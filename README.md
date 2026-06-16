# CreativeOS

**The AI Creative Operating System for high-performing ad creatives.**

Upload a single product image and CreativeOS analyzes it, builds a full advertising strategy, and generates **10 ready-to-launch ad creatives** — each with a custom AI image, scroll-stopping hook, headline, body copy, and CTA. Plus an **Ad Intelligence** module that researches competitors and produces 10 original, market-inspired ad ideas.

Built with Next.js 15, TypeScript, Prisma, NextAuth v5, and OpenAI (GPT-4o vision + `gpt-image-1`).

---

## ✨ Features

- **Product Analyzer** — GPT-4o vision detects product type, colors, materials, benefits, audience, and sales angles _(1 credit)_
- **Ad Strategy Generator** — 10 distinct ad angles with hooks, headlines, copy, CTAs, and image prompts _(2 credits)_
- **AI Image Generation** — `gpt-image-1` renders each creative with product consistency _(5 credits each / 50 for a full pack)_
- **Ad Gallery** — preview, download (PNG), copy the copy, and regenerate individual ads
- **Export** — single PNG via `@vercel/og`, or the full pack as a ZIP bundle (JSZip)
- **Ad Intelligence** — competitor research → winning patterns + 10 original ad ideas _(10 credits)_
- **Credits system** — DB-backed, atomic transactions, per-operation accounting
- **Auth** — NextAuth v5 (credentials) with protected dashboard routes
- **Premium dark UI** — Tailwind + shadcn/ui, violet accent, Linear/Stripe aesthetic

---

## 🧱 Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| ORM / DB | Prisma + PostgreSQL |
| Auth | NextAuth v5 (Auth.js) |
| Uploads | UploadThing |
| AI copy / vision | OpenAI GPT-4o |
| AI images | OpenAI `gpt-image-1` |
| PNG export | `@vercel/og` (Satori) |
| ZIP export | JSZip |
| Validation | Zod |

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example file and fill in your keys:

```bash
cp .env.example .env.local
```

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | ✅ | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | ✅ | `http://localhost:3000` in dev |
| `OPENAI_API_KEY` | ✅ | For analysis, strategy, and image generation |
| `UPLOADTHING_SECRET` | ✅ | Product image uploads |
| `UPLOADTHING_APP_ID` | ✅ | |
| `STRIPE_*` | ⬜ | Optional — billing is stubbed in dev |
| `APP_URL` | ✅ | `http://localhost:3000` |

### 3. Set up the database

```bash
npm run db:migrate   # create schema
npm run db:seed      # demo user + starter credits
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Demo login:** `demo@creativeos.ai` / `demo123456`

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | Lint |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:push` | Push schema without a migration |
| `npm run db:generate` | Generate the Prisma client |
| `npm run db:seed` | Seed the demo user and credits |
| `npm run db:studio` | Open Prisma Studio |

---

## 🔁 Generation Flow

```
Upload product image (UploadThing)
        ↓
Analyze Product   → GPT-4o vision → ProductAnalysis        (1 credit)
        ↓
Generate Strategy → GPT-4o → AdStrategy + 10 AdCreatives   (2 credits)
        ↓
Generate Full Pack → gpt-image-1 ×10 (sequential)          (50 credits)
   client polls status every 3s → auto-redirect to gallery
        ↓
Gallery → download PNG / ZIP, copy copy, regenerate
```

Image generation runs sequentially in the route handler; `AdCreative.status`
(`QUEUED → PROCESSING → COMPLETED / FAILED`) mirrors a queue model, so BullMQ
or similar can be dropped in later without schema changes.

---

## 💳 Credit Costs

| Operation | Credits |
|---|---|
| Analyze product | 1 |
| Generate strategy | 2 |
| Generate single image | 5 |
| Generate full pack (10 ads) | 50 |
| Analyze competitor | 10 |

New accounts start with **100 free credits**.

---

## 📁 Project Structure

```
app/
  (marketing)/    Landing + pricing
  (auth)/         Login + register
  (dashboard)/    Protected app (projects, gallery, intelligence, billing, settings)
  api/            Auth, projects, AI, ads, export, intelligence, credits, upload
components/
  ui/             shadcn/ui primitives
  layout/         Sidebar, header
  landing/        Marketing sections
  projects/ ads/ billing/
lib/              auth, prisma, openai, credits, storage, uploadthing, utils
prompts/          product-analysis, ad-strategy, image-generation, competitor-analysis
schemas/          Zod schemas (API + AI response validation)
types/            Shared TypeScript types
prisma/           schema.prisma + seed.ts
```

---

## ⚠️ Mocked in dev

- **Stripe billing** — UI is complete; "Add Credits" grants credits directly in dev mode
- **Email verification** — logged to console
- **Job queue** — sequential in-request generation (status model is queue-ready)

---

## License

Private. All rights reserved.
