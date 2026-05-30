"use client";
import { useMemo } from "react";
import Image from "next/image";

interface MasonryGalleryProps {
  images: string[];
  nivel: string;
}

export default function MasonryGallery({ images, nivel }: MasonryGalleryProps) {
  const shuffledImages = useMemo(
    () =>
      [...images].sort((a, b) => {
        const hash = (value: string) =>
          [...value].reduce((total, char) => total + char.charCodeAt(0), 0);

        return hash(a) - hash(b);
      }),
    [images]
  );

  if (shuffledImages.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white" data-reveal="fade">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Nuestra Comunidad en Acción
          </h2>
          <div className="w-24 h-1.5 bg-green-600 mx-auto mb-6"></div>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Vea momentos reales de aprendizaje, diversión y crecimiento en {nivel}
          </p>
        </div>

        {/* 3x3 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shuffledImages.slice(0, 9).map((image, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={image}
                  alt={`Foto de estudiantes en ${nivel}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              </div>
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-green-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-white font-semibold text-sm md:text-base">
                  {nivel}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
