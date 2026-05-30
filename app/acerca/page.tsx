import Image from "next/image";
import type { CSSProperties } from "react";
import CTASection from "@/components/CTASection";
import { getAboutPage, getStrapiMedia } from "@/lib/strapi";

export const metadata = {
  title: "Acerca de - Vigotsky Reynosa",
  description: "Conoce más sobre Vigotsky Reynosa, nuestra misión, valores y compromiso con la excelencia educativa.",
};

export default async function AboutPage() {
  // Fetch about page content from Strapi
  const pageData = await getAboutPage();

  // Fallback data
  const fallbackData = {
    hero_badge: "FORMANDO LÍDERES DEL FUTURO",
    hero_title: "Inspirando la Excelencia en la Educación",
    hero_background: { url: "/images/afuera-de-escuela.png" },
    main_badge: "DESCÚBRENOS",
    main_title: "Una elección confiable para la educación",
    main_description_1: "Vigotsky Reynosa es una escuela privada que ofrece educación desde kínder hasta preparatoria en Reynosa, México, comprometida a brindar un entorno de apoyo para sus alumnos. Nuestro enfoque educativo integral combina rigor académico con desarrollo personal, asegurando que cada niño prospere desde el nivel preescolar hasta la secundaria.",
    main_description_2: "En Vigotsky Reynosa, nos enorgullecemos de contar con un personal dedicado y métodos de enseñanza innovadores. Nuestros estudiantes no solo se destacan a nivel académico, sino que también crecen personalmente, fomentando un amor por el aprendizaje continuo que los prepara para el éxito en el futuro.",
    main_image: { url: "/images/kid-working.jpeg" },
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
    journey_description_2: "Desde sus inicios modestos, Vigotsky Reynosa se ha convertido en una institución confiable en la comunidad. Continuamos adaptándonos y mejorando nuestros programas para brindar a los estudiantes las herramientas que necesitan para alcanzar el éxito a lo largo de toda su vida.",
    journey_image: { url: "/images/kids-playing.png" }
  };

  const data = pageData || fallbackData;

  // Get image URLs
  const heroImageUrl = pageData?.hero_background
    ? getStrapiMedia(pageData.hero_background.url)
    : fallbackData.hero_background.url;
  const mainImageUrl = pageData?.main_image
    ? getStrapiMedia(pageData.main_image.url)
    : fallbackData.main_image.url;
  const journeyImageUrl = pageData?.journey_image
    ? getStrapiMedia(pageData.journey_image.url)
    : fallbackData.journey_image.url;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImageUrl || "/images/afuera-de-escuela.png"}
            alt="Escuela Vigotsky Reynosa"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 w-full" data-reveal="fade">
          <div className="max-w-2xl">
            <p className="text-white text-sm md:text-base font-medium tracking-wider mb-4 uppercase">
              {data.hero_badge}
            </p>
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {data.hero_title}
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content Section - Image with Text Overlay */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Arched Rectangle Image */}
            <div className="flex justify-center lg:justify-start" data-reveal="slide-right">
              <div className="relative w-[350px] h-[450px] lg:w-[400px] lg:h-[500px]">
                {/* Arched rectangle image container */}
                <div className="absolute inset-0 rounded-t-full overflow-hidden shadow-2xl">
                  <Image
                    src={mainImageUrl || "/images/kid-working.jpeg"}
                    alt="Estudiante trabajando"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="text-center lg:text-left" data-reveal="slide-left">
              <p className="text-sm font-bold tracking-widest uppercase text-slate-600 mb-2">
                {data.main_badge}
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">
                {data.main_title}
              </h2>
              <div className="w-20 h-1 bg-green-600 mb-6 mx-auto lg:mx-0"></div>
              <div className="space-y-4 text-base text-slate-700">
                <p>{data.main_description_1}</p>
                <p>{data.main_description_2}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section - Top */}
      <section className="bg-green-50 pt-16 lg:pt-24 pb-32 md:pb-36 lg:pb-32 relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left - Sticky Header */}
            <div className="lg:sticky lg:top-24" data-reveal="slide-right">
              <p className="text-sm font-semibold tracking-wider uppercase text-slate-600">
                {data.mission_badge}
              </p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-4 text-slate-900 leading-tight">
                {data.mission_title}
              </h2>
              <div className="w-24 h-1.5 bg-green-600 mt-6"></div>
            </div>

            {/* Right - Content */}
            <div className="space-y-12">
              <div data-reveal="item">
                <h3 className="text-sm font-semibold tracking-wider uppercase text-slate-600">
                  NUESTRA MISIÓN
                </h3>
                <h4 className="text-xl font-bold mt-2 text-slate-900">
                  {data.mission_subtitle}
                </h4>
                <p className="mt-4 text-slate-700 leading-relaxed">
                  {data.mission_description}
                </p>
              </div>

              <hr className="border-slate-300" />

              <div className="mb-8" data-reveal="item" style={{ "--reveal-delay": "60ms" } as CSSProperties}>
                <h3 className="text-sm font-semibold tracking-wider uppercase text-slate-600">
                  {data.values_badge}
                </h3>
                <h4 className="text-xl font-bold mt-2 text-slate-900">
                  {data.values_title}
                </h4>
                <p className="mt-4 text-slate-700 leading-relaxed mb-8 md:mb-12">
                  {data.values_description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overlapping Image - positioned between sections */}
      <div className="bg-white -mt-24 lg:-mt-32 pt-1">
        <div className="container mx-auto px-6">
          <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-t-2xl overflow-hidden shadow-2xl" data-reveal="scale">
            <Image
              src={journeyImageUrl || "/images/kids-playing.png"}
              alt="Niños en actividad creativa en el aula"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      </div>

      {/* Journey Section - Bottom */}
      <section className="bg-white pt-24 lg:pt-32 pb-16 lg:pb-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left - Sticky Header */}
            <div className="lg:sticky lg:top-24" data-reveal="slide-right">
              <p className="text-sm font-semibold tracking-wider uppercase text-slate-600">
                {data.journey_badge}
              </p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-4 text-slate-900 leading-tight">
                {data.journey_title}
              </h2>
              <div className="w-24 h-1.5 bg-green-600 mt-6"></div>
            </div>

            {/* Right - Content */}
            <div className="space-y-8 text-slate-700 leading-relaxed" data-reveal="item">
              <p>{data.journey_description_1}</p>
              <p>{data.journey_description_2}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
