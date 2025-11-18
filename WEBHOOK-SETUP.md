# Setting Up Strapi Webhook for Auto-Deploy

This guide will help you set up automatic deployments when content changes in Strapi.

## Step 1: Create a GitHub Personal Access Token (PAT)

1. Go to GitHub: https://github.com/settings/tokens
2. Click **Generate new token** → **Generate new token (classic)**
3. Give it a name: `Strapi Webhook Token`
4. Select scope: **`repo`** (full control of private repositories)
5. Click **Generate token**
6. **Copy the token** - you won't see it again!

Example token format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Step 2: Configure Webhook in Strapi

1. Log into Strapi: https://cms.vigotskyreynosa.edu.mx/admin
2. Go to **Settings** → **Webhooks**
3. Click **Add new webhook**

### Webhook Configuration:

**Name**:
```
GitHub Auto Deploy
```

**URL**:
```
https://api.github.com/repos/YOUR_GITHUB_USERNAME/vigotskyreynosa/dispatches
```
Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username

**Headers**: Click "Add header" twice and add:

Header 1:
- Name: `Authorization`
- Value: `token ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
  (Replace with your actual GitHub token from Step 1)

Header 2:
- Name: `Accept`
- Value: `application/vnd.github.v3+json`

**Events**: Select when to trigger the webhook
- ✅ Entry create
- ✅ Entry update
- ✅ Entry delete
- ✅ Entry publish
- ✅ Entry unpublish

**Enable**: Make sure it's checked ✅

## Step 3: Configure the Request Body

In Strapi v3, you need to set the request body to JSON.

**Body** (switch to JSON mode if available):
```json
{
  "event_type": "strapi-update"
}
```

If your Strapi version doesn't have a JSON editor, you might need to use the default body format. The important part is that GitHub receives `event_type: "strapi-update"` to match your workflow trigger.

## Step 4: Save and Test

1. Click **Save**
2. Click the **Trigger** button to test the webhook
3. Check GitHub Actions to see if it triggered:
   - Go to your repo → Actions tab
   - You should see a new workflow run

## Step 5: Test with Real Content

1. Go to Content Manager → Homepage
2. Change the hero title
3. Click **Save**
4. Click **Publish**
5. Wait 30 seconds, then check GitHub Actions
6. You should see a new build starting!

## Troubleshooting

**Webhook shows error 404**
- Double-check your GitHub username in the URL
- Make sure the repo name is correct: `vigotskyreynosa`

**Webhook shows error 401 Unauthorized**
- Your GitHub token might be wrong or expired
- Make sure you copied the full token including `ghp_` prefix
- Check the token has `repo` scope enabled

**Webhook succeeds but GitHub Actions doesn't run**
- Check the request body has `"event_type": "strapi-update"`
- Make sure your workflow file is on the `main` branch
- Check that repository_dispatch trigger is enabled in `.github/workflows/deploy.yml`

**Build succeeds but changes don't appear on site**
- Check CloudFront invalidation completed
- Try hard refresh (Ctrl+F5 or Cmd+Shift+R)
- CloudFront cache can take 5-10 minutes to fully clear

## What Gets Triggered?

By default, the webhook will trigger on ANY content change. If you want to be more selective:

### Option 1: Only trigger on specific content types
In Strapi webhook settings, you can add conditions or use the webhook entry filters (if available in your version).

### Option 2: Limit triggers in GitHub Actions
You could modify the workflow to only deploy during certain hours or after multiple changes.

## Expected Timeline

From content change to live site:
- Webhook trigger: ~1 second
- GitHub Actions starts: ~5-10 seconds
- Build process: ~2-3 minutes
- S3 upload: ~10-30 seconds
- CloudFront invalidation: ~2-5 minutes
- **Total: ~5-10 minutes**

## Cost Considerations

Each content change = 1 build = ~$0.03
- 50 updates/month = ~$1.50
- 200 updates/month = ~$6.00

If you're updating very frequently, consider batching changes or triggering manually.
