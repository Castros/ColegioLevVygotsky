import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import { getEducationLevels, getStrapiMedia } from "@/lib/strapi";
import { EducationLevel } from "@/lib/types";
import { niveles } from "@/data/niveles";

const fallbackImages: Record<string, string> = {
  "pre-kinder": "/images/hero-kinder-bg.png",
  kinder: "/images/kids-playing.png",
  primaria: "/images/kid-working.jpeg",
  secundaria: "/images/girl-learning.jpg",
};

const defaultFallbackImage = "/images/afuera-de-escuela.png";

export default async function NivelesSection() {
  const strapiLevels: EducationLevel[] = await getEducationLevels();

  const levels =
    strapiLevels && strapiLevels.length > 0
      ? strapiLevels.map((n) => ({
          slug: n.slug,
          title: n.title,
          ageRange: n.ageRange,
          description: n.description,
          imageUrl:
            getStrapiMedia(n.image?.url) ||
            fallbackImages[n.slug] ||
            defaultFallbackImage,
        }))
      : niveles.map((n, i) => ({
          slug: n.id,
          title: n.name,
          ageRange: n.ageRange,
          description: n.description,
          imageUrl:
            Object.values(fallbackImages)[i] || defaultFallbackImage,
        }));

  return (
    <section className="py-20 bg-white" id="niveles">
      <div className="max-w-7xl mx-auto px-4">
        <div data-reveal="fade">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-900">
            Nuestros Niveles Educativos
          </h2>
          <div className="w-16 h-1 bg-green-600 mx-auto mb-12"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {levels.map((nivel, index) => (
            <Link
              key={nivel.slug}
              href={`/niveles/${nivel.slug}`}
              className="relative group flex flex-col items-center"
              data-reveal="item"
              style={{ "--reveal-delay": `${Math.min(index * 60, 180)}ms` } as CSSProperties}
            >
              {/* Circular Card */}
              <div className="w-64 h-64 rounded-full overflow-hidden relative shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="absolute inset-0">
                  <Image
                    src={nivel.imageUrl}
                    alt={nivel.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* Default Overlay - Shows Nivel Name */}
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 via-green-900/40 to-transparent flex items-end justify-center pb-8 group-hover:opacity-0 transition-opacity duration-300">
                  <div className="text-center px-4">
                    <h3 className="text-2xl font-bold text-white">{nivel.title}</h3>
                    <p className="text-white/90 text-sm mt-1">{nivel.ageRange}</p>
                  </div>
                </div>

                {/* Hover Overlay - Shows Description */}
                <div className="absolute inset-0 bg-green-700/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">{nivel.title}</h3>
                    <p className="text-sm text-white/90 mb-2">{nivel.ageRange}</p>
                    <p className="text-xs text-white/80 line-clamp-4">{nivel.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
