# Content Guide: where to update each thing

Status key: ✅ verified from public sources · 📝 placeholder, replace with the club's real details · 🌐 general sport info (accurate, keep or edit)

## 1. Text: `frontend/src/content/site.ts`
| What | Variable | Status |
|---|---|---|
| Club name, tagline, description | `site.name`, `site.alternateName`, `site.tagline`, `site.description` | ✅ |
| Email, phones, WhatsApp number | `site.email`, `site.phones`, `site.whatsapp` | ✅ (WhatsApp assumed to be the first phone) |
| Address and PIN | `site.address` | ✅ (PIN 600122 vs 600128: confirm) |
| Opening hours | `site.hours` | 📝 |
| Instagram / Facebook links | `site.social` | ✅ |
| Home hero photo | `site.heroImage` | 📝 empty = target graphic |
| Home number strip | `stats` | ✅ Pondy Open 2025 |
| Achievements / results | `achievements` | ✅ add new medals here |
| Coaches (name, role, bio, certs, photo) | `coaches` | 📝 |
| Facilities | `facilities` | 📝 confirm each one |
| Gallery photos | `gallery` | 📝 |
| Disciplines, pathway, benefits | `disciplines`, `pathway`, `benefits` | 🌐 |
| Testimonials | `testimonials` | Empty; the section is hidden until you add real ones |
| FAQ (also feeds Google FAQ results) | `faqs` | 📝 starting age 8+ is an assumption |

## 2. Programmes, memberships, events and fees: `shared/catalog.json`
📝 All fees and durations are placeholders. This file **seeds the database**. After the first seed,
change prices from **Admin → Programmes & Fees** (that's what payments use). To add a new programme, plan or event:
add it to the JSON, then run `npm run db:seed` in `backend/` (it only adds new items and never overwrites admin edits).

## 3. Page-specific text: `frontend/src/pages/*.tsx`
| Page | File | Notes |
|---|---|---|
| Home hero heading and intro | `Home.tsx` | ✅ uses the Instagram bio line |
| About story | `About.tsx` | ✅ old-site copy + Pondy Open; 📝 founder, founding year, affiliations |
| Legal pages | `Legal.tsx` | 📝 draft; the club must approve (Razorpay checks these) |

## 4. Photos: `frontend/public/images/`
1. Put the file in `frontend/public/images/` (gallery photos in `images/gallery/`).
2. Set the path in `site.ts`, e.g. `image: '/images/coach-1.jpg'` or `{ image: '/images/gallery/pondy-open-2025.jpg', caption: 'Pondy Open 2025: team gold' }`.
3. Sizes: hero 1600×2000 (portrait 4:5) · coach 1200×900 (4:3) · facility 1280×720 (16:9) · gallery 1080×1080 (square).
   Export as JPG or WebP under 300 KB each (use squoosh.app).
4. Logo: replace `frontend/public/favicon.svg`, and add `frontend/public/og-image.jpg` (1200×630) for link previews on WhatsApp and Facebook.

## 5. SEO files: `frontend/public/`
`sitemap.xml`, `robots.txt`: replace `https://example.com` with the real domain. `llms.txt`: keep in sync with `site.ts`.
