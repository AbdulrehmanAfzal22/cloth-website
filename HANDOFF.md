# Maison Élan — current handoff, 26 September 2026

Read START_HERE.md for setup and admin access and TEST_RESULTS.md for verified results and remaining limits. Older phase reports and the original handoff are preserved in docs/archive/ as historical material.

- Existing Supabase project only: cloth-web / oapkgdvsnpakpackmgcs, ap-south-1.
- Existing Sites project only: appgprj_6ab37721b1b48191ac0dc09c9d623ad3. No new Site or database was created.
- Owner admin: abdulrehmanafzal60@gmail.com. Membership reconfirmed on 26 September. Use the existing password; no password was reset or exposed.
- Admin URL for this build: http://localhost:4173/admin while running locally.
- Payments remain COD/manual in USD. Shipping is free. Payment-status controls record external collection/refund only.
- Applied repair migration: 20260925163156_repair_commerce_and_review_workflows.
- All seven active local migration files were copied from the remote applied history. Do not reapply them.
- checkout_order(p_shipping,p_request_id) is the new idempotent frontend entry point. process_checkout(shipping,shipping_cents) remains compatible with the previous frontend.
- Checkout, cart stock handling, review approval, order transitions/restocking, manual payment records and support access/replies were repaired and tested.
- Customer order item/history ownership checks remain intact.
- 75 live SQL assertions passed under the existing QA identities, with test fixtures rolled back. Eight frontend unit tests and the production build pass.
- Browser checks of product options, admin forms, moderation and support used isolated fixtures; they do not prove password-authenticated image uploads.
- Fresh live counts: 4 auth users; 2 admin memberships; 0 products, categories, orders, reviews, cart items, wishlist items and support tickets.
- QA users and the QA admin membership are deliberately preserved. Never delete them without a new owner instruction.
- The catalog still needs real owner-provided products and photographs. Never fabricate products, orders, payments, revenue or test results.
- Full password-authenticated upload and customer checkout testing remains owner-dependent because no existing QA password was available.
- The published prototype was not changed. Its existing Sites project lookup still returned NOT_FOUND in this session. Resolve access to that exact project; never create a replacement.
- Live schema/functions/RLS and current code take precedence over historical markdown or archived SQL.
