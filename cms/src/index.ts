export default {
  register() {},

  async bootstrap({ strapi }: { strapi: any }) {
    strapi.db.lifecycles.subscribe({
      async afterUpdate(event: any) {
        // Only fire when an entry is published (publishedAt just got set)
        const justPublished =
          event.result?.publishedAt &&
          event.params?.data?.publishedAt;

        if (!justPublished) return;

        const token = process.env.GITHUB_TOKEN;
        const repo  = process.env.GITHUB_REPO;
        const eventType = process.env.GITHUB_DISPATCH_EVENT || 'strapi-update';

        if (!token || !repo) {
          strapi.log.warn('[webhook] GITHUB_TOKEN or GITHUB_REPO not set — skipping');
          return;
        }

        try {
          const res = await fetch(
            `https://api.github.com/repos/${repo}/dispatches`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github+json',
                'Content-Type': 'application/json',
                'X-GitHub-Api-Version': '2022-11-28',
              },
              body: JSON.stringify({ event_type: eventType }),
            }
          );

          if (res.ok) {
            strapi.log.info(`[webhook] GitHub Actions rebuild triggered (${eventType})`);
          } else {
            strapi.log.error(`[webhook] GitHub API returned ${res.status}`);
          }
        } catch (err) {
          strapi.log.error('[webhook] Failed to trigger GitHub Actions:', err);
        }
      },
    });
  },
};
