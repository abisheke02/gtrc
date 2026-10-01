# Session Handoff — Golden Trigger Rifle Club

**Last updated:** 2026-10-01
**Updated by:** Claude (with Abishek)

## Current State
- **Frontend (React + Vite)**: all 10 public pages built (Home, About, Programmes, Membership, Coaches,
  Facilities, Events, Gallery, Book, Contact), plus Privacy, Terms, Refund, Safety, payment success/failed and 404.
  Responsive, dark + gold theme, per-page title/description/canonical/OG, JSON-LD (SportsClub + FAQPage), WhatsApp button.
- **Admin panel** (`/admin`): login, dashboard (revenue, pending payments, new enquiries), bookings list with
  filter and CSV export, enquiries inbox with status, and editing of programme / plan / event prices.
- **Backend (Express + Prisma + Postgres)**: catalog API, enquiries, Razorpay order/verify/webhook, admin auth
  (bcrypt + httpOnly JWT cookie, rate-limited), audit log, email confirmations (logged to the console when SMTP_URL is empty).
- Tested locally: build and typecheck pass, 4 signature unit tests pass. End to end with curl: validation, server-side
  pricing, bad-signature rejection, verify → PAID, duplicate webhook doesn't send emails twice, refund → REFUNDED, CSV, audit log.

## In Progress
- Nothing mid-build.

## Known Issues
- Verified facts (name, address, phones, Instagram, Pondy Open 2025 medals) are in; see docs/CLIENT_INFO.md.
  Fees, schedules, coach names, facility details and legal text are still **PLACEHOLDERS** (`shared/catalog.json`,
  `frontend/src/content/site.ts`, `frontend/src/pages/Legal.tsx`). Confirm with the club before launch.
- Gallery and coach photos are placeholders. Real images need hosting (Cloudinary) and an admin upload screen.
- The site renders on the client side (Vite). For stronger SEO, add build-time prerendering (see DECISIONS.md).
- `example.com` in sitemap.xml, robots.txt and VITE_SITE_URL must be replaced once the domain is chosen.

- How to update text and photos: docs/CONTENT_GUIDE.md

## Next Steps
1. Get the Razorpay **test** keys from the club and do a real test payment end to end.
2. Collect logo, photos, real fees, coach details and timings, then update `site.ts` and `catalog.json`.
3. Phase 5 extras: gallery upload, content editor for page text, meta tags manager, audit log viewer.
4. Prerendering for SEO, then deploy (frontend on Vercel, backend + DB on Render/Railway) and connect the domain.

## Open Questions
- Email spelling: `goldentriggerriffleclub` (two f's). Is it correct?
- PIN code 600122 or 600128? Brand name: "Rifle Club" or "Shooting Academy"?
- One-time vs recurring membership payments? Slot/capacity limits per session?
- New domain name? English only, or Tamil too?
