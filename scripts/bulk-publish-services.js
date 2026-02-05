/**
 * Bulk publish all unpublished services in Strapi
 */

const STRAPI_URL = process.env.STRAPI_URL || 'https://cms.vigotskyreynosa.edu.mx';

async function bulkPublishServices() {
  console.log('🚀 Fetching all services (published and unpublished)...\n');
  console.log(`📍 Strapi URL: ${STRAPI_URL}\n`);

  try {
    // Fetch all services including unpublished (_publicationState=preview)
    const response = await fetch(`${STRAPI_URL}/services?_publicationState=preview`);

    if (!response.ok) {
      throw new Error(`Failed to fetch services: ${response.statusText}`);
    }

    const services = await response.json();
    console.log(`Found ${services.length} total services\n`);

    // Filter unpublished services (published_at is null)
    const unpublished = services.filter(s => !s.published_at);

    if (unpublished.length === 0) {
      console.log('✅ All services are already published!');
      return;
    }

    console.log(`Found ${unpublished.length} unpublished services:\n`);
    unpublished.forEach(s => {
      console.log(`  - ID ${s.id}: ${s.title || '(no title)'}`);
    });
    console.log('');

    // Publish each unpublished service
    console.log('📤 Publishing services...\n');

    for (const service of unpublished) {
      try {
        const publishResponse = await fetch(`${STRAPI_URL}/services/${service.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...service,
            published_at: new Date().toISOString()
          })
        });

        if (!publishResponse.ok) {
          console.error(`❌ Failed to publish ID ${service.id}: ${publishResponse.statusText}`);
          continue;
        }

        console.log(`✅ Published: ${service.title} (ID ${service.id})`);
      } catch (error) {
        console.error(`❌ Error publishing ID ${service.id}:`, error.message);
      }
    }

    console.log('\n🎉 Bulk publish complete!');
    console.log('🔄 Webhook will trigger auto-rebuild in ~30 seconds');

  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    process.exit(1);
  }
}

bulkPublishServices();
