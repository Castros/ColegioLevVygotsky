# Strapi Content Types Setup Guide
## Complete Guide for Creating All Content Types

This guide will walk you through creating all the necessary content types in Strapi so your entire website becomes editable.

**Strapi Admin URL:** `https://cms.vigotskyreynosa.edu.mx/admin`

---

## 📋 Overview

You need to create:
- **5 Single Types** (one instance only - for unique pages)
- **4 Collection Types** (multiple entries - for repeatable content)

---

## 🔧 Part 1: Collection Types (Repeatable Content)

### 1. Services Collection Type

Create services that can be added, edited, or removed.

**Steps:**
1. Go to **Content-Type Builder** → **Create new collection type**
2. **Display name:** `Service`
3. Click **Continue**

**Add these fields:**

| Field Name | Type | Options |
|------------|------|---------|
| `number` | Text (Short text) | Required |
| `title` | Text (Short text) | Required |
| `description` | Rich Text | Required |
| `shortDescription` | Text (Long text) | Required |
| `image` | Media (Single media) | Required, Images only |
| `imagePosition` | Enumeration | Values: `left`, `right` - Required |
| `order` | Number (integer) | Required, Default: 0 |

4. Click **Save** (Strapi will restart)
5. Go to **Settings** → **Roles** → **Public** → Check **find** and **findOne** for Service
6. Click **Save**

---

### 2. Testimonials Collection Type

**Already exists but needs to be updated with new fields.**

**Steps:**
1. Go to **Content-Type Builder** → Find **Testimonial**
2. Add these **new fields** (keep existing ones):

| Field Name | Type | Options |
|------------|------|---------|
| `rating` | Number (integer) | Required, Min: 1, Max: 5 |
| `text` | Text (Long text) | Required |
| `order` | Number (integer) | Required, Default: 0 |

3. Click **Save**
4. Ensure **Public** role has **find** and **findOne** permissions

---

### 3. Value Propositions Collection Type

**Steps:**
1. **Content-Type Builder** → **Create new collection type**
2. **Display name:** `Value Proposition`
3. Click **Continue**

**Add these fields:**

| Field Name | Type | Options |
|------------|------|---------|
| `title` | Text (Short text) | Required |
| `description` | Text (Long text) | Required |
| `icon` | Text (Short text) | Optional |
| `order` | Number (integer) | Required, Default: 0 |

4. Click **Save**
5. Set **Public** permissions (find, findOne)

---

### 4. Education Levels Collection Type

**Steps:**
1. **Content-Type Builder** → **Create new collection type**
2. **Display name:** `Education Level`
3. Click **Continue**

**Add these fields:**

| Field Name | Type | Options |
|------------|------|---------|
| `slug` | UID (attached to `title`) | Required, Unique |
| `title` | Text (Short text) | Required |
| `description` | Rich Text | Required |
| `ageRange` | Text (Short text) | Required (e.g., "3-5 años") |
| `features` | Component (repeatable) | See below |
| `image` | Media (Single media) | Required, Images only |
| `color` | Text (Short text) | Required |
| `order` | Number (integer) | Required, Default: 0 |

**Features Component:**
1. When adding `features` field, select **Component** → **Create new component**
2. **Name:** `feature-item`
3. **Category:** `elements`
4. Add one field:
   - **Name:** `text`
   - **Type:** Text (Short text)
   - **Required:** Yes
5. Click **Finish**
6. Set it as **Repeatable component**

4. Click **Save**
5. Set **Public** permissions (find, findOne)

---

## 🎯 Part 2: Single Types (Unique Pages)

### 1. About Section Single Type

For the homepage "About" section.

**Steps:**
1. **Content-Type Builder** → **Create new single type**
2. **Display name:** `About Section`
3. Click **Continue**

**Add these fields:**

| Field Name | Type | Options |
|------------|------|---------|
| `badge` | Text (Short text) | Required |
| `title` | Text (Short text) | Required |
| `description` | Text (Long text) | Required |
| `image` | Media (Single media) | Required, Images only |
| `ctaText` | Text (Short text) | Required |
| `ctaLink` | Text (Short text) | Required |

4. Click **Save**
5. Set **Public** permission (**find** only)

---

### 2. About Page Content Single Type

For the full About page (`/acerca`).

**Steps:**
1. **Content-Type Builder** → **Create new single type**
2. **Display name:** `About Page`
3. Click **Continue**

**Add these fields:**

| Field Name | Type | Options |
|------------|------|---------|
| `hero_badge` | Text (Short text) | Required |
| `hero_title` | Text (Short text) | Required |
| `hero_background` | Media (Single media) | Required, Images only |
| `main_badge` | Text (Short text) | Required |
| `main_title` | Text (Short text) | Required |
| `main_description_1` | Rich Text | Required |
| `main_description_2` | Rich Text | Required |
| `main_image` | Media (Single media) | Required, Images only |
| `mission_badge` | Text (Short text) | Required |
| `mission_title` | Text (Short text) | Required |
| `mission_subtitle` | Text (Short text) | Required |
| `mission_description` | Rich Text | Required |
| `values_badge` | Text (Short text) | Required |
| `values_title` | Text (Short text) | Required |
| `values_description` | Rich Text | Required |
| `journey_badge` | Text (Short text) | Required |
| `journey_title` | Text (Short text) | Required |
| `journey_description_1` | Rich Text | Required |
| `journey_description_2` | Rich Text | Required |
| `journey_image` | Media (Single media) | Required, Images only |

4. Click **Save**
5. Set **Public** permission (**find** only)

---

### 3. Services Page Content Single Type

For the Services page hero section.

**Steps:**
1. **Content-Type Builder** → **Create new single type**
2. **Display name:** `Services Page`
3. Click **Continue**

**Add these fields:**

| Field Name | Type | Options |
|------------|------|---------|
| `hero_badge` | Text (Short text) | Required |
| `hero_title` | Text (Short text) | Required |
| `hero_background` | Media (Single media) | Required, Images only |
| `section_badge` | Text (Short text) | Required |
| `section_title` | Text (Short text) | Required |
| `section_description` | Rich Text | Required |

4. Click **Save**
5. Set **Public** permission (**find** only)

---

### 4. CTA Section Single Type

For call-to-action sections across the site.

**Steps:**
1. **Content-Type Builder** → **Create new single type**
2. **Display name:** `CTA Section`
3. Click **Continue**

**Add these fields:**

| Field Name | Type | Options |
|------------|------|---------|
| `badge` | Text (Short text) | Optional |
| `title` | Text (Short text) | Required |
| `description` | Text (Long text) | Required |
| `primaryButtonText` | Text (Short text) | Required |
| `primaryButtonLink` | Text (Short text) | Required |
| `secondaryButtonText` | Text (Short text) | Optional |
| `secondaryButtonLink` | Text (Short text) | Optional |
| `backgroundColor` | Text (Short text) | Required, Default: "#16a34a" |

4. Click **Save**
5. Set **Public** permission (**find** only)

---

### 5. Contact Page Single Type

For the Contact page content.

**Steps:**
1. **Content-Type Builder** → **Create new single type**
2. **Display name:** `Contact Page`
3. Click **Continue**

**Add these fields:**

| Field Name | Type | Options |
|------------|------|---------|
| `hero_title` | Text (Short text) | Required |
| `hero_subtitle` | Text (Short text) | Required |
| `address` | Rich Text | Required |
| `phone` | Text (Short text) | Required |
| `email` | Email | Required |
| `hours` | Rich Text | Required |
| `mapUrl` | Text (Long text) | Required |
| `facebook` | Text (Short text) | Optional |
| `instagram` | Text (Short text) | Optional |
| `whatsapp` | Text (Short text) | Optional |

4. Click **Save**
5. Set **Public** permission (**find** only)

---

## 📝 Part 3: Populate Content

Now that all content types are created, populate them with the current website content:

### Services (4 entries)

1. Go to **Content Manager** → **Service** → **Create new entry**

**Service 1:**
- number: `01.`
- title: `Plan de Estudios Integral`
- description: `Nuestro Plan de Estudios Integral está diseñado para nutrir mentes jóvenes...` *(copy from current site)*
- shortDescription: `Un plan educativo completo que fomenta el pensamiento crítico y la creatividad.`
- image: Upload `/images/girl-learning.jpg`
- imagePosition: `left`
- order: `1`

**Service 2:**
- number: `02.`
- title: `Actividades Extracurriculares`
- imagePosition: `right`
- order: `2`

**Service 3:**
- number: `03.`
- title: `Estancia`
- imagePosition: `left`
- order: `3`

**Service 4:**
- number: `04.`
- title: `Métodos de Enseñanza Progresivos`
- imagePosition: `right`
- order: `4`

*(Fill in remaining fields from current website)*

---

### Testimonials (5 entries)

Update existing testimonials with new fields:
- rating: `5`
- order: `1`, `2`, `3`, `4`, `5`

---

### Value Propositions (3 entries)

Create 3 entries with content from current site.

---

### About Section (Single entry)

Fill with homepage about section content.

---

### About Page (Single entry)

Fill with all content from `/acerca` page.

---

### Services Page (Single entry)

Fill with hero content from `/servicios` page.

---

### CTA Section (Single entry)

Fill with call-to-action content.

---

### Contact Page (Single entry)

Fill with contact page content.

---

### Education Levels

Create entries for:
- Kínder
- Primaria
- Secundaria
- Preparatoria

---

## ✅ Verification Checklist

After creating all content types and populating them:

- [ ] All collection types have **find** and **findOne** public permissions
- [ ] All single types have **find** public permission
- [ ] All content is published (not just saved as draft)
- [ ] Test API endpoints:
  - `https://cms.vigotskyreynosa.edu.mx/api/services`
  - `https://cms.vigotskyreynosa.edu.mx/api/testimonials`
  - `https://cms.vigotskyreynosa.edu.mx/api/value-propositions`
  - `https://cms.vigotskyreynosa.edu.mx/api/about-section`
  - `https://cms.vigotskyreynosa.edu.mx/api/about-page`
  - `https://cms.vigotskyreynosa.edu.mx/api/services-page`
  - `https://cms.vigotskyreynosa.edu.mx/api/cta-section`
  - `https://cms.vigotskyreynosa.edu.mx/api/education-levels`
  - `https://cms.vigotskyreynosa.edu.mx/api/contact-page`

All endpoints should return JSON data without 403 errors.

---

## 🚀 Next Steps

Once all content types are created and populated in Strapi:

1. Developer will update the Next.js components to fetch from Strapi
2. Deploy the changes to production
3. Test that content updates trigger automatic rebuilds
4. Train customer on editing content

---

## 📞 Need Help?

If you encounter any issues during setup, check:
- All fields are marked as required/optional correctly
- Public permissions are set for all content types
- Content is **Published**, not just saved as draft
- Image uploads are working properly
