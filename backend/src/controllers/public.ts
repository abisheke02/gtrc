import type { Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../config/db.js'
import { env } from '../config/env.js'
import { getPublicCatalog } from '../services/catalog.js'
import { sendMail } from '../services/mailer.js'

export async function catalog(_req: Request, res: Response) {
  res.set('Cache-Control', 'public, max-age=60').json(await getPublicCatalog())
}

const phone = z.string().trim().regex(/^[0-9+ ]{10,15}$/, 'Enter a valid phone number')

const enquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone,
  email: z.union([z.literal(''), z.string().trim().email()]).optional(),
  subject: z.string().trim().max(100).optional(),
  message: z.string().trim().min(5).max(2000),
})

export async function createEnquiry(req: Request, res: Response) {
  const data = enquirySchema.parse(req.body)
  const enquiry = await prisma.enquiry.create({ data: { ...data, email: data.email || null } })
  await sendMail(env.CONTACT_EMAIL, `New enquiry: ${data.subject ?? 'Website'} from ${data.name}`, `${data.name} · ${data.phone} · ${data.email || '-'}\n\n${data.message}`)
  res.status(201).json({ id: enquiry.id })
}

export { phone }
