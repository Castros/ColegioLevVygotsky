/**
 * Strapi API utilities for v3.6.8
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://cms.vigotskyreynosa.edu.mx';

/**
 * Helper function to build Strapi API URLs
 */
export function getStrapiURL(path: string = ''): string {
  return `${STRAPI_URL}${path}`;
}

/**
 * Helper to fetch data from Strapi
 */
export async function fetchAPI(path: string, options: RequestInit = {}) {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store', // Disable Next.js fetch cache for build-time fetching
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const requestUrl = getStrapiURL(path);

  console.log(`[Strapi Fetch] Fetching: ${requestUrl}`);
  console.log(`[Strapi Fetch] STRAPI_URL env: ${STRAPI_URL}`);

  try {
    const response = await fetch(requestUrl, mergedOptions);

    console.log(`[Strapi Fetch] Response status: ${response.status}`);

    if (!response.ok) {
      console.error(`Strapi API error: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch from Strapi: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`[Strapi Fetch] Success! Data received for ${path}`);
    return data;
  } catch (error) {
    console.error(`[Strapi Fetch] ERROR for ${path}:`, error);
    throw error;
  }
}

/**
 * Helper to get image URL from Strapi
 * In Strapi v3, images can be relative or absolute
 */
export function getStrapiMedia(url: string | null | undefined): string | null {
  if (!url) return null;

  // If it's already a full URL, return it
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Otherwise, prepend the Strapi URL
  return getStrapiURL(url);
}

/**
 * Fetch Services (Collection Type)
 */
export async function getServices() {
  try {
    const data = await fetchAPI('/api/services?_sort=order:ASC');
    return data;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

/**
 * Fetch Testimonials (Collection Type)
 */
export async function getTestimonials() {
  try {
    const data = await fetchAPI('/api/testimonials?_sort=order:ASC');
    return data;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

/**
 * Fetch Value Propositions (Collection Type)
 */
export async function getValuePropositions() {
  try {
    const data = await fetchAPI('/api/value-propositions?_sort=order:ASC');
    return data;
  } catch (error) {
    console.error('Error fetching value propositions:', error);
    return [];
  }
}

/**
 * Fetch About Section (Single Type)
 */
export async function getAboutSection() {
  try {
    const data = await fetchAPI('/api/about-section');
    return data;
  } catch (error) {
    console.error('Error fetching about section:', error);
    return null;
  }
}

/**
 * Fetch About Page Content (Single Type)
 */
export async function getAboutPage() {
  try {
    const data = await fetchAPI('/api/about-page');
    return data;
  } catch (error) {
    console.error('Error fetching about page:', error);
    return null;
  }
}

/**
 * Fetch Services Page Content (Single Type)
 */
export async function getServicesPage() {
  try {
    const data = await fetchAPI('/api/services-page');
    return data;
  } catch (error) {
    console.error('Error fetching services page:', error);
    return null;
  }
}

/**
 * Fetch CTA Section (Single Type)
 */
export async function getCTASection() {
  try {
    const data = await fetchAPI('/api/cta-section');
    return data;
  } catch (error) {
    console.error('Error fetching CTA section:', error);
    return null;
  }
}

/**
 * Fetch Education Levels (Collection Type)
 */
export async function getEducationLevels() {
  try {
    const data = await fetchAPI('/api/education-levels?_sort=order:ASC');
    return data;
  } catch (error) {
    console.error('Error fetching education levels:', error);
    return [];
  }
}

/**
 * Fetch Single Education Level by slug (Collection Type)
 */
export async function getEducationLevelBySlug(slug: string) {
  try {
    const data = await fetchAPI(`/api/education-levels?slug=${slug}`);
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error(`Error fetching education level ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch Contact Page (Single Type)
 */
export async function getContactPage() {
  try {
    const data = await fetchAPI('/api/contact-page');
    return data;
  } catch (error) {
    console.error('Error fetching contact page:', error);
    return null;
  }
}
