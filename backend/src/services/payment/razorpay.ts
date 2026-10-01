import crypto from 'node:crypto'
import Razorpay from 'razorpay'
import { env, paymentsEnabled } from '../../config/env.js'
import { HttpError } from '../../utils/httpError.js'

let client: Razorpay | null = null
function rzp() {
  if (!paymentsEnabled) throw new HttpError(503, 'Online payments are not set up yet. Please call us to book.')
  client ??= new Razorpay({ key_id: env.RAZORPAY_KEY_ID, key_secret: env.RAZORPAY_KEY_SECRET })
  return client
}

export async function createOrder(amountInr: number, receipt: string, notes: Record<string, string>) {
  return rzp().orders.create({ amount: amountInr * 100, currency: 'INR', receipt, notes })
}

function safeEqualHex(a: string, b: string) {
  const ab = Buffer.from(a, 'utf8')
  const bb = Buffer.from(b, 'utf8')
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb)
}

/** Checkout handler signature: HMAC_SHA256(order_id + "|" + payment_id, key_secret). */
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string, secret = env.RAZORPAY_KEY_SECRET) {
  if (!secret) return false
  const expected = crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex')
  return safeEqualHex(expected, signature)
}

/** Webhook signature: HMAC_SHA256(raw request body, webhook_secret). */
export function verifyWebhookSignature(rawBody: Buffer, signature: string, secret = env.RAZORPAY_WEBHOOK_SECRET) {
  if (!secret || !signature) return false
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  return safeEqualHex(expected, signature)
}
