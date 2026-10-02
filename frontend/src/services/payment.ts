import { post } from './api'
import { site } from '../content/site'
import type { ItemType } from '../types'

export interface BookingInput {
  itemType: ItemType
  itemSlug: string
  name: string
  email: string
  phone: string
  participantName: string
  participantAge?: number
  guardianName?: string
  preferredDate?: string
  notes?: string
}

interface OrderResponse {
  bookingId: string
  orderId: string
  amount: number
  currency: string
  keyId: string
  itemName: string
}

declare global {
  interface Window { Razorpay?: new (opts: Record<string, unknown>) => { open: () => void; on: (e: string, cb: (r: unknown) => void) => void } }
}

function loadCheckout(): Promise<void> {
  if (window.Razorpay) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Could not load the payment window. Check your internet connection.'))
    document.body.appendChild(s)
  })
}

interface CheckoutOpts {
  order: { orderId: string; amount: number; currency: string; keyId: string }
  description: string
  prefill: { name: string; email: string; contact: string }
  notes: Record<string, string>
  verifyPath: string
  verifyBody: Record<string, string>
}

/** Opens Razorpay Checkout for an order our server created, then has the server verify the signature. */
async function openCheckout(o: CheckoutOpts): Promise<void> {
  await loadCheckout()
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay!({
      key: o.order.keyId,
      amount: o.order.amount,
      currency: o.order.currency,
      order_id: o.order.orderId,
      name: site.name,
      description: o.description,
      image: `${window.location.origin}/favicon.svg`,
      prefill: o.prefill,
      notes: o.notes,
      theme: { color: '#d4a72c' },
      handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        try {
          await post(o.verifyPath, { ...o.verifyBody, ...resp })
          resolve()
        } catch (e) {
          reject(e)
        }
      },
      modal: { ondismiss: () => reject(new Error('Payment was cancelled.')) },
    })
    rzp.on('payment.failed', () => reject(new Error('Payment failed. You have not been charged; please try again.')))
    rzp.open()
  })
}

/** Creates the order on our server (the server sets the price), then opens Razorpay Checkout. */
export async function startPayment(input: BookingInput): Promise<{ bookingId: string }> {
  const order = await post<OrderResponse>('/payments/order', input)
  await openCheckout({
    order,
    description: order.itemName,
    prefill: { name: input.name, email: input.email, contact: input.phone },
    notes: { bookingId: order.bookingId },
    verifyPath: '/payments/verify',
    verifyBody: { bookingId: order.bookingId },
  })
  return { bookingId: order.bookingId }
}

export interface DonationInput {
  amountInr: number
  purpose: string
  name: string
  email: string
  phone: string
  pan?: string
  address?: string
  message?: string
  anonymous: boolean
}

export async function startDonation(input: DonationInput): Promise<{ donationId: string }> {
  const order = await post<{ donationId: string; orderId: string; amount: number; currency: string; keyId: string; purpose: string }>('/donations/order', input)
  await openCheckout({
    order,
    description: `Donation: ${order.purpose}`,
    prefill: { name: input.name, email: input.email, contact: input.phone },
    notes: { donationId: order.donationId },
    verifyPath: '/donations/verify',
    verifyBody: { donationId: order.donationId },
  })
  return { donationId: order.donationId }
}
