"use client";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Background Image */}
        <Image
          src="/images/colored-pencils-on-beige-surface.jpeg"
          alt="Educational background"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-left">
            {/* Small heading */}
            <p className="text-white text-sm md:text-base font-medium tracking-wider mb-4 uppercase">
              INSPIRANDO MENTES JÓVENES
            </p>

            {/* Main Heading */}
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Un Camino de Aprendizaje y Éxito Comienza Aquí
            </h1>

            {/* Description */}
            <p className="text-white/90 text-base md:text-lg mb-8 max-w-xl">
              Empoderando a los estudiantes con una educación integral para el éxito duradero y el crecimiento personal en un ambiente de cuidado y apoyo.
            </p>

            {/* CTA Button */}
            <Link
              href="/contacto"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded transition-colors"
            >
              INSCRÍBETE AHORA
            </Link>
          </div>

          {/* Right Column - Arched Rectangle Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-[350px] h-[450px] lg:w-[400px] lg:h-[500px]">
              {/* Arched rectangle image container */}
              <div className="absolute inset-0 rounded-t-full overflow-hidden border-8 border-white/10 shadow-2xl">
                <Image
                  src="/images/girl-learning.jpg"
                  alt="Estudiante aprendiendo"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section - Below Hero Content */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-8 mt-16 max-w-xl">
          <div>
            <div className="text-white text-4xl md:text-5xl font-bold mb-2">10+</div>
            <div className="text-white/80 text-sm md:text-base">Año de Experiencia</div>
          </div>
          <div>
            <div className="text-white text-4xl md:text-5xl font-bold mb-2">300+</div>
            <div className="text-white/80 text-sm md:text-base">Familias</div>
          </div>
        </div>
      </div>
    </section>
  );
}
