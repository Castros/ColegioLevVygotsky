# Environment Variables Configuration

## AWS Lambda Environment Variables

Set these in AWS Lambda Console → Configuration → Environment variables:

### 1. GITHUB_TOKEN
```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
- **Where to get it:** https://github.com/settings/tokens
- **Scope needed:** `repo` (Full control of private repositories)
- **Expires:** Set expiration (90 days recommended)

### 2. GITHUB_REPO
```
YOUR_USERNAME/vigotskyreynosa
```
- **Format:** `username/repository-name`
- **Example:** `Castros/vigotskyreynosa`
- **Find your username:** Check your GitHub profile URL

### 3. WEBHOOK_SECRET
```
my-super-secret-webhook-key-2024
```
- **Generate random:** `openssl rand -hex 32`
- **Or make up:** Any long random string
- **Used in Strapi URL:** `?secret=YOUR-SECRET-HERE`

---

## GitHub Secrets

Set these in GitHub Repo → Settings → Secrets and variables → Actions:

### NEXT_PUBLIC_STRAPI_URL
```
https://cms.vigotskyreynosa.edu.mx
```
- **What it is:** Your Strapi CMS base URL
- **Used during build:** Next.js fetches content from this URL

### AWS_ACCESS_KEY_ID
```
AKIAIOSFODNN7EXAMPLE
```
- **Where to get:** AWS Console → IAM → Users → Security credentials
- **Needed for:** S3 upload

### AWS_SECRET_ACCESS_KEY
```
wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```
- **Where to get:** Same as above (only shown once when created)
- **Needed for:** S3 upload

### S3_BUCKET_NAME
```
your-bucket-name
```
- **Where to find:** AWS Console → S3 → Buckets
- **Example:** `vigotskyreynosa-static-site`

### CLOUDFRONT_DISTRIBUTION_ID
```
E1234ABCDEFGHI
```
- **Where to find:** AWS Console → CloudFront → Distributions
- **Format:** Starts with 'E' followed by alphanumeric

---

## Strapi Webhook URL Template

Use this format in Strapi Settings → Webhooks:

```
https://YOUR-LAMBDA-FUNCTION-URL.lambda-url.REGION.on.aws/?secret=YOUR-WEBHOOK-SECRET
```

**Example:**
```
https://abcdefg1234567.lambda-url.us-east-1.on.aws/?secret=my-super-secret-webhook-key-2024
```

**Important:**
- Get `YOUR-LAMBDA-FUNCTION-URL` from AWS Lambda → Function URL
- Use the same `YOUR-WEBHOOK-SECRET` from Lambda environment variable

---

## Quick Checklist

Before going live, verify:

- [ ] GitHub token generated with `repo` scope
- [ ] GitHub repo format is `username/repo` (not full URL)
- [ ] Webhook secret matches in both Lambda and Strapi URL
- [ ] Lambda Function URL is public (Auth type: NONE)
- [ ] All GitHub secrets are set (5 total)
- [ ] Strapi CMS URL is correct (https://cms.vigotskyreynosa.edu.mx)
- [ ] Test webhook trigger shows 200 OK
- [ ] GitHub Actions run triggered successfully
