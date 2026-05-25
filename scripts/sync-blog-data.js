/**
 * Sync blog categories and posts from Strapi to local JSON files
 * Run this before build to ensure static site has latest blog content
 */

const fs = require('fs');
const path = require('path');

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://cms.vigotskyreynosa.edu.mx';

// Default fallback categories
const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Académicos', slug: 'academicos', order: 1 },
  { id: 2, name: 'Vida Estudiantil', slug: 'vida-estudiantil', order: 2 },
  { id: 3, name: 'Eventos Escolares', slug: 'eventos-escolares', order: 3 },
  { id: 4, name: 'Noticias de Exalumnos', slug: 'noticias-exalumnos', order: 4 },
  { id: 5, name: 'Destacados de Maestros', slug: 'destacados-maestros', order: 5 },
];

async function fetchCategories() {
  try {
    console.log('📂 Fetching blog categories from Strapi...');
    const response = await fetch(`${STRAPI_URL}/api/categories?sort=order:asc`);

    if (!response.ok) {
      console.warn(`⚠️  Strapi returned ${response.status}, using default categories`);
      return null;
    }

    const json = await response.json();
    // Strapi v5 wraps collections in { data: [...] }
    const categories = json?.data ?? [];
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
    const response = await fetch(`${STRAPI_URL}/api/blog-posts?sort=published_date:desc&populate=*`);

    if (!response.ok) {
      console.warn(`⚠️  Strapi returned ${response.status}, keeping existing blog posts`);
      return null;
    }

    const json = await response.json();
    // Strapi v5 wraps collections in { data: [...] }
    const posts = json?.data ?? [];
    console.log(`✅ Fetched ${posts.length} blog posts`);
    return posts;
  } catch (error) {
    console.warn('⚠️  Failed to fetch blog posts from Strapi:', error.message);
    return null;
  }
}

function transformBlogPost(post) {
  // Strapi v5: fields are flat (no attributes wrapper), category is inline object
  let categoryValue = post.category;

  if (typeof post.category === 'object' && post.category !== null) {
    categoryValue = post.category;
  } else if (typeof post.category === 'number') {
    categoryValue = post.category.toString();
  }

  return {
    ...post,
    category: categoryValue,
  };
}

async function main() {
  console.log('🚀 Starting blog data sync...\n');

  const categoriesData = await fetchCategories();
  const blogPostsData = await fetchBlogPosts();

  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const categoriesPath = path.join(dataDir, 'categories.json');
  const categoriesToWrite = categoriesData || DEFAULT_CATEGORIES;
  fs.writeFileSync(categoriesPath, JSON.stringify(categoriesToWrite, null, 2), 'utf-8');
  console.log(`\n✅ Categories written to: ${categoriesPath}`);
  console.log(`   ${categoriesToWrite.length} categories saved`);

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
