# CLAUDE.md — Vigotsky Reynosa

## Project

| | |
|---|---|
| **Name** | vigotskyreynosa |
| **Client** | Colegio Lev Vygotsky — private K-12 school in Reynosa, Tamaulipas, México |
| **Live site** | https://vigotskyreynosa.edu.mx |
| **CMS URL** | https://cms.vigotskyreynosa.edu.mx |
| **CMS admin** | castrostech@gmail.com |
| **Type** | nextjs-static |
| **CMS** | Strapi v5 (yes) |
| **Repo** | Castros/ColegioLevVygotsky |
| **Droplet** | 128.199.7.34 (shared — Traefik network `web`) |

---

## Progress

- [x] **Phase 1 — Site built** — Next.js app complete, all pages (home, about, services, blog, contact, niveles), static export verified
- [x] **Phase 2 — AWS infrastructure** — S3 + CloudFront (prod + staging) with OAC, private buckets
- [x] **Phase 3 — GitHub Actions** — push to staging/main triggers build → S3 → CloudFront invalidation, confirmed working
- [x] **Phase 4 — DNS** — domain pointed to CloudFront, SSL valid, site live at vigotskyreynosa.edu.mx
- [x] **Phase 5 — Strapi v5** — migrated from v3.6.8 to v5, all content types defined, seeded with placeholder data
- [x] **Phase 6 — Wired up** — all components fetch from Strapi v5 (`/api/` prefix), fallback to hardcoded data confirmed
- [x] **Phase 7 — Strapi deployed** — Strapi v5 on shared droplet (128.199.7.34), public API accessible at cms.vigotskyreynosa.edu.mx
- [ ] **Phase 8 — Pipeline tested** — publish in Strapi → lifecycle hook → GitHub Actions → new build → live
- [ ] **Phase 9 — Real content** — placeholder data replaced with real school content, real images uploaded
- [ ] **Phase 10 — Contact form** — Lambda + API Gateway deployed, NEXT_PUBLIC_CONTACT_API_ENDPOINT set in GitHub secrets
- [ ] **Phase 11 — Handoff** — staff trained on Strapi admin, old v3 postgres container removed from droplet

**Right now: Phases 1–7 complete. Strapi v5 live and seeded. Next: Phase 8 — test full publish → webhook → rebuild pipeline.**

---

## How this project works end-to-end

```
Content editor publishes in Strapi
  → cms/src/index.ts fires afterCreate/afterUpdate lifecycle hook
  → 8-second debounce (multiple publishes within 8s = one build)
  → GitHub workflow_dispatch → triggers deploy-production.yml
  → GitHub Actions: npm ci → prebuild scripts → npm run build → aws s3 sync → CloudFront invalidation
  → Live site updated (~3–4 minutes after publish)

Prebuild scripts (run before next build):
  → scripts/sync-contact-info.js   fetches /api/contact-page → writes lib/site-config.ts
  → scripts/sync-blog-data.js      fetches /api/blog-posts + /api/categories → writes data/*.json
  → scripts/download-strapi-images.js  downloads all Strapi uploads → public/strapi-images/

If Strapi is unreachable during build:
  → Prebuild scripts warn and skip
  → Build uses hardcoded fallback data in each component
  → Site never goes down because of CMS issues
```

> The legacy Lambda webhook (`lambda-webhook/index.js`) also exists and still works.
> It fires a `repository_dispatch` event instead of `workflow_dispatch`.
> The **lifecycle hook is preferred** — no extra AWS infra needed, has debounce.

---

## Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 16, TypeScript, App Router | `output: 'export'` — fully static |
| Styling | Tailwind CSS v4 | |
| CMS | Strapi v5 on Docker | Self-hosted on shared DigitalOcean droplet |
| Database | PostgreSQL 16 in Docker | Runs alongside Strapi |
| Reverse proxy | Traefik | Auto SSL via Let's Encrypt, network `web` |
| Hosting | AWS S3 + CloudFront (`us-west-2`) | Static files, CloudFront CDN |
| CI/CD | GitHub Actions | deploy-production.yml, deploy-staging.yml |
| Rebuild trigger | Strapi lifecycle hook → workflow_dispatch | 8s debounce, classic PAT required |
| Contact form | AWS Lambda + API Gateway + SES | Lambda in `lambda/contact-form/` |

---

## Local development

```bash
# Start Strapi + PostgreSQL locally
docker compose -f cms/docker-compose.local.yml up --build

# Start Next.js (separate terminal)
npm run dev
```

- Strapi admin: http://localhost:1337/admin (create account on first run)
- Next.js: http://localhost:3000
- Set `NEXT_PUBLIC_STRAPI_URL=http://localhost:1337` in `.env`
- First `docker compose up --build` takes ~5 minutes (Strapi admin compilation)

---

## Deploy CMS to droplet

```bash
# From project root
./scripts/add-to-droplet.sh 128.199.7.34 vigotskyreynosa cms/.env.prod web
```

`add-to-droplet.sh` (4 args: IP, client name, env file, Traefik network):
- Verifies SSH, Docker, named network, swap (adds 2GB if missing)
- rsync `cms/` to `/opt/strapi/vigotskyreynosa/cms/` (excludes node_modules, .git, data)
- Copies `docker-compose.shared.yml` and `.env`
- Runs `docker compose up -d --build`

Watch logs after deploy:
```bash
ssh root@128.199.7.34 "docker logs vigotskyreynosa-strapi -f"
```

---

## Seed / repopulate Strapi content

```bash
# Run from project root
STRAPI_URL=https://cms.vigotskyreynosa.edu.mx \
STRAPI_ADMIN_EMAIL=castrostech@gmail.com \
STRAPI_ADMIN_PASSWORD=<password> \
node cms/scripts/populate-strapi-v5.js
```

Seeds: images from `public/strapi-images/`, blog posts from `data/blog-posts.json`, categories, services, testimonials, value propositions, education levels, all single types. Sets public read permissions automatically.

---

## Strapi content types

All endpoints use **Strapi v5 format** — `/api/` prefix, `sort=field:asc`, `populate=*`.

### Single types
| Endpoint | Used by |
|---|---|
| `/api/homepage?populate=*` | `HeroStrapi.tsx` via `getHomepage()` |
| `/api/about-section?populate=*` | `AboutSection.tsx` |
| `/api/about-page?populate=*` | `app/acerca/page.tsx` |
| `/api/services-page?populate=*` | `app/servicios/page.tsx` |
| `/api/cta-section?populate=*` | `CTASection.tsx` |
| `/api/contact-page?populate=*` | `sync-contact-info.js` → `lib/site-config.ts` |

### Collection types
| Endpoint | Used by |
|---|---|
| `/api/services?sort=order:asc&populate=*` | `ServicesSection.tsx` + `app/servicios/page.tsx` |
| `/api/testimonials?sort=order:asc&populate=*` | `TestimonialsSection.tsx` |
| `/api/value-propositions?sort=order:asc&populate=*` | `ValuePropositionSection.tsx` |
| `/api/education-levels?sort=order:asc&populate=*` | `NivelesSection.tsx` + `app/niveles/[id]/page.tsx` |
| `/api/blog-posts?sort=published_date:desc` | synced to `data/blog-posts.json` |
| `/api/categories?sort=order:asc` | synced to `data/categories.json` |

---

## File map

```
app/
  page.tsx                    ← homepage — assembles all section components
  acerca/page.tsx             ← about page
  servicios/page.tsx          ← services page
  blog/page.tsx               ← blog listing (hardcoded hero)
  blog/[slug]/page.tsx        ← blog post detail
  contacto/page.tsx           ← contact page (hours hardcoded — see Known Gaps)
  niveles/[id]/page.tsx       ← education level detail
  sitemap.ts                  ← static sitemap (missing /niveles/* and blog slugs)

components/
  HeroStrapi.tsx              ← homepage hero — Strapi homepage fields
  ServicesSection.tsx         ← services grid
  AboutSection.tsx            ← about section
  CTASection.tsx              ← call-to-action banner
  TestimonialsSection.tsx     ← testimonials
  ValuePropositionSection.tsx ← value propositions
  NivelesSection.tsx          ← education levels grid
  MasonryGallery.tsx          ← photo gallery (used inside NivelContent only)
  Navbar.tsx / Footer.tsx / TopBar.tsx

lib/
  strapi.ts                   ← all Strapi fetch functions + getStrapiMedia()
  api.ts                      ← blog/gallery fetchers with JSON fallback
  types.ts                    ← TypeScript interfaces for all Strapi content types
  site-config.ts              ← AUTO-GENERATED by sync-contact-info.js at build time
  contact.ts                  ← getContactInfo() helper (Strapi → site-config fallback)
  data.ts                     ← static nav links and service slugs

data/
  blog-posts.json             ← synced from Strapi by sync-blog-data.js
  categories.json             ← synced from Strapi by sync-blog-data.js
  niveles.ts                  ← static fallback for education levels

scripts/
  sync-contact-info.js        ← prebuild: fetches contact-page → writes lib/site-config.ts
  sync-blog-data.js           ← prebuild: fetches blog posts + categories → data/*.json
  download-strapi-images.js   ← prebuild: downloads Strapi uploads → public/strapi-images/
  add-to-droplet.sh           ← deploy CMS to shared droplet (4 args)

cms/
  Dockerfile                  ← Node 22 Alpine + su-exec entrypoint (fixes upload perms)
  docker-compose.shared.yml   ← multi-tenant compose — no Traefik, joins external network
  docker-compose.local.yml    ← local dev with Traefik
  src/index.ts                ← Strapi lifecycle hook → workflow_dispatch (8s debounce)
  scripts/populate-strapi-v5.js  ← one-time seed script
  scripts/fix-strapi-data.js     ← fix/migrate existing Strapi data

lambda/
  contact-form/               ← AWS Lambda for contact form (SES email + rate limiting)

lambda-webhook/
  index.js                    ← legacy: AWS Lambda → repository_dispatch (still works, no debounce)

.github/workflows/
  deploy-production.yml       ← push to main OR workflow_dispatch → build → S3 → CF
  deploy-staging.yml          ← push to staging OR workflow_dispatch → staging build
```

---

## Rules

### Always use Strapi v5 endpoint format
`/api/<type>?sort=field:asc&populate=*` — never the v3 format (`/services?_sort=order:ASC`).

### Every Strapi fetch must have a fallback
```typescript
export async function getServices(): Promise<Service[]> {
  try {
    const res = await fetchAPI('/api/services?sort=order:asc&populate=*');
    return res.data.map((d: any) => d.attributes ?? d);
  } catch {
    return SERVICES_FALLBACK; // hardcoded fallback — site never breaks
  }
}
```

### Public read permissions — set after every new content type
Settings → Roles & Permissions → Roles → Public → enable `find` + `findOne`
API returns 403 without it. Run `populate-strapi-v5.js` to set automatically.

### content-manager PUT saves as draft — publish separately
A PUT to `/content-manager/collection-types/{uid}/{documentId}` saves as draft.
Call `POST .../actions/publish` after. Same applies to single types.

### GitHub token — classic PAT only
`ghp_` prefix only. Fine-grained tokens return 403 on `workflow_dispatch`.
Scopes: `repo` + `workflow`.

### Strapi CMD — always `npm run develop`
Never `strapi start` — causes BigInt PostgreSQL errors in production builds.

### Static export constraints
Keep `output: 'export'` and `images: { unoptimized: true }` in `next.config.ts`.
No runtime API routes. `npm run build` must exit 0.

### Strapi date field types (TypeScript)
```typescript
createdAt?: string; updatedAt?: string; publishedAt?: string;
created_at?: string; updated_at?: string; published_at?: string;
documentId?: string;
```

---

## GitHub Actions secrets

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
S3_BUCKET_NAME                        ← production S3 bucket
CLOUDFRONT_DISTRIBUTION_ID            ← production CloudFront
STAGING_S3_BUCKET
STAGING_CLOUDFRONT_DISTRIBUTION_ID
STAGING_AWS_REGION
NEXT_PUBLIC_STRAPI_URL=https://cms.vigotskyreynosa.edu.mx
NEXT_PUBLIC_CONTACT_API_ENDPOINT      ← API Gateway URL (not yet set)
```

---

## TODO

- [ ] **Phase 8** — Test full pipeline: publish something in Strapi admin → verify GitHub Actions triggers and live site updates
- [ ] **Phase 9** — Replace all placeholder content with real school data (text, photos, staff info, actual hours)
- [ ] **Phase 10** — Deploy contact form Lambda (`lambda/contact-form/`) + set `NEXT_PUBLIC_CONTACT_API_ENDPOINT` in GitHub secrets
- [ ] **Phase 11** — Clean up old v3 Strapi postgres container on droplet: `docker stop strapi-db && docker rm strapi-db`
- [ ] **Phase 11** — Train school staff on Strapi admin (publish blog posts, update services, upload images)
- [ ] Fix sitemap — add `/niveles/*` and `/blog/<slug>` URLs to `app/sitemap.ts`
- [ ] Fix contact page — pull `hours` from Strapi via `getContactInfo()` instead of hardcoding in `app/contacto/page.tsx`
- [ ] Fix blog hero — create a `blog-page` single type in Strapi to drive the title and background image
- [ ] Add gallery page — `/galeria` route using `MasonryGallery.tsx` + `getGalleries()`
. 