/**
 * Strapi API utilities for v5
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://cms.vigotskyreynosa.edu.mx';

export function getStrapiURL(path: string = ''): string {
  return `${STRAPI_URL}${path}`;
}

// Strapi v5 wraps all responses in { data: ... }
export function unwrapCollection<T = any>(res: any): T[] {
  return res?.data ?? [];
}

export function unwrapSingle<T = any>(res: any): T | null {
  return res?.data ?? null;
}

export async function fetchAPI(path: string, options: RequestInit = {}) {
  const defaultOptions: RequestInit = {
    headers: { 'Content-Type': 'application/json' },
    // In development: no-cache so Strapi changes appear immediately
    // In production: force-cache for static exports
    cache: process.env.NODE_ENV === 'development' ? 'no-cache' : 'force-cache',
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: { ...defaultOptions.headers, ...options.headers },
  };

  const response = await fetch(getStrapiURL(path), mergedOptions);

  if (!response.ok) {
    throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Helper to get image URL from Strapi
 *
 * In production builds:
 * - Images are downloaded from Strapi during build time
 * - URLs are rewritten to point to local /strapi-images/ folder
 *
 * In development:
 * - Images are fetched directly from Strapi URL
 */
export function getStrapiMedia(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads/')) {
    if (process.env.NODE_ENV === 'production') {
      const filename = url.split('/').pop();
      return `/strapi-images/${filename}`;
    }
    return getStrapiURL(url);
  }
  return url;
}

// Collection types — all use /api/ prefix, sort=field:asc, populate=*
export async function getServices() {
  try {
    const res = await fetchAPI('/api/services?sort=order:asc&populate=*');
    return unwrapCollection(res);
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export async function getTestimonials() {
  try {
    const res = await fetchAPI('/api/testimonials?sort=order:asc&populate=*');
    return unwrapCollection(res);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

export async function getValuePropositions() {
  try {
    const res = await fetchAPI('/api/value-propositions?sort=order:asc&populate=*');
    return unwrapCollection(res);
  } catch (error) {
    console.error('Error fetching value propositions:', error);
    return [];
  }
}

export async function getEducationLevels() {
  try {
    const res = await fetchAPI('/api/education-levels?sort=order:asc&populate=*');
    return unwrapCollection(res);
  } catch (error) {
    console.error('Error fetching education levels:', error);
    return [];
  }
}

export async function getEducationLevelBySlug(slug: string) {
  try {
    const res = await fetchAPI(`/api/education-levels?filters[slug][$eq]=${slug}&populate=*`);
    const items = unwrapCollection<any>(res);
    return items.length > 0 ? items[0] : null;
  } catch (error) {
    console.error(`Error fetching education level ${slug}:`, error);
    return null;
  }
}

// Single types — all use /api/ prefix, populate=*
export async function getAboutSection() {
  try {
    const res = await fetchAPI('/api/about-section?populate=*');
    return unwrapSingle(res);
  } catch (error) {
    console.error('Error fetching about section:', error);
    return null;
  }
}

export async function getAboutPage() {
  try {
    const res = await fetchAPI('/api/about-page?populate=*');
    return unwrapSingle(res);
  } catch (error) {
    console.error('Error fetching about page:', error);
    return null;
  }
}

export async function getServicesPage() {
  try {
    const res = await fetchAPI('/api/services-page?populate=*');
    return unwrapSingle(res);
  } catch (error) {
    console.error('Error fetching services page:', error);
    return null;
  }
}

export async function getCTASection() {
  try {
    const res = await fetchAPI('/api/cta-section?populate=*');
    return unwrapSingle(res);
  } catch (error) {
    console.error('Error fetching CTA section:', error);
    return null;
  }
}

export async function getContactPage() {
  try {
    const res = await fetchAPI('/api/contact-page?populate=*');
    return unwrapSingle(res);
  } catch (error) {
    console.error('Error fetching contact page:', error);
    return null;
  }
}
