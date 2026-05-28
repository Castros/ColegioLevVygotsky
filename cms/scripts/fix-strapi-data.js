#!/usr/bin/env node
/**
 * Fix script: creates single types via REST API and publishes all draft entries.
 * Run from the project root:
 *   STRAPI_URL=https://cms-staging.vigotskyreynosa.edu.mx \
 *   STRAPI_ADMIN_EMAIL=you@email.com \
 *   STRAPI_ADMIN_PASSWORD=yourpassword \
 *   node cms/scripts/fix-strapi-data.js
 */

'use strict';

const STRAPI_URL     = process.env.STRAPI_URL || 'https://cms-staging.vigotskyreynosa.edu.mx';
const ADMIN_EMAIL    = process.env.STRAPI_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.STRAPI_ADMIN_PASSWORD;

async function adminReq(method, endpoint, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${STRAPI_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${endpoint} → ${res.status}: ${text}`);
  }
  return res.json();
}

async function apiReq(method, endpoint, body, apiToken) {
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiToken}` };
  const res = await fetch(`${STRAPI_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${endpoint} → ${res.status}: ${text}`);
  }
  return res.json();
}

const SINGLE_TYPES = [
  {
    restSlug: 'homepage',
    uid: 'api::homepage.homepage',
    data: {
      hero_title:       'Un Camino de Aprendizaje y Éxito Comienza Aquí',
      hero_subtitle:    'INSPIRANDO MENTES JÓVENES',
      hero_description: 'Empoderando a los estudiantes con una educación integral para el éxito duradero y el crecimiento personal en un ambiente de cuidado y apoyo.',
      years_experience: 10,
      families_count:   300,
    },
  },
  {
    restSlug: 'about-section',
    uid: 'api::about-section.about-section',
    data: {
      badge:       'DESCÚBRENOS',
      title:       'Una Opción Confiable en Educación',
      description: 'Fundado con la misión de cultivar mentes jóvenes, Vigotsky Reynosa ofrece un ambiente educativo integral de K-12 que promueve la excelencia académica y el desarrollo personal en Reynosa, México.',
      ctaText:     'ACERCA DE',
      ctaLink:     '/acerca',
    },
  },
  {
    restSlug: 'cta-section',
    uid: 'api::cta-section.cta-section',
    data: {
      badge:             'ÚNETE A NUESTRA COMUNIDAD',
      title:             'Inscribe a Tu Hijo en un Futuro Brillante Hoy',
      description:       'Vive un modelo educativo progresivo que empodera y fomenta el crecimiento de cada estudiante.',
      primaryButtonText: 'INSCRÍBETE AHORA',
      primaryButtonLink: '/contacto',
      backgroundColor:   '#15803d',
    },
  },
  {
    restSlug: 'contact-page',
    uid: 'api::contact-page.contact-page',
    data: {
      hero_title:    'Contáctanos',
      hero_subtitle: 'Estamos aquí para responder tus preguntas',
      phone:         '+52 899 174-0000',
      email:         'info@vigotskyreynosa.edu.mx',
      address:       'Reynosa, Tamaulipas, México',
      hours:         'Lunes a Viernes: 7:00 AM - 5:00 PM',
      facebook:      'https://www.facebook.com/profile.php?id=100063574022481',
      instagram:     'https://www.instagram.com/colegiolevvygotsky1/',
    },
  },
  {
    restSlug: 'services-page',
    uid: 'api::services-page.services-page',
    data: {
      hero_badge:          'NUESTROS SERVICIOS',
      hero_title:          'Programas y Servicios Educativos',
      section_badge:       'OFERTA EDUCATIVA',
      section_title:       'Programas Integrales para Cada Estudiante',
      section_description: 'Ofrecemos una amplia gama de servicios educativos diseñados para apoyar el desarrollo integral de cada alumno.',
    },
  },
  {
    restSlug: 'about-page',
    uid: 'api::about-page.about-page',
    data: {
      hero_badge:            'ACERCA DE NOSOTROS',
      hero_title:            'Conoce Colegio Lev Vygotsky',
      main_badge:            'NUESTRA HISTORIA',
      main_title:            'Una Institución Comprometida con la Educación',
      main_description_1:    'Fundado con la visión de ofrecer educación de calidad en Reynosa, Tamaulipas, el Colegio Lev Vygotsky ha crecido hasta convertirse en una de las instituciones educativas más respetadas de la región.',
      main_description_2:    'Nuestro enfoque holístico garantiza que cada estudiante reciba la atención y el apoyo necesarios para alcanzar su máximo potencial académico y personal.',
      mission_badge:         'NUESTRA MISIÓN',
      mission_title:         'Formando Líderes del Mañana',
      mission_subtitle:      'Comprometidos con la Excelencia',
      mission_description:   'Nuestra misión es proporcionar una educación integral de alta calidad que prepare a los estudiantes para los desafíos del siglo XXI.',
      values_badge:          'NUESTROS VALORES',
      values_title:          'Los Pilares de Nuestra Institución',
      values_description:    'Guiados por principios de excelencia, integridad y respeto, construimos una comunidad educativa donde cada estudiante puede florecer.',
      journey_badge:         'NUESTRO CAMINO',
      journey_title:         'Años de Experiencia Educativa',
      journey_description_1: 'Desde nuestros inicios, hemos estado comprometidos con la innovación educativa y el desarrollo continuo de nuestros programas académicos.',
      journey_description_2: 'Cada año, cientos de familias confían en nosotros para la educación de sus hijos, y ese voto de confianza nos inspira a seguir mejorando.',
    },
  },
];

const COLLECTION_TYPES = [
  { uid: 'api::service.service',                   restSlug: 'services' },
  { uid: 'api::testimonial.testimonial',           restSlug: 'testimonials' },
  { uid: 'api::value-proposition.value-proposition', restSlug: 'value-propositions' },
  { uid: 'api::education-level.education-level',  restSlug: 'education-levels' },
  { uid: 'api::category.category',                restSlug: 'categories' },
  { uid: 'api::blog-post.blog-post',              restSlug: 'blog-posts' },
];

async function main() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Set STRAPI_ADMIN_EMAIL and STRAPI_ADMIN_PASSWORD');
    process.exit(1);
  }

  // Login
  const loginRes = await adminReq('POST', '/admin/login', { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  const token = loginRes.data.token;
  console.log('✓ Logged in');

  // Create API token
  const tokenRes = await adminReq('POST', '/admin/api-tokens', {
    name: `fix-script-${Date.now()}`,
    description: 'Temporary fix script token',
    type: 'full-access',
    lifespan: null,
  }, token);
  const apiToken = tokenRes.data.accessKey;
  console.log('✓ API token created');

  // ── Single types via REST API ──────────────────────────────────────────────
  console.log('\n📄 Creating/updating single types via REST API...');
  for (const st of SINGLE_TYPES) {
    try {
      await apiReq('PUT', `/api/${st.restSlug}`, { data: st.data }, apiToken);
      console.log(`   ✓ ${st.restSlug} saved`);
    } catch (e) {
      console.warn(`   ⚠ ${st.restSlug} save failed: ${e.message}`);
    }
    try {
      await adminReq('POST', `/content-manager/single-types/${st.uid}/actions/publish`, {}, token);
      console.log(`   ✓ ${st.restSlug} published`);
    } catch (e) {
      console.warn(`   ⚠ ${st.restSlug} publish failed: ${e.message}`);
    }
  }

  // ── Publish draft collection type entries ──────────────────────────────────
  console.log('\n📤 Publishing draft collection type entries...');
  for (const ct of COLLECTION_TYPES) {
    try {
      const res = await apiReq('GET', `/api/${ct.restSlug}?status=draft&pagination[limit]=100`, null, apiToken);
      const entries = res.data || [];
      if (entries.length === 0) {
        console.log(`   — ${ct.restSlug}: no drafts found`);
        continue;
      }
      for (const entry of entries) {
        const docId = entry.documentId;
        if (!docId) {
          console.warn(`   ⚠ ${ct.restSlug} entry missing documentId, skipping`);
          continue;
        }
        try {
          await adminReq('POST', `/content-manager/collection-types/${ct.uid}/${docId}/actions/publish`, {}, token);
          console.log(`   ✓ ${ct.restSlug} ${docId} published`);
        } catch (e) {
          console.warn(`   ⚠ ${ct.restSlug} ${docId} publish failed: ${e.message}`);
        }
      }
    } catch (e) {
      console.warn(`   ⚠ Could not fetch ${ct.restSlug}: ${e.message}`);
    }
  }

  console.log('\n✅ Done! Check Strapi admin to verify content.\n');
}

main().catch(err => {
  console.error('\n❌', err.message);
  process.exit(1);
});
