# Vigotsky Reynosa Website

Official website for Instituto Vigotsky Reynosa - A modern, static Next.js website with headless CMS integration, deployed on AWS infrastructure.

🌐 **Live Site:** [vigotskyreynosa.edu.mx](https://vigotskyreynosa.edu.mx)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Content Management](#content-management)
- [Additional Documentation](#additional-documentation)

---

## 🎯 Overview

This is a high-performance, SEO-optimized educational institution website built with Next.js and deployed as a static site on AWS. The site features:

- ⚡ Lightning-fast static generation
- 🎨 Modern, responsive design with Tailwind CSS
- 📝 Headless CMS integration with Strapi
- 🚀 Automated CI/CD pipeline with GitHub Actions
- 🌍 Global CDN delivery via CloudFront
- 🔒 SSL/TLS encryption
- 📱 Mobile-first responsive design
- ♿ Accessibility-focused components

---

## 🛠 Tech Stack

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/)
- **Language:** [TypeScript 5](https://www.typescriptlang.org/)

### Backend & CMS
- **CMS:** [Strapi](https://strapi.io/) (Headless CMS)
- **CMS URL:** cms.vigotskyreynosa.edu.mx
- **Content API:** RESTful API for blog posts and dynamic content

### Infrastructure
- **Hosting:** AWS S3 (Static hosting)
- **CDN:** AWS CloudFront (Global content delivery)
- **DNS:** AWS Route53
- **SSL/TLS:** AWS Certificate Manager (ACM)
- **Region:** us-west-2

### CI/CD
- **Platform:** GitHub Actions
- **Trigger:** Push to main branch, manual dispatch, or Strapi webhook
- **Workflow:** Build → Test → Deploy → Cache Invalidation

---

## 🏗 Architecture

```
┌─────────────────┐
│   GitHub Repo   │
│   (Next.js App) │
└────────┬────────┘
         │
         │ Push/Webhook
         ▼
┌─────────────────┐
│ GitHub Actions  │
│ - npm install   │
│ - next build    │
│ - static export │
└────────┬────────┘
         │
         │ aws s3 sync
         ▼
┌─────────────────┐      ┌──────────────┐
│   AWS S3 Bucket │◄─────┤ Strapi CMS   │
│  (Static Files) │      │ (cms.*)      │
└────────┬────────┘      └──────────────┘
         │                      │
         │ CloudFront OAC       │ API Fetch
         ▼                      │ (Build Time)
┌─────────────────┐             │
│  CloudFront CDN │◄────────────┘
│  (Edge Cache)   │
└────────┬────────┘
         │
         │ HTTPS
         ▼
┌─────────────────┐
│   Route53 DNS   │
│ vigotskyreynosa │
│    .edu.mx      │
└─────────────────┘
```

### Key Features:
- **Static Generation:** Pages are pre-rendered at build time for maximum performance
- **Incremental Updates:** Strapi webhooks trigger automatic rebuilds when content changes
- **Edge Caching:** CloudFront caches static assets globally
- **Origin Access Control:** S3 bucket is private, only accessible via CloudFront
- **Auto Cache Invalidation:** CloudFront cache is automatically cleared on each deployment

---

## 📁 Project Structure

```
vigotskyreynosa/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── sitemap.ts                # SEO sitemap
│   ├── manifest.ts               # PWA manifest
│   ├── acerca/                   # About page
│   ├── blog/                     # Blog section (Strapi)
│   ├── contacto/                 # Contact page
│   ├── niveles/                  # Education levels
│   ├── servicios/                # Services page
│   └── api/                      # API routes
│       └── revalidate/           # Webhook endpoint
├── components/                   # React components
│   ├── Navbar.tsx                # Navigation bar
│   ├── Footer.tsx                # Site footer
│   ├── TopBar.tsx                # Top information bar
│   ├── Hero.tsx                  # Hero section
│   ├── HeroStrapi.tsx            # Strapi-powered hero
│   ├── AboutSection.tsx          # About section
│   ├── ServicesSection.tsx       # Services display
│   ├── EducationLevelsSection.tsx
│   ├── TestimonialsSection.tsx
│   ├── CTASection.tsx            # Call-to-action
│   ├── MasonryGallery.tsx        # Image gallery
│   ├── ScrollToTop.tsx           # Scroll utility
│   └── StructuredData.tsx        # SEO schema
├── data/                         # Static data
│   ├── blog-posts.json           # Blog posts cache
│   └── niveles.ts                # Education levels data
├── public/                       # Static assets
│   └── images/                   # Image files
├── lambda/                       # AWS Lambda functions
│   └── contact-form/             # Contact form handler
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI/CD workflow
├── lib/                          # Utility functions
├── out/                          # Static export output (gitignored)
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** v20.x or higher
- **npm:** v10.x or higher
- **Git:** Latest version

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/vigotskyreynosa.git
   cd vigotskyreynosa
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_STRAPI_URL=https://cms.vigotskyreynosa.edu.mx
   STRAPI_API_TOKEN=your_strapi_api_token
   REVALIDATION_SECRET=your_secret_key
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 💻 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production (static export)
npm run build

# Export static site
npm run export

# Lint code
npm run lint

# Start production server (for testing)
npm start
```

### Development Workflow

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and test locally:
   ```bash
   npm run dev
   ```

3. Build and verify static export:
   ```bash
   npm run build
   ```

4. Commit and push:
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

5. Create a Pull Request to `main` branch

### Code Style

- **TypeScript:** Strict mode enabled
- **ESLint:** Next.js recommended configuration
- **Formatting:** Follow existing patterns
- **Components:** Functional components with TypeScript
- **Naming:** PascalCase for components, camelCase for functions

---

## 🚢 Deployment

### Automatic Deployment (Recommended)

The site automatically deploys when:
- Code is pushed to `main` branch
- Strapi content is updated (via webhook)
- Manual workflow dispatch is triggered

### GitHub Actions Workflow

```yaml
Triggers:
  - push: main branch
  - repository_dispatch: strapi-update
  - workflow_dispatch: manual trigger

Steps:
  1. Checkout code
  2. Setup Node.js 20
  3. Install dependencies (npm ci)
  4. Restore Next.js cache
  5. Build static site (npm run build)
  6. Configure AWS credentials
  7. Sync to S3 bucket (aws s3 sync)
  8. Invalidate CloudFront cache
```

### Manual Deployment

If you need to deploy manually:

```bash
# 1. Build the site
npm run build

# 2. Sync to S3 (requires AWS CLI configured)
aws s3 sync out/ s3://your-bucket-name --delete

# 3. Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### Deployment Monitoring

- **GitHub Actions:** Check [Actions tab](https://github.com/your-org/vigotskyreynosa/actions)
- **CloudFront:** Monitor via AWS Console
- **Logs:** Available in GitHub Actions workflow runs

---

## 🔐 Environment Variables

### Local Development (.env.local)

```env
# Strapi CMS Configuration
NEXT_PUBLIC_STRAPI_URL=https://cms.vigotskyreynosa.edu.mx
STRAPI_API_TOKEN=your_strapi_api_token

# Webhook Security
REVALIDATION_SECRET=your_secret_key

# For local Strapi development:
# NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

### GitHub Secrets (Production)

Required secrets in GitHub repository settings:

| Secret Name | Description | Example |
|------------|-------------|---------|
| `NEXT_PUBLIC_STRAPI_URL` | Strapi CMS URL | `https://cms.vigotskyreynosa.edu.mx` |
| `AWS_ACCESS_KEY_ID` | AWS IAM access key | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret key | `wJalrXUt...` |
| `S3_BUCKET_NAME` | S3 bucket name | `vigotskyreynosa-website` |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID | `E1234ABCDEFGH` |

---

## 📝 Content Management

### Strapi CMS

The site uses Strapi as a headless CMS for dynamic content:

- **CMS URL:** https://cms.vigotskyreynosa.edu.mx
- **Content Types:** Blog posts, hero sections, testimonials
- **API:** RESTful API with JWT authentication

### Content Update Workflow

1. **Login to Strapi:** Access the CMS admin panel
2. **Edit Content:** Update blog posts, images, or other content
3. **Publish:** Click publish in Strapi
4. **Auto-Deploy:** Webhook triggers GitHub Actions
5. **Live Update:** Site rebuilds and deploys automatically (~5 minutes)

### Blog Posts

Blog posts are fetched from Strapi at build time and cached in `data/blog-posts.json`. The site automatically rebuilds when blog content is updated via webhook.

---

## 📚 Additional Documentation

Detailed setup guides are available in the repository:

- **[AWS-SETUP.md](./AWS-SETUP.md)** - Complete AWS infrastructure setup (S3, CloudFront, Route53, IAM)
- **[STRAPI-SETUP.md](./STRAPI-SETUP.md)** - Strapi CMS configuration and content types
- **[STRAPI-BLOG-SETUP.md](./STRAPI-BLOG-SETUP.md)** - Blog functionality setup
- **[BLOG-DEPLOYMENT-GUIDE.md](./BLOG-DEPLOYMENT-GUIDE.md)** - Blog deployment workflow
- **[WEBHOOK-SETUP.md](./WEBHOOK-SETUP.md)** - Strapi webhook configuration
- **[WEBHOOK-DIAGNOSIS.md](./WEBHOOK-DIAGNOSIS.md)** - Troubleshooting webhooks
- **[SEO-SETUP.md](./SEO-SETUP.md)** - SEO optimization guide
- **[lambda/README.md](./lambda/README.md)** - AWS Lambda functions guide

---

## 🌟 Features

### Performance
- ⚡ Static site generation for instant page loads
- 🗜️ Optimized images and assets
- 📦 Code splitting and lazy loading
- 🌐 Global CDN delivery

### SEO
- 🔍 Automated sitemap generation
- 📊 Structured data (JSON-LD)
- 📱 Mobile-responsive meta tags
- 🎯 Optimized page titles and descriptions

### User Experience
- 🎨 Modern, clean design
- 📱 Mobile-first responsive layout
- ♿ Accessibility features
- 🔄 Smooth page transitions
- ⬆️ Scroll-to-top functionality

### Developer Experience
- 🔧 TypeScript for type safety
- 🎨 Tailwind CSS for rapid styling
- 🔄 Hot module replacement in development
- 📦 Automated deployments
- 🧪 ESLint for code quality

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary software for Instituto Vigotsky Reynosa.

---

## 📞 Support

For technical issues or questions:
- **Website:** [vigotskyreynosa.edu.mx](https://vigotskyreynosa.edu.mx)
- **Email:** Contact through the website form
- **GitHub Issues:** For development-related issues

---

## 🎓 About Instituto Vigotsky Reynosa

Instituto Vigotsky Reynosa is an educational institution committed to providing quality education. This website serves as the primary digital presence for the institution, providing information about programs, admissions, and educational philosophy.

---

**Built with ❤️ by the Vigotsky Tech Team**
