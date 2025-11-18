import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  // Verify the secret
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Extract info about what changed
    const { model, entry } = body;

    // Only trigger rebuild for important changes
    const shouldRebuild = ['page', 'post', 'global', 'nivel'].includes(model);

    if (shouldRebuild) {
      // Trigger GitHub Actions workflow
      const githubToken = process.env.GITHUB_TOKEN;
      const repo = process.env.GITHUB_REPO; // format: "username/repo"

      if (githubToken && repo) {
        await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
          method: 'POST',
          headers: {
            'Authorization': `token ${githubToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event_type: 'strapi-update',
            client_payload: {
              model,
              entry_id: entry?.id,
            },
          }),
        });
      }
    }

    return NextResponse.json({
      revalidated: shouldRebuild,
      model,
      now: Date.now()
    });
  } catch (err) {
    console.error('Error revalidating:', err);
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
