# CarBikeKharido.com

A consumer-first automotive portal for **cars and bikes in India**. The
guiding rule: no raw jargon anywhere in the UI. Boot litres become "Fits 3
large suitcases", and the price you see is the on-road price for your own
city with every fee explained.

**Platform:** CarBikeKharido.com
**Copyright:** © VidyaLabs. All Rights Reserved.
**Principal Developer:** Rajesh Kumar
**Contact:** +91 9140878191 · rkrajesh.pgi@gmail.com
**Registered address:** C725, Kalpana Residency, Phase-II, Hulaskhera,
Raebareli Road, Mohanlalganj, Lucknow, Uttar Pradesh - 226301

## Stack

| Concern      | Choice                                           |
| ------------ | ------------------------------------------------ |
| Framework    | Next.js 16 (App Router) + React 19               |
| Language     | TypeScript (strict)                              |
| Styling      | Tailwind CSS v4, class-based dark mode           |
| Animation    | Framer Motion                                    |
| Database     | PostgreSQL + Prisma 7 (optional at runtime)      |
| Validation   | Zod + React Hook Form                            |
| Icons        | lucide-react                                     |

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # prisma generate && next build
npm run lint
```

The site **runs with no database**. Catalogue, tax slabs and insurance bands
are served from `src/lib/catalogue/seedData.ts` until `DATABASE_URL` is set.

To persist admin edits:

```bash
cp .env.example .env
# set DATABASE_URL, ADMIN_PASSWORD, ADMIN_SESSION_SECRET
npm run db:push
npm run db:seed
```

Admin lives at `/admin`. Without the two admin env vars the sign-in form stays
locked on purpose.

## Architecture

```
prisma/schema.prisma          Vehicle, Variant, Color, VehicleImage,
                              RtoTaxRule, InsuranceRule
src/lib/pricingEngine.ts      Deterministic on-road calculator + RTO lookup stub
src/lib/imaginStudio.ts       IMAGIN.studio CDN URL builder (360° / paint)
src/lib/catalogue/            Prisma client, repository, seed data, copy
src/lib/admin/                Session auth, Zod schemas, server actions
src/app/vehicles/[slug]       Detail page (SSG)
src/app/admin                 Variant prices, press-kit photos, RTO slabs
src/components/Vehicle360Viewer.tsx
```

### On-road formula

```
On-road = Ex-showroom
        + State RTO tax (banded, plus cess and fixed fees)
        + Insurance (1+3 for cars, 1+5 for bikes)
        + FASTag ₹500 (cars only)
        + TCS 1% if ex-showroom > ₹10 lakh
        + Registration and handling
```

States launched: **UP (Lucknow)**, **Delhi**, **Maharashtra**, **Karnataka**.
Electric vehicles are road-tax exempt in all four.

### Image pipeline

1. IMAGIN.studio 360° renders, when `NEXT_PUBLIC_IMAGIN_CUSTOMER_KEY` is set.
2. Wikimedia Commons photographs in `public/vehicles/` (refresh with
   `npm run fetch:photos`).
3. SVG silhouette as last resort.

### Hybrid data

`getVehicles()` reads PostgreSQL when `DATABASE_URL` is set and the tables
are seeded; otherwise it serves the bundled catalogue. A database outage
degrades to slightly stale content instead of a 500 page.

## Seed vehicles

Cars: Tata Nexon, Maruti Suzuki Fronx, Hyundai Creta, Mahindra XUV 3XO.
Bikes: Royal Enfield Classic 350, TVS iQube.
