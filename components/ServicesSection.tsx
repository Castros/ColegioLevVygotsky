import Link from "next/link";
import { getServices } from "@/lib/strapi";
import { Service } from "@/lib/types";

export default async function ServicesSection() {
  // Fetch services from Strapi
  const services: Service[] = await getServices();

  // Fallback data in case Strapi fails (Strapi is working, so this is rarely used)
  const fallbackServices: Service[] = [];

  // Use Strapi data if available, otherwise use fallback
  const displayServices = services.length > 0 ? services : fallbackServices;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Header */}
          <div>
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4">
              NUESTRA OFERTA EDUCATIVA
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Programas Integrales para Cada Estudiante
            </h2>
            <div className="w-16 h-1 bg-green-600 mb-6"></div>
            <p className="text-slate-600 leading-relaxed">
              Desde cuidado después de clases hasta actividades extracurriculares, atendemos diversos estilos de aprendizaje e intereses personales de cada niño.
            </p>
          </div>

          {/* Right Column - Services Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {displayServices.map((service, index) => (
              <div key={service.id || index} className="space-y-3">
                <div className="text-3xl font-bold text-green-600">
                  {service.number}
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {service.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {service.shortDescription}
                </p>
                <Link
                  href="/servicios"
                  className="inline-block text-green-600 hover:text-green-700 font-semibold text-sm uppercase tracking-wide transition-colors"
                >
                  VER MÁS
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
