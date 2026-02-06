/**
 * API functions to fetch data from Strapi CMS
 */

import { fetchAPI } from './strapi';
import type { Homepage, Gallery, Testimonial, Page, BlogPost, AboutPage } from './types';

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
 * Get all blog posts
 * Strapi v3 endpoint: /blog-posts
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    // Use local JSON file for development
    const blogPostsData = await import('@/data/blog-posts.json');
    return (blogPostsData.default || []) as BlogPost[];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

/**
 * Get blog posts by category
 * Strapi v3 endpoint: /blog-posts?category=Academics
 */
export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  try {
    // Use local JSON file for development
    const blogPostsData = await import('@/data/blog-posts.json');
    const posts = (blogPostsData.default || []) as BlogPost[];
    return posts.filter((post: BlogPost) => post.category === category);
  } catch (error) {
    console.error('Error fetching blog posts by category:', error);
    return [];
  }
}

/**
 * Get a single blog post by slug
 * Strapi v3 endpoint: /blog-posts?slug=example-slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // Use local JSON file for development
    const blogPostsData = await import('@/data/blog-posts.json');
    const posts = (blogPostsData.default || []) as BlogPost[];
    return posts.find((post: BlogPost) => post.slug === slug) || null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}
