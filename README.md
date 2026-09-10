# PandaWorld Apparel — Customer Frontend

A premium, minimalist fashion storefront built with **Vite + React**, styled with **Tailwind CSS** and a hand-built **shadcn/ui-style** component library, authenticated with **Clerk**, and wired to the PandaWorld backend API (Express/Prisma/PostgreSQL).

## Design System

| Token | Value |
|---|---|
| Background | `#FFFFFF` |
| Text | `#111111` (`ink`) |
| Accent (sale/alerts/badges) | `#E53935` (`accent`) |
| Surface | `#FAFAFA` / `#F5F5F5` (`surface` / `surface-muted`) |
| Display type | **Syne** (bold, geometric — used sparingly for headings) |
| Body/UI type | **Inter** |
| Radius scale | 12px / 16px / 20px (`rounded-sm/md/lg`) |

**Signature button**: transparent background, thin black border, black text — fills solid black with white text on hover. This is the `default` variant of `<Button>` in `src/components/ui/button.jsx`, used everywhere except the one or two most urgent CTAs per page (checkout's final "Pay" button uses the red `accent` variant; single-most-important CTAs use `solid`, a pre-filled black button — used sparingly on purpose).

No glassmorphism, no blur, no gradients — every surface is flat, white/black/gray, with red used only for sale badges, stock warnings, and critical actions, per the brief.

## Setup

```bash
npm install
cp .env.example .env
# then fill in:
#   VITE_API_URL                 — your backend's URL, e.g. http://localhost:5000/api
#   VITE_CLERK_PUBLISHABLE_KEY    — from the Clerk Dashboard (same app as the backend)
npm run dev
```

Runs at `http://localhost:5173`. Make sure the backend (from the earlier `ecommerce-backend` build) is running and `CORS_ORIGIN` there includes `http://localhost:5173`.

## Architecture

```
src/
├── components/
│   ├── ui/          shadcn-style primitives (Button, Card, Dialog, Sheet, Select, Tabs…)
│   ├── layout/       Header, Footer, MobileMenu, MiniCart, RootLayout, Logo
│   ├── product/       ProductCard, ProductGallery, QuickViewModal, SizeSelector…
│   ├── shop/           FilterSidebar, SortDropdown, Pagination (PLP)
│   ├── home/            HeroBanner, CategoryShowcase, ProductCarouselSection, FlashSaleBanner…
│   ├── account/          AccountSidebar
│   └── common/            EmptyState, LoadingSpinner, Breadcrumbs, ProtectedRoute, ImagePlaceholder
├── pages/            One file per route (see Pages below), plus pages/account/* for the account section
├── services/          Thin wrappers around the backend API (products, cart, orders/payments)
├── store/              Zustand stores: cartStore (server-synced), wishlistStore & addressStore (local), uiStore
├── lib/                 api client (axios + Clerk token interceptor), utils, constants, productPresentation
├── App.jsx               Routes + auth bootstrap
└── main.jsx                ClerkProvider + Router mount
```

## Pages (all 11 customer pages from the brief)

| Page | Route | Notes |
|---|---|---|
| Home | `/` | Hero, categories, trending/new/best-sellers/recommended carousels, flash sale, newsletter |
| Product Listing | `/shop` | Filters (category/price/size/sale), sort, pagination, quick view |
| Product Details | `/product/:id` | Gallery w/ zoom, size selector, qty, Add to Cart / Buy Now, reviews, related |
| Shopping Cart | `/cart` | Quantity controls, coupon code, order summary |
| Checkout | `/checkout` | 4-step: Shipping → Delivery → Payment → Review, then redirects to PayFast |
| Wishlist | `/wishlist` | Client-persisted (see Known Limitations) |
| Search Results | `/search?q=` | |
| Order Tracking | `/track-order` | Status timeline (PENDING → PROCESSING → SHIPPED → DELIVERED) |
| Customer Support | `/support` | FAQ, shipping/returns, size guide, contact form |
| Account | `/account/*` | Dashboard, Orders, Order Detail, Addresses, Settings |
| Sign in / Sign up | `/sign-in`, `/sign-up` | Clerk's hosted components, styled to match the brand |

## Known limitations (backend doesn't model these yet)

The current backend schema (`User`, `Category`, `Product`, `Cart`, `Order`) is intentionally lean. A few real fashion-storefront features are therefore implemented client-side as clearly-marked placeholders until the backend grows the matching models:

- **Wishlist** — no `/api/wishlist` endpoint yet, so `wishlistStore` persists to `localStorage` per browser (see `src/store/wishlistStore.js`). Swap for real API calls once that endpoint exists.
- **Saved addresses** — `Order.shippingAddress` is a single string; there's no `Address` model. `addressStore` persists addresses locally and formats them into that single string at checkout (`src/store/addressStore.js`).
- **Discounts, ratings/reviews, size variants** — `Product` has no `compareAtPrice`, review, or variant data. `src/lib/productPresentation.js` derives deterministic, presentable placeholder values from each product's id (same product always looks the same) so the UI reads correctly. Swap these out once the schema grows a `compareAtPrice` column, a `Review` model, and a `ProductVariant` model.
- **Coupons** — `CartPage` validates against two demo codes (`PANDA10`, `WELCOME15`) client-side. Replace with a real `/api/coupons/apply` endpoint when one exists.

None of this affects real data — prices, stock, cart contents, and orders are all live from the backend; only the *presentation* extras above are placeholders.

## Auth (Clerk)

Sign-up/sign-in use Clerk's hosted `<SignIn/>`/`<SignUp/>` components (styled to match the design tokens). Once signed in, `App.jsx`'s `AuthBootstrap` registers Clerk's `getToken()` with the axios client (`src/lib/api.js`), so every API request automatically carries a fresh session token — no manual token plumbing needed in individual pages.

## Images

The backend stores one `imageUrl` per product; there's no dedicated marketing-asset system for hero/campaign imagery. `ImagePlaceholder` (`src/components/common/ImagePlaceholder.jsx`) renders a tasteful on-brand placeholder anywhere real campaign photography would go (hero banner, category tiles) — swap in real `<img>` tags once you have shoots to use.

## Next steps

- Wire the admin dashboard (separate route section, per your earlier scoping) into this same app.
- Extend the backend with Wishlist/Address/Review/Coupon models and swap the client-side placeholders for real API calls.
- Add product image galleries (multiple images per product) once the backend supports it.
