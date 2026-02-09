/**
 * Sync blog categories and posts from Strapi to local JSON files
 * Run this before build to ensure static site has latest blog content
 */

const fs = require('fs');
const path = require('path');

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://cms.vigotskyreynosa.edu.mx';

// Default fallback categories
const DEFAULT_CATEGORIES = [
  {
    id: 1,
    name: 'Académicos',
    slug: 'academicos',
    order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Vida Estudiantil',
    slug: 'vida-estudiantil',
    order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Eventos Escolares',
    slug: 'eventos-escolares',
    order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Noticias de Exalumnos',
    slug: 'noticias-exalumnos',
    order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: 'Destacados de Maestros',
    slug: 'destacados-maestros',
    order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
  },
];

async function fetchCategories() {
  try {
    console.log('📂 Fetching blog categories from Strapi...');
    const response = await fetch(`${STRAPI_URL}/categories?_sort=order:ASC`);

    if (!response.ok) {
      console.warn(`⚠️  Strapi returned ${response.status}, using default categories`);
      return null;
    }

    const categories = await response.json();
    console.log(`✅ Fetched ${categories.length} categories`);
    return categories;
  } catch (error) {
    console.warn('⚠️  Failed to fetch categories from Strapi:', error.message);
    return null;
  }
}

async function fetchBlogPosts() {
  try {
    console.log('📝 Fetching blog posts from Strapi...');
    const response = await fetch(`${STRAPI_URL}/blog-posts?_sort=published_date:DESC`);

    if (!response.ok) {
      console.warn(`⚠️  Strapi returned ${response.status}, keeping existing blog posts`);
      return null;
    }

    const posts = await response.json();
    console.log(`✅ Fetched ${posts.length} blog posts`);
    return posts;
  } catch (error) {
    console.warn('⚠️  Failed to fetch blog posts from Strapi:', error.message);
    return null;
  }
}

function transformBlogPost(post) {
  // Handle both Strapi v3 relation formats:
  // - category as object: { id, name, slug }
  // - category as ID: number
  let categoryValue = post.category;

  if (typeof post.category === 'object' && post.category !== null) {
    // Category is already populated, keep it as is
    categoryValue = post.category;
  } else if (typeof post.category === 'number') {
    // Category is just an ID - this shouldn't happen with proper Strapi query
    // but handle it gracefully
    categoryValue = post.category.toString();
  }

  return {
    ...post,
    category: categoryValue,
  };
}

async function main() {
  console.log('🚀 Starting blog data sync...\n');

  // Fetch data from Strapi
  const categoriesData = await fetchCategories();
  const blogPostsData = await fetchBlogPosts();

  // Prepare directories
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Write categories
  const categoriesPath = path.join(dataDir, 'categories.json');
  const categoriesToWrite = categoriesData || DEFAULT_CATEGORIES;
  fs.writeFileSync(categoriesPath, JSON.stringify(categoriesToWrite, null, 2), 'utf-8');
  console.log(`\n✅ Categories written to: ${categoriesPath}`);
  console.log(`   ${categoriesToWrite.length} categories saved`);

  // Write blog posts (only if we got data from Strapi)
  if (blogPostsData && blogPostsData.length > 0) {
    const blogPostsPath = path.join(dataDir, 'blog-posts.json');
    const transformedPosts = blogPostsData.map(transformBlogPost);
    fs.writeFileSync(blogPostsPath, JSON.stringify(transformedPosts, null, 2), 'utf-8');
    console.log(`✅ Blog posts written to: ${blogPostsPath}`);
    console.log(`   ${transformedPosts.length} posts saved`);
  } else {
    console.log('ℹ️  No blog posts from Strapi, keeping existing blog-posts.json');
  }

  console.log('\n🎉 Blog data sync completed!\n');
}

main().catch(console.error);
