# Fully Static Build Setup
## Zero Runtime Dependencies on Strapi

This project is configured to build a **completely static website** hosted on S3/CloudFront with **zero runtime dependencies** on Strapi. This maximizes reliability and minimizes hosting costs.

---

## How It Works

### 🔄 Complete Workflow

1. **Content editor updates Strapi** (text, images, etc.)
2. **Strapi webhook fires** → triggers GitHub Actions
3. **GitHub Actions build process:**
   - ✅ Fetches all content from Strapi API
   - ✅ Downloads all images from Strapi to local build
   - ✅ Builds Next.js static site with everything included
   - ✅ Deploys complete package to S3
4. **CloudFront cache invalidated**
5. **Website updated** (~5 minutes total)

### 🎯 Key Features

- ✅ **Fully Static**: Everything (HTML, CSS, JS, images) on S3/CloudFront
- ✅ **Zero Dependencies**: Site runs independently from Strapi after deployment
- ✅ **Cost Effective**: Only pay for S3 + CloudFront (minimal costs)
- ✅ **Maximum Reliability**: Site works even if Strapi goes down
- ✅ **Fast Performance**: Everything served from CloudFront CDN
- ✅ **Atomic Deployments**: Build fails = previous version stays live
- ✅ **Fallback Data**: If Strapi is down during build, uses hardcoded fallback

---

## Build Process Details

### Step 1: Pre-Build Script (`prebuild`)

**File**: `scripts/download-strapi-images.js`

Before building, this script:
1. Connects to Strapi API
2. Fetches all content from all endpoints
3. Extracts all image objects (including format variations)
4. Downloads images to `public/strapi-images/`
5. If Strapi fails, warns but continues (fallback data will be used)

**Triggered automatically** when you run `npm run build`

### Step 2: Next.js Build

**Cache Strategy**: `no-store` (always fetch fresh data during build)

- Fetches content from Strapi
- Uses `getStrapiMedia()` helper to rewrite image URLs
- In production: Strapi URLs → `/strapi-images/filename.jpg`
- In development: Strapi URLs → `https://cms.vigotskyreynosa.edu.mx/uploads/...`
- Generates static HTML files in `out/` directory

### Step 3: Deploy to S3

- Syncs `out/` directory to S3 bucket
- Includes all HTML, CSS, JS, and images
- Uses `--delete` flag to remove old files
- Invalidates CloudFront cache

---

## Development vs Production

### 🔧 Development Mode (`npm run dev`)

**Images**: Fetched directly from Strapi
```typescript
// Development
/uploads/image.jpg → https://cms.vigotskyreynosa.edu.mx/uploads/image.jpg
```

**Benefits**:
- See image changes immediately
- No need to rebuild to see updates
- Direct debugging of Strapi API

### 🚀 Production Build (`npm run build`)

**Images**: Downloaded and included in build
```typescript
// Production
/uploads/image.jpg → /strapi-images/image.jpg
```

**Benefits**:
- Everything on S3/CloudFront
- No runtime dependency on Strapi
- Maximum performance and reliability

---

## File Structure

```
project/
├── scripts/
│   └── download-strapi-images.js    # Pre-build image downloader
├── public/
│   ├── images/                       # Fallback images (committed to git)
│   └── strapi-images/                # Downloaded Strapi images (build-time only)
├── lib/
│   └── strapi.ts                     # API helpers + image URL rewriter
└── .github/
    └── workflows/
        └── deploy.yml                # GitHub Actions deployment
```

---

## Environment Variables

### Required in GitHub Actions Secrets:

```bash
# Strapi CMS URL
NEXT_PUBLIC_STRAPI_URL=https://cms.vigotskyreynosa.edu.mx

# AWS Credentials
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
S3_BUCKET_NAME=your-bucket-name
CLOUDFRONT_DISTRIBUTION_ID=your_distribution_id
```

---

## Testing Locally

### Test Production Build Locally:

```bash
# Download images and build
npm run build

# Check that images were downloaded
ls -la public/strapi-images/

# Serve the static site
npx serve out/

# Open http://localhost:3000
```

### Test Image Download Script Only:

```bash
node scripts/download-strapi-images.js
```

---

## Troubleshooting

### ❌ Build fails: "Cannot reach Strapi"

**Cause**: Strapi is down or unreachable during build

**Solution**:
- Build will use fallback data (hardcoded content + local images)
- Site still deploys successfully
- Check Strapi server status
- Rebuild when Strapi is back online

### ❌ Images not showing after deployment

**Cause**: Images failed to download during build

**Check**:
1. GitHub Actions logs: Look for "Downloading images..." section
2. Verify images exist in S3: `aws s3 ls s3://your-bucket/strapi-images/`
3. Check CloudFront is serving images: `curl https://your-domain.com/strapi-images/image.jpg`

**Solution**:
- Trigger manual rebuild: GitHub → Actions → Run workflow
- Check Strapi uploads are publicly accessible
- Verify `NEXT_PUBLIC_STRAPI_URL` is correct

### ❌ Old images still showing

**Cause**: CloudFront cache not cleared

**Solution**:
- Wait 5-10 minutes for invalidation to complete
- Check invalidation status in AWS Console → CloudFront → Invalidations
- Hard refresh browser: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)

### ❌ Build succeeds but site doesn't update

**Cause**: S3 sync failed or CloudFront invalidation failed

**Check**:
1. GitHub Actions logs: Look for S3 sync and CloudFront invalidation steps
2. Verify AWS credentials are valid
3. Check S3 bucket exists and is accessible

---

## Cost Optimization

### Current Setup (S3 + CloudFront):

**Monthly costs** (estimated for typical traffic):
- S3 Storage: ~$0.50 - $2 (depending on image sizes)
- S3 Requests: ~$0.10 - $0.50
- CloudFront: ~$1 - $5 (first 1TB free)
- **Total: ~$2 - $8/month**

### What You're NOT Paying For:

- ❌ No Vercel/Netlify hosting fees
- ❌ No serverless function costs
- ❌ No runtime API calls
- ❌ No database hosting (Strapi is just for content management)

---

## Updating Content Workflow

### For Content Editors:

1. **Login to Strapi**: https://cms.vigotskyreynosa.edu.mx/admin
2. **Edit content** (text, images, etc.)
3. **Click "Publish"**
4. **Wait ~5 minutes** for automatic deployment
5. **Refresh website** to see changes

### Behind the Scenes:

```
Strapi Publish
    ↓
Webhook Trigger
    ↓
GitHub Actions Start
    ↓
Download Images + Fetch Content
    ↓
Build Static Site
    ↓
Deploy to S3
    ↓
Clear CloudFront Cache
    ↓
✅ Live Website Updated!
```

---

## Comparison with Other Approaches

### ❌ Server-Side Rendering (SSR)
- **Cost**: High (serverless functions, always-on server)
- **Complexity**: High
- **Reliability**: Depends on Strapi runtime
- **Speed**: Slower (API calls on every request)

### ❌ Images from Strapi at Runtime
- **Cost**: Medium
- **Complexity**: Medium
- **Reliability**: Depends on Strapi being up
- **Speed**: Slower (images from CMS server)

### ✅ Fully Static (Current Setup)
- **Cost**: Minimal (S3 + CloudFront only)
- **Complexity**: Low (just build-time fetch)
- **Reliability**: Maximum (zero runtime dependencies)
- **Speed**: Maximum (everything from CDN)

---

## Maintenance

### Regular Tasks:

1. **Monitor GitHub Actions**: Check for failed builds
2. **Review Strapi Uptime**: Ensure it's available during builds
3. **Check S3 Storage**: Monitor storage costs
4. **CloudFront Metrics**: Review traffic and costs

### Updates:

**Updating Strapi URL**:
```bash
# GitHub → Settings → Secrets → Update NEXT_PUBLIC_STRAPI_URL
# Then trigger a rebuild
```

**Updating AWS Credentials**:
```bash
# GitHub → Settings → Secrets → Update AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
```

---

## Security Best Practices

✅ **DO:**
- Keep AWS credentials in GitHub Secrets (never commit)
- Use IAM role with minimal permissions (S3 + CloudFront only)
- Set S3 bucket to private (CloudFront serves publicly)
- Use HTTPS for Strapi (certificate required)

❌ **DON'T:**
- Commit `.env` files
- Give AWS credentials admin access
- Make S3 bucket publicly writable
- Skip CloudFront (direct S3 URLs are slower)

---

## Support

### Useful Links:

- **GitHub Actions Logs**: https://github.com/Castros/ColegioLevVygotsky/actions
- **Website**: https://vigotskyreynosa.edu.mx
- **Strapi CMS**: https://cms.vigotskyreynosa.edu.mx/admin

### Debug Commands:

```bash
# Test Strapi API
curl https://cms.vigotskyreynosa.edu.mx/services

# Test image download
node scripts/download-strapi-images.js

# Test production build
npm run build && npx serve out/

# Check S3 contents
aws s3 ls s3://your-bucket-name --recursive | grep strapi-images
```

---

**Last Updated**: 2026-02-05
