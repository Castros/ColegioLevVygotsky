# Fixing Strapi Webhook - 401 Bad Credentials

## Problem
Strapi webhook returns: `{"message": "Bad credentials", "status": "401"}`

This means the GitHub Personal Access Token is invalid, expired, or missing permissions.

---

## Solution: Create New GitHub Token

### Step 1: Generate New GitHub Personal Access Token

**Classic Token (Recommended):**

1. Go to: https://github.com/settings/tokens
2. Click **Generate new token** → **Generate new token (classic)**
3. **Name:** `Strapi Webhook - Vigotsky`
4. **Expiration:** Choose expiration (90 days, 1 year, or No expiration)
5. **Scopes:** Check ONLY these:
   - ✅ **repo** (Full control of private repositories)
     - This gives access to:
       - repo:status
       - repo_deployment
       - public_repo
       - repo:invite
       - security_events
6. **Scroll down and click "Generate token"**
7. **COPY THE TOKEN** - You won't see it again!

Token format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

### Step 2: Update Strapi Webhook

1. **Login to Strapi:** https://cms.vigotskyreynosa.edu.mx/admin
2. **Go to:** Settings → Webhooks
3. **Find:** "GitHub Auto Deploy" webhook (or create new one)
4. **Click Edit**

### Webhook Configuration:

**Name:**
```
GitHub Auto Deploy
```

**URL:**
```
https://api.github.com/repos/Castros/ColegioLevVygotsky/dispatches
```

**Headers:** (Click "Add header" for each)

Header 1:
- **Name:** `Authorization`
- **Value:** `token ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

  ⚠️ **IMPORTANT:**
  - Include the word `token` followed by a space
  - Then paste your actual GitHub token
  - Full format: `token ghp_your_actual_token_here`

Header 2:
- **Name:** `Accept`
- **Value:** `application/vnd.github.v3+json`

**Method:** POST

**Body (JSON):**
```json
{
  "event_type": "strapi-update"
}
```

**Events to trigger:** (Check these boxes)
- ✅ `entry.create`
- ✅ `entry.update`
- ✅ `entry.delete`
- ✅ `entry.publish`
- ✅ `entry.unpublish`

**Enabled:** ✅ YES

---

### Step 3: Save and Test

1. **Click "Save"**
2. **Click "Trigger"** button to test
3. **Check the response:**
   - ✅ **Success:** `Status: 204 No Content` or empty response
   - ❌ **Error:** See troubleshooting below

4. **Verify in GitHub Actions:**
   - Go to: https://github.com/Castros/ColegioLevVygotsky/actions
   - You should see a new workflow run starting!
   - Title: "Build and Deploy to S3"

---

## Troubleshooting

### Error: 401 Unauthorized / Bad credentials
**Causes:**
- Token is wrong or expired
- Token doesn't have `repo` scope
- Missing `token ` prefix in Authorization header

**Solution:**
1. Create a new token with `repo` scope
2. Make sure Authorization header is: `token ghp_your_token` (not just `ghp_your_token`)
3. No extra spaces or quotes

### Error: 404 Not Found
**Causes:**
- GitHub username is wrong in URL
- Repository name is wrong
- Repository doesn't exist or is private and token can't access it

**Solution:**
- Verify URL is: `https://api.github.com/repos/Castros/ColegioLevVygotsky/dispatches`
- Check repo exists: https://github.com/Castros/ColegioLevVygotsky

### Webhook triggers but GitHub Actions doesn't run
**Causes:**
- Body doesn't have `"event_type": "strapi-update"`
- Workflow file not on `main` branch
- repository_dispatch trigger not in workflow

**Solution:**
1. Check body has exact JSON: `{"event_type": "strapi-update"}`
2. Verify `.github/workflows/deploy.yml` is on main branch
3. Confirm workflow has:
   ```yaml
   on:
     repository_dispatch:
       types: [strapi-update]
   ```

### Success but website doesn't update
**Causes:**
- CloudFront cache not cleared yet (takes 2-5 min)
- Browser cache

**Solution:**
1. Wait 5-10 minutes for full deployment
2. Hard refresh browser: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
3. Check CloudFront invalidation completed in AWS Console

---

## Testing the Full Workflow

1. **Go to Strapi:** Content Manager → Homepage
2. **Make a small change** (e.g., change hero title)
3. **Click "Save"**
4. **Click "Publish"**
5. **Wait 5-10 seconds**
6. **Check GitHub Actions:** https://github.com/Castros/ColegioLevVygotsky/actions
7. **You should see:** New workflow run starting!
8. **Wait ~5 minutes** for build to complete
9. **Visit website:** https://vigotskyreynosa.edu.mx
10. **Hard refresh:** Ctrl+F5
11. **Verify:** Your changes are live!

---

## Expected Timeline

From content change to live website:
- **0:00** - Click Publish in Strapi
- **0:01** - Webhook fires
- **0:05** - GitHub Actions starts
- **2:00** - Build completes
- **2:30** - Files uploaded to S3
- **2:35** - CloudFront invalidation starts
- **5:00** - CloudFront cache fully cleared
- **5:00** - ✅ Changes live on website!

**Total time: ~5-10 minutes**

---

## Security Best Practices

✅ **DO:**
- Use token expiration (90 days or 1 year)
- Only give `repo` scope (nothing more)
- Store token securely
- Regenerate if compromised

❌ **DON'T:**
- Share token publicly
- Commit token to git
- Give unnecessary scopes
- Use "No expiration" unless necessary

---

## Quick Reference

**Repo URL:** `https://github.com/Castros/ColegioLevVygotsky`

**Webhook URL:** `https://api.github.com/repos/Castros/ColegioLevVygotsky/dispatches`

**Authorization Header Format:** `token ghp_your_actual_token_here`

**Event Type:** `strapi-update`

**GitHub Actions:** https://github.com/Castros/ColegioLevVygotsky/actions

**Website:** https://vigotskyreynosa.edu.mx

---

## Need More Help?

Check these logs:
1. **Strapi Webhook Logs:** Settings → Webhooks → Click on webhook → View logs
2. **GitHub Actions Logs:** Actions tab → Click on workflow run → View logs
3. **CloudFront Logs:** AWS Console → CloudFront → Distributions

---

**Updated:** 2026-02-04
