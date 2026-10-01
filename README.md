# Golden Trigger Rifle Club — Website

Website for **Golden Trigger Rifle Club / Golden Trigger Shooting Academy** in Gerugambakkam, Chennai.
The old domain (`goldentriggershootingacademy.com`) has expired, so this is a full rebuild.

**Scope:** a 10-page public website, an admin panel, and online payments through Razorpay.

Folder layout follows the VisionNex Master Reference:
§1 SaaS Marketing Website + §11 Admin/SEO/GEO + `services/payment/` from §4 Ecommerce.

```
gtrc/
├── website/            # Next.js (SSG for public pages, best for SEO/GEO)
│   ├── public/         # images, favicon, robots.txt, sitemap.xml, llms.txt
│   └── src/
│       ├── app/        # Next.js routes: 10 public pages + /admin
│       ├── admin/      # Admin panel: pages/, components/, auth/
│       ├── components/ # sections/, common/, layout/, seo/ (SEOHead, StructuredData)
│       ├── content/    # Editable copy (JSON), separate from components
│       ├── services/   # API calls, including the Razorpay checkout client
│       ├── assets/ styles/ types/ utils/
├── backend/            # Node + Express + TypeScript API
│   ├── prisma/         # schema.prisma (PostgreSQL)
│   └── src/
│       ├── routes/ (+ admin/)  controllers/  models/  middleware/  config/  utils/
│       ├── services/payment/   # Razorpay order creation, signature verification, webhooks
│       └── db/migrations, db/seeds
├── docs/               # IMPLEMENTATION_PLAN, CLIENT_INFO, DECISIONS
├── SESSION_HANDOFF.md  ARCHITECTURE.md  ROADMAP.md  CHANGELOG.md
```

## Run locally (after scaffolding in Phase 1)
```bash
cp website/.env.example website/.env && cp backend/.env.example backend/.env
cd backend && npm install && npm run dev
cd website && npm install && npm run dev
```
