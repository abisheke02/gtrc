import 'dotenv/config'
import { app } from './app.js'
import { env, paymentsEnabled } from './config/env.js'

app.listen(env.PORT, () => {
  console.log(`GTRC API listening on http://localhost:${env.PORT}`)
  if (!paymentsEnabled) console.warn('Razorpay keys not set: /api/payments/order will return 503')
})
