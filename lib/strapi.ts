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

  try {
    const response = await fetch(requestUrl, mergedOptions);

    if (!response.ok) {
      console.error(`Strapi API error: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch from Strapi: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching from Strapi:', error);
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
