/**
 * Test script to populate Services only
 */

const STRAPI_URL = process.env.STRAPI_URL || 'https://cms.vigotskyreynosa.edu.mx';

const services = [
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
];

async function populateServices() {
  console.log('🚀 Testing Services population...\n');
  console.log(`📍 Strapi URL: ${STRAPI_URL}\n`);

  for (let i = 0; i < services.length; i++) {
    const service = services[i];
    console.log(`\n[${i + 1}/4] Creating: ${service.title}`);

    try {
      // Strapi v3 API format (no /api prefix, no data wrapper)
      const response = await fetch(`${STRAPI_URL}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(service)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Error: ${response.status} ${response.statusText}`);
        console.error(`   Details: ${errorText}`);

        // Try to parse error as JSON for better display
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error?.message) {
            console.error(`   Message: ${errorJson.error.message}`);
          }
        } catch {}

        continue;
      }

      const result = await response.json();
      console.log(`✅ Success! ID: ${result.data?.id || result.id}`);

    } catch (error) {
      console.error(`❌ Network error:`, error.message);
    }
  }

  console.log('\n\n✨ Services population test complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Go to Strapi: https://cms.vigotskyreynosa.edu.mx/admin');
  console.log('   2. Check Content Manager → Services');
  console.log('   3. Upload images for each service');
  console.log('   4. Click "Publish" on each service');
  console.log('\n🎉 After publishing, the website will auto-rebuild!');
}

populateServices().catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});
