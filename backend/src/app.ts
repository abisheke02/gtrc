import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { env, isProd } from './config/env.js'
import { api } from './routes/index.js'
import { razorpayWebhook } from './controllers/payments.js'
import { errorHandler } from './middleware/errorHandler.js'

export const app = express()

if (isProd) app.set('trust proxy', 1)
app.use(helmet())
app.use(cors({ origin: env.CORS_ORIGIN.split(',').map((s) => s.trim()), credentials: true }))

// The webhook needs the raw body for signature verification, so it is mounted before express.json().
app.post('/api/payments/webhook', express.raw({ type: 'application/json', limit: '1mb' }), razorpayWebhook)

app.use(express.json({ limit: '100kb' }))
app.use(cookieParser())
app.use('/api', api)
app.use('/api', (_req, res) => { res.status(404).json({ error: 'Not found' }) })
app.use(errorHandler)
