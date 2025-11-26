# Strapi v3 Webhook Diagnosis Guide

## Step 1: Test What Strapi is Actually Sending

1. **Go to webhook.site:**
   - Visit https://webhook.site
   - You'll get a unique URL like: `https://webhook.site/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - Keep this tab open

2. **Configure test webhook in Strapi:**
   - Login: https://cms.vigotskyreynosa.edu.mx/admin
   - Go to: Settings → Webhooks
   - Create a NEW webhook (don't modify existing one yet)
   - **Name:** `Test Webhook`
   - **URL:** Paste your webhook.site URL
   - **Events:** Check "Entry update"
   - **Enable:** ✅
   - Save it

3. **Trigger the webhook:**
   - Click the "Trigger" button on your test webhook
   - OR go to Content Manager and update any content

4. **Check webhook.site:**
   - Go back to webhook.site tab
   - You should see a request appear
   - **Copy the entire request details** (headers + body)
   {"log":{"version":"1.2","creator":{"name":"Webhook.site","version":"1.0"},"entries":[{"startedDateTime":"2025-11-18 21:29:31","request":{"method":"POST","url":"https://webhook.site/b11c73bf-d5f0-4db1-9df8-749729e7c06f","headers":[{"name":"host","value":"webhook.site"},{"name":"accept-encoding","value":"gzip,deflate"},{"name":"user-agent","value":"node-fetch/1.0 (+https://github.com/bitinn/node-fetch)"},{"name":"content-length","value":"64"},{"name":"accept","value":"*/*"},{"name":"content-type","value":"application/json"},{"name":"x-strapi-event","value":"trigger-test"}],"bodySize":64,"postData":{"mimeType":"application/json","text":"{\"event\":\"trigger-test\",\"created_at\":\"2025-11-18T21:29:31.139Z\"}"}},"response":{"status":200,"httpVersion":"HTTP/1.1","headers":[{"name":"Content-Type","value":"text/html"}],"content":{"size":156,"text":"This URL has no default content configured. <a href=\"https://webhook.site/#!/edit/b11c73bf-d5f0-4db1-9df8-749729e7c06f\">Change response in Webhook.site</a>.","mimeType":"text/html"}}}]}}

## Step 2: Check Current GitHub Webhook Settings

1. **Find your existing webhook in Strapi:**
   - Settings → Webhooks
   - Look for "GitHub Auto Deploy" or similar

2. **Verify these settings:**

   - [ ] URL is: `https://api.github.com/repos/[USERNAME]/vigotskyreynosa/dispatches`
   - [ ] Authorization header: `token ghp_...` (your GitHub token)
   - [ ] Accept header: `application/vnd.github.v3+json`
   - [ ] Events are selected (entry.create, entry.update, etc.)
   - [ ] Webhook is enabled

3. **Check webhook execution history:**
   - In Strapi webhook settings, there might be a logs/history section
   - Look for error codes:
     - `404` = Wrong URL (repo name or username incorrect)
     - `401` = Authentication failed (bad token)
     - `422` = Bad request format (body issue)
     - `200`/`204` = Success! (but maybe workflow not triggering)

## Step 3: Test GitHub Actions Manually

To verify GitHub Actions works:

1. Go to: https://github.com/YOUR_USERNAME/vigotskyreynosa/actions
2. Click "Build and Deploy to S3" workflow
3. Click "Run workflow" button
4. Select branch: `main`
5. Click green "Run workflow"
6. Wait and verify build completes successfully

✅ If this works → The problem is webhook triggering
❌ If this fails → The problem is in the build itself

## Common Issues & Solutions

### Issue 1: Strapi v3 Cannot Send Custom Body

**Problem:** Strapi v3 sends its own format:
```json
{
  "event": "entry.update",
  "model": "homepage",
  "entry": { ... }
}
```

But GitHub needs:
```json
{
  "event_type": "strapi-update"
}
```

**Solutions:**

**A) Use the Lambda webhook relay** (recommended)
- Deploy `lambda-webhook/index.js` to AWS Lambda
- Point Strapi at Lambda URL instead
- Lambda translates format and calls GitHub

**B) Modify GitHub workflow** (simpler, but less elegant)
- Change workflow to accept webhooks at a different endpoint
- Use workflow_dispatch with inputs
- Or set up GitHub webhook that accepts any payload

**C) Use a webhook relay service**
- Zapier, Make.com, or n8n
- Free tier usually sufficient

### Issue 2: GitHub Token Issues

If getting 401 errors:

1. **Generate new token:**
   - https://github.com/settings/tokens
   - Generate new token (classic)
   - Scopes needed: `repo` (full control)
   - Copy the `ghp_...` token

2. **Update Strapi webhook header:**
   - Authorization: `token ghp_YOUR_NEW_TOKEN`
   - (Note: include the word "token" before the actual token)

### Issue 3: Wrong Repository URL

Double check URL format:
```
https://api.github.com/repos/[USERNAME]/vigotskyreynosa/dispatches
```

- Replace `[USERNAME]` with your actual GitHub username
- Repo name must be exact: `vigotskyreynosa`

## Next Steps Based on Your Test

### If webhook.site shows Strapi IS sending requests:
→ The problem is the payload format or GitHub token
→ Option: Deploy Lambda relay OR modify workflow

### If webhook.site shows NO requests from Strapi:
→ Webhook not configured correctly in Strapi
→ Check events are selected and webhook is enabled

### If Strapi shows 200 response but Actions don't run:
→ Payload format issue
→ GitHub received it but didn't recognize event_type
→ Need Lambda relay OR workflow modification

## Test Your Understanding

Answer these to diagnose:

1. When you trigger the Strapi webhook, does webhook.site receive anything?
   - YES → Continue to question 2
   - NO → Webhook not configured/enabled in Strapi

2. What HTTP status code does Strapi webhook show in its logs?
   - 200/204 → Success, but format might be wrong
   - 401 → Bad token
   - 404 → Wrong URL
   - 422 → Bad payload format

3. Does manual "Run workflow" work in GitHub Actions?
   - YES → Problem is webhook trigger only
   - NO → Problem is build configuration

## Recommended Solution

Based on Strapi v3 limitations, I recommend:

**Deploy the Lambda webhook relay:**

1. The Lambda function in `lambda-webhook/index.js` is already written
2. It accepts Strapi's format and translates to GitHub's format
3. More reliable than trying to make Strapi send custom body
4. Would you like help deploying this to AWS Lambda?

Or if you prefer a quicker fix, I can help you set up a free webhook relay service.
