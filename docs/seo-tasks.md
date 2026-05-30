# SEO Tasks — Colegio Lev Vygotsky

Audit date: 2026-05-30  
Priority 1 = highest impact / fix first. Priority 13 = lowest / ongoing.

---

## Strapi Content Required?

Most tasks are **pure Next.js code** — no CMS changes needed.  
The three exceptions are marked below with **[STRAPI]**.

---

## Tasks

### Priority 1 — Create `robots.txt` (15 min)
**Status:** [ ] Not started  
**File:** `app/robots.ts` *(new file)*  
**Impact:** Critical — the server currently returns HTTP 403 on `/robots.txt`. Googlebot cannot read crawl rules. A 403 is worse than a missing file — some crawlers treat it as a deliberate block.  
**Fix:** Create `app/robots.ts` so Next.js generates and uploads `robots.txt` at build time.  
**Strapi changes:** None

---

### Priority 2 — Fix Sitemap (1 hr)
**Status:** [ ] Not started  
**File:** `app/sitemap.ts`  
**Impact:** Critical — the sitemap only has 5 URLs. All four `/niveles/*` pages and every `/blog/[slug]` are missing. Google has no declarative path to crawl these pages.  
**Fix:** Rewrite `app/sitemap.ts` to dynamically pull nivel slugs (from Strapi or static fallback) and blog slugs (from `data/blog-posts.json`) at build time. Also fix `lastmod` on blog posts to use `published_date` instead of the current build date.  
**Strapi changes:** None — reads existing Strapi data, does not modify it

---

### Priority 3 — Add `generateMetadata` to Blog Post Pages (30 min)
**Status:** [ ] Not started  
**File:** `app/blog/[slug]/page.tsx`  
**Impact:** High — every blog post currently renders with the homepage title and description. All posts look like duplicates to Google.  
**Fix:** Add a `generateMetadata` function that pulls `title`, `excerpt`, `published_date`, and `featured_image` from the post data (already fetched for the page render) and outputs a unique `<title>`, `<meta name="description">`, and Open Graph tags per post.  
**Strapi changes:** None — uses data already fetched from Strapi

---

### Priority 4 — Fix Double `<h1>` on Homepage (15 min)
**Status:** [ ] Not started  
**File:** `components/HeroStrapi.tsx`  
**Impact:** High — Google sees two `<h1>` tags on the homepage, which dilutes the primary keyword signal. The second heading "Un Camino de Aprendizaje y Éxito Comienza Aquí" should be an `<h2>`.  
**Fix:** Change the second `<h1>` to `<h2>` in the hero component. No design change — same visual weight, correct semantic structure.  
**Strapi changes:** None  
**Note:** If you also want to keyword-optimize the H1 text (e.g., add "Reynosa" to the headline), that change would be made in the Strapi `homepage` content type — but the heading tag fix itself is code-only.

---

### Priority 5 — Rewrite Per-Page Titles and Meta Descriptions (1 hr)
**Status:** [ ] Not started  
**Files:** `app/acerca/page.tsx`, `app/servicios/page.tsx`, `app/contacto/page.tsx`, `app/blog/page.tsx`  
**Impact:** High — current titles repeat the brand name twice ("Vigotsky Reynosa | Vigotsky Reynosa") and descriptions are generic with no local keyword or conversion angle.  
**Fix:** Strip the brand name from per-page title strings (the root layout template already appends it). Rewrite descriptions to include "Reynosa" + intent-specific copy. Recommended:

| Page | Recommended Title | Recommended Description |
|---|---|---|
| /acerca | "Nuestra Historia y Misión" | "Conoce la historia, misión y valores del Colegio Lev Vygotsky — escuela privada en Reynosa, Tamaulipas con educación de preescolar a preparatoria." |
| /servicios | "Servicios Educativos en Reynosa" | "Programas educativos en Reynosa: after school, clases extracurriculares, apoyo psicopedagógico y comedor escolar. Colegio Lev Vygotsky, Reynosa." |
| /contacto | "Contacto e Inscripciones — Reynosa" | "Contáctanos para inscripciones y visitas al Colegio Lev Vygotsky en Reynosa. Lunes a viernes 8:30–17:00." |
| /blog | "Blog Educativo" | "Artículos, noticias y recursos para padres de familia del Colegio Lev Vygotsky en Reynosa, Tamaulipas." |

**Strapi changes:** None

---

### Priority 6 — Fix StructuredData Schema Errors (1 hr)
**Status:** [ ] Not started  
**File:** `components/StructuredData.tsx`  
**Impact:** High — the current schema has several errors that Google's Rich Results Test will flag:
- `"educationalCredentialAwarded": "High School Diploma"` → should be `"Bachillerato"` (Spanish, correct credential name in Mexico)
- `"priceRange": "$$"` → not a valid property for `EducationalOrganization`, remove it
- `SearchAction` on the WebSite schema points to `/blog?q=...` — the blog has no search feature, this is a broken declaration, remove it
- `@type` should be `["EducationalOrganization", "School"]` — Google uses the `School` sub-type for knowledge panels
- Address block is missing `streetAddress` and `postalCode`
- Missing `openingHoursSpecification`

**Strapi changes:**  
**[STRAPI]** The street address and postal code fixes require entering the real address into the `contact-page` content type in Strapi. The `sync-contact-info.js` prebuild script will then write it into `lib/site-config.ts` and the schema will pick it up automatically. Fields needed: street address, colonia, postal code.

---

### Priority 7 — Add Article Schema to Blog Post Pages (1 hr)
**Status:** [ ] Not started  
**Files:** `app/blog/[slug]/page.tsx` + new `components/ArticleSchema.tsx`  
**Impact:** Medium-High — without `BlogPosting` schema, Google cannot display rich results (author, publish date) for blog posts in search results.  
**Fix:** Create a new `ArticleSchema` server component that accepts post data and injects a `BlogPosting` JSON-LD block. Include `headline`, `description`, `datePublished`, `dateModified`, `author`, `publisher`, `image`, and `mainEntityOfPage`. Add it to the blog post page.  
**Strapi changes:** None — uses data already fetched from Strapi

---

### Priority 8 — Add Canonical Tags to All Pages (1 hr)
**Status:** [ ] Not started  
**Files:** `app/layout.tsx`, `app/acerca/page.tsx`, `app/servicios/page.tsx`, `app/contacto/page.tsx`, `app/blog/page.tsx`, `app/niveles/[id]/page.tsx`, `app/blog/[slug]/page.tsx`  
**Impact:** Medium — without canonical tags, CloudFront can serve the same page at `/` and `/index.html` as separate URLs. Google treats these as duplicate pages.  
**Fix:** Add `alternates: { canonical: 'https://vigotskyreynosa.edu.mx/<path>' }` to each page's `metadata` export or `generateMetadata` function. The `/niveles/[id]` page already has `generateMetadata` — just add the canonical there.  
**Strapi changes:** None

---

### Priority 9 — Fix Image Alt Texts (1 hr)
**Status:** [ ] Not started  
**Files:** `components/HeroStrapi.tsx`, `components/NivelesSection.tsx`, `components/Navbar.tsx`, `app/blog/[slug]/page.tsx`  
**Impact:** Medium — generic or empty alt texts lose both accessibility points and keyword relevance signals. The blog post featured image currently has empty alt text.  
**Fix:** Update alt text to be descriptive and locally relevant:
- Navbar logo: `alt="Colegio Lev Vygotsky — Escuela privada en Reynosa"`
- School exterior photos: `alt="Instalaciones del Colegio Lev Vygotsky en Reynosa, Tamaulipas"`
- Level photos: `alt="Programa de [nivel] — Colegio Lev Vygotsky Reynosa"`
- Blog featured image: use `post.title` as the alt fallback if no explicit alt is stored in Strapi

**Strapi changes:** None for the code defaults. Optionally, alt text for Strapi-uploaded images can be set in Strapi's Media Library per image — this is a content task for Phase 9 (real content).

---

### Priority 10 — Add OG Image + Real Address to Site Config (2 hrs)
**Status:** [ ] Not started  
**Files:** `app/layout.tsx`, `public/og-image.jpg` *(new)*, `lib/site-config.ts`  
**Impact:** Medium — when the site is shared on WhatsApp, Facebook, or iMessage, no preview image appears. Also blocks the schema address fix from Priority 6.  
**Fix:**
1. Create a static OG image at `public/og-image.jpg` (1200×630px) — can be a branded image with the school name and logo
2. Add `images: [{ url: '/og-image.jpg', width: 1200, height: 630 }]` to the Open Graph config in `app/layout.tsx`
3. Once real address is entered in Strapi (see below), verify `sync-contact-info.js` writes `streetAddress` and `postalCode` into `lib/site-config.ts`

**Strapi changes:**  
**[STRAPI]** Enter the real street address, colonia, and CP (postal code) into the `contact-page` content type. This feeds both the schema (Priority 6) and the contact page display.

---

### Priority 11 — Add WhatsApp CTA to Contact Page and Footer (30 min)
**Status:** [ ] Not started  
**Files:** `app/contacto/page.tsx`, `components/Footer.tsx`  
**Impact:** Medium — WhatsApp is the dominant contact channel for parents in Mexico. Currently `siteConfig.social.whatsapp` is `undefined`.  
**Fix:** Add a WhatsApp button/link to the contact page and footer. Link format: `https://wa.me/52<10-digit-number>`.  
**Strapi changes:**  
**[STRAPI]** Add the school's WhatsApp number to the `contact-page` content type in Strapi. The `sync-contact-info.js` script should be updated to write `siteConfig.social.whatsapp` from that field.

---

### Priority 12 — Verify Google Search Console + Submit Sitemap (External)
**Status:** [ ] Not started  
**Files:** `app/layout.tsx` *(add verification code)*  
**Impact:** Medium — without Search Console, there is no way to detect manual actions, crawl errors, or confirm the corrected sitemap is being processed. Currently the Google verification code is commented out in `app/layout.tsx`.  
**Fix:**
1. Go to [Google Search Console](https://search.google.com/search-console) → Add property → `https://vigotskyreynosa.edu.mx`
2. Choose HTML tag verification → copy the `content` value from the meta tag
3. Uncomment and fill in `verification: { google: 'your-code-here' }` in `app/layout.tsx`
4. Deploy → verify → submit sitemap at `/sitemap.xml`

**Strapi changes:** None

---

### Priority 13 — Google Business Profile Optimization (External / Ongoing)
**Status:** [ ] Not started  
**Impact:** Highest business impact for local search — but this is entirely external to the codebase.  
**Why it matters:** Parents searching "colegio privado Reynosa" will see the Google local map pack (3 map results) before any blue links. The school cannot appear there without a verified, optimized GBP listing.  
**Actions:**
1. Claim or verify the Google Business Profile at [business.google.com](https://business.google.com)
2. Set category to "Colegio Privado" or "Escuela K-12"
3. Add all education levels as services (Preescolar, Primaria, Secundaria, Preparatoria)
4. Add business hours (must match what's on the website)
5. Upload 10+ high-quality photos of the campus, classrooms, and staff
6. Ensure NAP (Name, Address, Phone) exactly matches what's on the website — same spelling, same phone format
7. Respond to any existing reviews

**NAP consistency note:** The website currently uses "Vigotsky Reynosa" in the UI and "Colegio Lev Vygotsky" in the schema. Decide on one canonical name and use it everywhere — GBP, website schema, footer, and any external directories.

---

## Keyword Targets (Reference)

| Keyword | Intent | Target Page |
|---|---|---|
| colegio privado reynosa | Commercial | Homepage |
| escuela privada reynosa tamaulipas | Commercial | Homepage |
| kinder privado reynosa | Commercial | /niveles/preescolar |
| primaria privada reynosa | Commercial | /niveles/primaria |
| secundaria privada reynosa | Commercial | /niveles/secundaria |
| preparatoria privada reynosa | Commercial | /niveles/preparatoria |
| inscripciones colegio reynosa | Transactional | /contacto |
| colegio lev vygotsky reynosa | Navigational | Homepage |

**Seasonal peaks:** January–February = enrollment season, highest search volume for school-related queries in Mexico.

---

## Summary

| Priority | Task | Est. Time | Strapi? |
|---|---|---|---|
| 1 | Create robots.txt | 15 min | No |
| 2 | Fix sitemap | 1 hr | No |
| 3 | Blog post generateMetadata | 30 min | No |
| 4 | Fix double H1 | 15 min | No |
| 5 | Rewrite page titles + descriptions | 1 hr | No |
| 6 | Fix StructuredData schema | 1 hr | Yes — street address in contact-page |
| 7 | Article schema for blog posts | 1 hr | No |
| 8 | Canonical tags | 1 hr | No |
| 9 | Image alt texts | 1 hr | No |
| 10 | OG image + address | 2 hrs | Yes — street address in contact-page |
| 11 | WhatsApp CTA | 30 min | Yes — WhatsApp number in contact-page |
| 12 | Search Console + sitemap submit | External | No |
| 13 | Google Business Profile | External | No |
