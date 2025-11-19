/**
 * TypeScript types for Strapi CMS data
 */

export interface StrapiImage {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  formats?: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
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
  path?: string;
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
  photo?: StrapiImage;
  created_at: string;
  updated_at: string;
  published_at: string;
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  featured_image?: StrapiImage;
  created_at: string;
  updated_at: string;
  published_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: StrapiImage;
  category: 'Academics' | 'Student Life' | 'School Events' | 'Alumni News' | 'Teacher Spotlights';
  published_date: string;
  author?: string;
  created_at: string;
  updated_at: string;
  published_at: string;
}
