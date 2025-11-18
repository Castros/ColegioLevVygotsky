# Strapi CMS Setup Guide

This guide will help you set up content types in your Strapi CMS at `https://cms.vigotskyreynosa.edu.mx/admin`

## Step 1: Create Homepage Content Type (Single Type)

1. Log into Strapi admin: `https://cms.vigotskyreynosa.edu.mx/admin`
2. Go to **Content-Type Builder** (in left sidebar)
3. Click **Create new single type**
4. Name: `homepage`
5. Click **Continue**

### Add these fields to Homepage:

**Hero Section:**
- Field: **Text** → Name: `hero_title` → Short text
- Field: **Text** → Name: `hero_subtitle` → Short text
- Field: **Text** → Name: `hero_description` → Long text
- Field: **Media** → Name: `hero_background_image` → Single media (images only)
- Field: **Media** → Name: `hero_feature_image` → Single media (images only)

**Stats:**
- Field: **Number** → Name: `years_experience` → integer
- Field: **Number** → Name: `families_count` → integer

6. Click **Save**
7. Strapi will restart

## Step 2: Set Permissions for Public Access

1. Go to **Settings** → **Roles & Permissions** → **Public**
2. Scroll to **Homepage**
3. Check the box for `find`
4. Click **Save**

## Step 3: Add Content to Homepage

1. Go to **Content Manager** → **Homepage** (in left sidebar)
2. Fill in the fields:
   - **hero_title**: "Un Camino de Aprendizaje y Éxito Comienza Aquí"
   - **hero_subtitle**: "INSPIRANDO MENTES JÓVENES"
   - **hero_description**: "Empoderando a los estudiantes con una educación integral para el éxito duradero y el crecimiento personal en un ambiente de cuidado y apoyo."
   - **years_experience**: 10
   - **families_count**: 300
3. Upload images:
   - **hero_background_image**: Upload your background image
   - **hero_feature_image**: Upload the student learning image
4. Click **Save**
5. Click **Publish**

## Step 4: Test the API

Open this URL in your browser:
```
https://cms.vigotskyreynosa.edu.mx/homepage
```

You should see JSON data with all your content!

---

## Optional: Create Gallery Content Type (Collection Type)

1. Go to **Content-Type Builder**
2. Click **Create new collection type**
3. Name: `gallery`
4. Click **Continue**

### Add these fields:

- Field: **Text** → Name: `title` → Short text
- Field: **Text** → Name: `category` → Short text
- Field: **Media** → Name: `images` → Multiple media (images only)

5. Click **Save**
6. Set permissions (Settings → Roles → Public → Gallery → check `find` and `findone`)
7. Add gallery content via Content Manager

---

## Optional: Create Testimonials Content Type

1. Go to **Content-Type Builder**
2. Click **Create new collection type**
3. Name: `testimonial`

### Add these fields:

- Field: **Text** → Name: `name` → Short text
- Field: **Text** → Name: `role` → Short text (e.g., "Madre de familia")
- Field: **Rich Text** → Name: `message`
- Field: **Media** → Name: `photo` → Single media (optional)

4. Click **Save**
5. Set permissions for public access
6. Add testimonials via Content Manager

---

## Troubleshooting

**Problem: API returns 403 Forbidden**
- Solution: Go to Settings → Roles & Permissions → Public → Enable `find` and `findone` for your content types

**Problem: Images not showing**
- Solution: Check that media is uploaded and published
- Image URLs will be at: `https://cms.vigotskyreynosa.edu.mx/uploads/[filename]`

**Problem: Content not updating**
- Solution: Make sure you clicked **Publish** after saving (not just Save)

---

## Next Steps

After setting up your content types in Strapi, your Next.js site will automatically fetch the latest content when you rebuild it!
