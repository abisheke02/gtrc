# Decisions

- **Next.js, not plain Vite, for the website.** Per Master Reference §11, client-rendered Vite isn't reliably crawlable, and local SEO ("rifle club Chennai") is the main goal of the site.
- **Separate Express backend.** Follows the universal frontend/backend split, keeps the Razorpay secret and webhooks isolated, and is easy to reuse for a mobile app later.
- **PostgreSQL + Prisma.** Bookings and payments need relational integrity and versioned migrations (§8).
- **Razorpay.** India-first: UPI, cards, netbanking. Lives in `backend/src/services/payment/` (§4).
- **Content in the DB, editable from admin, with JSON fallback in `website/src/content/`.** Lets non-developers edit the site without a redeploy.
- **2026-10-01: React + Vite instead of Next.js** (Abishek asked for a React environment; it matches the
  universal VisionNex base). SEO mitigation: React 19 native `<title>`/`<meta>` per page, JSON-LD, sitemap,
  robots and llms.txt. **TODO before launch:** add build-time prerendering of the public routes
  (e.g. `vite-react-ssg` or a Playwright prerender script) so crawlers get full HTML.
- **Catalog in one table (`CatalogItem`)** with editable name/price/active columns plus a JSON `data` column for
  display fields. `shared/catalog.json` seeds it and is the frontend's offline fallback.
- **Express 5 + Prisma 6** (Prisma 7/8 need driver adapters; 6 is the stable, familiar path).
