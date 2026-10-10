# Verification Record

Date: 2026-10-10. Environment: Node 24.19.0, Next.js 16.4.0, Linux Chromium using software WebGL. Target repository: `roslesmedia/radsystems-`.

## Passed

- Production compilation and prerendering of 122 pages, including all 104 product routes.
- Strict TypeScript checking and ESLint with zero errors or warnings.
- Three focused tests for storage estimation, protocol/channel compatibility, and price adjustment validation.
- Production dependency audit: zero known vulnerabilities. ExcelJS's compatible UUID dependency is overridden to the patched 11.x release.
- Actual canvas-pixel inspection confirms a nonblank 3D hero; pointer movement changes the rendered image.
- Forward scroll exposes separated model components; reverse scroll restores the initial state. The scene is unmounted when offscreen.
- Desktop screenshots at 1440 × 1000 and mobile screenshots at 390 × 844. The exploded lens was reframed after visual inspection.
- Live search handles Persian Arabic-character variants and keyboard result selection.
- Catalogue category/resolution/stock/price-sort URL state, refresh persistence and empty results.
- Product viewer zoom/reset, comparison selection, add-to-cart, quantity changes and cart persistence after refresh.
- Checkout validates sample details and completes a clearly labeled local simulation with no order POST request.
- Seven-step configurator produces a valid demonstration package and adds its three product lines to the cart.
- A 16-camera package exposes adequately stocked cameras and compatible recorder choices, and reaches an enabled package action without warnings.
- Admin bulk price preview, single application, session history and rollback.
- Browser Excel download and validated reimport.
- Successful responses from customer/account, enquiry, policy, robots and sitemap routes.
- Mobile navigation drawer, filter dialog and catalogue selection.
- No document-level horizontal overflow at 390px on home, shop, product, configurator, admin or checkout. A pagination overflow found during testing was corrected and these checks rerun.
- Reduced-motion layout and deliberately disabled WebGL static-image fallback.

After corrections, all 11 original browser scenarios passed in a complete run against the production server on port 3001. A subsequent stock-availability filter correction also passed the added 16-camera package scenario in a focused run. Production HTTP checks returned 200 for the main shopping/admin routes and local GLB/WebP assets. Reproduce the now 12-scenario suite with `node scripts/e2e.mjs`; use `TEST_FILTER='Mobile|Reduced'` for targeted checks. Screenshots and browser output are generated under `test-results/` and are intentionally excluded from Git.

## Explicitly Not Verified or Operational

- No live WooCommerce, payment, authentication, order submission, enquiry delivery, staff authorization or server cart persistence exists.
- Admin data lives only in the current React page session and does not alter the public catalogue.
- The authored camera is conceptual. Manufacturer photorealism, exact engineering, real stock/specifications, licensed brand inventory and installation photography require production assets.
- No field Core Web Vitals, Lighthouse score, real low-power mobile GPU benchmark, screen-reader certification, Safari or Firefox test is claimed.
- Asset fetch failures after WebGL initialization are handled by Next's page error boundary; a production implementation should additionally provide asset-specific retry telemetry.
- No Vercel URL was published. `gh auth status` reports the provided GitHub token as invalid, and no authenticated Vercel tooling is configured. Follow the deployment steps in README once access is restored.

## Preview Boundaries

All catalogue brands, pricing and specifications are fictional and labeled. No reviews, partnerships, merchant credentials, warranty claims, client statistics or real customer records were invented. Preview indexing is disabled. Gateway and merchant API credentials never appear in browser code.
