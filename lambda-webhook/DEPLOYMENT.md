# AWS Lambda Deployment Guide - Strapi Webhook Relay

This Lambda function translates Strapi webhooks to GitHub Actions triggers.

## Prerequisites

Before deploying, you'll need:

1. **AWS Account** - Sign up at https://aws.amazon.com (free tier is sufficient)
2. **GitHub Personal Access Token** - For triggering GitHub Actions
3. **Your GitHub repository name** - e.g., `username/vigotskyreynosa`

---

## Part 1: Create GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Settings:
   - **Note:** `Lambda Webhook to GitHub Actions`
   - **Expiration:** 90 days (or "No expiration" if you prefer)
   - **Scopes:** Check ✅ **`repo`** (Full control of private repositories)
4. Click **"Generate token"**
5. **COPY THE TOKEN** - it starts with `ghp_...`
6. Save it somewhere safe - you'll need it in Part 3

---

## Part 2: Deploy Lambda Function to AWS

### Step 1: Log into AWS Console

1. Go to: https://console.aws.amazon.com
2. Sign in (or create free account)
3. In the top-right, select region: **US East (N. Virginia)** or your preferred region

### Step 2: Create Lambda Function

1. In AWS Console, search for **"Lambda"** in the search bar
2. Click **"Create function"**
3. Configure:
   - ✅ **Author from scratch**
   - **Function name:** `strapi-webhook-relay`
   - **Runtime:** `Node.js 20.x` (or latest available)
   - **Architecture:** `x86_64`
   - Click **"Create function"**

### Step 3: Upload Function Code

**Option A: Using the Web Editor (Simplest)**

1. In the Lambda function page, scroll to **"Code source"**
2. Delete the existing code in `index.mjs` or `index.js`
3. Copy the entire contents of `lambda-webhook/index.js` from this repo
4. Paste it into the AWS editor
5. Click **"Deploy"** button (orange button at top)

**Option B: Upload ZIP file**

1. On your computer, navigate to the `lambda-webhook` folder
2. Select `index.js` and `package.json`
3. Create a ZIP file containing both files (name it `function.zip`)
4. In AWS Lambda console, click **"Upload from"** → **".zip file"**
5. Upload your `function.zip`
6. Click **"Save"**

### Step 4: Create Function URL (Public Endpoint)

1. In your Lambda function page, go to **"Configuration"** tab
2. Click **"Function URL"** in the left sidebar
3. Click **"Create function URL"**
4. Settings:
   - **Auth type:** `NONE` (we'll use query parameter secret instead)
   - **CORS:** Leave defaults
5. Click **"Save"**
6. **COPY THE FUNCTION URL** - it looks like:
   ```
   https://abcdefghij.lambda-url.us-east-1.on.aws/
   ```
7. Save this URL - you'll need it for Strapi configuration

---

## Part 3: Configure Environment Variables

1. Still in your Lambda function, go to **"Configuration"** tab
2. Click **"Environment variables"** in left sidebar
3. Click **"Edit"**
4. Click **"Add environment variable"** for each of these:

### Variable 1: GITHUB_TOKEN
- **Key:** `GITHUB_TOKEN`
- **Value:** `ghp_...` (your token from Part 1)

### Variable 2: GITHUB_REPO
- **Key:** `GITHUB_REPO`
- **Value:** `YOUR_USERNAME/vigotskyreynosa`
  - Replace `YOUR_USERNAME` with your actual GitHub username
  - Example: `Castros/vigotskyreynosa`

### Variable 3: WEBHOOK_SECRET
- **Key:** `WEBHOOK_SECRET`
- **Value:** Generate a random secret (or use any password)
  - You can use: `openssl rand -hex 32` in terminal
  - Or just make up a long random string like: `my-super-secret-webhook-key-2024`
  - **SAVE THIS SECRET** - you'll add it to Strapi webhook URL

4. Click **"Save"**

---

## Part 4: Test the Lambda Function

1. In Lambda console, go to **"Test"** tab
2. Click **"Create new event"**
3. **Event name:** `test-strapi-webhook`
4. Replace the test event JSON with:

```json
{
  "queryStringParameters": {
    "secret": "my-super-secret-webhook-key-2024"
  },
  "body": "{\"event\":\"entry.update\",\"model\":\"homepage\",\"created_at\":\"2025-11-18T21:29:31.139Z\"}"
}
```

**Important:** Replace `my-super-secret-webhook-key-2024` with your actual WEBHOOK_SECRET from Part 3!

5. Click **"Save"**
6. Click **"Test"** button
7. Check the result:
   - ✅ **Success:** Should see `"success": true` in response
   - ✅ **Check GitHub:** Go to your repo → Actions tab → should see new workflow run!
   - ❌ **Error 401:** Wrong GITHUB_TOKEN or GITHUB_REPO
   - ❌ **Error 500:** Check environment variables are set correctly

---

## Part 5: Configure Strapi Webhook

Now that Lambda is working, point Strapi to it:

1. Log into Strapi: https://cms.vigotskyreynosa.edu.mx/admin
2. Go to **Settings** → **Webhooks**
3. Find your existing webhook (or create new one)
4. Configure:

**Name:**
```
GitHub Auto Deploy (via Lambda)
```

**URL:** (Use your Lambda Function URL + secret parameter)
```
https://YOUR-LAMBDA-URL.lambda-url.us-east-1.on.aws/?secret=YOUR-WEBHOOK-SECRET
```

Example:
```
https://abcdefghij.lambda-url.us-east-1.on.aws/?secret=my-super-secret-webhook-key-2024
```

**Headers:**
- Remove all headers (Lambda doesn't need them)
- Or keep Content-Type: `application/json`

**Events:** Select which events trigger rebuild
- ✅ Entry create
- ✅ Entry update
- ✅ Entry delete
- ✅ Entry publish
- ✅ Entry unpublish

**Enable:** ✅ Checked

5. Click **"Save"**

---

## Part 6: Test End-to-End

1. In Strapi webhook settings, click **"Trigger"** button on your webhook
2. Check Strapi shows **200 OK** response
3. Check GitHub Actions:
   - Go to: https://github.com/YOUR_USERNAME/vigotskyreynosa/actions
   - Should see new workflow run started!
4. Wait for build to complete (~3-5 minutes)
5. Check CloudWatch Logs in AWS (optional):
   - AWS Console → CloudWatch → Log groups
   - `/aws/lambda/strapi-webhook-relay`
   - See real-time logs of webhook processing

---

## Troubleshooting

### Strapi shows error 401 (Unauthorized)
- Wrong secret in URL
- Check the `?secret=...` matches your WEBHOOK_SECRET environment variable

### Strapi shows success but GitHub Actions don't run
- Check Lambda logs in CloudWatch
- Verify GITHUB_TOKEN has `repo` scope
- Verify GITHUB_REPO format is `username/repo` (not URL)

### Lambda test works but Strapi webhook doesn't
- Check the Lambda Function URL in Strapi is correct
- Check `?secret=...` is appended to URL
- Check Strapi can reach the internet/AWS

### GitHub Actions run but build fails
- This is separate from webhook - check build logs
- Verify NEXT_PUBLIC_STRAPI_URL secret is set in GitHub

---

## Cost Estimate

AWS Lambda Free Tier includes:
- 1M requests per month - FREE
- 400,000 GB-seconds compute time - FREE

**Your usage:**
- ~50 content updates/month = ~50 Lambda invocations
- **Cost: $0.00** (well within free tier)

Even with 1,000 updates/month, cost would be ~$0.20/month.

---

## Security Notes

1. **WEBHOOK_SECRET** prevents unauthorized triggers
2. **Function URL** is public but requires secret parameter
3. **GITHUB_TOKEN** has repo-only scope (limited permissions)
4. All secrets stored in AWS environment variables (encrypted at rest)

If you ever need to rotate secrets:
- Generate new GitHub token
- Update Lambda environment variable
- No code changes needed!

---

## Complete Flow

Here's what happens when you click "Publish" in Strapi:

```
1. Strapi sends webhook → Lambda Function URL
2. Lambda validates secret parameter
3. Lambda parses Strapi payload
4. Lambda calls GitHub API with proper format
5. GitHub triggers "repository_dispatch" event
6. GitHub Actions workflow runs
7. Next.js builds with latest Strapi content
8. Static files upload to S3
9. CloudFront cache invalidated
10. New content live on site! (5-10 minutes total)
```

---

## Next Steps

After successful deployment:

1. ✅ Test with real content update in Strapi
2. ✅ Verify new content appears on site after ~5-10 minutes
3. ✅ Delete old/test webhooks in Strapi if any
4. ✅ Monitor CloudWatch logs for first few days
5. ✅ Set up CloudWatch alarms (optional, for production monitoring)

---

## Need Help?

Common issues and logs to check:

1. **Strapi Webhook Logs** - Settings → Webhooks → View execution logs
2. **Lambda Logs** - AWS CloudWatch → Log groups → `/aws/lambda/strapi-webhook-relay`
3. **GitHub Actions** - Your repo → Actions tab
4. **Build Logs** - Click on specific workflow run for detailed logs
