# Strapi CMS Reference

**CMS Admin:** `https://cms.vigotskyreynosa.edu.mx/admin`
**Version:** Strapi v3.6.8 (no `/api/` prefix on endpoints)

---

## Current Status

All content types are created and live. The site fetches from Strapi at build time with hardcoded fallbacks if Strapi is unreachable.

| Content Type | Strapi Endpoint | Status |
|---|---|---|
| Homepage | `/homepage` | ✅ Live |
| About Section | `/about-section` | ✅ Live |
| About Page | `/about-page` | ✅ Live |
| Services Page | `/services-page` | ✅ Live |
| CTA Section | `/cta-section` | ✅ Live |
| Contact Page | `/contact-page` | ✅ Live |
| Services | `/services?_sort=order:ASC` | ✅ Live |
| Testimonials | `/testimonials?_sort=order:ASC` | ✅ Live |
| Value Propositions | `/value-propositions?_sort=order:ASC` | ✅ Live |
| Education Levels | `/education-levels?_sort=order:ASC` | ✅ Live |
| Blog Posts | `/blog-posts?_sort=published_date:DESC` | ✅ Live (synced to `data/blog-posts.json`) |
| Categories | `/categories?_sort=order:ASC` | ✅ Live (synced to `data/categories.json`) |

---

## Permissions

Every content type needs public read access:

1. Strapi Admin → **Settings → Roles & Permissions → Public**
2. For each content type, check:
   - Single types: **find**
   - Collection types: **find** and **findOne**
3. Click **Save**

All content must be **Published** (not just saved as draft) to appear on the site.

---

## Content Types — Field Reference

### Single Types

#### Homepage (`/homepage`)
| Field | Type |
|---|---|
| `hero_title` | Short text |
| `hero_subtitle` | Short text |
| `hero_description` | Long text |
| `hero_background_image` | Single media (image) |
| `hero_feature_image` | Single media (image) |
| `years_experience` | Integer |
| `families_count` | Integer |

#### About Section (`/about-section`)
Homepage "Descúbrenos" section.

| Field | Type |
|---|---|
| `badge` | Short text |
| `title` | Short text |
| `description` | Long text |
| `image` | Single media (image) |
| `ctaText` | Short text |
| `ctaLink` | Short text |

#### About Page (`/about-page`)
Full `/acerca` page.

| Field | Type |
|---|---|
| `hero_badge` | Short text |
| `hero_title` | Short text |
| `hero_background` | Single media (image) |
| `main_badge` | Short text |
| `main_title` | Short text |
| `main_description_1` | Rich Text |
| `main_description_2` | Rich Text |
| `main_image` | Single media (image) |
| `mission_badge` | Short text |
| `mission_title` | Short text |
| `mission_subtitle` | Short text |
| `mission_description` | Rich Text |
| `values_badge` | Short text |
| `values_title` | Short text |
| `values_description` | Rich Text |
| `journey_badge` | Short text |
| `journey_title` | Short text |
| `journey_description_1` | Rich Text |
| `journey_description_2` | Rich Text |
| `journey_image` | Single media (image) |

#### Services Page (`/services-page`)
Hero section for `/servicios`.

| Field | Type |
|---|---|
| `hero_badge` | Short text |
| `hero_title` | Short text |
| `hero_background` | Single media (image) |
| `section_badge` | Short text |
| `section_title` | Short text |
| `section_description` | Rich Text |

#### CTA Section (`/cta-section`)
Call-to-action banner used site-wide.

| Field | Type |
|---|---|
| `badge` | Short text (optional) |
| `title` | Short text |
| `description` | Long text |
| `primaryButtonText` | Short text |
| `primaryButtonLink` | Short text |
| `secondaryButtonText` | Short text (optional) |
| `secondaryButtonLink` | Short text (optional) |
| `backgroundColor` | Short text (hex, default `#16a34a`) |

#### Contact Page (`/contact-page`)
Synced at build time to `lib/site-config.ts` by `scripts/sync-contact-info.js`.

| Field | Type |
|---|---|
| `hero_title` | Short text |
| `hero_subtitle` | Short text |
| `address` | Rich Text |
| `phone` | Short text |
| `email` | Email |
| `hours` | Rich Text |
| `mapUrl` | Long text (Google Maps embed URL) |
| `facebook` | Short text (optional) |
| `instagram` | Short text (optional) |
| `whatsapp` | Short text (optional) |

---

### Collection Types

#### Service (`/services`)
| Field | Type | Notes |
|---|---|---|
| `number` | Short text | "01.", "02.", etc. |
| `title` | Short text | Required |
| `description` | Rich Text | Required |
| `shortDescription` | Long text | Required |
| `image` | Single media (image) | Required |
| `imagePosition` | Enumeration | `left` or `right` |
| `order` | Integer | Controls display order |

#### Testimonial (`/testimonials`)
| Field | Type |
|---|---|
| `name` | Short text |
| `role` | Short text (e.g., "Madre de familia") |
| `rating` | Integer (1–5) |
| `text` | Long text |
| `photo` | Single media (image, optional) |
| `order` | Integer |

#### Value Proposition (`/value-propositions`)
| Field | Type |
|---|---|
| `title` | Short text |
| `description` | Long text |
| `icon` | Short text (optional) |
| `order` | Integer |

#### Education Level (`/education-levels`)
| Field | Type | Notes |
|---|---|---|
| `slug` | UID (attached to `title`) | Used as URL: `/niveles/{slug}` |
| `title` | Short text | "Kínder", "Primaria", etc. |
| `description` | Rich Text | |
| `ageRange` | Short text | "3–5 años" |
| `features` | Repeatable component | Each: `{ text: Short text }` |
| `image` | Single media (image) | |
| `color` | Short text | Theme color hex |
| `order` | Integer | |

#### Blog Post (`/blog-posts`)
Synced at build time to `data/blog-posts.json` by `scripts/sync-blog-data.js`.

| Field | Type |
|---|---|
| `title` | Short text |
| `slug` | UID (attached to `title`) |
| `excerpt` | Short text |
| `content` | Rich Text |
| `featured_image` | Single media (image) |
| `category` | Relation → Category |
| `published_date` | Date |
| `author` | Short text (default: "Colegio Lev Vygotsky") |

#### Category (`/categories`)
Synced to `data/categories.json`.

| Field | Type |
|---|---|
| `name` | Short text |
| `slug` | UID (attached to `name`) |
| `order` | Integer |

---

## Troubleshooting

**403 on any endpoint** — Public role doesn't have `find` permission for that content type. Fix: Settings → Roles & Permissions → Public → enable `find`/`findOne`.

**Content not updating** — Content was saved but not published. Click **Publish** (not just Save).

**Images not showing** — Check that media is uploaded and the entry is published. Dev URLs: `https://cms.vigotskyreynosa.edu.mx/uploads/<filename>`. Production images are downloaded to `public/strapi-images/` at build time.

**Build uses fallback data** — Strapi was unreachable during build. Site still deploys successfully with hardcoded fallbacks. Rebuild when Strapi is back online.
