import Image from "next/image";
import type { CSSProperties } from "react";
import { getServices, getServicesPage, getStrapiMedia } from "@/lib/strapi";
import { Service, StrapiImage } from "@/lib/types";

export const metadata = {
  title: "Servicios - Vigotsky Reynosa",
  description: "Descubre nuestros programas educativos integrales diseñados para cada estudiante.",
};

export default async function ServicesPage() {
  // Fetch services and page content from Strapi
  const servicesData: Service[] = await getServices();
  const pageData = await getServicesPage();

  // Fallback services data
  const fallbackImage = (url: string): StrapiImage => ({
    id: 0,
    name: url.split("/").pop() || "fallback-image",
    width: 0,
    height: 0,
    hash: "",
    ext: url.split(".").pop() ? `.${url.split(".").pop()}` : "",
    mime: "",
    size: 0,
    url,
    provider: "local",
  });

  const fallbackServices: Service[] = [
    {
      id: 1,
      number: "01.",
      title: "Plan de Estudios Integral",
      description: "Nuestro Plan de Estudios Integral está diseñado para nutrir mentes jóvenes a través de una combinación de métodos de enseñanza tradicionales e innovadores. Nos enfocamos en el pensamiento crítico, la creatividad y la inteligencia emocional, asegurando que cada estudiante desarrolle habilidades esenciales para el futuro. Adaptado para satisfacer diversos estilos de aprendizaje, nuestro plan de estudios crea un entorno atractivo donde los estudiantes prosperan académica y socialmente. Con materias enfocadas que van desde las artes hasta las ciencias, fomentamos el amor por el aprendizaje y alentamos la exploración de por vida. Nuestros educadores dedicados están comprometidos a guiar a cada niño en su viaje educativo, estableciendo una base sólida para el éxito futuro.",
      shortDescription: "",
      image: fallbackImage("/images/girl-learning.jpg"),
      imagePosition: "left" as const,
      order: 1,
      created_at: "",
      updated_at: "",
      published_at: ""
    },
    {
      id: 2,
      number: "02.",
      title: "Actividades Extracurriculares",
      description: "En Vigotsky Reynosa, nuestro programa de Actividades Extracurriculares enriquece la experiencia educativa de los estudiantes más allá del aula. Ofrecemos una amplia gama de clubes y clases, incluyendo deportes, artes y música, permitiendo a los estudiantes explorar sus pasiones y desarrollar nuevas habilidades. La participación en estas actividades fomenta el trabajo en equipo, el liderazgo y la interacción social, fomentando un sentido de comunidad entre los estudiantes. Guiados por instructores experimentados, los niños ganan confianza y creatividad mientras equilibran lo académico con actividades placenteras. Estos programas son cruciales para el crecimiento personal, asegurando que cada niño se desarrolle holísticamente como individuo.",
      shortDescription: "",
      image: fallbackImage("/images/kids-playing.png"),
      imagePosition: "right" as const,
      order: 2,
      created_at: "",
      updated_at: "",
      published_at: ""
    },
    {
      id: 3,
      number: "03.",
      title: "Estancia",
      description: "Nuestro programa de Estancia proporciona un ambiente seguro y enriquecedor para los estudiantes después del horario escolar. Priorizamos la seguridad mientras aseguramos que los niños participen en actividades divertidas y educativas. Nuestro personal dedicado supervisa a los estudiantes, ofreciendo asistencia con la tarea, proyectos creativos y tiempo de juego recreativo. Este programa no solo apoya a las familias trabajadoras, sino que también fomenta las interacciones sociales entre compañeros. Alentamos la autoexpresión y la colaboración a través de diversas actividades grupales que estimulan el aprendizaje. Con un enfoque en el bienestar, nuestra Estancia asegura que los estudiantes se sientan valorados y apoyados en un entorno comunitario.",
      shortDescription: "",
      image: fallbackImage("/images/boy-holiding-dinosaure.png"),
      imagePosition: "left" as const,
      order: 3,
      created_at: "",
      updated_at: "",
      published_at: ""
    },
    {
      id: 4,
      number: "04.",
      title: "Métodos de Enseñanza Progresivos",
      description: "En Vigotsky Reynosa, adoptamos Métodos de Enseñanza Progresivos que priorizan la participación del estudiante y el aprendizaje activo. Nuestro enfoque combina experiencias prácticas con proyectos colaborativos, permitiendo a los estudiantes tomar posesión de su educación. Al integrar tecnología y aplicaciones del mundo real, hacemos que el aprendizaje sea relevante y emocionante. Nuestros educadores están capacitados en técnicas innovadoras que atienden diversos estilos de aprendizaje, asegurando que cada niño pueda prosperar. Creemos en fomentar el pensamiento crítico y las habilidades de resolución de problemas, preparando a los estudiantes para los desafíos del mañana. Este compromiso con la educación progresiva empodera a los estudiantes para convertirse en aprendices de por vida y ciudadanos globales responsables.",
      shortDescription: "",
      image: fallbackImage("/images/kid-working.jpeg"),
      imagePosition: "right" as const,
      order: 4,
      created_at: "",
      updated_at: "",
      published_at: ""
    },
  ];

  const services = servicesData.length > 0 ? servicesData : fallbackServices;

  // Fallback hero data
  const heroData = pageData || {
    hero_badge: "EDUCACIÓN INTEGRAL",
    hero_title: "Descubre Nuestros Programas de Aprendizaje Integral",
    hero_background: { url: "/images/afuera-de-escuela.png" }
  };

  const heroImageUrl = pageData?.hero_background
    ? getStrapiMedia(pageData.hero_background.url)
    : "/images/afuera-de-escuela.png";

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImageUrl || "/images/afuera-de-escuela.png"}
            alt="Colegio Lev Vygotsky"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 w-full text-center" data-reveal="fade">
          <p className="text-white text-sm md:text-base font-medium tracking-wider mb-4 uppercase">
            {heroData.hero_badge}
          </p>
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {heroData.hero_title}
          </h1>
        </div>
      </section>

      {/* Services Sections */}
      <div className="bg-white">
        {services.map((service, index) => {
          const serviceImageUrl = service.image?.url
            ? getStrapiMedia(service.image.url) || service.image.url
            : "/images/afuera-de-escuela.png";

          return (
            <section
              key={service.id || index}
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
                    data-reveal={service.imagePosition === "right" ? "slide-left" : "slide-right"}
                  >
                    <div className="w-full max-w-md aspect-square">
                      <div className="w-full h-full rounded-[50%] overflow-hidden shadow-2xl relative">
                        <Image
                          src={serviceImageUrl || "/images/afuera-de-escuela.png"}
                          alt={service.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div
                    className={`text-center lg:text-left ${
                      service.imagePosition === "right" ? "lg:col-start-1 lg:row-start-1" : ""
                    }`}
                    data-reveal={service.imagePosition === "right" ? "slide-right" : "slide-left"}
                    style={{ "--reveal-delay": "60ms" } as CSSProperties}
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
          );
        })}
      </div>
    </div>
  );
}
