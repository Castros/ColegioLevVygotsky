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
    cache: 'force-cache', // Cache at build time for static export
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
 * Strapi v3 endpoint: /services (no /api prefix)
 */
export async function getServices() {
  try {
    const data = await fetchAPI('/services?_sort=order:ASC');
    return data;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

/**
 * Fetch Testimonials (Collection Type)
 * Strapi v3 endpoint: /testimonials
 */
export async function getTestimonials() {
  try {
    const data = await fetchAPI('/testimonials?_sort=order:ASC');
    return data;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

/**
 * Fetch Value Propositions (Collection Type)
 * Strapi v3 endpoint: /value-propositions
 */
export async function getValuePropositions() {
  try {
    const data = await fetchAPI('/value-propositions?_sort=order:ASC');
    return data;
  } catch (error) {
    console.error('Error fetching value propositions:', error);
    return [];
  }
}

/**
 * Fetch About Section (Single Type)
 * Strapi v3 endpoint: /about-section
 */
export async function getAboutSection() {
  try {
    const data = await fetchAPI('/about-section');
    return data;
  } catch (error) {
    console.error('Error fetching about section:', error);
    return null;
  }
}

/**
 * Fetch About Page Content (Single Type)
 * Strapi v3 endpoint: /about-page
 */
export async function getAboutPage() {
  try {
    const data = await fetchAPI('/about-page');
    return data;
  } catch (error) {
    console.error('Error fetching about page:', error);
    return null;
  }
}

/**
 * Fetch Services Page Content (Single Type)
 * Strapi v3 endpoint: /services-page
 */
export async function getServicesPage() {
  try {
    const data = await fetchAPI('/services-page');
    return data;
  } catch (error) {
    console.error('Error fetching services page:', error);
    // Return null gracefully - the page will use fallback data
    return null;
  }
}

/**
 * Fetch CTA Section (Single Type)
 * Strapi v3 endpoint: /cta-section
 */
export async function getCTASection() {
  try {
    const data = await fetchAPI('/cta-section');
    return data;
  } catch (error) {
    console.error('Error fetching CTA section:', error);
    return null;
  }
}

/**
 * Fetch Education Levels (Collection Type)
 * Strapi v3 endpoint: /education-levels
 */
export async function getEducationLevels() {
  try {
    const data = await fetchAPI('/education-levels?_sort=order:ASC');
    return data;
  } catch (error) {
    console.error('Error fetching education levels:', error);
    return [];
  }
}

/**
 * Fetch Single Education Level by slug (Collection Type)
 * Strapi v3 endpoint: /education-levels
 */
export async function getEducationLevelBySlug(slug: string) {
  try {
    const data = await fetchAPI(`/education-levels?slug=${slug}`);
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error(`Error fetching education level ${slug}:`, error);
    return null;
  }
}

/**
 * Fetch Contact Page (Single Type)
 * Strapi v3 endpoint: /contact-page
 */
export async function getContactPage() {
  try {
    const data = await fetchAPI('/contact-page');
    return data;
  } catch (error) {
    console.error('Error fetching contact page:', error);
    return null;
  }
}
