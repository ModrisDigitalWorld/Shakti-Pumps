# Shakti Pumps — website + admin

Next.js 16 (App Router) · Tailwind CSS v4 · Supabase Postgres via Drizzle · Cloudinary for images/documents.
Public site (SEO-focused, mobile-first) and a password-protected admin panel in one app.

## 1. Setup

```bash
npm install
cp .env .env                    # then fill in values
npm run db:generate             # only if you change src/lib/db/schema.ts
npm run db:migrate              # applies ./drizzle migrations to Supabase
npm run db:seed                 # categories, KSB brand, industries, FAQs, default settings
npm run dev                     # http://localhost:3000
```

`npm run db:seed:demo` additionally adds clearly-labelled demo products/spares for testing (delete them in the admin before launch).

### Environment variables
| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Supabase -> Project Settings -> Database -> Connection string (use the **transaction pooler**, port 6543, in production) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | The admin login |
| `AUTH_SECRET` | 32+ random characters (`openssl rand -base64 48`) — signs the admin session cookie |
| `CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET` | Image & document uploads (admin can also paste any image URL) |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, sitemap, structured data (e.g. `https://www.example.com`) |
| `NEXT_PUBLIC_GA_ID`, `GOOGLE_SITE_VERIFICATION` | Analytics and Search Console verification |

## 2. Admin panel — `/admin`
Dashboard · Enquiries (status, call/WhatsApp/email, search) · Products · Spare parts · Brands · Categories · Industries · Resources (catalogue upload) · FAQs · Site settings (phones, email, address, map, KSB wording, hero/KSB/about images).
Content changes go live within ~60 s (and immediately for new pages).

## 3. Before launch — content checklist
- Replace placeholder phone / email in **Admin → Site settings**.
- Confirm the **KSB designation** wording matches your official dealership documents; add the KSB logo / images only where permitted.
- Remove demo data, add real products with **verified** specifications and real photographs (consistent 4:3 images on clean backgrounds).
- Publish only the industries you actually serve; upload only documents that exist.
- Review the Privacy Policy and Terms templates.
- Set `NEXT_PUBLIC_SITE_URL`, add the site in Google Search Console (submit `/sitemap.xml`), set the GA ID.
- Turn on Supabase backups (Project → Database → Backups).

## 4. Deploy (Vercel)
Import the repo, add the env vars above, deploy. HTTPS is automatic. Run `npm run db:migrate` once against the production database.

## 5. Structure
```
src/app/(site)/      public pages (home, products, spare-parts, ksb, industries, resources, about, contact, get-a-quote, faq, legal)
src/app/admin/       login + panel (generic CRUD driven by src/lib/admin-config.ts)
src/app/api/         /enquiries (public), /admin/* (auth-protected)
src/lib/db/schema.ts Drizzle schema      src/lib/queries.ts public queries / search
src/middleware.ts    admin auth gate + same-origin check
```
SEO: per-page metadata + canonicals, `sitemap.xml`, `robots.txt`, LocalBusiness / Product / FAQ / Breadcrumb JSON-LD, filtered URLs set to `noindex`.
Security: signed httpOnly session cookie, constant-time credential check, login & enquiry rate limits (in-memory, per instance), honeypot, zod validation on every write, origin check on admin mutations, http(s)-only URLs, upload type/size limits.

## Notes
- Adding a new admin-editable content type: add a table in the schema, a config entry in `admin-config.ts`, and a registry entry in `crud.ts`.
- `_previous-attempt/` (if present) holds files that were already in this folder from an earlier session; they are excluded from the build and safe to delete.
