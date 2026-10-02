import type { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../config/db.js'
import { env, paymentsEnabled } from '../config/env.js'
import { getBookableItem } from '../services/catalog.js'
import { createOrder, verifyPaymentSignature, verifyWebhookSignature } from '../services/payment/razorpay.js'
import { markFailed, markPaid, markRefunded } from '../services/booking.js'
import { markDonationFailed, markDonationPaid, markDonationRefunded } from '../services/donation.js'
import { HttpError } from '../utils/httpError.js'
import { phone } from './public.js'

const orderSchema = z.object({
  itemType: z.enum(['PROGRAM', 'PLAN', 'EVENT']),
  itemSlug: z.string().trim().min(1).max(100),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  phone,
  participantName: z.string().trim().min(2).max(100),
  participantAge: z.coerce.number().int().min(5).max(100).optional(),
  guardianName: z.string().trim().max(100).optional(),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  notes: z.string().trim().max(1000).optional(),
}).refine((d) => d.participantAge === undefined || d.participantAge >= 18 || Boolean(d.guardianName), {
  message: 'A parent or guardian name is required for shooters under 18',
  path: ['guardianName'],
})

export async function createPaymentOrder(req: Request, res: Response) {
  if (!paymentsEnabled) throw new HttpError(503, 'Online payments are not set up yet. Please call us to book.')
  const input = orderSchema.parse(req.body)
  const item = await getBookableItem(input.itemType, input.itemSlug)

  const booking = await prisma.booking.create({
    data: {
      ...input,
      preferredDate: input.preferredDate ? new Date(input.preferredDate) : null,
      itemName: item.name,
      amountInr: item.priceInr,
    },
  })

  try {
    const order = await createOrder(item.priceInr, booking.id, { bookingId: booking.id, item: `${item.type}:${item.slug}` })
    await prisma.booking.update({ where: { id: booking.id }, data: { razorpayOrderId: order.id } })
    res.status(201).json({
      bookingId: booking.id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: env.RAZORPAY_KEY_ID,
      itemName: item.name,
    })
  } catch (e) {
    await prisma.booking.update({ where: { id: booking.id }, data: { status: 'FAILED' } })
    throw e
  }
}

export const DONATION_PURPOSES = ['Where it is needed most', 'Junior shooter scholarships', 'Range & equipment upkeep', 'Competition travel & entry fees'] as const

const donationSchema = z.object({
  amountInr: z.number().int().min(100, 'Minimum donation is ₹100').max(10_00_000, 'For donations above ₹10,00,000 please contact us'),
  purpose: z.enum(DONATION_PURPOSES),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  phone,
  pan: z.string().trim().toUpperCase().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Enter a valid PAN (e.g. ABCDE1234F)').optional(),
  address: z.string().trim().max(300).optional(),
  message: z.string().trim().max(500).optional(),
  anonymous: z.boolean().default(false),
})

export async function createDonationOrder(req: Request, res: Response) {
  if (!paymentsEnabled) throw new HttpError(503, 'Online payments are not set up yet. Please call us to donate.')
  const input = donationSchema.parse(req.body)
  const donation = await prisma.donation.create({ data: input })
  try {
    const order = await createOrder(input.amountInr, donation.id, { donationId: donation.id, purpose: input.purpose })
    await prisma.donation.update({ where: { id: donation.id }, data: { razorpayOrderId: order.id } })
    res.status(201).json({ donationId: donation.id, orderId: order.id, amount: order.amount, currency: order.currency, keyId: env.RAZORPAY_KEY_ID, purpose: input.purpose })
  } catch (e) {
    await prisma.donation.update({ where: { id: donation.id }, data: { status: 'FAILED' } })
    throw e
  }
}

const verifyDonationSchema = z.object({
  donationId: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
})

export async function verifyDonation(req: Request, res: Response) {
  const v = verifyDonationSchema.parse(req.body)
  const donation = await prisma.donation.findUnique({ where: { id: v.donationId } })
  if (!donation || donation.razorpayOrderId !== v.razorpay_order_id) throw new HttpError(400, 'Donation does not match this payment')
  if (!verifyPaymentSignature(v.razorpay_order_id, v.razorpay_payment_id, v.razorpay_signature)) {
    throw new HttpError(400, 'Payment could not be verified. If money was deducted, contact us with your payment ID.')
  }
  const updated = await markDonationPaid(v.razorpay_order_id, v.razorpay_payment_id)
  res.json({ donationId: updated?.id, status: updated?.status })
}

const verifySchema = z.object({
  bookingId: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
})

export async function verifyPayment(req: Request, res: Response) {
  const v = verifySchema.parse(req.body)
  const booking = await prisma.booking.findUnique({ where: { id: v.bookingId } })
  if (!booking || booking.razorpayOrderId !== v.razorpay_order_id) throw new HttpError(400, 'Booking does not match this payment')
  if (!verifyPaymentSignature(v.razorpay_order_id, v.razorpay_payment_id, v.razorpay_signature)) {
    throw new HttpError(400, 'Payment could not be verified. If money was deducted, contact us with your payment ID.')
  }
  const updated = await markPaid(v.razorpay_order_id, v.razorpay_payment_id)
  res.json({ bookingId: updated?.id, status: updated?.status })
}

/** Razorpay webhook: the source of truth if the customer closes the browser mid-payment. */
export async function razorpayWebhook(req: Request, res: Response) {
  const raw = req.body as Buffer
  if (!Buffer.isBuffer(raw) || !verifyWebhookSignature(raw, req.get('x-razorpay-signature') ?? '')) {
    throw new HttpError(400, 'Invalid signature')
  }
  const event = JSON.parse(raw.toString('utf8'))
  const payment = event.payload?.payment?.entity
  const refund = event.payload?.refund?.entity

  switch (event.event) {
    case 'payment.captured':
    case 'order.paid':
      if (payment?.order_id) {
        await markPaid(payment.order_id, payment.id)
        await markDonationPaid(payment.order_id, payment.id)
      }
      break
    case 'payment.failed':
      if (payment?.order_id) {
        await markFailed(payment.order_id)
        await markDonationFailed(payment.order_id)
      }
      break
    case 'refund.processed':
      if (refund?.payment_id) {
        await markRefunded(refund.payment_id)
        await markDonationRefunded(refund.payment_id)
      }
      break
  }
  res.json({ ok: true })
}
