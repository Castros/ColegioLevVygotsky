import Link from "next/link";

export default function ServicesSection() {
  const services = [
    {
      number: "01.",
      title: "Plan de Estudios Integra",
      description: "Un plan educativo completo que fomenta el pensamiento crítico y la creatividad en los estudiantes.",
      link: "/servicios"
    },
    {
      number: "02.",
      title: "Actividades Extracurriculares",
      description: "Una variedad de clubes y clases diseñados para potenciar las habilidades e intereses de los estudiantes.",
      link: "/servicios"
    },
    {
      number: "03.",
      title: "Estancia",
      description: "Un ambiente seguro y estimulante para los niños fuera del horario escolar.",
      link: "/servicios"
    },
    {
      number: "04.",
      title: "Métodos de Enseñanza Progresivos",
      description: "Estrategias innovadoras de enseñanza para potenciar la participación y el aprendizaje de los estudiantes.",
      link: "/servicios"
    }
  ];

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
            {services.map((service, index) => (
              <div key={index} className="space-y-3">
                <div className="text-3xl font-bold text-green-600">
                  {service.number}
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {service.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {service.description}
                </p>
                <Link
                  href={service.link}
                  className="inline-block text-green-600 hover:text-green-700 font-semibold text-sm uppercase tracking-wide transition-colors"
                >
                  LEARN MORE
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
