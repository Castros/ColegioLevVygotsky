#!/usr/bin/env node
/**
 * Populate Strapi v5 with content migrated from v3 data files.
 *
 * Usage (run from the cms/ directory):
 *   STRAPI_ADMIN_EMAIL=admin@example.com \
 *   STRAPI_ADMIN_PASSWORD=yourpassword \
 *   node scripts/populate-strapi-v5.js
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const STRAPI_URL     = process.env.STRAPI_URL || 'http://localhost:3200';
const ADMIN_EMAIL    = process.env.STRAPI_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.STRAPI_ADMIN_PASSWORD;

// Paths relative to the cms/ directory
const ROOT         = path.resolve(__dirname, '../..');
const IMAGES_DIR   = path.join(ROOT, 'public/strapi-images');
const BLOG_FILE    = path.join(ROOT, 'data/blog-posts.json');
const CAT_FILE     = path.join(ROOT, 'data/categories.json');

// ─── helpers ──────────────────────────────────────────────────────────────────

async function request(method, endpoint, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  try {
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
  } catch (e) {
    if (e.cause) throw new Error(`${method} ${endpoint} → fetch failed: ${e.cause.message} (${e.cause.code})`);
    throw e;
  }
}

async function createApiToken(adminToken) {
  const name = `populate-script-${Date.now()}`;
  const res = await request('POST', '/admin/api-tokens', {
    name,
    description: 'Temporary token for populate script',
    type: 'full-access',
    lifespan: null,
  }, adminToken);
  return res.data?.accessKey;
}

function uploadImage(filePath, apiToken) {
  const { execSync } = require('child_process');
  if (!fs.existsSync(filePath)) return null;
  const filename = path.basename(filePath);
  try {
    const result = execSync(
      `curl -s -X POST "${STRAPI_URL}/api/upload" -H "Authorization: Bearer ${apiToken}" -F "files=@${filePath}" --max-time 30`,
      { encoding: 'utf8' }
    );
    const data = JSON.parse(result);
    if (data?.error) {
      console.warn(`  ⚠ upload failed for ${filename}: ${data.error.message}`);
      return null;
    }
    return data[0]?.id || null;
  } catch (e) {
    console.warn(`  ⚠ upload error for ${filename}: ${e.message.slice(0, 80)}`);
    return null;
  }
}

async function createEntry(uid, data, token) {
  const res = await request('POST', `/content-manager/collection-types/${uid}`, data, token);
  return res.data ?? res;
}

async function updateSingleType(uid, data, token) {
  const res = await request('PUT', `/content-manager/single-types/${uid}`, data, token);
  return res.data ?? res;
}

async function publishEntry(uid, documentId, token) {
  try {
    await request('POST', `/content-manager/collection-types/${uid}/${documentId}/actions/publish`, {}, token);
  } catch (e) {
    console.warn(`  ⚠ publish failed for ${documentId}: ${e.message}`);
  }
}

async function publishSingleType(uid, token) {
  try {
    await request('POST', `/content-manager/single-types/${uid}/actions/publish`, {}, token);
  } catch (e) {
    console.warn(`  ⚠ publish single type failed for ${uid}: ${e.message}`);
  }
}

function log(msg) { console.log(msg); }

// ─── content data ─────────────────────────────────────────────────────────────

const SERVICES = [
  { number: '01', title: 'After School',            description: 'Cuidado y apoyo académico después del horario escolar para facilitar la vida de los padres que trabajan.',  shortDescription: 'Cuidado y apoyo académico después del horario escolar para facilitar la vida de los padres que trabajan.',  order: 1 },
  { number: '02', title: 'Clases Extracurriculares', description: 'Programas deportivos, artísticos y culturales que complementan la formación integral de nuestros alumnos.', shortDescription: 'Programas deportivos, artísticos y culturales que complementan la formación integral de nuestros alumnos.', order: 2 },
  { number: '03', title: 'Apoyo Psicopedagógico',   description: 'Seguimiento cercano del desarrollo emocional y académico para asegurar el éxito de cada estudiante.',         shortDescription: 'Seguimiento cercano del desarrollo emocional y académico para asegurar el éxito de cada estudiante.',  order: 3 },
  { number: '04', title: 'Comedor Escolar',          description: 'Menús nutritivos y balanceados preparados bajo estrictos estándares de higiene y calidad.',                  shortDescription: 'Menús nutritivos y balanceados preparados bajo estrictos estándares de higiene y calidad.',           order: 4 },
];

const TESTIMONIALS = [
  { name: 'María González',  role: 'Madre de Estudiante', message: 'Vigotsky Reynosa ha transformado la educación de mi hijo. Los maestros son dedicados y el ambiente es perfecto para el aprendizaje.',                            order: 1 },
  { name: 'Carlos Ramírez',  role: 'Padre de Estudiante', message: 'Excelente institución educativa. Mi hija ha desarrollado habilidades académicas y sociales excepcionales gracias al equipo de Vigotsky.',                          order: 2 },
  { name: 'Ana López',       role: 'Madre de Estudiante', message: 'La mejor decisión que tomamos fue inscribir a nuestros hijos aquí. El enfoque integral y personalizado hace la diferencia.',                                        order: 3 },
  { name: 'Roberto Silva',   role: 'Padre de Estudiante', message: 'Los programas extracurriculares son increíbles. Mi hijo está más motivado que nunca y realmente disfruta ir a la escuela.',                                         order: 4 },
];

const VALUE_PROPOSITIONS = [
  { title: 'Enfoque Educativo Holístico',           description: 'Nos enfocamos en el desarrollo integral de los estudiantes, fomentando habilidades académicas, sociales y emocionales en un ambiente de cuidado y apoyo.', order: 1 },
  { title: 'Personal Dedicado y Experimentado',    description: 'Nuestros maestros están comprometidos con el aprendizaje individualizado, asegurando que cada estudiante reciba atención y apoyo personalizados.',             order: 2 },
  { title: 'Actividades Extracurriculares Dinámicas', description: 'Ofrecemos una amplia variedad de clases extracurriculares que enriquecen la experiencia de los estudiantes y fomentan intereses personales más allá de lo académico.', order: 3 },
];

const EDUCATION_LEVELS = [
  {
    slug: 'pre-kinder', title: 'Pre-Kínder', ageRange: '1 año y 6 meses - 3 años', order: 1,
    description: 'Primeros pasos en el aprendizaje con un enfoque en desarrollo sensorial, motricidad, y adaptación al ambiente escolar en un espacio amoroso y seguro.',
    features: [{ text: 'Estimulación temprana y sensorial' }, { text: 'Desarrollo de motricidad fina y gruesa' }, { text: 'Socialización y adaptación escolar' }, { text: 'Actividades de exploración y descubrimiento' }],
  },
  {
    slug: 'kinder', title: 'Kínder', ageRange: '3-6 años', order: 2,
    description: 'Desarrollo integral en los primeros años, fomentando la creatividad, habilidades sociales y fundamentos académicos en un ambiente seguro y estimulante.',
    features: [{ text: 'Aprendizaje a través del juego' }, { text: 'Desarrollo socioemocional' }, { text: 'Introducción a la lectoescritura' }, { text: 'Actividades artísticas y musicales' }],
  },
  {
    slug: 'primaria', title: 'Primaria', ageRange: '6-12 años', order: 3,
    description: 'Educación primaria que construye bases sólidas en todas las áreas académicas, desarrollando pensamiento crítico y amor por el aprendizaje.',
    features: [{ text: 'Programa académico integral' }, { text: 'Desarrollo de habilidades STEM' }, { text: 'Actividades extracurriculares' }, { text: 'Formación en valores' }],
  },
  {
    slug: 'secundaria', title: 'Secundaria', ageRange: '12-15 años', order: 4,
    description: 'Preparación para el futuro con un programa riguroso que desarrolla liderazgo, pensamiento independiente y excelencia académica.',
    features: [{ text: 'Preparación para preparatoria' }, { text: 'Desarrollo de liderazgo' }, { text: 'Orientación vocacional' }, { text: 'Proyectos de investigación' }],
  },
];

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Set STRAPI_ADMIN_EMAIL and STRAPI_ADMIN_PASSWORD before running.');
    process.exit(1);
  }
  if (!process.env.STRAPI_API_TOKEN) {
    console.warn('⚠ STRAPI_API_TOKEN not set — images will be skipped. Create a Full Access token in Settings → API Tokens.\n');
  }

  // 1. Login
  log('\n🔐 Logging in...');
  const loginRes = await request('POST', '/admin/login', { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  const token = loginRes.data.token;
  log('   ✓ Authenticated');

  // 2. Get or create API token for upload endpoint
  log('\n🔑 Getting API token for uploads...');
  let apiToken = process.env.STRAPI_API_TOKEN;
  if (apiToken) {
    log('   ✓ Using STRAPI_API_TOKEN from environment');
  } else {
    apiToken = await createApiToken(token);
    log('   ✓ API token created');
  }

  // 3. Upload images
  log('\n🖼  Uploading images...');
  const imageMap = {}; // basename → strapi file id
  if (fs.existsSync(IMAGES_DIR)) {
    // Only upload originals, skip strapi-generated size variants (large_, medium_, small_, thumbnail_)
    const files = fs.readdirSync(IMAGES_DIR).filter(f =>
      /\.(png|jpe?g|gif|webp|svg)$/i.test(f) &&
      !/^(large|medium|small|thumbnail)_/.test(f)
    );
    for (const file of files) {
      const id = await uploadImage(path.join(IMAGES_DIR, file), apiToken);
      if (id) {
        imageMap[file] = id;
        log(`   ✓ ${file} → id ${id}`);
      }
    }
  } else {
    log('   ⚠ No strapi-images directory found, skipping image upload.');
  }

  // helper: find best matching uploaded image id by partial filename
  function findImage(hint) {
    if (!hint) return null;
    const base = path.basename(hint).toLowerCase().replace(/[^a-z0-9.]/g, '_');
    const match = Object.keys(imageMap).find(k => k.toLowerCase().includes(base.split('_')[0]) || base.includes(k.split('_')[0]));
    return match ? imageMap[match] : null;
  }

  // 4. Categories
  log('\n📂 Creating categories...');
  const categories = JSON.parse(fs.readFileSync(CAT_FILE, 'utf8'));
  const catDocIdMap = {}; // v3 id → v5 documentId
  for (const cat of categories) {
    const entry = await createEntry('api::category.category', { name: cat.name, slug: cat.slug, order: cat.order }, token);
    catDocIdMap[cat.id] = entry.documentId;
    log(`   ✓ ${cat.name}`);
  }

  // 4. Blog posts
  log('\n📝 Creating blog posts...');
  const blogPosts = JSON.parse(fs.readFileSync(BLOG_FILE, 'utf8'));
  for (const post of blogPosts) {
    const catDocId = post.category?.id ? catDocIdMap[post.category.id] : null;
    const imgId = post.featured_image?.url ? findImage(post.featured_image.url) : null;

    const data = {
      title:          post.title,
      slug:           post.slug,
      excerpt:        post.excerpt || '',
      content:        post.content || '',
      published_date: post.published_date || null,
      ...(catDocId && { category: catDocId }),
      ...(imgId    && { featured_image: imgId }),
    };

    const entry = await createEntry('api::blog-post.blog-post', data, token);
    await publishEntry('api::blog-post.blog-post', entry.documentId, token);
    log(`   ✓ ${post.title}`);
  }

  // 5. Services
  log('\n🎓 Creating services...');
  for (const svc of SERVICES) {
    const entry = await createEntry('api::service.service', svc, token);
    await publishEntry('api::service.service', entry.documentId, token);
    log(`   ✓ ${svc.title}`);
  }

  // 6. Testimonials
  log('\n💬 Creating testimonials...');
  for (const t of TESTIMONIALS) {
    const entry = await createEntry('api::testimonial.testimonial', t, token);
    await publishEntry('api::testimonial.testimonial', entry.documentId, token);
    log(`   ✓ ${t.name}`);
  }

  // 7. Value propositions
  log('\n✅ Creating value propositions...');
  for (const vp of VALUE_PROPOSITIONS) {
    const entry = await createEntry('api::value-proposition.value-proposition', vp, token);
    await publishEntry('api::value-proposition.value-proposition', entry.documentId, token);
    log(`   ✓ ${vp.title}`);
  }

  // 8. Education levels
  log('\n🏫 Creating education levels...');
  for (const level of EDUCATION_LEVELS) {
    const entry = await createEntry('api::education-level.education-level', level, token);
    await publishEntry('api::education-level.education-level', entry.documentId, token);
    log(`   ✓ ${level.title}`);
  }

  // 9. Single types
  log('\n📄 Updating single types...');

  await updateSingleType('api::homepage.homepage', {
    hero_title:       'Un Camino de Aprendizaje y Éxito Comienza Aquí',
    hero_subtitle:    'INSPIRANDO MENTES JÓVENES',
    hero_description: 'Empoderando a los estudiantes con una educación integral para el éxito duradero y el crecimiento personal en un ambiente de cuidado y apoyo.',
    years_experience: 10,
    families_count:   300,
  }, token);
  await publishSingleType('api::homepage.homepage', token);
  log('   ✓ homepage');

  await updateSingleType('api::about-section.about-section', {
    badge:       'DESCÚBRENOS',
    title:       'Una Opción Confiable en Educación',
    description: 'Fundado con la misión de cultivar mentes jóvenes, Vigotsky Reynosa ofrece un ambiente educativo integral de K-12 que promueve la excelencia académica y el desarrollo personal en Reynosa, México.',
    ctaText:     'ACERCA DE',
    ctaLink:     '/acerca',
  }, token);
  await publishSingleType('api::about-section.about-section', token);
  log('   ✓ about-section');

  await updateSingleType('api::cta-section.cta-section', {
    badge:               'ÚNETE A NUESTRA COMUNIDAD',
    title:               'Inscribe a Tu Hijo en un Futuro Brillante Hoy',
    description:         'Vive un modelo educativo progresivo que empodera y fomenta el crecimiento de cada estudiante.',
    primaryButtonText:   'INSCRÍBETE AHORA',
    primaryButtonLink:   '/contacto',
    backgroundColor:     '#15803d',
  }, token);
  await publishSingleType('api::cta-section.cta-section', token);
  log('   ✓ cta-section');

  await updateSingleType('api::contact-page.contact-page', {
    hero_title:  'Contáctanos',
    hero_subtitle: 'Estamos aquí para responder tus preguntas',
    phone:       '+52 899 174-0000',
    email:       'info@vigotskyreynosa.edu.mx',
    address:     'Reynosa, Tamaulipas, México',
    hours:       'Lunes a Viernes: 7:00 AM - 5:00 PM',
    mapUrl:      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1791.8592520102459!2d98.36072362627539!3d26.075454551296275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8665058add1dfced%3A0x8d748b063e65e551!2sColegio%20Lev%20Vygotsky!5e0!3m2!1sen!2smx!4v1763515642391!5m2!1sen!2smx',
    facebook:    'https://www.facebook.com/profile.php?id=100063574022481',
    instagram:   'https://www.instagram.com/colegiolevvygotsky1/',
  }, token);
  await publishSingleType('api::contact-page.contact-page', token);
  log('   ✓ contact-page');

  await updateSingleType('api::services-page.services-page', {
    hero_badge:          'NUESTROS SERVICIOS',
    hero_title:          'Programas y Servicios Educativos',
    section_badge:       'OFERTA EDUCATIVA',
    section_title:       'Programas Integrales para Cada Estudiante',
    section_description: 'Ofrecemos una amplia gama de servicios educativos diseñados para apoyar el desarrollo integral de cada alumno.',
  }, token);
  await publishSingleType('api::services-page.services-page', token);
  log('   ✓ services-page');

  await updateSingleType('api::about-page.about-page', {
    hero_badge:            'ACERCA DE NOSOTROS',
    hero_title:            'Conoce Colegio Lev Vygotsky',
    main_badge:            'NUESTRA HISTORIA',
    main_title:            'Una Institución Comprometida con la Educación',
    main_description_1:    'Fundado con la visión de ofrecer educación de calidad en Reynosa, Tamaulipas, el Colegio Lev Vygotsky ha crecido hasta convertirse en una de las instituciones educativas más respetadas de la región.',
    main_description_2:    'Nuestro enfoque holístico garantiza que cada estudiante reciba la atención y el apoyo necesarios para alcanzar su máximo potencial académico y personal.',
    mission_badge:         'NUESTRA MISIÓN',
    mission_title:         'Formando Líderes del Mañana',
    mission_subtitle:      'Comprometidos con la Excelencia',
    mission_description:   'Nuestra misión es proporcionar una educación integral de alta calidad que prepare a los estudiantes para los desafíos del siglo XXI, fomentando el pensamiento crítico, la creatividad y los valores humanos.',
    values_badge:          'NUESTROS VALORES',
    values_title:          'Los Pilares de Nuestra Institución',
    values_description:    'Guiados por principios de excelencia, integridad y respeto, construimos una comunidad educativa donde cada estudiante puede florecer.',
    journey_badge:         'NUESTRO CAMINO',
    journey_title:         'Años de Experiencia Educativa',
    journey_description_1: 'Desde nuestros inicios, hemos estado comprometidos con la innovación educativa y el desarrollo continuo de nuestros programas académicos.',
    journey_description_2: 'Cada año, cientos de familias confían en nosotros para la educación de sus hijos, y ese voto de confianza nos inspira a seguir mejorando.',
  }, token);
  await publishSingleType('api::about-page.about-page', token);
  log('   ✓ about-page');

  // Final step: enable public read permissions on all content types
  log('\n🔓 Setting public read permissions...');
  const rolesRes = await request('GET', '/users-permissions/roles', null, token);
  const publicRole = rolesRes.roles.find(r => r.type === 'public');
  if (publicRole) {
    const roleDetail = await request('GET', `/users-permissions/roles/${publicRole.id}`, null, token);
    const perms = roleDetail.role.permissions;

    const contentTypes = [
      'category', 'blog-post', 'service', 'testimonial',
      'value-proposition', 'education-level',
      'homepage', 'about-section', 'cta-section',
      'contact-page', 'services-page', 'about-page',
    ];

    for (const ct of contentTypes) {
      const key = `api::${ct}.${ct}`;
      if (perms[key]?.controllers) {
        Object.keys(perms[key].controllers).forEach(controller => {
          ['find', 'findone'].forEach(action => {
            if (perms[key].controllers[controller][action] !== undefined) {
              perms[key].controllers[controller][action].enabled = true;
            }
          });
        });
      }
    }

    await request('PUT', `/users-permissions/roles/${publicRole.id}`, { permissions: perms }, token);
    log('   ✓ Public read permissions enabled for all content types');
  } else {
    log('   ⚠ Could not find Public role — set permissions manually in Settings → Roles → Public');
  }

  log('\n✅ Population complete!\n');
}

main().catch(err => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
