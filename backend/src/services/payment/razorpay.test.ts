import { test } from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'

process.env.DATABASE_URL ??= 'postgresql://x'
process.env.JWT_SECRET ??= 'test-secret-test-secret'
const { verifyPaymentSignature, verifyWebhookSignature } = await import('./razorpay.js')

const secret = 'test_secret'
const sign = (data: string | Buffer) => crypto.createHmac('sha256', secret).update(data).digest('hex')

test('accepts a valid checkout signature', () => {
  assert.equal(verifyPaymentSignature('order_1', 'pay_1', sign('order_1|pay_1'), secret), true)
})

test('rejects a tampered checkout signature', () => {
  assert.equal(verifyPaymentSignature('order_1', 'pay_2', sign('order_1|pay_1'), secret), false)
  assert.equal(verifyPaymentSignature('order_1', 'pay_1', 'deadbeef', secret), false)
})

test('rejects when no secret is configured', () => {
  assert.equal(verifyPaymentSignature('order_1', 'pay_1', sign('order_1|pay_1'), ''), false)
})

test('verifies webhook bodies byte-for-byte', () => {
  const body = Buffer.from('{"event":"payment.captured"}')
  assert.equal(verifyWebhookSignature(body, sign(body), secret), true)
  assert.equal(verifyWebhookSignature(Buffer.from('{"event":"payment.captured" }'), sign(body), secret), false)
})
