import type { Donation } from '@prisma/client'
import { prisma } from '../config/db.js'
import { env } from '../config/env.js'
import { sendMail } from './mailer.js'

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`

/** Moves a donation to PAID exactly once (browser /verify and webhook can race) and emails on that transition only. */
export async function markDonationPaid(orderId: string, paymentId: string) {
  const { count } = await prisma.donation.updateMany({
    where: { razorpayOrderId: orderId, status: { in: ['PENDING', 'FAILED'] } },
    data: { status: 'PAID', razorpayPaymentId: paymentId, paidAt: new Date() },
  })
  const donation = await prisma.donation.findUnique({ where: { razorpayOrderId: orderId } })
  if (count === 1 && donation) await sendAcknowledgement(donation)
  return donation
}

export async function markDonationFailed(orderId: string) {
  await prisma.donation.updateMany({ where: { razorpayOrderId: orderId, status: 'PENDING' }, data: { status: 'FAILED' } })
}

export async function markDonationRefunded(paymentId: string) {
  await prisma.donation.updateMany({ where: { razorpayPaymentId: paymentId, status: 'PAID' }, data: { status: 'REFUNDED' } })
}

async function sendAcknowledgement(d: Donation) {
  const receiptNote = d.pan
    ? 'You asked for a tax receipt. We have your PAN and will email your 80G receipt separately.'
    : 'If you need a tax (80G) receipt, reply to this email with your PAN and address.'
  await sendMail(
    d.email,
    'Thank you for your donation',
    `Hi ${d.name},\n\nThank you for supporting Golden Trigger Rifle Club. We received your donation of ${inr(d.amountInr)} towards "${d.purpose}".\n\nReference: ${d.id}\nPayment ID: ${d.razorpayPaymentId}\n\n${receiptNote}\n\nGolden Trigger Rifle Club\nGerugambakkam, Chennai\n${env.CONTACT_EMAIL}`,
  )
  await sendMail(
    env.CONTACT_EMAIL,
    `New donation: ${inr(d.amountInr)} (${d.purpose})`,
    `${d.anonymous ? 'Donor asked to stay anonymous' : 'Donor may be named'}\nDonor: ${d.name} · ${d.phone} · ${d.email}\nPAN: ${d.pan ?? '-'}\nAddress: ${d.address ?? '-'}\nMessage: ${d.message ?? '-'}\nPayment ID: ${d.razorpayPaymentId}`,
  )
}
