/**
 * Sync contact information from Strapi to site-config.ts
 * Run this before build to ensure site config has latest contact info
 */

const fs = require('fs');
const path = require('path');

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://cms.vigotskyreynosa.edu.mx';

async function fetchContactInfo() {
  try {
    console.log('📞 Fetching contact information from Strapi...');
    // Strapi v5: /api/ prefix, populate=* for any media fields
    const response = await fetch(`${STRAPI_URL}/api/contact-page?populate=*`);

    if (!response.ok) {
      console.warn(`⚠️  Strapi returned ${response.status}, using default config`);
      return null;
    }

    const json = await response.json();
    // Strapi v5 wraps single types in { data: {...} }
    const data = json?.data ?? null;
    console.log('✅ Contact information fetched successfully');
    return data;
  } catch (error) {
    console.warn('⚠️  Failed to fetch from Strapi, using default config:', error.message);
    return null;
  }
}

function generateSiteConfig(contactData) {
  const phoneDisplay = contactData?.phone || '+52 899 174-0031';
  const phoneLink = `tel:${phoneDisplay.replace(/[\s-]/g, '')}`;
  const email = contactData?.email || 'info@vigotskyreynosa.edu.mx';
  const address = contactData?.address?.trim() || 'Reynosa, Tamaulipas, México';
  const facebook = contactData?.facebook?.trim() || 'https://www.facebook.com/colegiolevvygotskyreynosa';
  const instagram = contactData?.instagram?.trim() || 'https://www.instagram.com/colegiolevvygotsky1/';
  const mapUrl = contactData?.mapUrl || contactData?.mapurl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1791.8592520102459!2d-98.36072362627539!3d26.075454551296275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8665058add1dfced%3A0x8d748b063e65e551!2sColegio%20Lev%20Vygotsky!5e0!3m2!1sen!2smx!4v1763515642391!5m2!1sen!2smx';

  return `/**
 * Site-wide configuration
 * Single source of truth for contact information and site settings
 *
 * This file is auto-generated from Strapi before build.
 * To update contact info, edit in Strapi CMS or modify the fallback values in scripts/sync-contact-info.js
 */

export const siteConfig = {
  name: 'Colegio Lev Vygotsky',
  description: 'Educación de calidad en Reynosa, Tamaulipas',

  contact: {
    phone: {
      display: '${phoneDisplay}',
      link: '${phoneLink}',
    },
    email: {
      display: '${email}',
      link: 'mailto:${email}',
    },
    address: {
      street: 'Calle Dirección',
      city: 'Reynosa',
      state: 'Tamaulipas',
      country: 'México',
      fullAddress: '${address}',
    },
  },

  social: {
    facebook: '${facebook}',
    instagram: '${instagram}',
    whatsapp: ${contactData?.whatsapp ? `'${contactData.whatsapp}'` : 'undefined'},
  },

  maps: {
    embedUrl: '${mapUrl}',
  },
} as const;
`;
}

async function main() {
  console.log('🚀 Starting contact info sync...');

  const contactData = await fetchContactInfo();

  if (contactData) {
    console.log('📝 Contact data:', {
      phone: contactData.phone,
      email: contactData.email,
      address: contactData.address?.substring(0, 50) + '...',
    });
  }

  const configContent = generateSiteConfig(contactData);
  const configPath = path.join(__dirname, '..', 'lib', 'site-config.ts');

  fs.writeFileSync(configPath, configContent, 'utf-8');
  console.log('✅ site-config.ts updated successfully!');
  console.log('📁 Location:', configPath);
}

main().catch(console.error);
