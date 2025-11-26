/**
 * AWS Lambda function to relay Strapi webhooks to GitHub Actions
 *
 * Environment Variables Required:
 * - GITHUB_TOKEN: GitHub Personal Access Token with 'repo' scope
 * - GITHUB_REPO: Repository in format 'username/repo' (e.g., 'Castros/ColegioLevVygotsky')
 * - WEBHOOK_SECRET: Secret to validate requests from Strapi
 */

exports.handler = async (event) => {
    console.log('Received webhook:', JSON.stringify(event, null, 2));

    // Parse query parameters
    const queryParams = event.queryStringParameters || {};
    const secret = queryParams.secret;

    // Validate secret
    if (!secret || secret !== process.env.WEBHOOK_SECRET) {
        console.error('Invalid or missing secret');
        return {
            statusCode: 401,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ error: 'Unauthorized' }),
        };
    }

    // Parse Strapi webhook body
    let body;
    try {
        body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch (error) {
        console.error('Error parsing body:', error);
        return {
            statusCode: 400,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ error: 'Invalid JSON body' }),
        };
    }

    console.log('Parsed body:', JSON.stringify(body, null, 2));

    // Trigger GitHub Actions
    const githubToken = process.env.GITHUB_TOKEN;
    const githubRepo = process.env.GITHUB_REPO;

    if (!githubToken || !githubRepo) {
        console.error('Missing GITHUB_TOKEN or GITHUB_REPO environment variables');
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ error: 'Server configuration error' }),
        };
    }

    try {
        const githubUrl = `https://api.github.com/repos/${githubRepo}/dispatches`;
        console.log('Triggering GitHub Actions:', githubUrl);

        const response = await fetch(githubUrl, {
            method: 'POST',
            headers: {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event_type: 'strapi-update',
                client_payload: {
                    model: body.model,
                    event: body.event,
                    triggered_at: new Date().toISOString(),
                },
            }),
        });

        if (response.ok) {
            console.log('Successfully triggered GitHub Actions');
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    success: true,
                    message: 'Build triggered successfully',
                    model: body.model,
                    event: body.event,
                }),
            };
        } else {
            const errorText = await response.text();
            console.error('GitHub API error:', response.status, errorText);
            return {
                statusCode: response.status,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    error: 'Failed to trigger GitHub Actions',
                    details: errorText,
                }),
            };
        }
    } catch (error) {
        console.error('Error triggering GitHub Actions:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message,
            }),
        };
    }
};
