import nodemailer from 'nodemailer'
import { env } from '../config/env.js'

const transport = env.SMTP_URL ? nodemailer.createTransport(env.SMTP_URL) : null

/** Sends an email. Never throws: a mail failure must not break a booking or payment. */
export async function sendMail(to: string, subject: string, text: string) {
  if (!transport) {
    console.log(`[mail:dev] to=${to} subject="${subject}"\n${text}\n`)
    return
  }
  try {
    await transport.sendMail({ from: env.MAIL_FROM, to, subject, text })
  } catch (e) {
    console.error('sendMail failed', e)
  }
}
