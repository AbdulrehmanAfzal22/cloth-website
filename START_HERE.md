# Maison Élan — repaired source and admin guide

Release prepared 26 September 2026. This package uses the existing Supabase project `cloth-web` (`oapkgdvsnpakpackmgcs`). Do not create another database or apply the old migrations again.

This update adds `supabase/migrations/20260927110000_require_complete_published_products.sql`. Apply this new migration once to the existing project before deploying the updated app. It backfills products without a category into an `Uncategorized` category, makes category assignment required, and enforces publish completeness in `save_product`.

## Open the app from source

Install Node.js 22.12 or a newer supported Node LTS version. Unzip the source archive, open a terminal in the `maison-elan` folder, and run:

```sh
npm ci
npm run dev
```

Keep that terminal open. Open **http://localhost:4173** in your browser. This project's port is **4173**, not 5173.

The existing public Supabase URL and publishable key are already configured. No database password, secret key, payment key, or new project is needed. Internet access is needed for Supabase, product images, and the existing externally hosted editorial images/fonts.

## Access the admin dashboard

1. Open **http://localhost:4173/admin**.
2. Sign in with **abdulrehmanafzal60@gmail.com** and the account's existing password.
3. After signing in, the app returns you to the admin dashboard. You can also use **My account → Open admin dashboard**, or **Admin sign in** in the footer.

Admin membership was reconfirmed in the live database on 26 September 2026. There is no default admin password. Signing up does not grant admin access. If you forgot the password, use the app's **Forgot password?** link and your own email inbox; do not send a password in chat.

Email confirmation and password-recovery links require the intended app origin in the existing project's Supabase Auth redirect allowlist. For local use, allow `http://localhost:4173/login` for signup confirmation and `http://localhost:4173/reset-password` for recovery. Recovery requests use `/reset-password?mode=forgot`; the emailed link returns to `/reset-password` to set a new password. Check these settings in the existing project if email links redirect elsewhere. Password recovery and email delivery have not been verified in this release.

Leaked-password protection was reported disabled in the last Supabase security review. It is a hosted Auth setting, not a repository setting, and could not be changed from this workspace. The project owner should enable it in the existing Supabase project's Auth password-security settings; do not alter unrelated database security policies to address this warning.

## Add your real catalog

The live catalog remains empty. No invented products were added.

1. In **Categories**, add your desired categories.
2. In **Products & inventory**, choose **Add product**.
3. Enter the name, USD price, department, description, care information and category.
4. Add a row for every colour/size combination and enter its stock.
5. Upload your product photographs: JPEG, PNG or WebP, up to 5 MB each. The first image is the cover. Set each photo's **Image colour** to its variant colour (for example, `Ink`) so selecting that colour shows its photos. Unlabelled images can be shared across colours.
6. Choose a category before saving. To publish, provide a nonblank description, at least one complete colour/size variant, and an uploaded image. The server enforces these rules in addition to the editor validation. Drafts stay hidden from shoppers.
7. Open `/shop`, open the product and refresh to confirm its saved data and photos.

## Orders, reviews and support

- Checkout is deliberately **cash on delivery/manual**, in **USD**, with **free shipping**. No gateway is connected, and the app does not charge a card.
- Orders start pending/unpaid. Admin → Orders shows delivery details, items, totals and status history. Statuses move forward. Cancelling an unshipped order restores its stock once; shipped/delivered orders cannot be cancelled with this control.
- Payment status is an admin record only. Mark paid after collecting payment. Mark refunded only after you have actually refunded the customer outside the app. These controls do not transfer money. Revenue totals count records marked paid.
- Inventory and cart quantities use an explicit save button beside the number.
- Review policy: any authenticated customer may submit a review; reviews require admin approval before appearing publicly. Reviews are not verified-purchase-only. Admin → Reviews can approve, hide or delete them.
- Product “Delete” in Admin → Products is a soft delete: it archives/unpublishes the product and clears its featured flag. Product, variant, image, wishlist and order-history rows are preserved to protect historical records and foreign-key relationships. Archived products are hidden from the storefront; edit their status only if restoring them is intended.
- Customers can open Help & complaints from their account or order details. Admin → Support provides replies and ticket status controls.
- Existing QA accounts and their admin membership were preserved, as instructed.

## Production-build ZIP

The separate build archive contains `dist/`, this guide, and `serve.mjs`. With Node.js installed, unzip it and run:

```sh
node serve.mjs
```

Then open **http://localhost:4173/admin**. This local preview needs no `npm install`. Close the source development server first if it already occupies port 4173. Do not double-click `dist/index.html`; the application needs an HTTP server and route fallback.

To rebuild from source:

```sh
npm test
npm run build
node serve.mjs
```

## Existing published site

This release has **not** replaced the old static published prototype. The existing Sites project is `appgprj_6ab37721b1b48191ac0dc09c9d623ad3`. Its connector returned “Sites project not found” in this session. No replacement Site was created.

After the owner completes real sign-in/upload/customer-flow checks, publish the built `dist/` to that **same** project through the account that owns it. Keep SPA fallback to `index.html` for app routes such as `/admin` and `/product/...`, use HTTPS, and configure the existing Supabase Auth redirect URLs for that origin. Preserve the site's current access settings. The platform sign-in gate is separate from the storefront's Supabase login.

## Verification and remaining limits

See `TEST_RESULTS.md` for exactly what was tested. Live SQL checks prove the database workflows and access policies under existing QA identities; isolated browser fixtures prove the UI behaviour separately. They are not a substitute for a real password-authenticated image-upload and checkout session.

The remaining owner-dependent checks are: sign in using the real account, upload/publish the first real product, then complete a customer COD order and verify it in admin. The QA login/image-upload script was syntax-checked but was not run because the existing QA password was unavailable. Do not reset/delete QA users or grant additional admins just to run it.

`tests/product-flow.mjs` accepts one JSON line on stdin with `admin`, `customer` (existing QA UUIDs) and `password`. Use a private local input file or password manager; never commit credentials. The script removes only its own uniquely identified product/image fixture in `finally` and reports cleanup errors. Run it from the source folder with `node tests/product-flow.mjs` and supply stdin securely.

The SQL files in `supabase/migrations/` now match the seven applied remote migration versions, including `20260925163156_repair_commerce_and_review_workflows.sql`. They are records, not instructions to reapply the database. Historical phase documents and superseded SQL drafts are retained in `docs/archive/` and must not be used as current completion reports.
