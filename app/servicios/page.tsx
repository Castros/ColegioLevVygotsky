import Image from "next/image";

export const metadata = {
  title: "Servicios - Vigotsky Reynosa",
  description: "Descubre nuestros programas educativos integrales diseñados para cada estudiante.",
};

export default function ServicesPage() {
  const services = [
    {
      number: "01.",
      title: "Plan de Estudios Integral",
      description: "Nuestro Plan de Estudios Integral está diseñado para nutrir mentes jóvenes a través de una combinación de métodos de enseñanza tradicionales e innovadores. Nos enfocamos en el pensamiento crítico, la creatividad y la inteligencia emocional, asegurando que cada estudiante desarrolle habilidades esenciales para el futuro. Adaptado para satisfacer diversos estilos de aprendizaje, nuestro plan de estudios crea un entorno atractivo donde los estudiantes prosperan académica y socialmente. Con materias enfocadas que van desde las artes hasta las ciencias, fomentamos el amor por el aprendizaje y alentamos la exploración de por vida. Nuestros educadores dedicados están comprometidos a guiar a cada niño en su viaje educativo, estableciendo una base sólida para el éxito futuro.",
      image: "/images/girl-learning.jpg",
      imagePosition: "left",
    },
    {
      number: "02.",
      title: "Actividades Extracurriculares",
      description: "En Vigotsky Reynosa, nuestro programa de Actividades Extracurriculares enriquece la experiencia educativa de los estudiantes más allá del aula. Ofrecemos una amplia gama de clubes y clases, incluyendo deportes, artes y música, permitiendo a los estudiantes explorar sus pasiones y desarrollar nuevas habilidades. La participación en estas actividades fomenta el trabajo en equipo, el liderazgo y la interacción social, fomentando un sentido de comunidad entre los estudiantes. Guiados por instructores experimentados, los niños ganan confianza y creatividad mientras equilibran lo académico con actividades placenteras. Estos programas son cruciales para el crecimiento personal, asegurando que cada niño se desarrolle holísticamente como individuo.",
      image: "/images/kids-playing.png",
      imagePosition: "right",
    },
    {
      number: "03.",
      title: "Estancia",
      description: "Nuestro programa de Estancia proporciona un ambiente seguro y enriquecedor para los estudiantes después del horario escolar. Priorizamos la seguridad mientras aseguramos que los niños participen en actividades divertidas y educativas. Nuestro personal dedicado supervisa a los estudiantes, ofreciendo asistencia con la tarea, proyectos creativos y tiempo de juego recreativo. Este programa no solo apoya a las familias trabajadoras, sino que también fomenta las interacciones sociales entre compañeros. Alentamos la autoexpresión y la colaboración a través de diversas actividades grupales que estimulan el aprendizaje. Con un enfoque en el bienestar, nuestra Estancia asegura que los estudiantes se sientan valorados y apoyados en un entorno comunitario.",
      image: "/images/boy-holiding-dinosaure.png",
      imagePosition: "left",
    },
    {
      number: "04.",
      title: "Métodos de Enseñanza Progresivos",
      description: "En Vigotsky Reynosa, adoptamos Métodos de Enseñanza Progresivos que priorizan la participación del estudiante y el aprendizaje activo. Nuestro enfoque combina experiencias prácticas con proyectos colaborativos, permitiendo a los estudiantes tomar posesión de su educación. Al integrar tecnología y aplicaciones del mundo real, hacemos que el aprendizaje sea relevante y emocionante. Nuestros educadores están capacitados en técnicas innovadoras que atienden diversos estilos de aprendizaje, asegurando que cada niño pueda prosperar. Creemos en fomentar el pensamiento crítico y las habilidades de resolución de problemas, preparando a los estudiantes para los desafíos del mañana. Este compromiso con la educación progresiva empodera a los estudiantes para convertirse en aprendices de por vida y ciudadanos globales responsables.",
      image: "/images/kid-working.jpeg",
      imagePosition: "right",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/afuera-de-escuela.png"
            alt="Colegio Lev Vygotsky"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 w-full text-center">
          <p className="text-white text-sm md:text-base font-medium tracking-wider mb-4 uppercase">
            EDUCACIÓN INTEGRAL
          </p>
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Descubre Nuestros Programas de Aprendizaje Integral
          </h1>
        </div>
      </section>

      {/* Services Sections */}
      <div className="bg-white">
        {services.map((service, index) => (
          <section
            key={index}
            className={`py-16 sm:py-24 ${index % 2 === 1 ? "bg-slate-50" : "bg-white"}`}
          >
            <div className="container mx-auto px-6 lg:px-8">
              <div
                className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                  service.imagePosition === "right" ? "lg:grid-flow-dense" : ""
                }`}
              >
                {/* Image */}
                <div
                  className={`flex justify-center ${
                    service.imagePosition === "right" ? "lg:col-start-2" : ""
                  }`}
                >
                  <div className="w-full max-w-md aspect-square">
                    <div className="w-full h-full rounded-[50%] overflow-hidden shadow-2xl relative">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div
                  className={`text-center lg:text-left ${
                    service.imagePosition === "right" ? "lg:col-start-1 lg:row-start-1" : ""
                  }`}
                >
                  <p className="text-3xl font-bold text-green-600 mb-2">
                    {service.number}
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
                    {service.title}
                  </h2>
                  <div className="w-20 h-1 bg-green-600 mb-6 mx-auto lg:mx-0"></div>
                  <p className="text-base text-slate-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
