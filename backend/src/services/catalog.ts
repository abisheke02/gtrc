import type { ItemType } from '@prisma/client'
import { prisma } from '../config/db.js'
import { HttpError } from '../utils/httpError.js'

export async function getPublicCatalog() {
  const items = await prisma.catalogItem.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } })
  const shape = (t: ItemType) =>
    items.filter((i) => i.type === t).map((i) => ({ ...(i.data as object), slug: i.slug, name: i.name, priceInr: i.priceInr }))
  return { programs: shape('PROGRAM'), plans: shape('PLAN'), events: shape('EVENT') }
}

/** The authoritative price for a booking always comes from the DB, never from the client. */
export async function getBookableItem(type: ItemType, slug: string) {
  const item = await prisma.catalogItem.findUnique({ where: { type_slug: { type, slug } } })
  if (!item || !item.active) throw new HttpError(404, 'This item is no longer available')
  if (type === 'EVENT') {
    const date = (item.data as { date?: string }).date
    if (date && date < new Date().toISOString().slice(0, 10)) throw new HttpError(400, 'Registration for this event has closed')
  }
  return item
}
