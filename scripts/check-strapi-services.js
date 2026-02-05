#!/usr/bin/env node

/**
 * Diagnostic script to check Strapi services data
 */

const STRAPI_URL = 'https://cms.vigotskyreynosa.edu.mx';

async function checkServices() {
  console.log('🔍 Checking Strapi Services...\n');

  try {
    const response = await fetch(`${STRAPI_URL}/services?_sort=order:ASC`);

    if (!response.ok) {
      console.error(`❌ Error: ${response.status} ${response.statusText}`);
      return;
    }

    const services = await response.json();

    console.log(`✅ Found ${services.length} services\n`);
    console.log('Services ordered by "order" field:\n');

    services.forEach((service, index) => {
      console.log(`${index + 1}. ${service.number} ${service.title}`);
      console.log(`   Order: ${service.order}`);
      console.log(`   Short Description: ${service.shortDescription?.substring(0, 60)}...`);
      console.log(`   Image Position: ${service.imagePosition}`);
      console.log('');
    });

    // Check for issues
    console.log('\n🔎 Data Validation:');

    const issues = [];

    // Check for null orders
    const nullOrders = services.filter(s => s.order === null);
    if (nullOrders.length > 0) {
      issues.push(`⚠️  ${nullOrders.length} service(s) have null order values`);
    }

    // Check for duplicate titles
    const titles = services.map(s => s.title);
    const duplicateTitles = titles.filter((title, index) => titles.indexOf(title) !== index);
    if (duplicateTitles.length > 0) {
      issues.push(`⚠️  Duplicate titles found: ${[...new Set(duplicateTitles)].join(', ')}`);
    }

    // Check for number/order mismatch
    services.forEach(service => {
      const numFromNumber = service.number?.replace(/\D/g, '');
      if (numFromNumber && service.order && parseInt(numFromNumber) !== service.order) {
        issues.push(`⚠️  Mismatch: "${service.title}" has number="${service.number}" but order=${service.order}`);
      }
    });

    if (issues.length === 0) {
      console.log('✅ No data issues found!');
    } else {
      console.log('Issues found:');
      issues.forEach(issue => console.log(issue));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function checkServicesPage() {
  console.log('\n\n🔍 Checking Services Page content type...\n');

  try {
    const response = await fetch(`${STRAPI_URL}/services-page`);

    if (response.status === 404) {
      console.log('❌ Services Page content type NOT FOUND (404)');
      console.log('   This needs to be created in Strapi admin.');
      return;
    }

    if (!response.ok) {
      console.error(`❌ Error: ${response.status} ${response.statusText}`);
      return;
    }

    const data = await response.json();
    console.log('✅ Services Page exists');
    console.log('   Hero Badge:', data.hero_badge);
    console.log('   Hero Title:', data.hero_title);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run checks
checkServices().then(() => checkServicesPage());
