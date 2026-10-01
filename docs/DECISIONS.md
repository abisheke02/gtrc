# Decisions

- **Next.js, not plain Vite, for the website.** Per Master Reference §11, client-rendered Vite isn't reliably crawlable, and local SEO ("rifle club Chennai") is the main goal of the site.
- **Separate Express backend.** Follows the universal frontend/backend split, keeps the Razorpay secret and webhooks isolated, and is easy to reuse for a mobile app later.
- **PostgreSQL + Prisma.** Bookings and payments need relational integrity and versioned migrations (§8).
- **Razorpay.** India-first: UPI, cards, netbanking. Lives in `backend/src/services/payment/` (§4).
- **Content in the DB, editable from admin, with JSON fallback in `website/src/content/`.** Lets non-developers edit the site without a redeploy.
