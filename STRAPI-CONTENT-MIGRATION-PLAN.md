# Strapi Content Migration Plan
## Vigotsky Reynosa - Making Website Content Editable

This document outlines the plan to migrate all hardcoded content to Strapi CMS so the customer can edit website content independently.

---

## 📋 Current Status

### ✅ Already in Strapi
- **Homepage Hero** (Single Type) - Connected via `HeroStrapi` component
  - hero_title, hero_subtitle, hero_description
  - hero_background_image, hero_feature_image
  - years_experience, families_count

### ❌ Needs Migration (Hardcoded)

#### **1. Services** (Collection Type)
**Location:** `app/servicios/page.tsx` + `components/ServicesSection.tsx`

**Content to migrate:**
- Service 01: Plan de Estudios Integral
- Service 02: Actividades Extracurriculares
- Service 03: Estancia
- Service 04: Métodos de Enseñanza Progresivos

**Fields needed:**
```typescript
{
  number: string,           // "01.", "02.", etc.
  title: string,           // Service title
  description: text,       // Long description
  shortDescription: text,  // For homepage preview
  image: media,            // Service image
  imagePosition: enum      // "left" or "right"
}
```

---

#### **2. Testimonials** (Collection Type)
**Location:** `components/TestimonialsSection.tsx`

**Content to migrate:**
- 5 parent testimonials currently hardcoded

**Fields needed:**
```typescript
{
  name: string,           // Parent name
  role: string,          // "Madre de Estudiante", "Padre de Estudiante"
  rating: integer,       // 1-5 stars
  text: text,           // Testimonial text
  photo: media          // Optional parent photo
}
```

---

#### **3. Value Propositions** (Collection Type)
**Location:** `components/ValuePropositionSection.tsx`

**Content to migrate:**
- Enfoque Educativo Holístico
- Personal Dedicado y Experimentado
- Actividades Extracurriculares Dinámicas

**Fields needed:**
```typescript
{
  title: string,
  description: text,
  icon: string,          // Icon name (optional)
  order: integer        // Display order
}
```

---

#### **4. About Section** (Single Type)
**Location:** `components/AboutSection.tsx`

**Fields needed:**
```typescript
{
  badge: string,         // "DESCÚBRENOS"
  title: string,        // "Una Opción Confiable en Educación"
  description: text,    // Main description paragraph
  image: media,         // Circular image
  ctaText: string,      // "ACERCA DE"
  ctaLink: string       // "/acerca"
}
```

---

#### **5. About Page Content** (Single Type)
**Location:** `app/acerca/page.tsx`

**Fields needed:**
```typescript
{
  // Hero Section
  hero_badge: string,              // "FORMANDO LÍDERES DEL FUTURO"
  hero_title: string,              // "Inspirando la Excelencia..."
  hero_background: media,

  // Main Content Section
  main_badge: string,              // "DESCÚBRENOS"
  main_title: string,              // "Una elección confiable..."
  main_description_1: text,        // First paragraph
  main_description_2: text,        // Second paragraph
  main_image: media,

  // Mission Section
  mission_badge: string,           // "NUESTRO PROPÓSITO..."
  mission_title: string,
  mission_subtitle: string,
  mission_description: text,

  // Values Section
  values_badge: string,
  values_title: string,
  values_description: text,

  // Journey Section
  journey_badge: string,           // "NUESTRO RECORRIDO..."
  journey_title: string,
  journey_description_1: text,
  journey_description_2: text,
  journey_image: media
}
```

---

#### **6. Services Page Content** (Single Type)
**Location:** `app/servicios/page.tsx`

**Fields needed:**
```typescript
{
  hero_badge: string,       // "EDUCACIÓN INTEGRAL"
  hero_title: string,       // "Descubre Nuestros Programas..."
  hero_background: media
}
```
*Note: Service cards will use the Services collection type*

---

#### **7. CTA Section** (Single Type)
**Location:** `components/CTASection.tsx`

**Fields needed:**
```typescript
{
  badge: string,           // Badge text
  title: string,          // Main CTA title
  description: text,      // CTA description
  primaryButtonText: string,    // "Contáctanos"
  primaryButtonLink: string,    // "/contacto"
  secondaryButtonText: string,  // Optional
  secondaryButtonLink: string,  // Optional
  backgroundColor: string       // Background color/gradient
}
```

---

#### **8. Education Levels (Niveles)** (Collection Type)
**Location:** `data/niveles.ts` + `components/NivelesSection.tsx`

**Fields needed:**
```typescript
{
  id: string,            // URL slug
  title: string,        // "Kínder", "Primaria", etc.
  description: text,
  ageRange: string,     // "3-5 años"
  features: component[], // Repeatable features list
  image: media,
  color: string,        // Theme color
  order: integer
}
```

---

#### **9. Contact Page** (Single Type)
**Location:** `app/contacto/page.tsx`

**Fields needed:**
```typescript
{
  hero_title: string,
  hero_subtitle: string,
  address: text,
  phone: string,
  email: string,
  hours: text,
  mapUrl: string,       // Google Maps embed URL
  socialLinks: component[] // Repeatable social links
}
```

---

## 🎯 Implementation Plan

### Phase 1: Setup Strapi Content Types (Priority)
1. ✅ Homepage Hero (already exists)
2. **Create Services collection type**
3. **Create Testimonials collection type**
4. **Create Value Propositions collection type**
5. **Create About Section single type**
6. **Create About Page Content single type**
7. **Create Services Page Content single type**
8. **Create CTA Section single type**
9. **Create Education Levels collection type**
10. **Create Contact Page single type**

### Phase 2: Migrate Data to Strapi
1. Login to Strapi admin
2. Create all content types following the field structure above
3. Set public permissions for all content types (find, findOne)
4. Input all current hardcoded content into Strapi
5. Upload all images to Strapi media library

### Phase 3: Update Next.js Code
1. Create Strapi API helper functions in `lib/strapi.ts`
2. Update each component to fetch from Strapi instead of hardcoded data
3. Handle loading states and fallbacks
4. Test all pages locally

### Phase 4: Deploy & Test
1. Commit changes to GitHub
2. Trigger GitHub Actions deployment
3. Verify all content displays correctly on production
4. Test that content updates in Strapi reflect on website after rebuild

### Phase 5: Documentation
1. Create customer guide for editing content
2. Document each Strapi content type and what it controls
3. Add screenshots and step-by-step instructions
4. Include troubleshooting section

---

## 📝 Strapi API Endpoints (After Migration)

```
GET /api/homepage          - Homepage hero data
GET /api/services          - All services
GET /api/testimonials      - All testimonials
GET /api/value-propositions - Value propositions
GET /api/about-section     - About section data
GET /api/about-page        - Full about page content
GET /api/services-page     - Services page hero
GET /api/cta-section       - CTA section data
GET /api/education-levels  - All niveles/levels
GET /api/contact-page      - Contact page content
```

---

## ⚠️ Important Notes

1. **Preserve Webhook:** Ensure Strapi webhook continues to trigger GitHub Actions on content update
2. **Image Optimization:** Images from Strapi may need optimization settings
3. **Fallback Content:** Add fallback data in case Strapi API fails
4. **Cache Strategy:** Consider caching strategy for faster builds
5. **Permissions:** Ensure all content types have public read permissions

---

## 🎓 Customer Training Topics

1. How to login to Strapi
2. How to edit existing content
3. How to upload and manage images
4. How to add/remove testimonials
5. How to reorder items (services, niveles)
6. How content changes trigger website updates
7. Troubleshooting common issues

---

## 📊 Success Metrics

- ✅ All hardcoded content moved to Strapi
- ✅ Customer can independently edit all content
- ✅ Website automatically rebuilds on content changes
- ✅ No code changes needed for content updates
- ✅ Customer trained and comfortable with Strapi
- ✅ Documentation complete and accessible

---

**Next Steps:**
1. Get customer approval for this plan
2. Begin Phase 1: Create all Strapi content types
3. Schedule customer training session after migration complete
