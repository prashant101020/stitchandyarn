# 🧶 Stitch & Yarn — by Deepa

> Handmade crochet accessories, personalised keychains, home decor & gifting.

A beautiful, mobile-first e-commerce website built for a handmade crochet brand.

![Stitch & Yarn](public/logo.jpeg)

---

## ✨ Features

- **Beautiful storefront** — Hero, category tiles, bestsellers carousel, testimonials, trust badges
- **Full shop** — Category filters, search, price sorting, product detail with image gallery
- **Personalisation** — Custom initial letters, colour choices, notes saved with orders
- **Cart & Checkout** — Slide-in cart drawer, guest checkout, Indian PIN code validation, gift notes
- **WhatsApp ordering** — Pre-filled WhatsApp message with complete order details
- **Razorpay payments** — Feature-flagged; works fully with WhatsApp-only if not configured
- **Order tracking** — Track by order ID + phone number
- **Custom order requests** — Form with image upload, colour preferences, deadline
- **Admin panel** (`/admin`) — Product CRUD, order management with status flow, CSV export, coupons
- **Mobile-first** — Thumb-friendly, sticky CTAs, bottom navigation patterns
- **SEO** — Per-page titles, Open Graph tags, sitemap.xml, robots.txt
- **Performance** — Code-split routes, lazy-loaded images, minimal bundle

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| State | Zustand (cart, persisted in localStorage) |
| Animation | Framer Motion |
| Icons | Lucide React |
| Toasts | react-hot-toast |
| Database | Supabase (Postgres + Auth + Storage) |
| Payments | Razorpay (optional) |
| Hosting | Cloudflare Pages |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- A [Supabase](https://supabase.com) account (free tier)

### 1. Clone & Install

```bash
cd stitch-yarn-app
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → **New Query**
3. Paste the contents of `supabase-schema.sql` and run it
4. Go to **Settings** → **API** and copy:
   - Project URL → `VITE_SUPABASE_URL`
   - `anon` public key → `VITE_SUPABASE_ANON_KEY`

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_RAZORPAY_KEY_ID=        # Leave empty for WhatsApp-only mode
VITE_WHATSAPP_NUMBER=919876543210
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 5. Set Up Admin Authentication

1. In Supabase, go to **Authentication** → **Users**
2. Click **Add User** → enter the admin email and password
3. Log in at `/admin` with those credentials

### 6. Upload Product Images

1. In Supabase, go to **Storage** → create a bucket called `product-images`
2. Set the bucket policy to **Public**
3. Upload images through the Admin panel or directly in Supabase Storage

## 📦 Deploying to Cloudflare Pages

### Build

```bash
npm run build
```

Output is in `dist/`.

### Deploy

1. Go to [Cloudflare Pages](https://pages.cloudflare.com)
2. Connect your GitHub repo (or upload the `dist/` folder)
3. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Add environment variables in the Cloudflare dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_RAZORPAY_KEY_ID` (if using Razorpay)
   - `VITE_WHATSAPP_NUMBER`

### Custom Domain

1. In Cloudflare Pages → your project → **Custom Domains**
2. Add `stitchandyarn.in` (or your domain)
3. Update DNS records as instructed

## 🔑 Razorpay Setup (Optional)

If you want online payments in addition to WhatsApp ordering:

1. Create a [Razorpay](https://razorpay.com) account
2. Get your **Test Mode** Key ID and Key Secret
3. Add `VITE_RAZORPAY_KEY_ID` to your `.env`
4. Set `razorpay_enabled` to `true` in the `site_settings` table
5. For production, switch to Live Mode keys

> Without Razorpay configured, the site works fully with WhatsApp ordering only.

## 👩‍💼 Owner's Guide: How to Add a Product

1. Go to `/admin` and sign in
2. Click the **Products** tab
3. Click **+ Add Product**
4. Fill in:
   - **Name** — e.g., "Rose Gold Bun Stick"
   - **Description** — Write in a warm, personal voice
   - **Price** — in ₹ (e.g., 349)
   - **Compare Price** — original price if on sale (optional)
   - **Category** — select from dropdown
   - **Stock** — number available (0 if made-to-order)
   - **Made to order** — check if you make it after ordering
   - **Images** — upload 1–4 photos
5. Click **Save**

The product will appear in the shop immediately.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CartDrawer.tsx   # Slide-in cart
│   ├── Footer.tsx       # Site footer
│   ├── Motifs.tsx       # SVG brand motifs (hearts, sprigs)
│   ├── Navbar.tsx       # Navigation bar
│   ├── UI.tsx           # Shared components (cards, headings, etc.)
│   └── WhatsAppFab.tsx  # Floating WhatsApp button
├── pages/               # Route pages (code-split)
│   ├── Home.tsx
│   ├── Shop.tsx
│   ├── Product.tsx
│   ├── Checkout.tsx
│   ├── OrderConfirmation.tsx
│   ├── TrackOrder.tsx
│   ├── About.tsx
│   ├── Contact.tsx
│   ├── FAQ.tsx
│   ├── CustomOrder.tsx
│   ├── ShippingReturns.tsx
│   ├── Privacy.tsx
│   ├── Terms.tsx
│   └── Admin.tsx
├── App.tsx              # Router + layout
├── data.ts              # Mock/seed data
├── store.ts             # Zustand cart store
├── types.ts             # TypeScript interfaces
├── index.css            # Design system + Tailwind
└── main.tsx             # Entry point
```

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| Cream | `#FBF3EA` | Page background |
| Surface | `#FFFAF5` | Cards, modals |
| Primary | `#B9735F` | Buttons, links |
| Blush | `#F2C9BE` | Highlights |
| Cocoa | `#3E2420` | Text |
| Sage | `#8C9A74` | Accent badges |
| Rose Line | `#D9A794` | Borders |

**Fonts:** Great Vibes (script accents) · Cormorant Garamond (headings) · DM Sans (body)

---

Made with 💕 by Deepa
