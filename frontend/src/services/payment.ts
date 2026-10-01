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

/** Creates the order on our server (the server sets the price), then opens Razorpay Checkout. */
export async function startPayment(input: BookingInput): Promise<{ bookingId: string }> {
  const order = await post<OrderResponse>('/payments/order', input)
  await loadCheckout()

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay!({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: site.name,
      description: order.itemName,
      image: `${window.location.origin}/favicon.svg`,
      prefill: { name: input.name, email: input.email, contact: input.phone },
      notes: { bookingId: order.bookingId },
      theme: { color: '#d4a72c' },
      handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        try {
          await post('/payments/verify', { bookingId: order.bookingId, ...resp })
          resolve({ bookingId: order.bookingId })
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
