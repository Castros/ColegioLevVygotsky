/**
 * API functions to fetch data from Strapi CMS
 */

import { fetchAPI } from './strapi';
import type { Homepage, Gallery, Testimonial, Page, BlogPost, AboutPage, Category } from './types';

/**
 * Get homepage data (single type)
 * Strapi v3 endpoint: /homepage
 */
export async function getHomepage(): Promise<Homepage | null> {
  try {
    const data = await fetchAPI('/homepage');
    return data;
  } catch (error) {
    console.error('Error fetching homepage:', error);
    return null;
  }
}

/**
 * Get all galleries
 * Strapi v3 endpoint: /galleries
 */
export async function getGalleries(): Promise<Gallery[]> {
  try {
    const data = await fetchAPI('/galleries');
    return data || [];
  } catch (error) {
    console.error('Error fetching galleries:', error);
    return [];
  }
}

/**
 * Get gallery by category
 * Strapi v3 endpoint: /galleries?category=kinder
 */
export async function getGalleryByCategory(category: string): Promise<Gallery[]> {
  try {
    const data = await fetchAPI(`/galleries?category=${category}`);
    return data || [];
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return [];
  }
}

/**
 * Get all testimonials
 * Strapi v3 endpoint: /testimonials
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const data = await fetchAPI('/testimonials');
    return data || [];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

/**
 * Get all pages
 * Strapi v3 endpoint: /pages
 */
export async function getPages(): Promise<Page[]> {
  try {
    const data = await fetchAPI('/pages');
    return data || [];
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
}

/**
 * Get a single page by slug
 * Strapi v3 endpoint: /pages?slug=example-slug
 */
export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const pages = await fetchAPI(`/pages?slug=${slug}`);
    return pages?.[0] || null;
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

/**
 * Get all blog categories
 * In development: fetch from Strapi with JSON fallback
 * In production: use synced JSON data
 */
export async function getCategories(): Promise<Category[]> {
  try {
    // In development, try to fetch from Strapi first
    if (process.env.NODE_ENV === 'development') {
      try {
        const data = await fetchAPI('/categories?_sort=order:ASC');
        if (data && data.length > 0) {
          console.log('[Categories] Using data from Strapi');
          return data;
        }
      } catch (strapiError) {
        console.warn('[Categories] Strapi fetch failed, falling back to JSON:', strapiError);
      }
    }

    // Fall back to JSON data (or use in production)
    const categoriesData = await import('@/data/categories.json');
    console.log('[Categories] Using JSON fallback data');
    return (categoriesData.default || []) as Category[];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Get all blog posts
 * In development: fetch from Strapi with JSON fallback
 * In production: use synced JSON data
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    // In development, try to fetch from Strapi first
    if (process.env.NODE_ENV === 'development') {
      try {
        const data = await fetchAPI('/blog-posts?_sort=published_date:DESC');
        if (data && data.length > 0) {
          console.log('[Blog Posts] Using data from Strapi');
          return data;
        }
      } catch (strapiError) {
        console.warn('[Blog Posts] Strapi fetch failed, falling back to JSON:', strapiError);
      }
    }

    // Fall back to JSON data (or use in production)
    const blogPostsData = await import('@/data/blog-posts.json');
    console.log('[Blog Posts] Using JSON fallback data');
    return (blogPostsData.default || []) as BlogPost[];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

/**
 * Get blog posts by category slug or name
 * Handles both Category objects and string values
 */
export async function getBlogPostsByCategory(categorySlugOrName: string): Promise<BlogPost[]> {
  try {
    const blogPostsData = await import('@/data/blog-posts.json');
    const posts = (blogPostsData.default || []) as BlogPost[];
    return posts.filter((post: BlogPost) => {
      if (typeof post.category === 'string') {
        return post.category === categorySlugOrName;
      } else if (post.category && typeof post.category === 'object') {
        return post.category.slug === categorySlugOrName || post.category.name === categorySlugOrName;
      }
      return false;
    });
  } catch (error) {
    console.error('Error fetching blog posts by category:', error);
    return [];
  }
}

/**
 * Get a single blog post by slug
 * In development: fetch from Strapi with JSON fallback
 * In production: use synced JSON data
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // In development, try to fetch from Strapi first
    if (process.env.NODE_ENV === 'development') {
      try {
        const posts = await fetchAPI(`/blog-posts?slug=${slug}`);
        if (posts && posts.length > 0) {
          console.log(`[Blog Post ${slug}] Using data from Strapi`);
          return posts[0];
        }
      } catch (strapiError) {
        console.warn(`[Blog Post ${slug}] Strapi fetch failed, falling back to JSON:`, strapiError);
      }
    }

    // Fall back to JSON data (or use in production)
    const blogPostsData = await import('@/data/blog-posts.json');
    const posts = (blogPostsData.default || []) as BlogPost[];
    console.log(`[Blog Post ${slug}] Using JSON fallback data`);
    return posts.find((post: BlogPost) => post.slug === slug) || null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}
