# Verification record — 26 September 2026

These results describe observed checks, not a claim that every possible flow or deployment has passed.

| Area | Result | Scope |
| --- | --- | --- |
| Live commerce and RLS SQL suite | 43 / 43 passed | Existing QA roles, draft save, public catalog access, cart, wishlist, reviews, ownership, COD checkout, stock, status history and review moderation |
| Live regression SQL suite | 32 / 32 passed | Retry idempotence, invalid input, stock revalidation, cancellation/restocking once, manual payment records, support access and replies |
| Frontend unit tests | 8 / 8 passed | Colour-specific sizes/photos, gallery fallbacks, allowed status transitions, paid revenue and secure UUID fallback |
| Production build | Passed | Vite 7.1.7; 1,713 modules; index HTML, CSS and JavaScript emitted |
| Public REST reads | HTTP 200 | Products with category/image/variant joins, approved-review fields, categories; live catalog empty |
| Browser public checks | Passed spot checks | Shop loading/empty state, search URL updates, About route, admin redirects to sign-in |
| Browser product fixture | Passed | Initial colour has only its sizes, Clay changes image and sizes, selecting size enables add-to-cart |
| Browser admin fixtures | Passed | Product editor draft submission, review approval/filter updates, support conversation/reply rendering |
| Mobile layout spot checks | Passed | Product and product editor at 390px iframe width; 375px usable content width including scrollbar; no document horizontal overflow |
| Browser password-authenticated end-to-end flow | Not run | Existing account passwords were unavailable |
| Live image-upload integration script | Not run | QA password unavailable; updated script syntax checked and cleanup added |
| Password recovery / email delivery | Not verified | Requires the owner's mailbox and the intended auth redirect configuration |
| Existing Site deployment | Not performed | Existing project lookup returned NOT_FOUND; no new project created |

The SQL suites ran on 25 September 2026 against the real `cloth-web` database. They use the existing QA user claims and database roles inside transactions. Fixture rows and temporary helpers are rolled back. Order identity sequences can advance during rollback-only checkout tests; gaps are normal and no fake orders remain.

The browser component tests used clearly labelled, isolated local fixtures. They did not authenticate to the live admin account and made no catalog/order/support writes. Their results establish UI behaviour only. They are excluded from the delivered app. This is separate from the live SQL checks and public HTTP reads.

On 26 September 2026 at 09:01 UTC, the live state was checked again: 4 auth users, 2 admin memberships, owner `abdulrehmanafzal60@gmail.com` still an admin, and zero products, categories, orders, reviews, cart items, wishlist items and support tickets. The repaired checkout function and applied migration were present. No real user data or QA accounts were deleted.

## Fixed

- Checkout's ambiguous `order_number`, missing required request ID, and total creation logic.
- Stable request-ID retries, stock-aware cart changes, server-side shipping/address validation and atomic stock/order/cart operations.
- Customer review self-approval and the invalid public review-to-profile join.
- Order cancellation restocking, guarded status transitions, payment-record auditing and paid-only revenue calculations.
- Support RPC permissions, ownership checks and reply/reopen handling.
- Product colour/size/gallery selection; product editor department, unsaved-form preservation on focus refresh and image-preview cleanup.
- Per-keystroke inventory/cart writes, missing admin moderation/support screens, About/404 pages and missing workflow layouts.
- HTTP preview compatibility where `crypto.randomUUID` is unavailable, using secure random values rather than weak randomness.

## Security advisor result

After the migration, the public SECURITY DEFINER execution warnings were cleared. Two existing notices remained: the intentionally inaccessible `private.admin_members` allowlist has RLS with no direct policies (informational), and leaked-password protection is disabled in Supabase Auth. No auth settings were changed. The owner can review the latter setting at [Supabase password security](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection). The private table follows the existing definer-helper access design; do not grant direct access merely to silence an informational notice. [RLS advisor reference](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy).

## Before replacing the published prototype

Sign in to the repaired app, upload and publish the first real product, then complete the customer browse → cart → COD checkout → order history flow and update that order from admin. Confirm the customer sees the update. These owner-dependent checks and access to the existing Sites project are still needed before publication. No payment gateway, fabricated catalog, fake revenue, new project, new admin or password reset was introduced.

Raw database results are in `docs/verification/`. The reproducible SQL suites and frontend tests are in `tests/`. Historical phase reports are archived and are not evidence of current completion.
