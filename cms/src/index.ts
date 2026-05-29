let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const DEBOUNCE_MS = 8000; // wait 8s after the last publish before triggering

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: any }) {
    // Send invite email when a new admin user is created with a registration token
    strapi.db.lifecycles.subscribe({
      models: ['admin::user'],
      async afterCreate(event: any) {
        const { result } = event;
        if (!result?.registrationToken || !result?.email) return;

        const cmsUrl = process.env.PUBLIC_URL || 'https://cms.vigotskyreynosa.edu.mx';
        const link = `${cmsUrl}/admin/auth/register?registrationToken=${result.registrationToken}`;

        try {
          await strapi.plugin('email').service('email').send({
            to: result.email,
            subject: 'Invitación para gestionar el sitio web',
            html: `
              <p>Hola ${result.firstname || ''},</p>
              <p>Has sido invitado/a a gestionar el contenido del sitio web de Colegio Lev Vygotsky.</p>
              <p><a href="${link}" style="background:#4945ff;color:#fff;padding:10px 20px;border-radius:4px;text-decoration:none;">Activar mi cuenta</a></p>
              <p>O copia este enlace en tu navegador:<br/>${link}</p>
              <p>Este enlace es de uso único. Si no esperabas este correo, puedes ignorarlo.</p>
            `,
          });
          strapi.log.info(`[invite] Invitation email sent to ${result.email}`);
        } catch (err) {
          strapi.log.error(`[invite] Failed to send invitation email to ${result.email}:`, err);
        }
      },
    });

    strapi.db.lifecycles.subscribe({
      // Strapi v5: publishing creates a new published version (afterCreate with publishedAt set)
      async afterCreate(event: any) {
        const isPublished = !!event.result?.publishedAt;
        const isContentType = event.model?.uid?.startsWith('api::');

        if (!isPublished || !isContentType) return;

        const token = process.env.GITHUB_TOKEN;
        const repo  = process.env.GITHUB_REPO;
        const workflow = process.env.GITHUB_WORKFLOW || 'deploy-staging.yml';
        const branch  = process.env.GITHUB_BRANCH  || 'staging';

        if (!token || !repo) {
          strapi.log.warn('[webhook] GITHUB_TOKEN or GITHUB_REPO not set — skipping');
          return;
        }

        strapi.log.info(`[webhook] publish on ${event.model.uid} — debounce timer reset (${DEBOUNCE_MS}ms)`);

        // Cancel any pending trigger and restart the timer
        if (debounceTimer) clearTimeout(debounceTimer);

        debounceTimer = setTimeout(async () => {
          debounceTimer = null;
          strapi.log.info(`[webhook] debounce settled — triggering ${workflow} on ${branch}`);

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
        }, DEBOUNCE_MS);
      },
    });
  },
};
