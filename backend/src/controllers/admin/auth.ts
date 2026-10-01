import type { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { prisma } from '../../config/db.js'
import { env, isProd } from '../../config/env.js'
import { ADMIN_COOKIE, type AdminClaims } from '../../middleware/requireAdmin.js'
import { audit } from '../../middleware/auditLogger.js'
import { HttpError } from '../../utils/httpError.js'

const loginSchema = z.object({ email: z.string().trim().toLowerCase().email(), password: z.string().min(1) })
const SESSION_HOURS = 12

export async function login(req: Request, res: Response) {
  const { email, password } = loginSchema.parse(req.body)
  const admin = await prisma.adminUser.findUnique({ where: { email } })
  if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) throw new HttpError(401, 'Wrong email or password')

  const claims: AdminClaims = { sub: admin.id, email: admin.email, name: admin.name }
  const token = jwt.sign(claims, env.JWT_SECRET, { expiresIn: `${SESSION_HOURS}h` })
  res.cookie(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: SESSION_HOURS * 3600 * 1000,
    path: '/api',
  })
  req.admin = claims
  await audit(req, 'login', 'auth', `${admin.email} logged in`)
  res.json({ admin: { id: admin.id, email: admin.email, name: admin.name } })
}

export async function logout(req: Request, res: Response) {
  res.clearCookie(ADMIN_COOKIE, { path: '/api' })
  res.json({ ok: true })
}

export async function me(req: Request, res: Response) {
  const a = req.admin!
  res.json({ admin: { id: a.sub, email: a.email, name: a.name } })
}
