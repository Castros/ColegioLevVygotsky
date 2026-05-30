"use client";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { EducationLevel } from "@/lib/types";
import { getStrapiMedia } from "@/lib/strapi";
import { FaCheck, FaGraduationCap, FaHeart, FaArrowRight } from "react-icons/fa";
import MasonryGallery from "@/components/MasonryGallery";

interface NivelContentProps {
  nivel: EducationLevel;
}

// Static fallback galleries — used when Strapi gallery field is empty
const fallbackGalleries: Record<string, string[]> = {
  "pre-kinder": [
    "/images/gallery-kinder/kinder-1.png",
    "/images/gallery-kinder/kinder-2.png",
    "/images/gallery-kinder/kinder-3.png",
  ],
  kinder: [
    "/images/gallery-kinder/kinder-1.png",
    "/images/gallery-kinder/kinder-2.png",
    "/images/gallery-kinder/kinder-3.png",
    "/images/gallery-kinder/kinder-4.png",
    "/images/gallery-kinder/kinder-5.png",
    "/images/gallery-kinder/kinder-6.png",
    "/images/gallery-kinder/kinder-7.png",
    "/images/gallery-kinder/kinder-8.png",
    "/images/gallery-kinder/kinder-9.png",
    "/images/gallery-kinder/kinder-10.png",
  ],
  primaria: [
    "/images/gallery-primaria/primaria-1.jpg",
    "/images/gallery-primaria/primaria-2.jpg",
    "/images/gallery-primaria/primaria-3.jpg",
    "/images/gallery-primaria/primaria-4.jpg",
    "/images/gallery-primaria/primaria-5.jpg",
    "/images/gallery-primaria/primaria-6.jpg",
  ],
  secundaria: [
    "/images/gallery-secundaria/secundaria-1.jpg",
    "/images/gallery-secundaria/secundaria-2.jpg",
    "/images/gallery-secundaria/secundaria-3.jpg",
    "/images/gallery-secundaria/secundaria-4.jpg",
    "/images/gallery-secundaria/secundaria-5.jpg",
    "/images/gallery-secundaria/secundaria-6.jpg",
  ],
};

// Fallback hero background images (used when Strapi image is not available)
const fallbackHeroImages: Record<string, string> = {
  "pre-kinder": "/images/hero-kinder-bg.png",
  kinder: "/images/hero-kinder-bg.png",
  primaria: "/images/kid-working.jpeg",
  secundaria: "/images/girl-learning.jpg",
};

const defaultFallbackImage = "/images/afuera-de-escuela.png";

// Content specific to each nivel (keyed by slug)
const nivelData: Record<string, {
  promise: string;
  promiseDescription: string;
  developmentalAreas: { title: string; description: string }[];
  outcomes: string[];
  testimonial: { text: string; author: string; role: string };
}> = {
  "pre-kinder": {
    promise: "Los Primeros Pasos en el Mundo del Aprendizaje",
    promiseDescription: "En Pre-Kínder, acompañamos a los más pequeños en sus primeros pasos educativos, fomentando su desarrollo sensorial, motriz y socioemocional en un ambiente lleno de amor, cuidado y estímulo.",
    developmentalAreas: [
      {
        title: "Estimulación Temprana y Sensorial",
        description: "Actividades diseñadas para estimular todos los sentidos y promover el desarrollo cognitivo temprano"
      },
      {
        title: "Desarrollo de Motricidad Fina y Gruesa",
        description: "Ejercicios y juegos que fortalecen habilidades motoras fundamentales para su crecimiento"
      },
      {
        title: "Socialización y Adaptación Escolar",
        description: "Primeras experiencias de convivencia grupal en un ambiente seguro y acogedor"
      },
      {
        title: "Actividades de Exploración y Descubrimiento",
        description: "Espacios de juego y exploración que fomentan la curiosidad natural y el aprendizaje activo"
      },
      {
        title: "Desarrollo del Lenguaje",
        description: "Estimulación temprana del lenguaje verbal y comprensión a través de canciones, cuentos y juegos"
      },
      {
        title: "Rutinas y Autonomía",
        description: "Establecimiento de rutinas saludables y desarrollo de independencia apropiada para su edad"
      },
    ],
    outcomes: [
      "Adaptación exitosa al ambiente escolar",
      "Desarrollo de habilidades motoras fundamentales",
      "Primeras habilidades sociales y de convivencia",
      "Estimulación sensorial y cognitiva apropiada",
      "Base sólida para continuar en Kínder",
    ],
    testimonial: {
      text: "Estaba preocupada por dejar a mi bebé tan pequeña en la escuela, pero el cariño y profesionalismo de las maestras de Pre-Kínder me tranquilizaron desde el primer día. Ahora mi hija está feliz, ha desarrollado muchas habilidades y sobre todo, ama ir a la escuela.",
      author: "Laura Martínez",
      role: "Madre de alumna de Pre-Kínder",
    },
  },
  kinder: {
    promise: "Un Comienzo Lleno de Amor y Aprendizaje",
    promiseDescription: "En nuestro kínder, su hijo descubrirá el amor por aprender en un ambiente seguro, cálido y estimulante donde cada día es una nueva aventura.",
    developmentalAreas: [
      {
        title: "Desarrollo Psicomotriz",
        description: "Fortalecemos habilidades motoras finas y gruesas a través de actividades físicas y coordinación"
      },
      {
        title: "Habilidades Cognitivas y Sensoperceptivas",
        description: "Estimulamos el pensamiento crítico, la memoria y la percepción sensorial"
      },
      {
        title: "Desarrollo Socioemocional",
        description: "Fomentamos la inteligencia emocional, empatía y habilidades sociales"
      },
      {
        title: "Lenguaje Expresivo y Comprensivo",
        description: "Desarrollamos comunicación verbal y escrita en español e inglés"
      },
      {
        title: "Pensamiento Lógico-Matemático",
        description: "Introducimos conceptos matemáticos básicos a través del juego"
      },
      {
        title: "Creatividad y Expresión Artística",
        description: "Estimulamos la creatividad mediante arte, música y expresión corporal"
      },
    ],
    outcomes: [
      "Desarrollo de habilidades sociales y emocionales sólidas",
      "Fundamentos de lectoescritura en español e inglés",
      "Amor por el aprendizaje y curiosidad natural",
      "Confianza e independencia apropiada para su edad",
      "Preparación completa para primaria",
    ],
    testimonial: {
      text: "Mi hija estaba nerviosa por comenzar la escuela, pero desde el primer día se enamoró de su salón y sus maestras. Ahora no quiere faltar ni un solo día. Ha aprendido tanto y siempre llega a casa emocionada por compartir lo que descubrió.",
      author: "Ana María González",
      role: "Madre de alumna de Kínder 3",
    },
  },
  primaria: {
    promise: "Construyendo Bases Sólidas para el Futuro",
    promiseDescription: "En primaria, cultivamos el pensamiento crítico, la creatividad y la excelencia académica mientras formamos niños seguros de sí mismos y ávidos de conocimiento.",
    developmentalAreas: [
      {
        title: "Competencias de Lectoescritura",
        description: "Dominio avanzado de lectura comprensiva y escritura creativa en español e inglés"
      },
      {
        title: "Pensamiento Matemático",
        description: "Razonamiento lógico, resolución de problemas y aplicación de conceptos matemáticos"
      },
      {
        title: "Ciencias y Método Científico",
        description: "Exploración científica, experimentación e investigación guiada"
      },
      {
        title: "Desarrollo Socioemocional",
        description: "Fortalecemos valores, trabajo en equipo y resolución de conflictos"
      },
      {
        title: "Habilidades STEM",
        description: "Integración de ciencia, tecnología, ingeniería y matemáticas"
      },
      {
        title: "Educación Artística y Cultural",
        description: "Expresión creativa, apreciación artística y consciencia cultural"
      },
    ],
    outcomes: [
      "Dominio de competencias académicas fundamentales",
      "Bilingüismo funcional en español e inglés",
      "Pensamiento crítico y habilidades de investigación",
      "Trabajo en equipo y liderazgo",
      "Bases sólidas en STEM (ciencia, tecnología, ingeniería, matemáticas)",
    ],
    testimonial: {
      text: "El nivel académico es excelente. Mi hijo no solo ha mejorado en todas las materias, sino que también ha desarrollado una mentalidad de crecimiento. Los maestros realmente se preocupan por cada alumno y adaptan la enseñanza a sus necesidades.",
      author: "Carlos Ramírez",
      role: "Padre de alumno de 4° grado",
    },
  },
  secundaria: {
    promise: "Preparando Líderes para el Mañana",
    promiseDescription: "En secundaria, desafiamos a nuestros estudiantes a alcanzar su máximo potencial académico y personal, preparándolos para destacar en preparatoria y más allá.",
    developmentalAreas: [
      {
        title: "Excelencia Académica",
        description: "Dominio de matemáticas avanzadas, ciencias (biología, física, química) y análisis literario"
      },
      {
        title: "Bilingüismo Avanzado",
        description: "Competencia profesional en español e inglés con enfoque en comunicación académica"
      },
      {
        title: "Pensamiento Crítico e Investigación",
        description: "Metodología de investigación, análisis crítico y argumentación fundamentada"
      },
      {
        title: "Desarrollo de Liderazgo",
        description: "Habilidades de liderazgo, trabajo en equipo y responsabilidad social"
      },
      {
        title: "Orientación Vocacional",
        description: "Exploración de intereses profesionales y preparación para la siguiente etapa educativa"
      },
      {
        title: "Madurez Socioemocional",
        description: "Inteligencia emocional, toma de decisiones y ética personal"
      },
    ],
    outcomes: [
      "Preparación académica excepcional para preparatoria",
      "Desarrollo de liderazgo y responsabilidad social",
      "Habilidades de investigación y presentación avanzadas",
      "Orientación vocacional y planificación de carrera",
      "Pensamiento independiente y madurez emocional",
    ],
    testimonial: {
      text: "La secundaria en Vigotsky no solo preparó a mi hija académicamente, sino que también la ayudó a descubrir sus pasiones y fortalezas. Los maestros son mentores que realmente invierten en el éxito de cada estudiante. Ahora está en preparatoria y sobresale en todo.",
      author: "Patricia Morales",
      role: "Madre de exalumna de 3° de Secundaria",
    },
  },
};

export default function NivelContent({ nivel }: NivelContentProps) {
  const data = nivelData[nivel.slug];

  // Use Strapi image if available, otherwise fall back to local
  const heroImage =
    (nivel.image?.url ? getStrapiMedia(nivel.image.url) : null) ||
    fallbackHeroImages[nivel.slug] ||
    defaultFallbackImage;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt={`Hero background ${nivel.title}`}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 w-full">
          <div className="max-w-3xl" data-reveal="fade">
            <p className="text-green-200 text-sm md:text-base font-semibold tracking-wider mb-4 uppercase">
              {nivel.ageRange}
            </p>
            <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              {nivel.title}
            </h1>
            <p className="text-white/90 text-lg md:text-xl leading-relaxed mb-8">
              {nivel.description}
            </p>
            <div className="flex flex-wrap gap-4" data-reveal="item" style={{ "--reveal-delay": "120ms" } as CSSProperties}>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 bg-white text-green-700 px-8 py-4 rounded-full font-bold hover:bg-green-50 transition text-lg shadow-lg"
              >
                AGENDAR VISITA <FaArrowRight />
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition text-lg"
              >
                MÁS INFORMACIÓN
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Promise Section */}
      {data && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <FaHeart className="text-green-600 text-5xl mx-auto mb-6" data-reveal="scale" />
              <div data-reveal="fade">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                {data.promise}
              </h2>
              <div className="w-24 h-1.5 bg-green-600 mx-auto mb-6"></div>
              <p className="text-xl text-slate-700 leading-relaxed">
                {data.promiseDescription}
              </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Developmental Areas */}
      {data && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12" data-reveal="fade">
              <FaGraduationCap className="text-green-600 text-5xl mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Áreas de Desarrollo
              </h2>
              <div className="w-24 h-1.5 bg-green-600 mx-auto mb-6"></div>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Las habilidades y competencias que su hijo desarrollará en {nivel.title}
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {data.developmentalAreas.map((area, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 border-l-4 border-green-600 pl-6 py-2"
                    data-reveal="item"
                    style={{ "--reveal-delay": `${Math.min(index * 60, 240)}ms` } as CSSProperties}
                  >
                    <div className="flex-1">
                      <h3 className="text-slate-900 font-bold text-xl mb-2">{area.title}</h3>
                      <p className="text-slate-600 text-base leading-relaxed">{area.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Masonry Gallery — Strapi gallery field first, static fallback if empty */}
      <MasonryGallery
        images={
          nivel.gallery && nivel.gallery.length > 0
            ? nivel.gallery.map((img) => getStrapiMedia(img.url) || img.url)
            : fallbackGalleries[nivel.slug] || []
        }
        nivel={nivel.title}
      />

      {/* Learning Outcomes */}
      {data && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
              {/* Left side - Large Icon */}
              <div className="flex-shrink-0" data-reveal="slide-right">
                <div className="w-64 h-64 lg:w-80 lg:h-80 bg-gradient-to-br from-green-600 to-green-800 rounded-3xl flex items-center justify-center shadow-2xl">
                  <FaGraduationCap className="text-white text-8xl lg:text-9xl" />
                </div>
              </div>

              {/* Right side - Content */}
              <div className="flex-1" data-reveal="slide-left">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                  Lo Que Su Hijo Logrará
                </h2>
                <div className="w-24 h-1.5 bg-green-600 mb-6"></div>
                <p className="text-xl text-slate-600 mb-8">
                  Resultados medibles y transformadores
                </p>

                <div className="space-y-5">
                  {data.outcomes.map((outcome, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4"
                      data-reveal="item"
                      style={{ "--reveal-delay": `${Math.min(index * 60, 240)}ms` } as CSSProperties}
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <FaCheck className="text-white text-sm" />
                      </div>
                      <p className="text-slate-700 text-lg leading-relaxed pt-1">{outcome}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonial */}
      {data && (
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-3xl p-8 md:p-12 text-white" data-reveal="scale">
              <div className="text-6xl mb-6 opacity-50">&quot;</div>
              <p className="text-xl md:text-2xl leading-relaxed mb-8 italic">
                {data.testimonial.text}
              </p>
              <div className="border-t border-white/20 pt-6">
                <p className="font-bold text-lg">{data.testimonial.author}</p>
                <p className="text-green-200">{data.testimonial.role}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center" data-reveal="fade">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Dé el Primer Paso Hoy
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Agende una visita personalizada y conozca por qué las familias confían en Vigotsky Reynosa para la educación de sus hijos.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-full font-bold hover:bg-green-700 transition text-lg shadow-lg"
            >
              AGENDAR VISITA AHORA <FaArrowRight />
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition text-lg"
            >
              SOLICITAR INFORMACIÓN
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
