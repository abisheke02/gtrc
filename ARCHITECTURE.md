# Architecture

```
Browser ──► website (Next.js on Vercel)
              │  public pages: SSG/ISR, content fetched from backend at build/revalidate
              │  /admin: client-side, JWT cookie
              ▼
           backend (Express API) ──► PostgreSQL (Prisma)
              │
              └──► Razorpay (orders, verify signature)  ◄── Razorpay webhooks
              └──► Cloudinary (gallery uploads), email (Resend/SMTP)
```
