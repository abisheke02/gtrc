# Golden Trigger Rifle Club — Website

A 10-page public website, an admin panel, and Razorpay online payments for
**Golden Trigger Rifle Club**, Gerugambakkam, Chennai (club email: goldentriggerriffleclub@gmail.com).

Folder layout follows the VisionNex Master Reference (universal React + Vite base,
§1 marketing website, §11 admin/SEO, §4 `services/payment/`).

```
gtrc/
├── frontend/              React 19 + Vite + TypeScript + Tailwind v4
│   ├── public/            favicon, robots.txt, sitemap.xml, llms.txt
│   └── src/
│       ├── pages/         the 10 public pages + legal + payment result + 404
│       ├── admin/         admin panel (pages/, components/), code-split
│       ├── components/    common/, layout/, seo/ (Seo, JSON-LD)
│       ├── content/       site.ts: editable copy (address, phones, FAQ, coaches…)
│       ├── services/      api.ts, payment.ts (Razorpay Checkout)
│       ├── context/ hooks/ types/ utils/
├── backend/               Node + Express 5 + TypeScript + Prisma (PostgreSQL)
│   ├── prisma/            schema.prisma, migrations/, seed.ts
│   └── src/
│       ├── routes/ controllers/ middleware/ config/ utils/
│       └── services/      catalog, booking, mailer, payment/razorpay
├── shared/catalog.json    programmes / plans / events: the DB seed and the frontend fallback
└── docs/                  IMPLEMENTATION_PLAN, CLIENT_INFO, DECISIONS
```

## Run locally

Requirements: Node 20+, PostgreSQL 14+.

```bash
# 1. Database (once)
createuser -P gtrc            # password: gtrc
createdb -O gtrc gtrc

# 2. Backend: http://localhost:4000
cd backend
cp .env.example .env          # set JWT_SECRET, ADMIN_SEED_PASSWORD, Razorpay test keys
npm install
npx prisma migrate dev        # create the tables
npm run db:seed               # programmes/fees + first admin user
npm run dev

# 3. Frontend: http://localhost:5173 (proxies /api to :4000)
cd frontend
cp .env.example .env
npm install
npm run dev
```

Admin panel: http://localhost:5173/admin. Log in with `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD`.

## Checks
```bash
cd frontend && npm run build        # typecheck + production build
cd backend  && npm run typecheck && npm test
```

## Payments (Razorpay)
1. The browser asks the backend for an order: `POST /api/payments/order`. The **price comes from the DB**, never from the browser.
2. Razorpay Checkout opens (UPI, cards, netbanking).
3. `POST /api/payments/verify` checks the HMAC signature and marks the booking PAID.
4. The webhook `POST /api/payments/webhook` (events: `payment.captured`, `order.paid`, `payment.failed`, `refund.processed`) handles a closed browser and refunds. It is idempotent, so confirmation emails go out once.

Razorpay dashboard setup: Settings → Webhooks → URL `https://<api-domain>/api/payments/webhook`, then copy the secret into `RAZORPAY_WEBHOOK_SECRET`.
