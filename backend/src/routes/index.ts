import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { catalog, createEnquiry } from '../controllers/public.js'
import { createPaymentOrder, verifyPayment } from '../controllers/payments.js'
import { adminRouter } from './admin/index.js'

const formLimiter = rateLimit({ windowMs: 15 * 60_000, limit: 20, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many requests. Please try again later.' } })

export const api = Router()

api.get('/health', (_req, res) => { res.json({ ok: true }) })
api.get('/catalog', catalog)
api.post('/enquiries', formLimiter, createEnquiry)
api.post('/payments/order', formLimiter, createPaymentOrder)
api.post('/payments/verify', verifyPayment)
api.use('/admin', adminRouter)
