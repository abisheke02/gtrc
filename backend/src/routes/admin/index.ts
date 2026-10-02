import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { requireAdmin } from '../../middleware/requireAdmin.js'
import { login, logout, me } from '../../controllers/admin/auth.js'
import { exportBookingsCsv, exportDonationsCsv, listBookings, listDonations, listCatalog, listEnquiries, stats, updateCatalogItem, updateEnquiry } from '../../controllers/admin/dashboard.js'

const loginLimiter = rateLimit({ windowMs: 15 * 60_000, limit: 10, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many login attempts. Try again in 15 minutes.' } })

export const adminRouter = Router()

adminRouter.post('/auth/login', loginLimiter, login)
adminRouter.post('/auth/logout', logout)

adminRouter.use(requireAdmin)
adminRouter.get('/auth/me', me)
adminRouter.get('/stats', stats)
adminRouter.get('/bookings', listBookings)
adminRouter.get('/bookings.csv', exportBookingsCsv)
adminRouter.get('/donations', listDonations)
adminRouter.get('/donations.csv', exportDonationsCsv)
adminRouter.get('/enquiries', listEnquiries)
adminRouter.patch('/enquiries/:id', updateEnquiry)
adminRouter.get('/catalog', listCatalog)
adminRouter.patch('/catalog/:type/:slug', updateCatalogItem)
