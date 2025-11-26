# Strapi Blog Content Type Setup

## Step 1: Create Blog Post Content Type in Strapi

1. Log into Strapi: https://cms.vigotskyreynosa.edu.mx/admin
2. Go to **Content-Types Builder** (in left sidebar)
3. Click **"Create new collection type"**
4. Name: `blog-post` (singular: blog-post, plural: blog-posts)

## Step 2: Add Fields to Blog Post

Add these fields one by one:

### Field 1: Title
- Type: **Text**
- Name: `title`
- Settings: Required ✅

### Field 2: Slug
- Type: **UID**
- Name: `slug`
- Attached field: `title`
- Settings: Required ✅

### Field 3: Excerpt
- Type: **Text**
- Name: `excerpt`
- Settings: Required ✅

### Field 4: Content
- Type: **Rich Text**
- Name: `content`
- Settings: Required ✅

### Field 5: Featured Image
- Type: **Media** (Single image)
- Name: `featured_image`
- Settings: Required ✅

### Field 6: Category
- Type: **Enumeration**
- Name: `category`
- Values (add these options):
  - `Academics`
  - `Student Life`
  - `School Events`
  - `Alumni News`
  - `Teacher Spotlights`
- Settings: Required ✅

### Field 7: Published Date
- Type: **Date**
- Name: `published_date`
- Type: Date only
- Settings: Required ✅

### Field 8: Author
- Type: **Text**
- Name: `author`
- Default value: `Colegio Lev Vygotsky`

## Step 3: Save and Publish

1. Click **"Save"** in top right
2. Wait for Strapi to restart
3. Go to **Content Manager** → **Blog Post**
4. Click **"Add New Blog Post"**
5. Create a few sample blog posts

## Step 4: Set Permissions (IMPORTANT!)

1. Go to **Settings** → **Roles & Permissions** → **Public**
2. Under **Blog-post**, check:
   - ✅ `find` (get all blog posts)
   - ✅ `findone` (get single blog post)
3. Click **"Save"**

## Sample Blog Post Data

Here's a sample post to create:

**Title:** `Annual Science Fair Highlights`
**Excerpt:** `See the innovative projects from our talented students.`
**Content:** `Our annual science fair showcased incredible creativity and scientific thinking from students across all grade levels...`
**Category:** `School Events`
**Published Date:** `2024-11-18`
**Featured Image:** Upload an image

Create 5-6 sample posts to test the blog page!
