# AWS S3 + CloudFront Setup Guide

This guide will walk you through setting up S3 bucket and CloudFront distribution for your static Next.js site.

## Prerequisites
- AWS Account
- Domain: vigotskyreynosa.edu.mx (already in Route53)
- AWS CLI installed (optional, for testing)

---

## Part 1: Create S3 Bucket

### Step 1: Create the S3 Bucket

1. Go to **AWS Console** → **S3**
2. Click **Create bucket**

**Bucket settings:**
- **Bucket name**: `vigotskyreynosa-website` (must be globally unique)
- **Region**: `us-east-1` (or your preferred region)
- **Object Ownership**: ACLs disabled (recommended)
- **Block Public Access settings**:
  - ✅ Block all public access (we'll use CloudFront)
- **Bucket Versioning**: Disabled (optional, can enable for rollback capability)
- **Default encryption**: Enable (Server-side encryption with Amazon S3 managed keys)

3. Click **Create bucket**

### Step 2: Configure Bucket for Static Website (Optional)

Since we're using CloudFront, this is optional but can be useful for testing.

1. Go to your bucket → **Properties** tab
2. Scroll to **Static website hosting**
3. Click **Edit**
4. Select **Enable**
5. **Index document**: `index.html`
6. **Error document**: `404.html`
7. Click **Save changes**

---

## Part 2: Create CloudFront Distribution

### Step 1: Create Distribution

1. Go to **AWS Console** → **CloudFront**
2. Click **Create distribution**

### Origin Settings:

- **Origin domain**: Select your S3 bucket from dropdown
  - Example: `vigotskyreynosa-website.s3.us-east-1.amazonaws.com`
- **Origin path**: Leave empty
- **Name**: Auto-filled (keep it)
- **Origin access**: **Origin access control settings (recommended)**
  - Click **Create control setting**
  - Name: `vigotskyreynosa-oac`
  - Click **Create**
- **Enable Origin Shield**: No

### Default Cache Behavior Settings:

- **Viewer protocol policy**: Redirect HTTP to HTTPS
- **Allowed HTTP methods**: GET, HEAD
- **Cache policy**: CachingOptimized (Recommended for S3)
- **Origin request policy**: None
- **Response headers policy**: None

### Settings:

- **Price class**: Use all edge locations (best performance)
  - Or choose "Use only North America and Europe" to save costs
- **Alternate domain name (CNAME)**:
  - Add: `vigotskyreynosa.edu.mx`
  - Add: `www.vigotskyreynosa.edu.mx`
- **Custom SSL certificate**:
  - Click **Request certificate** (this will open ACM in new tab)
  - See Step 2 below for SSL setup
- **Default root object**: `index.html`
- **Standard logging**: Off (or enable for analytics)

3. Click **Create distribution**

**Important**: Copy the distribution ID - you'll need it for GitHub Actions!

Example: `E1234ABCDEFGH`

### Step 2: Request SSL Certificate (ACM)

**IMPORTANT**: SSL certificates for CloudFront MUST be created in **us-east-1** region!

1. Go to **AWS Console** → **Certificate Manager**
2. **Change region to us-east-1** (top right)
3. Click **Request certificate**
4. Select **Request a public certificate**
5. Click **Next**

**Domain names:**
- Add: `vigotskyreynosa.edu.mx`
- Click **Add another name**
- Add: `*.vigotskyreynosa.edu.mx`

**Validation method**: DNS validation

6. Click **Request**

### Step 3: Validate SSL Certificate

1. Click on your certificate
2. Click **Create records in Route 53** (since your domain is already in Route53)
3. Check both domains
4. Click **Create records**
5. Wait 5-10 minutes for validation (status will change to "Issued")

### Step 4: Attach SSL to CloudFront

1. Go back to **CloudFront** → Your distribution
2. Click **Edit**
3. **Custom SSL certificate**: Select your newly issued certificate
4. Click **Save changes**

### Step 5: Update S3 Bucket Policy

CloudFront needs permission to access your S3 bucket.

1. Go to **CloudFront** → Your distribution
2. Click on the **Origins** tab
3. You should see a banner: "The S3 bucket policy needs to be updated"
4. Click **Copy policy**
5. Go to **S3** → Your bucket → **Permissions** tab
6. Scroll to **Bucket policy**
7. Click **Edit**
8. Paste the policy
9. Click **Save changes**

Example policy (you'll get this from CloudFront):
```json
{
    "Version": "2008-10-17",
    "Id": "PolicyForCloudFrontPrivateContent",
    "Statement": [
        {
            "Sid": "AllowCloudFrontServicePrincipal",
            "Effect": "Allow",
            "Principal": {
                "Service": "cloudfront.amazonaws.com"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::vigotskyreynosa-website/*",
            "Condition": {
                "StringEquals": {
                    "AWS:SourceArn": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
                }
            }
        }
    ]
}
```

---

## Part 3: Configure Route53 DNS

### Step 1: Create A Record for Root Domain

1. Go to **Route53** → **Hosted zones**
2. Click on `vigotskyreynosa.edu.mx`
3. Click **Create record**

**Record 1 (Root domain):**
- **Record name**: Leave empty (root domain)
- **Record type**: A
- **Alias**: Yes (toggle on)
- **Route traffic to**:
  - Alias to CloudFront distribution
  - Select your CloudFront distribution
- **Routing policy**: Simple routing
- Click **Create records**

### Step 2: Create A Record for www Subdomain

1. Click **Create record** again

**Record 2 (www subdomain):**
- **Record name**: `www`
- **Record type**: A
- **Alias**: Yes
- **Route traffic to**:
  - Alias to CloudFront distribution
  - Select your CloudFront distribution
- Click **Create records**

---

## Part 4: Create IAM User for GitHub Actions

### Step 1: Create IAM User

1. Go to **IAM** → **Users**
2. Click **Create user**
3. **User name**: `github-actions-deploy`
4. Click **Next**
5. **Permissions**: Attach policies directly
6. Search and select:
   - `AmazonS3FullAccess` (or create custom policy with limited access)
   - `CloudFrontFullAccess` (or create custom policy)
7. Click **Next**
8. Click **Create user**

### Step 2: Create Access Keys

1. Click on the user you just created
2. Go to **Security credentials** tab
3. Scroll to **Access keys**
4. Click **Create access key**
5. Select **Application running outside AWS**
6. Click **Next**
7. Add description: `GitHub Actions deployment`
8. Click **Create access key**
9. **IMPORTANT**: Copy both:
   - Access key ID (example: `AKIAIOSFODNN7EXAMPLE`)
   - Secret access key (example: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`)
   - You won't see the secret again!

### Step 3: (Optional) Create Custom IAM Policy

For better security, create a custom policy instead of full access:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::vigotskyreynosa-website",
                "arn:aws:s3:::vigotskyreynosa-website/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "cloudfront:CreateInvalidation",
                "cloudfront:GetInvalidation"
            ],
            "Resource": "arn:aws:cloudfront::YOUR_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
        }
    ]
}
```

---

## Part 5: Configure GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each:

**Secrets to add:**

1. **NEXT_PUBLIC_STRAPI_URL**
   - Value: `https://cms.vigotskyreynosa.edu.mx`

2. **AWS_ACCESS_KEY_ID**
   - Value: Your IAM access key ID from Part 4

3. **AWS_SECRET_ACCESS_KEY**
   - Value: Your IAM secret access key from Part 4

4. **S3_BUCKET_NAME**
   - Value: `vigotskyreynosa-website` (your bucket name)

5. **CLOUDFRONT_DISTRIBUTION_ID**
   - Value: Your CloudFront distribution ID (e.g., `E1234ABCDEFGH`)

6. **AWS_REGION** (if different from us-east-1)
   - Value: `us-east-1` (or your bucket region)

---

## Part 6: Update GitHub Actions Workflow

Make sure your `.github/workflows/deploy.yml` has the correct region:

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: us-east-1  # Change if your bucket is in different region
```

---

## Part 7: Test the Setup

### Step 1: Manual Deploy Test

1. Commit and push your code to GitHub
2. Go to GitHub → **Actions** tab
3. You should see the workflow running
4. Wait for it to complete (~5 minutes)

### Step 2: Verify CloudFront

1. Open CloudFront distribution domain (example: `d111111abcdef8.cloudfront.net`)
2. You should see your website
3. Open your custom domain: `https://vigotskyreynosa.edu.mx`
4. You should see your website with valid SSL

### Step 3: Check for Common Issues

**Website shows 403 Forbidden:**
- Check S3 bucket policy is correct
- Verify CloudFront has OAC configured

**Website shows old content:**
- Check CloudFront invalidation ran successfully
- Wait 5-10 minutes for cache to clear
- Try hard refresh: Ctrl+F5 or Cmd+Shift+R

**SSL certificate error:**
- Make sure certificate is in us-east-1 region
- Verify DNS validation completed
- Wait a few minutes for CloudFront to pick up the certificate

**404 errors on refresh:**
- Add error pages configuration in CloudFront

---

## Part 8: Configure CloudFront Error Pages (Next.js SPA)

For proper Next.js routing:

1. Go to CloudFront → Your distribution → **Error pages** tab
2. Click **Create custom error response**

**Error 403:**
- HTTP error code: 403
- Customize error response: Yes
- Response page path: `/404.html`
- HTTP response code: 404

**Error 404:**
- HTTP error code: 404
- Customize error response: Yes
- Response page path: `/404.html`
- HTTP response code: 404

---

## Summary Checklist

✅ S3 bucket created
✅ CloudFront distribution created
✅ SSL certificate issued and validated
✅ S3 bucket policy updated
✅ Route53 DNS records created
✅ IAM user created with access keys
✅ GitHub secrets configured
✅ GitHub Actions workflow updated
✅ Test deployment successful
✅ Custom domain working with HTTPS

---

## Useful AWS CLI Commands

Test S3 sync locally:
```bash
npm run build
aws s3 sync out/ s3://vigotskyreynosa-website --delete --dryrun
```

Create CloudFront invalidation manually:
```bash
aws cloudfront create-invalidation \
  --distribution-id E1234ABCDEFGH \
  --paths "/*"
```

---

## Cost Estimate

**S3 Storage:**
- ~100MB site = $0.023/month

**CloudFront:**
- First 1TB/month = Free (first 12 months)
- After: $0.085/GB

**Route53:**
- Hosted zone: $0.50/month
- Queries: $0.40 per million

**Total monthly cost:** ~$1-5/month for a typical school website

---

## Support

If you run into issues, check:
- CloudFront distribution status is "Deployed"
- SSL certificate status is "Issued"
- S3 bucket policy allows CloudFront access
- GitHub Actions logs for specific errors
