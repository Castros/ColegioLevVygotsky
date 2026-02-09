/**
 * TypeScript types for Strapi CMS data
 */

export interface StrapiImage {
  id: number;
  name: string;
  alternativeText?: string | null;
  caption?: string | null;
  width: number;
  height: number;
  formats?: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  } | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string | null;
  provider: string;
  provider_metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface StrapiImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  path?: string | null;
  url: string;
}

export interface Homepage {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  hero_background_image: StrapiImage;
  hero_feature_image: StrapiImage;
  years_experience: number;
  families_count: number;
  created_at: string;
  updated_at: string;
  published_at: string;
}

export interface Gallery {
  id: number;
  title: string;
  category: string;
  images: StrapiImage[];
  created_at: string;
  updated_at: string;
  published_at: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  message: string;
  photo?: StrapiImage | null;
  created_at: string;
  updated_at: string;
  published_at: string;
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  featured_image?: StrapiImage | null;
  created_at: string;
  updated_at: string;
  published_at: string;
}

// Blog Category Collection Type
export interface Category {
  id: number;
  name: string;
  slug: string;
  order?: number | null;
  created_at: string;
  updated_at: string;
  published_at: string;
}

// Blog Post Collection Type
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: StrapiImage;
  category: Category | string; // Can be Category object from Strapi or string from JSON fallback
  published_date: string;
  author?: string | null;
  created_at: string;
  updated_at: string;
  published_at: string;
}

// Services Collection Type
export interface Service {
  id: number;
  number: string;
  title: string;
  description: string;
  shortDescription: string;
  image: StrapiImage;
  imagePosition: 'left' | 'right';
  order: number;
  created_at: string;
  updated_at: string;
  published_at: string;
}

// Testimonials Collection Type (extending existing)
export interface TestimonialExtended extends Testimonial {
  rating: number;
  text: string;
  order: number;
}

// Value Propositions Collection Type
export interface ValueProposition {
  id: number;
  title: string;
  description: string;
  icon?: string | null;
  order: number;
  created_at: string;
  updated_at: string;
  published_at: string;
}

// About Section Single Type
export interface AboutSection {
  id: number;
  badge: string;
  title: string;
  description: string;
  image: StrapiImage;
  ctaText: string;
  ctaLink: string;
  created_at: string;
  updated_at: string;
  published_at: string;
}

// About Page Content Single Type
export interface AboutPage {
  id: number;
  hero_badge: string;
  hero_title: string;
  hero_background: StrapiImage;
  main_badge: string;
  main_title: string;
  main_description_1: string;
  main_description_2: string;
  main_image: StrapiImage;
  mission_badge: string;
  mission_title: string;
  mission_subtitle: string;
  mission_description: string;
  values_badge: string;
  values_title: string;
  values_description: string;
  journey_badge: string;
  journey_title: string;
  journey_description_1: string;
  journey_description_2: string;
  journey_image: StrapiImage;
  created_at: string;
  updated_at: string;
  published_at: string;
}

// Services Page Content Single Type
export interface ServicesPage {
  id: number;
  hero_badge: string;
  hero_title: string;
  hero_background: StrapiImage;
  section_badge: string;
  section_title: string;
  section_description: string;
  created_at: string;
  updated_at: string;
  published_at: string;
}

// CTA Section Single Type
export interface CTASection {
  id: number;
  badge: string;
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string | null;
  secondaryButtonLink?: string | null;
  backgroundColor: string;
  created_at: string;
  updated_at: string;
  published_at: string;
}

// Education Level Feature Component
export interface EducationLevelFeature {
  id: number;
  text: string;
}

// Education Levels Collection Type
export interface EducationLevel {
  id: number;
  slug: string;
  title: string;
  description: string;
  ageRange: string;
  features: EducationLevelFeature[];
  image: StrapiImage;
  color: string;
  order: number;
  created_at: string;
  updated_at: string;
  published_at: string;
}

// Contact Page Single Type
export interface ContactPage {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  mapUrl: string;
  facebook?: string | null;
  instagram?: string | null;
  whatsapp?: string | null;
  created_at: string;
  updated_at: string;
  published_at: string;
}
