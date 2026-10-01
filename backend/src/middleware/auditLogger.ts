import type { Request } from 'express'
import { prisma } from '../config/db.js'

/** Master Reference §15: record who changed what in the admin panel. */
export async function audit(req: Request, action: string, section: string, summary: string, targetId?: string) {
  await prisma.auditLog
    .create({ data: { adminEmail: req.admin?.email ?? 'unknown', action, section, summary, targetId, ipAddress: req.ip } })
    .catch((e) => console.error('audit log failed', e))
}
