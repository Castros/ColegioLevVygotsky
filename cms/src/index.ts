export default {
  register() {},

  async bootstrap({ strapi }: { strapi: any }) {
    strapi.db.lifecycles.subscribe({
      // Strapi v5: publishing creates a new published version (afterCreate with publishedAt set)
      async afterCreate(event: any) {
        const isPublished = !!event.result?.publishedAt;
        const isContentType = event.model?.uid?.startsWith('api::');

        if (!isPublished || !isContentType) return;

        const token = process.env.GITHUB_TOKEN;
        const repo  = process.env.GITHUB_REPO;
        const eventType = process.env.GITHUB_DISPATCH_EVENT || 'strapi-update';

        if (!token || !repo) {
          strapi.log.warn('[webhook] GITHUB_TOKEN or GITHUB_REPO not set — skipping');
          return;
        }

        const workflow = process.env.GITHUB_WORKFLOW || 'deploy-staging.yml';
        const branch  = process.env.GITHUB_BRANCH  || 'staging';

        strapi.log.info(`[webhook] publish detected on ${event.model.uid} — triggering ${workflow} on ${branch}`);

        try {
          const res = await fetch(
            `https://api.github.com/repos/${repo}/actions/workflows/${workflow}/dispatches`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/vnd.github+json',
                'Content-Type': 'application/json',
                'X-GitHub-Api-Version': '2022-11-28',
              },
              body: JSON.stringify({ ref: branch }),
            }
          );

          if (res.ok) {
            strapi.log.info(`[webhook] GitHub Actions rebuild triggered (${workflow} @ ${branch})`);
          } else {
            const body = await res.text();
            strapi.log.error(`[webhook] GitHub API returned ${res.status}: ${body}`);
          }
        } catch (err) {
          strapi.log.error('[webhook] Failed to trigger GitHub Actions:', err);
        }
      },
    });
  },
};
