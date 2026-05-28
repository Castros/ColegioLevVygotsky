/**
 * API functions to fetch data from Strapi CMS v5
 */

import { fetchAPI, unwrapCollection, unwrapSingle } from './strapi';
import type { Homepage, Gallery, Testimonial, Page, BlogPost, AboutPage, Category } from './types';

export async function getHomepage(): Promise<Homepage | null> {
  try {
    const res = await fetchAPI('/api/homepage?populate=*');
    return unwrapSingle<Homepage>(res);
  } catch (error) {
    console.error('Error fetching homepage:', error);
    return null;
  }
}

export async function getGalleries(): Promise<Gallery[]> {
  try {
    const res = await fetchAPI('/api/galleries?populate=*');
    return unwrapCollection<Gallery>(res);
  } catch (error) {
    console.error('Error fetching galleries:', error);
    return [];
  }
}

export async function getGalleryByCategory(category: string): Promise<Gallery[]> {
  try {
    const res = await fetchAPI(`/api/galleries?filters[category][$eq]=${category}&populate=*`);
    return unwrapCollection<Gallery>(res);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return [];
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetchAPI('/api/testimonials?sort=order:asc&populate=*');
    return unwrapCollection<Testimonial>(res);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

export async function getPages(): Promise<Page[]> {
  try {
    const res = await fetchAPI('/api/pages?populate=*');
    return unwrapCollection<Page>(res);
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const res = await fetchAPI(`/api/pages?filters[slug][$eq]=${slug}&populate=*`);
    const pages = unwrapCollection<Page>(res);
    return pages[0] ?? null;
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
    if (process.env.NODE_ENV === 'development') {
      try {
        const res = await fetchAPI('/api/categories?sort=order:asc');
        const data = unwrapCollection<Category>(res);
        if (data.length > 0) return data;
      } catch (strapiError) {
        console.warn('[Categories] Strapi fetch failed, falling back to JSON:', strapiError);
      }
    }

    const categoriesData = await import('@/data/categories.json');
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
    if (process.env.NODE_ENV === 'development') {
      try {
        const res = await fetchAPI('/api/blog-posts?sort=published_date:desc&populate=*');
        const data = unwrapCollection<BlogPost>(res);
        if (data.length > 0) return data;
      } catch (strapiError) {
        console.warn('[Blog Posts] Strapi fetch failed, falling back to JSON:', strapiError);
      }
    }

    const blogPostsData = await import('@/data/blog-posts.json');
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
    if (process.env.NODE_ENV === 'development') {
      try {
        const res = await fetchAPI(`/api/blog-posts?filters[slug][$eq]=${slug}&populate=*`);
        const posts = unwrapCollection<BlogPost>(res);
        if (posts.length > 0) return posts[0];
      } catch (strapiError) {
        console.warn(`[Blog Post ${slug}] Strapi fetch failed, falling back to JSON:`, strapiError);
      }
    }

    const blogPostsData = await import('@/data/blog-posts.json');
    const posts = (blogPostsData.default || []) as BlogPost[];
    return posts.find((post: BlogPost) => post.slug === slug) || null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}
