export default {
  register() {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async bootstrap({ strapi }: { strapi: any }) {
    // Trigger a GitHub Actions rebuild whenever content is published
    strapi.documents.use(async (ctx: any, next: any) => {
      await next();

      if (ctx.action !== 'publish') return;

      const token = process.env.GITHUB_TOKEN;
      const repo = process.env.GITHUB_REPO;
      const eventType = process.env.GITHUB_DISPATCH_EVENT || 'strapi-update';

      if (!token || !repo) return;

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
          strapi.log.info(`[webhook] GitHub Actions triggered (${eventType})`);
        } else {
          strapi.log.error(`[webhook] GitHub API returned ${res.status}`);
        }
      } catch (err) {
        strapi.log.error('[webhook] Failed to trigger GitHub Actions:', err);
      }
    });
  },
};
