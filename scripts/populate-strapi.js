/**
 * Script to populate Strapi with initial content from fallback data
 *
 * Usage:
 *   node scripts/populate-strapi.js
 *
 * Requirements:
 *   - All content types must be created in Strapi first
 *   - Set STRAPI_URL and STRAPI_API_TOKEN environment variables
 */

const STRAPI_URL = process.env.STRAPI_URL || 'https://cms.vigotskyreynosa.edu.mx';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN; // Optional - only needed if API is protected

// Fallback data from components
const data = {
  // Services
  services: [
    {
      number: "01.",
      title: "Plan de Estudios Integral",
      description: "Nuestro Plan de Estudios Integral está diseñado para nutrir mentes jóvenes a través de una combinación de métodos de enseñanza tradicionales e innovadores. Nos enfocamos en el pensamiento crítico, la creatividad y la inteligencia emocional, asegurando que cada estudiante desarrolle habilidades esenciales para el futuro. Adaptado para satisfacer diversos estilos de aprendizaje, nuestro plan de estudios crea un entorno atractivo donde los estudiantes prosperan académica y socialmente. Con materias enfocadas que van desde las artes hasta las ciencias, fomentamos el amor por el aprendizaje y alentamos la exploración de por vida. Nuestros educadores dedicados están comprometidos a guiar a cada niño en su viaje educativo, estableciendo una base sólida para el éxito futuro.",
      shortDescription: "Un plan educativo completo que fomenta el pensamiento crítico y la creatividad en los estudiantes.",
      imagePosition: "left",
      order: 1
    },
    {
      number: "02.",
      title: "Actividades Extracurriculares",
      description: "En Vigotsky Reynosa, nuestro programa de Actividades Extracurriculares enriquece la experiencia educativa de los estudiantes más allá del aula. Ofrecemos una amplia gama de clubes y clases, incluyendo deportes, artes y música, permitiendo a los estudiantes explorar sus pasiones y desarrollar nuevas habilidades. La participación en estas actividades fomenta el trabajo en equipo, el liderazgo y la interacción social, fomentando un sentido de comunidad entre los estudiantes. Guiados por instructores experimentados, los niños ganan confianza y creatividad mientras equilibran lo académico con actividades placenteras. Estos programas son cruciales para el crecimiento personal, asegurando que cada niño se desarrolle holísticamente como individuo.",
      shortDescription: "Una variedad de clubes y clases diseñados para potenciar las habilidades e intereses de los estudiantes.",
      imagePosition: "right",
      order: 2
    },
    {
      number: "03.",
      title: "Estancia",
      description: "Nuestro programa de Estancia proporciona un ambiente seguro y enriquecedor para los estudiantes después del horario escolar. Priorizamos la seguridad mientras aseguramos que los niños participen en actividades divertidas y educativas. Nuestro personal dedicado supervisa a los estudiantes, ofreciendo asistencia con la tarea, proyectos creativos y tiempo de juego recreativo. Este programa no solo apoya a las familias trabajadoras, sino que también fomenta las interacciones sociales entre compañeros. Alentamos la autoexpresión y la colaboración a través de diversas actividades grupales que estimulan el aprendizaje. Con un enfoque en el bienestar, nuestra Estancia asegura que los estudiantes se sientan valorados y apoyados en un entorno comunitario.",
      shortDescription: "Un ambiente seguro y estimulante para los niños fuera del horario escolar.",
      imagePosition: "left",
      order: 3
    },
    {
      number: "04.",
      title: "Métodos de Enseñanza Progresivos",
      description: "En Vigotsky Reynosa, adoptamos Métodos de Enseñanza Progresivos que priorizan la participación del estudiante y el aprendizaje activo. Nuestro enfoque combina experiencias prácticas con proyectos colaborativos, permitiendo a los estudiantes tomar posesión de su educación. Al integrar tecnología y aplicaciones del mundo real, hacemos que el aprendizaje sea relevante y emocionante. Nuestros educadores están capacitados en técnicas innovadoras que atienden diversos estilos de aprendizaje, asegurando que cada niño pueda prosperar. Creemos en fomentar el pensamiento crítico y las habilidades de resolución de problemas, preparando a los estudiantes para los desafíos del mañana. Este compromiso con la educación progresiva empodera a los estudiantes para convertirse en aprendices de por vida y ciudadanos globales responsables.",
      shortDescription: "Estrategias innovadoras de enseñanza para potenciar la participación y el aprendizaje de los estudiantes.",
      imagePosition: "right",
      order: 4
    }
  ],

  // Testimonials
  testimonials: [
    {
      name: "María González",
      role: "Madre de alumno",
      content: "Vigotsky Reynosa ha sido una bendición para nuestra familia. Mi hijo ha florecido aquí, tanto académica como personalmente.",
      rating: 5,
      order: 1
    },
    {
      name: "Carlos Martínez",
      role: "Padre de alumna",
      content: "El enfoque educativo integral y el personal dedicado hacen de esta escuela la mejor elección para nuestros hijos.",
      rating: 5,
      order: 2
    },
    {
      name: "Ana López",
      role: "Madre de dos alumnos",
      content: "Excelente institución con valores sólidos. Mis hijos están recibiendo una educación de calidad que los prepara para el futuro.",
      rating: 5,
      order: 3
    }
  ],

  // About Section
  aboutSection: {
    badge: "DESCÚBRENOS",
    title: "Una Opción Confiable en Educación",
    description: "Fundado con la misión de cultivar mentes jóvenes, Vigotsky Reynosa ofrece un ambiente educativo integral de K-12 que promueve la excelencia académica y el desarrollo personal en Reynosa, México."
  },

  // CTA Section
  ctaSection: {
    badge: "ÚNETE A NUESTRA COMUNIDAD",
    title: "Inscribe a Tu Hijo en un Futuro Brillante Hoy",
    description: "Vive un modelo educativo progresivo que empodera y fomenta el crecimiento de cada estudiante.",
    primaryButtonText: "INSCRÍBETE AHORA",
    primaryButtonLink: "/contacto",
    backgroundColor: "#15803d"
  },

  // Value Propositions
  valuePropositions: [
    {
      title: "Enfoque Educativo Holístico",
      description: "Nos enfocamos en el desarrollo integral de los estudiantes, fomentando habilidades académicas, sociales y emocionales en un ambiente de cuidado y apoyo.",
      icon: "check",
      order: 1
    },
    {
      title: "Personal Dedicado y Experimentado",
      description: "Nuestros maestros están comprometidos con el aprendizaje individualizado, asegurando que cada estudiante reciba atención y apoyo personalizados.",
      icon: "check",
      order: 2
    },
    {
      title: "Actividades Extracurriculares Dinámicas",
      description: "Ofrecemos una amplia variedad de clases extracurriculares que enriquecen la experiencia de los estudiantes y fomentan intereses personales más allá de lo académico.",
      icon: "check",
      order: 3
    }
  ],

  // Services Page
  servicesPage: {
    hero_badge: "EDUCACIÓN INTEGRAL",
    hero_title: "Descubre Nuestros Programas de Aprendizaje Integral"
  },

  // About Page
  aboutPage: {
    hero_badge: "FORMANDO LÍDERES DEL FUTURO",
    hero_title: "Inspirando la Excelencia en la Educación",
    main_badge: "DESCÚBRENOS",
    main_title: "Una elección confiable para la educación",
    main_description_1: "Vigotsky Reynosa es una escuela privada que ofrece educación desde kínder hasta preparatoria en Reynosa, México, comprometida a brindar un entorno de apoyo para sus alumnos. Nuestro enfoque educativo integral combina rigor académico con desarrollo personal, asegurando que cada niño prospere desde el nivel preescolar hasta la secundaria.",
    main_description_2: "En Vigotsky Reynosa, nos enorgullecemos de contar con un personal dedicado y métodos de enseñanza innovadores. Nuestros estudiantes no solo se destacan a nivel académico, sino que también crecen personalmente, fomentando un amor por el aprendizaje continuo que los prepara para el éxito en el futuro.",
    mission_badge: "NUESTRO PROPÓSITO Y PRINCIPIOS",
    mission_title: "Misión y Valores que Inspiran",
    mission_subtitle: "Sembrando Valores, Cosechando Logros",
    mission_description: "En Vigotsky Reynosa, nuestra misión es inspirar y cultivar las mentes de los jóvenes, fomentando el amor por el aprendizaje y el crecimiento personal, garantizando que cada estudiante alcance su máximo potencial en un entorno de apoyo.",
    values_badge: "NUESTROS PRINCIPIOS",
    values_title: "Valores que Nos Definen",
    values_description: "Valoramos la diversidad, la integridad y la colaboración. Nuestro compromiso con una educación progresiva empodera a los alumnos para sobresalir tanto intelectual como socialmente, creando una comunidad que respeta la individualidad y promueve el crecimiento y la comprensión compartidos.",
    journey_badge: "NUESTRO RECORRIDO HASTA AHORA",
    journey_title: "Un Legado de Aprendizaje",
    journey_description_1: "Con la visión de transformar la educación en Reynosa, Vigotsky Reynosa abrió sus puertas a entusiastas estudiantes, ganándose rápidamente una reputación de excelencia académica y enseñanza innovadora. A lo largo de los años, la escuela ha ampliado su plan de estudios y sus actividades extracurriculares, adoptando una filosofía educativa integral que satisface las diversas necesidades de sus alumnos.",
    journey_description_2: "Desde sus inicios modestos, Vigotsky Reynosa se ha convertido en una institución confiable en la comunidad. Continuamos adaptándonos y mejorando nuestros programas para brindar a los estudiantes las herramientas que necesitan para alcanzar el éxito a lo largo de toda su vida."
  }
};

async function populateStrapi() {
  console.log('🚀 Starting Strapi population...\n');

  const headers = {
    'Content-Type': 'application/json',
  };

  // Add authorization if token is provided
  if (STRAPI_API_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`;
  }

  // Helper function to post data
  async function postData(endpoint, data) {
    try {
      const response = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to create ${endpoint}: ${response.status} - ${error}`);
      }

      const result = await response.json();
      console.log(`✅ Created ${endpoint}:`, result.id || result.data?.id);
      return result;
    } catch (error) {
      console.error(`❌ Error creating ${endpoint}:`, error.message);
      return null;
    }
  }

  // Helper function to put (update) data for single types
  async function putData(endpoint, data) {
    try {
      const response = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ data })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to update ${endpoint}: ${response.status} - ${error}`);
      }

      const result = await response.json();
      console.log(`✅ Updated ${endpoint}`);
      return result;
    } catch (error) {
      console.error(`❌ Error updating ${endpoint}:`, error.message);
      return null;
    }
  }

  // Populate Services
  console.log('\n📝 Populating Services...');
  for (const service of data.services) {
    await postData('services', { data: service });
  }

  // Populate Testimonials
  console.log('\n💬 Populating Testimonials...');
  for (const testimonial of data.testimonials) {
    await postData('testimonials', { data: testimonial });
  }

  // Populate About Section (Single Type)
  console.log('\n📄 Populating About Section...');
  await putData('about-section', data.aboutSection);

  // Populate CTA Section (Single Type)
  console.log('\n📢 Populating CTA Section...');
  await putData('cta-section', data.ctaSection);

  // Populate Value Propositions
  console.log('\n⭐ Populating Value Propositions...');
  for (const prop of data.valuePropositions) {
    await postData('value-propositions', { data: prop });
  }

  // Populate Services Page (Single Type)
  console.log('\n📄 Populating Services Page...');
  await putData('services-page', data.servicesPage);

  // Populate About Page (Single Type)
  console.log('\n📄 Populating About Page...');
  await putData('about-page', data.aboutPage);

  console.log('\n\n✨ Strapi population complete!');
  console.log('\n⚠️  Note: You still need to:');
  console.log('   1. Upload images in Strapi admin');
  console.log('   2. Link images to the appropriate content');
  console.log('   3. Publish all content (if using draft/publish)');
  console.log('\n🎉 Next: Update content in Strapi, save, and it will auto-deploy!');
}

// Run the script
populateStrapi().catch(console.error);
