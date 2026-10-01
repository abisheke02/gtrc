import type { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { HttpError } from '../utils/httpError.js'

export const ADMIN_COOKIE = 'gtrc_admin'

export interface AdminClaims { sub: string; email: string; name: string }

declare global {
  namespace Express {
    interface Request { admin?: AdminClaims }
  }
}

export const requireAdmin: RequestHandler = (req, _res, next) => {
  const token = req.cookies?.[ADMIN_COOKIE]
  if (!token) return next(new HttpError(401, 'Please log in'))
  try {
    req.admin = jwt.verify(token, env.JWT_SECRET) as AdminClaims
    next()
  } catch {
    next(new HttpError(401, 'Session expired. Please log in again.'))
  }
}
