# Commerce Integration Boundary

The current provider is `demoCommerce`, implementing `CommerceAdapter` in `lib/commerce.ts`. All prices are integer **toman**. No customer data, order, payment, or enquiry is submitted. Browser localStorage stores only product IDs, quantities and comparison IDs.

The live implementation should provide product listing, lookup and search through server-only modules. Administrative WooCommerce keys must remain in server environment variables; never use a `NEXT_PUBLIC_` prefix. Validate live IDs, stock and prices on the server at checkout, regardless of what the browser displays.

WooCommerce Store API minor-unit strings must first be parsed using the currency's reported minor-unit count. Then explicitly map configured store currency to IRR (rial) or IRT (toman). `wooAmountToToman` accepts normalized integer major-unit amounts and rejects fractional toman rather than silently rounding. Gateway amounts require a separate explicit mapping tested against the selected gateway.

Prefer a hosted WooCommerce checkout for the first live release: create a validated cart handoff server-side, redirect only to the merchant's allowlisted HTTPS checkout host, and let the installed approved gateway handle payments. Do not assume a gateway plugin supports headless order creation. Signed webhooks and server-verified order status must be authoritative for payment completion.

The preview admin is not an authorization boundary. Before live integration, gate the route through server authentication, implement CSRF protection and permission checks on every mutation, secure cookies, audit records and idempotent price batches. WooCommerce must remain the only inventory/order source of truth. Uploaded files need server validation and safe object storage; client file previews are not production uploads.

Bulk pricing in the demo requires old/new preview, excludes manual overrides, removes the batch after apply, records session history and permits rollback only while current prices match the applied snapshot. Imported spreadsheets contain IDs and integer `price_toman`; formulas, duplicate IDs, unexpected models and invalid amounts are rejected. Rate recalculation accepts only a manually confirmed recent timestamp and bounded rate ratio; there is no live rate source.

Configurator compatibility uses only the explicit fictional IP/Analog protocol and recorder channel count. Storage is estimated as cameras × Mbps × seconds/day × days ÷ 8 ÷ 10^12, plus 15%. It is not an installation certification. Live rules must additionally cover supported codecs, bandwidth, power budgets, firmware, lens coverage, mounts, wiring, disk compatibility and manufacturer documentation.
