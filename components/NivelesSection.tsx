"use client";
import Link from "next/link";
import Image from "next/image";
import { niveles } from "@/data/niveles";

export default function NivelesSection() {
  const nivelImages = [
    "/images/kinder-students.jpg", // Kinder
    "/images/primaria-students.jpg", // Primaria
    "/images/secundaria-students.jpg", // Secundaria
  ];

  return (
    <section className="py-20 bg-white" id="niveles">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-slate-900">
          Nuestros Niveles Educativos
        </h2>
        <div className="w-16 h-1 bg-green-600 mx-auto mb-12"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {niveles.map((nivel, index) => {
            return (
              <Link
                key={nivel.id}
                href={`/niveles/${nivel.id}`}
                className="relative group flex flex-col items-center"
              >
                {/* Circular Card */}
                <div className="w-64 h-64 rounded-full overflow-hidden relative shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={nivelImages[index] || "/images/placeholder.jpg"}
                      alt={nivel.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Default Overlay - Shows Nivel Name */}
                  <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 via-green-900/40 to-transparent flex items-end justify-center pb-8 group-hover:opacity-0 transition-opacity duration-300">
                    <div className="text-center px-4">
                      <h3 className="text-2xl font-bold text-white">{nivel.name}</h3>
                      <p className="text-white/90 text-sm mt-1">{nivel.ageRange}</p>
                    </div>
                  </div>

                  {/* Hover Overlay - Shows Description */}
                  <div className="absolute inset-0 bg-green-700/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-white mb-2">{nivel.name}</h3>
                      <p className="text-sm text-white/90 mb-2">{nivel.grades}</p>
                      <p className="text-xs text-white/80 line-clamp-4">{nivel.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
