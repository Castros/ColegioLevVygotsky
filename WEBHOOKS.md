# Webhooks — Strapi → GitHub Actions

Strapi publishes content → fires a webhook → AWS Lambda relay → GitHub Actions → rebuild → S3 deploy.

**Strapi Admin:** `https://cms.vigotskyreynosa.edu.mx/admin`
**GitHub Actions:** `https://github.com/Castros/ColegioLevVygotsky/actions`

---

## Architecture

Strapi v3 cannot send a custom body, so it cannot call the GitHub Dispatches API directly. A Lambda relay sits in between:

```
Strapi Publish
    ↓
Strapi Webhook → lambda-webhook/index.js (AWS Lambda)
    ↓
GitHub API POST /repos/Castros/ColegioLevVygotsky/dispatches
    ↓
GitHub Actions: "Build and Deploy to S3"
    ↓
S3 upload + CloudFront invalidation
    ↓
✅ Live site updated (~5 min total)
```

The Lambda URL is set as the webhook URL in Strapi. See `lambda-webhook/DEPLOYMENT.md` for deploying the Lambda.

---

## Setting Up the Strapi Webhook

1. Log into Strapi: `https://cms.vigotskyreynosa.edu.mx/admin`
2. Go to **Settings → Webhooks → Add new webhook**

**Configuration:**

| Field | Value |
|---|---|
| Name | `GitHub Auto Deploy` |
| URL | Your Lambda function URL (from AWS) |
| Method | POST |
| Events | entry.create, entry.update, entry.delete, entry.publish, entry.unpublish |
| Enabled | ✅ |

No custom headers or body needed — the Lambda handles translation to GitHub's format.

3. Click **Save**, then **Trigger** to test.

---

## Setting Up the GitHub Token (if using direct webhook)

If calling GitHub directly instead of via Lambda:

1. Go to `https://github.com/settings/tokens`
2. **Generate new token (classic)**
3. Name: `Strapi Webhook - Vigotsky`
4. Scopes: check **`repo`** only
5. Set expiration (90 days or 1 year recommended)
6. Copy the token — you won't see it again

In Strapi webhook headers:
- `Authorization`: `token ghp_your_actual_token_here`
- `Accept`: `application/vnd.github.v3+json`

Body (JSON):
```json
{ "event_type": "strapi-update" }
```

The GitHub Actions workflow must have:
```yaml
on:
  repository_dispatch:
    types: [strapi-update]
```

---

## Troubleshooting

### 401 Bad Credentials
- Token is wrong, expired, or missing `repo` scope
- Authorization header must be `token ghp_...` (include the word `token` and a space)
- Generate a new token at `https://github.com/settings/tokens`

### 404 Not Found
- Check repo URL: `https://api.github.com/repos/Castros/ColegioLevVygotsky/dispatches`
- Username and repo name are case-sensitive

### 422 Unprocessable Entity
- Request body is malformed
- Must be exactly: `{ "event_type": "strapi-update" }`

### Webhook fires (200/204) but Actions don't run
- `event_type` in the body doesn't match the workflow trigger type
- Verify `deploy.yml` is on the `main` branch
- Check the workflow `on.repository_dispatch.types` list

### Build runs but site doesn't update
- Wait 5–10 min for CloudFront invalidation to complete
- Hard refresh: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
- Check invalidation status: AWS Console → CloudFront → Invalidations

---

## Diagnosing with webhook.site

To inspect exactly what Strapi sends:

1. Visit `https://webhook.site` and copy your unique URL
2. Create a **test** webhook in Strapi pointing at that URL
3. Click Trigger (or publish content)
4. Check webhook.site for the request body and headers

Strapi v3 sends its native format:
```json
{
  "event": "entry.publish",
  "model": "homepage",
  "entry": { ... }
}
```
That's why the Lambda relay is needed — it translates this to `{ "event_type": "strapi-update" }`.

---

## Manually Triggering a Build

GitHub → Actions → "Build and Deploy to S3" → **Run workflow** → select `main` → Run.

---

## Expected Timeline

| Time | Event |
|---|---|
| 0:00 | Click Publish in Strapi |
| 0:01 | Webhook fires |
| 0:05 | GitHub Actions starts |
| 2:00 | Build completes |
| 2:30 | S3 upload done |
| 2:35 | CloudFront invalidation starts |
| ~5:00 | ✅ Changes live |

---

## Cost

Each content change triggers one build ≈ $0.03.
- 50 updates/month ≈ $1.50
- 200 updates/month ≈ $6.00
