# Vigotsky Reynosa WordPress Site Audit

**Date:** 2025-01-13
**Current Site:** https://vigotskyreynosa.edu.mx/
**Purpose:** Migration planning to Next.js + Strapi + S3 + CloudFront

---

## 1. Site Structure Overview

### Main Navigation Pages
1. **Inicio (Home)** - `/` or `/home-2`
2. **Acerca de (About)** - `/about/`
3. **Servicios (Services)** - `/service/`
4. **Blog** - `/blog/`
5. **Contacto (Contact)** - `/contact/`

### Additional Elements
- **CTA Button:** "INSCRIBETE AHORA" (Enroll Now) - Links to contact page
- **Social Media:** Instagram, Facebook, Twitter links in header
- **Footer:** Copyright text "Copyright © 2025 fransolutions.net"

---

## 2. Content Inventory

### Pages (5 total)

#### Home Page
- **Hero Section:**
  - Tagline: "INSPIRANDO MENTES JÓVENES"
  - Headline: "Un Camino de Aprendizaje y Éxito Comienza Aquí"
  - Description: Educational mission statement
  - CTA: "INSCRIBETE AHORA" button
  - Hero image: Student in classroom
- **Stats Section:**
  - "0+ Año de Experiencia"
  - "7+ Familias"
- **Services Preview:** Links to services page
- **About Preview:** Section with "ACERCA DE" link

#### About Page (`/about/`)
- **Hero:** "FORMANDO LÍDERES DEL FUTURO" / "Inspirando la Excelencia en la Educación"
- **Main Content:**
  - Section: "DESCÚBRENOS"
  - Heading: "Una elección confiable para la educación"
  - Description: School mission (kinder to preparatoria)
  - Staff commitment and educational approach
- **Images:** Circular featured image of student

#### Services Page (`/service/`)
- **Hero:** "EMPOWERING EDUCATION" / "Discover Our Comprehensive Learning Programs"
- **Service Items:**
  1. **Holistic Academic Curriculum** - Critical thinking, creativity, emotional intelligence
  2. **Extracurricular Activities** (implied from scroll)
  3. **After-School Care** (implied)
  4. **Progressive Teaching Methods** (implied)
- **Images:** Educational toys/materials

#### Blog Page (`/blog/`)
- **Hero:** "Inspiring Ideas for Lifelong Learning"
- **Layout:** 3-column grid of blog post cards
- **Post Card Format:**
  - Featured image
  - Post title
  - Date
  - Excerpt
  - "Read Post »" link

#### Contact Page (`/contact/`)
- **Hero:** "GET IN TOUCH" / "Connect with Vigotsky Reynosa Today"
- **Form:** SureForms embedded form (shortcode: `[sureforms id='724']`)
- **Contact Information:**
  - **Phone:** 55 89 9174-0031
  - **Email:** contact@vigotskyreynosa.edu.mx
  - **Address:** vygotsky@micolegiomegusta.com.mx
- **Map:** Google Maps embed showing location
  - "Vigotsky English School" marker
  - Address visible: Sur 25 M249 LT514, Leyes de Reforma 2da Secc, Iztapalapa, 09310

---

## 3. Blog Posts Inventory

**Total Posts:** 3
**Author:** z0lkyh3lhooc (single author)
**Categories:** 1 (Uncategorized)
**Tags:** 0 (no tags used)

### Post 1
- **Title:** "Crafting Captivating Headlines: Your awesome post title goes here"
- **Date:** January 16, 2025
- **Featured Image:** Young boy with dinosaur cutout
- **Comments:** 15
- **Category:** Uncategorized

### Post 2
- **Title:** "The Art of Drawing Readers In: Your attractive post title goes here"
- **Date:** January 16, 2025
- **Featured Image:** Three girls on staircase
- **Comments:** 0
- **Category:** Uncategorized

### Post 3
- **Title:** "Mastering the First Impression: Your intriguing post title goes here"
- **Date:** January 16, 2025
- **Featured Image:** Woman in black shirt
- **Comments:** 1
- **Category:** Uncategorized

**Note:** All posts appear to be placeholder/demo content about blog writing techniques.

---

## 4. Media Assets

**Total Media Items:** 10

### Breakdown by Type
- **JPEG Images:** 6
- **PNG Images:** 4
- **PDFs:** 0
- **Other:** 0

### File Size Range
- **Smallest:** 1,212 bytes (32x32 logo)
- **Largest:** 6,121,765 bytes (~6.1 MB - PNG background)

### Image Dimensions Range
- **Smallest:** 32×32 pixels (favicon/logo)
- **Largest:** 2,560×1,920 pixels (hero backgrounds)

### Media Usage
- School logo (multiple sizes)
- Hero background images
- Student/classroom photos
- Featured images for blog posts
- Service section images

---

## 5. Forms & Interactive Features

### Contact Form
- **Plugin:** SureForms (WordPress form builder plugin)
- **Form ID:** 724
- **Location:** Contact page (`/contact/`)
- **Purpose:** General contact/enrollment inquiries
- **Fields:** (Unknown - requires inspection of SureForms configuration)
  - Likely includes: Name, Email, Phone, Message
  - May include: Student Age, Grade Level, Inquiry Type

### Enrollment CTA
- **Button:** "INSCRIBETE AHORA" (appears on multiple pages)
- **Action:** Links to contact page
- **Purpose:** Primary conversion point for new student enrollment

### Google Maps Integration
- **Location:** Contact page
- **Map Type:** Embedded Google Maps iframe
- **Marker:** "Vigotsky English School"

---

## 6. WordPress Plugins Detected

1. **SureForms** - Form builder (contact form)
2. **Ultimate Addons for Gutenberg** - Gutenberg block extensions
3. **Presto Player** - Video player (may not be actively used)

---

## 7. Dynamic Features & Functionality

### Navigation
- **Desktop:** Horizontal menu with 5 main items + CTA button
- **Mobile:** Hamburger menu (responsive)
- **Sticky Header:** Logo and navigation remain visible on scroll

### Comments System
- WordPress default commenting enabled on blog posts
- Comment counts visible: 15, 0, 1 respectively

### Social Media Links
- Instagram
- Facebook
- Twitter
- Text: "Signos en nuestro redes" (Follow us on social media)

### SEO/Meta
- Page titles follow standard WordPress format
- Likely using Yoast SEO or similar (common for WordPress)

---

## 8. Design & Styling

### Color Palette
- **Primary:** Green (#548235 or similar - brand color, CTA buttons)
- **Secondary:** Dark gray/black (text, footer)
- **Accent:** White (backgrounds, text on dark)
- **Hero overlays:** Dark transparency over images

### Typography
- **Headings:** Large, bold, sans-serif
- **Body:** Clean, readable sans-serif
- **Spanish language:** Primary content language

### Layout Patterns
- **Hero sections:** Full-width background image with overlay text + CTA
- **Content sections:** Alternating image + text layouts
- **Blog grid:** 3-column responsive grid
- **Footer:** Dark background with copyright

### Responsive Design
- Mobile-first approach
- Hamburger menu on mobile
- Grid layouts collapse to single column
- Images scale appropriately

---

## 9. Content Type Mapping for Strapi

### Recommended Strapi Content Types

#### 1. **Page** (Collection Type)
- `title` (Text, required)
- `slug` (UID from title, required)
- `hero_title` (Text)
- `hero_subtitle` (Text)
- `hero_image` (Media)
- `content` (Rich Text / Blocks)
- `seo` (Component: SEO)
- `published_at` (DateTime)

#### 2. **Blog Post** (Collection Type)
- `title` (Text, required)
- `slug` (UID from title, required)
- `excerpt` (Text, 200 char)
- `content` (Rich Text, required)
- `featured_image` (Media)
- `author` (Relation: belongs to Author)
- `categories` (Relation: has many Categories)
- `tags` (Relation: has many Tags)
- `published_date` (Date, required)
- `seo` (Component: SEO)

#### 3. **Category** (Collection Type)
- `name` (Text, required)
- `slug` (UID from name)
- `description` (Text)

#### 4. **Tag** (Collection Type)
- `name` (Text, required)
- `slug` (UID from name)

#### 5. **Author** (Collection Type)
- `name` (Text, required)
- `slug` (UID from name)
- `bio` (Text)
- `avatar` (Media)
- `email` (Email)

#### 6. **Service** (Collection Type)
- `title` (Text, required)
- `order` (Number)
- `description` (Rich Text)
- `icon` or `image` (Media)

#### 7. **Contact Submission** (Collection Type)
- `name` (Text, required)
- `email` (Email, required)
- `phone` (Text)
- `message` (Text, required)
- `inquiry_type` (Enumeration: General, Enrollment, Other)
- `submitted_at` (DateTime, auto)
- `status` (Enumeration: New, Contacted, Resolved)

#### 8. **Site Settings** (Single Type)
- `site_title` (Text)
- `site_tagline` (Text)
- `logo` (Media)
- `favicon` (Media)
- `phone` (Text)
- `email` (Email)
- `address` (Text)
- `google_maps_embed_url` (Text)
- `social_media` (Component: repeatable)
  - `platform` (Enumeration: Facebook, Instagram, Twitter)
  - `url` (Text)
- `footer_text` (Text)

#### 9. **Navigation** (Single Type)
- `menu_items` (Component: repeatable)
  - `label` (Text)
  - `url` (Text)
  - `order` (Number)
  - `is_cta` (Boolean)

### Strapi Components

#### SEO Component
- `meta_title` (Text)
- `meta_description` (Text, 160 char)
- `og_image` (Media)
- `keywords` (Text)

#### Social Media Component
- `platform` (Enumeration)
- `url` (Text)

---

## 10. Migration Considerations

### Content Migration Priority
1. **High Priority:**
   - All 5 main pages (Home, About, Services, Blog, Contact)
   - Site settings (logo, contact info, social links)
   - Navigation structure

2. **Medium Priority:**
   - 3 existing blog posts (may be placeholder content)
   - Media library (10 images)

3. **Low Priority:**
   - Comments (15 total across posts)
   - Author profiles (only 1 author currently)

### Forms Replacement Strategy
- **Current:** SureForms WordPress plugin
- **Options for Next.js:**
  1. **Strapi Form Submission API** - Create custom form, POST to Strapi
  2. **Serverless Function** - AWS Lambda/Vercel function to handle submissions
  3. **Third-party Service** - Formspree, Netlify Forms, or similar

**Recommendation:** Use Strapi API endpoint to collect submissions + AWS SES for email notifications

### Email Notifications
- **Current setup:** Unknown (likely WordPress default mail or SMTP plugin)
- **Recommended:** AWS SES (Simple Email Service)
  - Cost-effective ($0.10 per 1,000 emails)
  - Reliable delivery
  - Easy integration with Lambda or Next.js API routes

### Image Optimization
- **Current:** WordPress handles image optimization and responsive sizes
- **For Next.js Static Export:**
  - Use Strapi's image processing for responsive images
  - Or use external service: Cloudinary (free tier available)
  - Or pre-process images during build with sharp/next-image-export-optimizer

**Recommendation:** Use Strapi's built-in image transformations API

### Comments System
- **Current:** WordPress native comments (minimal usage)
- **Options:**
  1. Disable comments (simplest for static site)
  2. Disqus (free tier available)
  3. Third-party service: Commento, Hyvor Talk

**Recommendation:** Remove comments initially, add later if needed

### 404/Error Pages
- **Current:** WordPress default
- **For Static Site:** Create custom 404.html page in Next.js

---

## 11. Technical Requirements Summary

### Frontend (Next.js)
- TypeScript configuration
- Static export (`next export`)
- Tailwind CSS or similar for styling
- Strapi SDK for API calls during build
- Responsive design (mobile-first)
- Spanish language support

### Backend (Strapi on DigitalOcean)
- PostgreSQL database
- Content types as defined in section 9
- API permissions (public read for content)
- CORS configuration for frontend domain
- Image upload and transformation
- Webhook configuration for deployment triggers

### Infrastructure (AWS)
- S3 bucket for static hosting
- CloudFront distribution
- Route 53 or external DNS for domain
- Certificate Manager for SSL
- (Optional) SES for email notifications
- (Optional) Lambda for form processing

### CI/CD
- GitHub repository
- GitHub Actions workflow
- Automated build on Strapi webhook
- S3 sync and CloudFront invalidation

---

## 12. Estimated Migration Complexity

### Content Volume
- **Low:** 5 pages, 3 blog posts, 10 media files
- **Timeline:** Content migration can be completed in 1-2 days

### Custom Features
- **Moderate:** Contact form with email notifications
- **Low:** Social media links, navigation
- **None:** No complex e-commerce, membership, or custom post types

### Design Complexity
- **Moderate:** Clean, modern design with hero sections
- **Standard:** Responsive layouts, common UI patterns
- **Estimated frontend development:** 1-2 weeks

---

## 13. Next Steps

1. ✅ **Audit Complete** - This document
2. **Set up Strapi** - Create content types on DigitalOcean
3. **Migrate Content** - Transfer pages, posts, and media to Strapi
4. **Initialize Next.js** - Set up project with TypeScript + Tailwind
5. **Build Frontend** - Create pages and components
6. **Implement Forms** - Contact/enrollment form with email
7. **Set up AWS** - S3, CloudFront, domain configuration
8. **Deploy & Test** - CI/CD pipeline + testing
9. **Go Live** - Switch DNS to CloudFront

---

## 14. Questions/Uncertainties to Resolve

1. **SureForms Configuration:** What fields are in the contact form?
2. **Email Service:** Current email provider and requirements for notifications
3. **DNS Provider:** Where is vigotskyreynosa.edu.mx hosted? Access credentials?
4. **Analytics:** Is Google Analytics or similar currently installed?
5. **Backup Strategy:** Where should WordPress backups be stored before migration?
6. **Content Update:** Are the 3 blog posts placeholder content or should they be migrated?
7. **Comments:** Should comment functionality be preserved in the new site?

---

**Audit completed by:** Claude Code
**Next task:** Initialize Next.js project and set up Strapi on DigitalOcean
