# Implementation Plan — GTRC Website

## Stack (see DECISIONS.md)
- **frontend/**: React 19 + Vite + TypeScript + Tailwind (changed from Next.js on 2026-10-01; see DECISIONS.md).
- **backend/**: Node + Express + TypeScript, PostgreSQL + Prisma.
- **Payments**: Razorpay (India: UPI, cards, netbanking).
- **Admin auth**: email + password (bcrypt) with an httpOnly JWT cookie. Admin only, no customer accounts in v1.
- **Images**: Cloudinary or S3, never committed to git (Repo Hygiene §16).
- **Hosting**: website on Vercel; backend + DB on Render/Railway or the VisionNex Proxmox server.

## The 10 public pages
| # | Route | Page | Main content |
|---|---|---|---|
| 1 | `/` | Home | Hero, intro, programmes preview, achievements, testimonials, call to action (Book / Enrol) |
| 2 | `/about` | About Us | Story, mission, affiliations, safety commitment |
| 3 | `/programs` | Training Programmes | Air rifle / air pistol / .22, beginner to advanced, kids / adults, each with "Enrol and pay" |
| 4 | `/membership` | Membership & Fees | Plans table with Razorpay checkout |
| 5 | `/coaches` | Coaches | Coach profiles and certifications |
| 6 | `/facilities` | Range & Facilities | Lanes, equipment, timings |
| 7 | `/events` | Events & Competitions | Upcoming events with paid registration, past results |
| 8 | `/gallery` | Gallery | Photos and videos, with Instagram feed embed |
| 9 | `/book` | Book a Session / Enrol | Form, then Razorpay payment, then confirmation |
| 10 | `/contact` | Contact | Map, phones, WhatsApp button, enquiry form, FAQ |

Required legal pages (small, not counted in the 10, and needed for Razorpay approval):
`/privacy`, `/terms`, `/refund-policy`, `/safety-rules`. Also `/payment/success` and `/payment/failed`.

## Admin panel (`/admin`)
- Dashboard: today's bookings, revenue, new enquiries
- Content Editor: hero text, programmes, fees, coaches, FAQ (`page_sections`)
- Programmes / Plans / Events CRUD (price, slots, active toggle)
- Bookings & Payments: list, filter, status, export to CSV, refund link to Razorpay
- Enquiries (contact form inbox)
- Gallery manager (upload to Cloudinary)
- Meta Tags Manager (title, description, OG image, canonical for each page)
- Audit log (§15): who changed what

## Payment flow (Razorpay)
1. User picks a programme / plan / event, then fills details (student name, age, guardian, phone, email).
2. Frontend → `POST /api/payments/order` → backend creates a Razorpay order with the amount **from the DB, never trusted from the client** and saves a `Booking(status=PENDING)`.
3. Razorpay Checkout opens. On success, frontend → `POST /api/payments/verify` → backend checks the HMAC signature and marks the booking `PAID`.
4. Webhook `POST /api/payments/webhook` (`payment.captured`, `payment.failed`, `refund.processed`) is the source of truth if the browser closes mid-payment.
5. Confirmation email and WhatsApp message, plus a receipt.

## Data model (Prisma, first pass)
`AdminUser`, `Program`, `MembershipPlan`, `Event`, `Booking`, `Payment`, `Enquiry`,
`GalleryItem`, `PageSection`, `PageMeta`, `AuditLog`.

## Phases
| Phase | Work | Est. |
|---|---|---|
| 0 | Kickoff answers, client assets, domain, Razorpay KYC | Client side |
| 1 | Scaffold Next.js + Express + Prisma, env, CI, design system (uipro init) | 1 day |
| 2 | The 10 public pages from `content/*.json`, responsive, SEO components | 3–4 days |
| 3 | Backend: models, migrations, enquiry API, admin auth | 2 days |
| 4 | Razorpay order / verify / webhook, booking flow, emails | 2 days |
| 5 | Admin panel: dashboard, CRUD, bookings, content and meta editors | 3–4 days |
| 6 | SEO/GEO: sitemap, robots, llms.txt, JSON-LD (SportsActivityLocation, FAQPage), GA4 | 1 day |
| 7 | QA, live test payment, deploy, connect domain, Google Search Console | 1–2 days |

## Kickoff questions (§9) to answer tomorrow
1. Main action for visitors: enrolling in a course, booking a trial, or buying a membership?
2. Who updates content after launch: the club staff (needs the admin editor) or VisionNex?
3. Is the payment one-time per course, monthly membership, or both? Do we need auto-recurring?
4. Is there a slot/capacity limit per session (affects booking logic)?
5. Payment gateway confirmed as Razorpay, and are test keys ready?
6. Domain: re-buy the old one, or get a new one (e.g. goldentriggerrifleclub.in)?
7. Language: English only, or English + Tamil (i18n §15)?
8. Hosting budget: Vercel + Render (managed), or the VisionNex Proxmox server?
