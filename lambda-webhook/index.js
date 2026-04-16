/**
 * AWS Lambda function to relay Strapi webhooks to GitHub Actions
 * Includes 10-minute cooldown debounce to prevent build spam.
 *
 * Environment Variables Required:
 * - GITHUB_TOKEN: GitHub Personal Access Token with 'repo' scope
 * - GITHUB_REPO: Repository in format 'username/repo' (e.g., 'Castros/ColegioLevVygotsky')
 * - WEBHOOK_SECRET: Secret to validate requests from Strapi
 *
 * SSM Parameters (auto-created on first run):
 * - /strapi-webhook/last_build_time
 * - /strapi-webhook/last_save_time
 *
 * Triggers:
 * - API Gateway (Strapi webhook calls)
 * - EventBridge scheduled rule (every 10 minutes, checks for pending builds)
 */

const { SSMClient, GetParameterCommand, PutParameterCommand } = require('@aws-sdk/client-ssm');

const ssmClient = new SSMClient({ region: process.env.AWS_REGION || 'us-east-1' });

const COOLDOWN_MS = 10 * 60 * 1000; // 10 minutes
const PARAM_LAST_BUILD = '/strapi-webhook/last_build_time';
const PARAM_LAST_SAVE = '/strapi-webhook/last_save_time';

async function getParam(name) {
    try {
        const result = await ssmClient.send(new GetParameterCommand({ Name: name }));
        return result.Parameter.Value;
    } catch (err) {
        if (err.name === 'ParameterNotFound') return null;
        throw err;
    }
}

async function setParam(name, value) {
    await ssmClient.send(new PutParameterCommand({
        Name: name,
        Value: value,
        Type: 'String',
        Overwrite: true,
    }));
}

async function triggerGitHubBuild(model, eventType) {
    const githubToken = process.env.GITHUB_TOKEN;
    const githubRepo = process.env.GITHUB_REPO;

    if (!githubToken || !githubRepo) {
        throw new Error('Missing GITHUB_TOKEN or GITHUB_REPO environment variables');
    }

    const response = await fetch(`https://api.github.com/repos/${githubRepo}/dispatches`, {
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
                event: eventType,
                triggered_at: new Date().toISOString(),
            },
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GitHub API error: ${response.status} ${errorText}`);
    }
}

exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    // --- EventBridge scheduled check ---
    // Runs every 10 minutes to catch pending changes made during a cooldown window
    if (event.source === 'aws.events' || event['detail-type'] === 'Scheduled Event') {
        console.log('Running scheduled pending build check...');

        const lastSave = await getParam(PARAM_LAST_SAVE);
        const lastBuild = await getParam(PARAM_LAST_BUILD);

        if (!lastSave) {
            console.log('No saves recorded yet, nothing to do.');
            return { statusCode: 200, body: 'No pending changes' };
        }

        const hasPendingChanges = !lastBuild || new Date(lastSave) > new Date(lastBuild);
        if (hasPendingChanges) {
            console.log('Pending changes detected, triggering build...');
            await triggerGitHubBuild('scheduled-check', 'pending');
            await setParam(PARAM_LAST_BUILD, new Date().toISOString());
            return { statusCode: 200, body: 'Pending build triggered' };
        }

        console.log('No pending changes since last build, skipping.');
        return { statusCode: 200, body: 'No pending changes' };
    }

    // --- Strapi webhook ---
    const queryParams = event.queryStringParameters || {};
    const secret = queryParams.secret;

    if (!secret || secret !== process.env.WEBHOOK_SECRET) {
        console.error('Invalid or missing secret');
        return {
            statusCode: 401,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Unauthorized' }),
        };
    }

    let body;
    try {
        body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    } catch (error) {
        console.error('Error parsing body:', error);
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Invalid JSON body' }),
        };
    }

    console.log('Parsed body:', JSON.stringify(body, null, 2));

    const now = new Date().toISOString();
    await setParam(PARAM_LAST_SAVE, now);
    console.log(`Recorded save at ${now}`);

    const lastBuild = await getParam(PARAM_LAST_BUILD);
    const withinCooldown = lastBuild && (Date.now() - new Date(lastBuild).getTime()) < COOLDOWN_MS;

    if (withinCooldown) {
        const remainingMs = COOLDOWN_MS - (Date.now() - new Date(lastBuild).getTime());
        const remainingMin = Math.ceil(remainingMs / 1000 / 60);
        console.log(`Cooldown active (~${remainingMin} min remaining). Changes recorded as pending.`);
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: true,
                message: `Changes saved. Build will trigger automatically in ~${remainingMin} minutes.`,
            }),
        };
    }

    // Outside cooldown — trigger build immediately
    console.log('Outside cooldown, triggering GitHub Actions build...');
    await triggerGitHubBuild(body.model, body.event);
    await setParam(PARAM_LAST_BUILD, now);

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            success: true,
            message: 'Build triggered successfully',
            model: body.model,
            event: body.event,
        }),
    };
};
