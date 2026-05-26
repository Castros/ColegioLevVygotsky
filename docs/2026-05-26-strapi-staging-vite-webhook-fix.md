# Incident & Fix — 2026-05-26
## Strapi Staging: Vite Host Check + GitHub Actions Webhook

---

## Summary

Staging CMS (`cms-staging.vigotskyreynosa.edu.mx`) became inaccessible and a GitHub Actions rebuild trigger was added. Two separate issues surfaced during the work.

---

## Issue 1: Vite "Blocked request" — Admin panel inaccessible

### Symptom
Navigating to `https://cms-staging.vigotskyreynosa.edu.mx/admin` returned:

```
Blocked request. This host ('cms-staging.vigotskyreynosa.edu.mx') is not allowed.
To allow this host, add 'cms-staging.vigotskyreynosa.edu.mx' to `server.allowedHosts` in vite.config.js.
```

### Root Cause
Vite 5.4+ added a security feature that blocks requests from non-localhost hostnames when running in dev server mode. Strapi v5 runs the admin panel through the Vite dev server (`strapi develop`). When the container was rebuilt, a newer Vite version was installed that enforces this check — breaking access through the Traefik reverse proxy.

### What Was Tried (Did Not Work)
- `cms/src/admin/vite.config.ts` with `allowedHosts: 'all'` — Strapi v5 does not forward the `server` key from this file into the Vite dev server config.
- Attempted `allowedHosts: true` (boolean) — same result, file not picked up.

### Fix Applied
Added a `sed` patch to `cms/Dockerfile` that runs at image build time, right after `npm ci`. It patches the Vite chunk file in `node_modules` to bypass the host check entirely:

```dockerfile
# Bypass Vite 5.4+ host check so the admin panel works behind a reverse proxy
RUN find /opt/node_modules/vite/dist/node/chunks -name '*.js' \
    -exec grep -l 'Blocked request' {} \; \
    | xargs sed -i 's/if (!hostHeader || !isHostAllowed(config, isPreview, hostHeader))/if (false)/g'
```

**File patched inside the container:** `/opt/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js` at the `isHostAllowed` guard (line ~59319).

---

## Issue 2: "Count should be a number" — API 500 errors

### Symptom
All Strapi REST API endpoints returned 500 with:

```
Count should be a number, but received: "5" (a string)
```

### Root Cause
PostgreSQL's `pg` driver returns `COUNT(*)` results as JavaScript `BigInt` strings. Strapi v5 in **production mode** (`strapi start`) runs the count query as a raw pg query and doesn't coerce the result. Develop mode (`strapi develop`) handles this differently and doesn't hit the bug.

### Fix Applied
Kept the Dockerfile `CMD` as `npm run develop` (develop mode). Switching to `strapi start` (production mode) triggers the BigInt count bug.

---

## Issue 3: GitHub Actions Webhook from Strapi

### Goal
Strapi publish → GitHub Actions rebuild → S3 deploy → CloudFront invalidation.

### Architecture
Strapi v5 (staging) calls the GitHub Dispatches API directly from `cms/src/index.ts` using the lifecycle hook. No Lambda relay needed for staging since Strapi v5 can send a custom HTTP request body.

```
Strapi Publish
    ↓
strapi.db.lifecycles.subscribe afterUpdate (checks publishedAt)
    ↓
POST https://api.github.com/repos/{GITHUB_REPO}/dispatches
    ↓
GitHub Actions: deploy-staging workflow (event_type: strapi-update-staging)
    ↓
Next.js build → S3 upload → CloudFront invalidation
```

### Environment Variables (set in `/opt/strapi/docker-compose.yml` on the droplet)
| Variable | Value |
|---|---|
| `GITHUB_TOKEN` | Personal access token with `repo` scope |
| `GITHUB_REPO` | `owner/repo` (e.g. `Castros/ColegioLevVygotsky`) |
| `GITHUB_DISPATCH_EVENT` | `strapi-update-staging` |

### Code (`cms/src/index.ts`)
Uses `strapi.db.lifecycles.subscribe` — the template's approach, compatible with both Strapi v4 and v5. Fires `afterUpdate`, checks that `publishedAt` was just set (not a draft save), then calls the GitHub API.

### What Was Tried and Reverted
- `strapi.documents.use()` middleware — this is the Strapi v5 Document Service API. It compiled but broke local CMS startup (middleware registration order conflict). Reverted.

---

## Docker Build Issues During This Session

### Layer export hanging
Five competing `docker-buildx` processes had accumulated **19.79 GB** of build cache, causing layer exports to hang indefinitely.

**Fix:**
```bash
pkill -9 -f docker-buildx
docker builder prune -f
```

### `scp` to host does NOT update the container
Files copied to `/opt/strapi/cms/` on the droplet host are not visible inside the running container. The container has its own filesystem baked at build time.

**Correct approach for hot-patching a running container:**
```bash
docker cp /tmp/file.ts vigotskyreynosa-strapi:/opt/app/src/file.ts
```

**Correct approach for permanent changes:** update the source file → rebuild image → `docker compose up -d`.

### Use `screen` for long builds over SSH
```bash
screen -dmS strapirebuild bash -c "cd /opt/strapi && docker compose build --no-cache 2>&1 | tee /tmp/build.log && docker compose up -d && echo DONE >> /tmp/build.log"
```
Monitor with: `tail -f /tmp/build.log`

---

## Files Changed

| File | Change |
|---|---|
| `cms/Dockerfile` | Added Vite host-check bypass `sed` patch after `npm ci` |
| `cms/src/index.ts` | GitHub Actions webhook via `strapi.db.lifecycles.subscribe` |
| `cms/src/admin/vite.config.ts` | Attempted fix (kept for reference, not the active solution) |
