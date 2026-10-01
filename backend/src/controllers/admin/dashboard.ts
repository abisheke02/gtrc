import type { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../../config/db.js'
import { audit } from '../../middleware/auditLogger.js'
import { HttpError } from '../../utils/httpError.js'

/** Midnight in India time (UTC+5:30), so "today" matches the club's day. */
function istStartOf(unit: 'day' | 'month') {
  const offset = 330 * 60_000
  const ist = new Date(Date.now() + offset)
  if (unit === 'month') ist.setUTCDate(1)
  ist.setUTCHours(0, 0, 0, 0)
  return new Date(ist.getTime() - offset)
}

export async function stats(_req: Request, res: Response) {
  const [today, month, pendingBookings, newEnquiries] = await Promise.all([
    prisma.booking.aggregate({ _sum: { amountInr: true }, where: { status: 'PAID', paidAt: { gte: istStartOf('day') } } }),
    prisma.booking.aggregate({ _sum: { amountInr: true }, _count: true, where: { status: 'PAID', paidAt: { gte: istStartOf('month') } } }),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.enquiry.count({ where: { status: 'NEW' } }),
  ])
  res.json({
    revenueToday: today._sum.amountInr ?? 0,
    revenueMonth: month._sum.amountInr ?? 0,
    paidBookingsMonth: month._count,
    pendingBookings,
    newEnquiries,
  })
}

const statusFilter = z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']).optional()

export async function listBookings(req: Request, res: Response) {
  const status = statusFilter.parse(req.query.status || undefined)
  const bookings = await prisma.booking.findMany({ where: { status }, orderBy: { createdAt: 'desc' }, take: 500 })
  res.json({ bookings })
}

const csvCell = (v: unknown) => {
  let s = v == null ? '' : v instanceof Date ? v.toISOString() : String(v)
  if (/^[=+\-@]/.test(s)) s = `'${s}` // block spreadsheet formula injection
  return `"${s.replace(/"/g, '""')}"`
}

export async function exportBookingsCsv(req: Request, res: Response) {
  const status = statusFilter.parse(req.query.status || undefined)
  const rows = await prisma.booking.findMany({ where: { status }, orderBy: { createdAt: 'desc' } })
  const cols = ['id', 'createdAt', 'status', 'itemType', 'itemName', 'amountInr', 'name', 'phone', 'email', 'participantName', 'participantAge', 'guardianName', 'preferredDate', 'razorpayPaymentId', 'paidAt'] as const
  const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => csvCell(r[c])).join(','))].join('\n')
  await audit(req, 'export', 'bookings', `Exported ${rows.length} bookings`)
  res.set({ 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="gtrc-bookings-${new Date().toISOString().slice(0, 10)}.csv"` }).send(csv)
}

export async function listEnquiries(_req: Request, res: Response) {
  res.json({ enquiries: await prisma.enquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 500 }) })
}

export async function updateEnquiry(req: Request<{ id: string }>, res: Response) {
  const { status } = z.object({ status: z.enum(['NEW', 'CONTACTED', 'CLOSED']) }).parse(req.body)
  const r = await prisma.enquiry.updateMany({ where: { id: req.params.id }, data: { status } })
  if (r.count === 0) throw new HttpError(404, 'Enquiry not found')
  await audit(req, 'status_change', 'enquiries', `Enquiry marked ${status}`, req.params.id)
  res.json({ ok: true })
}

export async function listCatalog(_req: Request, res: Response) {
  const items = await prisma.catalogItem.findMany({ orderBy: [{ type: 'asc' }, { sortOrder: 'asc' }], select: { type: true, slug: true, name: true, priceInr: true, active: true } })
  res.json({ items })
}

const catalogPatch = z.object({
  name: z.string().trim().min(2).max(120).optional(),
  priceInr: z.number().int().min(1).max(10_00_000).optional(),
  active: z.boolean().optional(),
})

export async function updateCatalogItem(req: Request<{ type: string; slug: string }>, res: Response) {
  const type = z.enum(['PROGRAM', 'PLAN', 'EVENT']).parse(req.params.type)
  const data = catalogPatch.parse(req.body)
  const before = await prisma.catalogItem.findUnique({ where: { type_slug: { type, slug: req.params.slug } } })
  if (!before) throw new HttpError(404, 'Item not found')
  const item = await prisma.catalogItem.update({ where: { id: before.id }, data })
  const changes = (Object.keys(data) as (keyof typeof data)[])
    .filter((k) => before[k] !== item[k])
    .map((k) => `${k}: ${before[k]} → ${item[k]}`)
  if (changes.length) await audit(req, 'update', 'catalog', `${item.name}: ${changes.join(', ')}`, item.id)
  res.json({ item })
}
