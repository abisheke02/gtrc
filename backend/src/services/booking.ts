import type { Booking } from '@prisma/client'
import { prisma } from '../config/db.js'
import { env } from '../config/env.js'
import { sendMail } from './mailer.js'

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`

/**
 * Moves a booking to PAID exactly once, whether the browser /verify call or the
 * webhook arrives first, and sends confirmation emails only on that transition.
 */
export async function markPaid(orderId: string, paymentId: string) {
  const { count } = await prisma.booking.updateMany({
    where: { razorpayOrderId: orderId, status: { in: ['PENDING', 'FAILED'] } },
    data: { status: 'PAID', razorpayPaymentId: paymentId, paidAt: new Date() },
  })
  const booking = await prisma.booking.findUnique({ where: { razorpayOrderId: orderId } })
  if (count === 1 && booking) await sendConfirmation(booking)
  return booking
}

export async function markFailed(orderId: string) {
  await prisma.booking.updateMany({ where: { razorpayOrderId: orderId, status: 'PENDING' }, data: { status: 'FAILED' } })
}

export async function markRefunded(paymentId: string) {
  await prisma.booking.updateMany({ where: { razorpayPaymentId: paymentId, status: 'PAID' }, data: { status: 'REFUNDED' } })
}

async function sendConfirmation(b: Booking) {
  const lines = [
    `Booking reference: ${b.id}`,
    `Item: ${b.itemName}`,
    `Amount paid: ${inr(b.amountInr)}`,
    `Shooter: ${b.participantName}${b.participantAge ? ` (age ${b.participantAge})` : ''}`,
    b.guardianName ? `Guardian: ${b.guardianName}` : '',
    b.preferredDate ? `Preferred start: ${b.preferredDate.toISOString().slice(0, 10)}` : '',
    `Payment ID: ${b.razorpayPaymentId}`,
  ].filter(Boolean)

  await sendMail(
    b.email,
    `Booking confirmed: ${b.itemName}`,
    `Hi ${b.name},\n\nThank you for booking with Golden Trigger Rifle Club. Your payment was received.\n\n${lines.join('\n')}\n\nOur team will call you on ${b.phone} to confirm your slot.\n\nGolden Trigger Rifle Club\nGerugambakkam, Chennai\n${env.CONTACT_EMAIL}`,
  )
  await sendMail(env.CONTACT_EMAIL, `New paid booking: ${b.itemName} (${inr(b.amountInr)})`, `${lines.join('\n')}\n\nCustomer: ${b.name} · ${b.phone} · ${b.email}\nNotes: ${b.notes ?? '-'}`)
}
