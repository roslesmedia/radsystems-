# RADSYSTEM

Persian RTL security equipment showroom and commerce frontend preview. Built with Next.js App Router, React, TypeScript, Three.js / React Three Fiber / Drei and GSAP ScrollTrigger. Plain CSS tokens keep the design portable without an extra utility framework. Vazirmatn and Manrope are served locally from Fontsource.

## Run

Requires Node.js 22 or newer and npm.

```sh
npm ci
npm run dev -- --port 3000
```

Open http://localhost:3000. Production: `npm run build`, then `npm start`.
In restricted cloud workspaces use `npm ci --cache /tmp/radsystem-npm-cache`.

## Routes

- `/`: scroll-controlled 3D camera concept, rotation, exploded components and reassembly.
- `/shop`: 104 fictional product records, search, URL filters, sorting and pagination.
- `/product/[slug]`: specs, gallery, selected interactive 3D viewers, quantity and cart.
- `/compare`: up to four products.
- `/configurator`: seven-step package builder with explicit protocol, channels, stock and storage checks.
- `/cart`, `/checkout`: browser-persisted cart and demonstration order validation.
- `/account`, `/consultation`: preview forms; no requests are sent.
- `/admin`: isolated, public design demo; product/image/stock editing, Excel price import/export, bulk pricing preview, manual overrides, history and rollback. State is intentionally scoped to the mounted admin page.
- `/info/shipping`, `/info/returns`, `/info/privacy`: truthful policy placeholders.
- `/asset-studio`: local model thumbnail production utility, excluded from sitemap and indexing.

## Data and Integration

All 104 records, brands, prices and specifications are explicitly fictional. `lib/commerce.ts` owns the demo adapter; `lib/woo-contract.ts` defines a future server-only integration contract and strict IRR/IRT conversion. The cart uses browser storage, not a server session. There is no inventory database.

See [integration notes](docs/COMMERCE.md), [asset provenance](docs/ASSETS.md), [implementation plan](docs/IMPLEMENTATION.md), and [QA results](docs/QA.md).

## Validation

```sh
npm run typecheck
npm run lint
npm test
npm run build
node scripts/e2e.mjs
```

Browser scripts use `/usr/bin/chromium`. Start the application before running them. `scripts/visual-check.mjs` produces desktop/mobile screenshots in `test-results/`. `npm run assets` regenerates the authored GLB geometry; `node scripts/render-assets.mjs` renders WebP imagery through Three.js and Chromium. Generated assets are committed source assets, not a deployment-time dependency.

## Deploy to Vercel

1. Commit and push the source to the chosen GitHub repository and branch.
2. Import `roslesmedia/radsystems-` in Vercel as a Next.js project, with repository root as the root directory.
3. Use Node.js 22+, `npm ci`, and `npm run build` (provided in `vercel.json`).
4. Set `NEXT_PUBLIC_SITE_URL` to the assigned preview domain, including `https://`.
5. Deploy and verify product routes, local assets, checkout disclaimers, and the public demo indicator on `/admin`.

No Vercel deployment is claimed unless a deployment URL is recorded in QA results. No WordPress or MySQL service runs in Vercel functions. For a future VPS, use the standard Next production server with `npm run build` and `npm start` behind your HTTPS reverse proxy.

## Production Prerequisites

- Confirmed merchant contact details, service claims, shipping, returns and privacy terms.
- Real product inventory, verified specifications, licensed manufacturer photography/models and brand permissions.
- WordPress + WooCommerce on persistent hosting, authoritative inventory and server-side API credentials.
- Merchant-approved Iranian gateway; verify headless support or use WooCommerce-hosted checkout.
- Backend authentication, role enforcement, audit logs and secure sessions before any operational admin release.
- Working enquiry delivery, account APIs, server cart/session handling and order status.
- Real-device performance/a11y testing and field Core Web Vitals. No Lighthouse or CWV score is claimed.

The homepage camera and separable internal components are an original design concept, not a manufacturer's engineering model. Preview robots and metadata intentionally prohibit indexing; remove this restriction only after real store content is ready.
