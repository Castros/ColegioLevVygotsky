# Strapi Content Population Script

This script automatically populates your Strapi CMS with initial content from the fallback data in your codebase.

## Prerequisites

**IMPORTANT:** You MUST create all content types in Strapi admin first!

Follow `../STRAPI-CONTENT-TYPES-SETUP.md` to create:
- ✅ Services (Collection Type)
- ✅ Testimonials (Collection Type)
- ✅ Value Propositions (Collection Type)
- ✅ About Section (Single Type)
- ✅ CTA Section (Single Type)
- ✅ Services Page (Single Type)
- ✅ About Page (Single Type)

## Usage

### Step 1: Create Content Types in Strapi

1. Login to Strapi: https://cms.vigotskyreynosa.edu.mx/admin
2. Follow `STRAPI-CONTENT-TYPES-SETUP.md` to create all content types
3. Make sure to **Save** each content type after creating it

### Step 2: Run the Population Script

```bash
# From the project root
node scripts/populate-strapi.js
```

### Step 3: Upload Images & Publish

1. Go back to Strapi admin
2. For each content item:
   - Upload appropriate images
   - Link images to the content
   - Click **"Publish"** (if using draft/publish workflow)

## What Gets Populated

✅ **Services** (4 items)
- Plan de Estudios Integral
- Actividades Extracurriculares
- Estancia
- Métodos de Enseñanza Progresivos

✅ **Testimonials** (3 items)
- María González
- Carlos Martínez
- Ana López

✅ **Value Propositions** (3 items)
- Enfoque Educativo Holístico
- Personal Dedicado y Experimentado
- Actividades Extracurriculares Dinámicas

✅ **About Section** (Single Type)
- Badge, title, and description

✅ **CTA Section** (Single Type)
- Badge, title, description, buttons, and colors

✅ **Services Page** (Single Type)
- Hero badge and title

✅ **About Page** (Single Type)
- All text content for the about page sections

## After Population

Once the script completes:

1. **Verify in Strapi:**
   - Check that all content appears in Content Manager
   - Upload missing images
   - Review and edit text as needed

2. **Publish Content:**
   - Click "Publish" on each item (if using draft/publish)
   - This will trigger the webhook → Lambda → GitHub Actions

3. **Wait for Deployment:**
   - ~5-10 minutes for the website to rebuild and update
   - Check: https://vigotskyreynosa.edu.mx

## Troubleshooting

### Error: "Content type not found"
**Problem:** Content type doesn't exist in Strapi yet
**Solution:** Create it in Strapi admin following `STRAPI-CONTENT-TYPES-SETUP.md`

### Error: "Unauthorized" or 403
**Problem:** API permissions not configured
**Solution:**
1. Go to Strapi → Settings → Roles → Public
2. Enable permissions for each content type (find, create, update)
3. Save

### Script runs but no data appears
**Problem:** Data wasn't published
**Solution:** Go to each content item in Strapi and click "Publish"

## Manual Setup Alternative

If you prefer to enter data manually instead of using this script:
1. Skip this script entirely
2. Create content types in Strapi admin
3. Manually add content through the Strapi UI
4. Use the fallback data in components as reference

## Notes

- Images are NOT uploaded by this script (Strapi API requires file uploads)
- You must manually upload images in Strapi admin
- The script uses the same fallback data that's in your code
- Running this script multiple times may create duplicate entries
