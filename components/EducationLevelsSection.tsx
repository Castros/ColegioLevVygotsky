import { FaGraduationCap, FaBook, FaUsers } from "react-icons/fa";

export default function EducationLevelsSection() {
  const levels = [
    {
      icon: FaGraduationCap,
      title: "Kínder",
      ageRange: "3-6 años",
      description: "Desarrollo integral en los primeros años, fomentando la creatividad, habilidades sociales y fundamentos académicos en un ambiente seguro y estimulante.",
      highlights: [
        "Aprendizaje a través del juego",
        "Desarrollo socioemocional",
        "Introducción a la lectoescritura"
      ]
    },
    {
      icon: FaBook,
      title: "Primaria",
      ageRange: "6-12 años",
      description: "Educación primaria que construye bases sólidas en todas las áreas académicas, desarrollando pensamiento crítico y amor por el aprendizaje.",
      highlights: [
        "Programa académico integral",
        "Desarrollo de habilidades STEM",
        "Actividades extracurriculares"
      ]
    },
    {
      icon: FaUsers,
      title: "Secundaria",
      ageRange: "12-15 años",
      description: "Preparación para el futuro con un programa riguroso que desarrolla liderazgo, pensamiento independiente y excelencia académica.",
      highlights: [
        "Preparación para preparatoria",
        "Desarrollo de liderazgo",
        "Orientación vocacional"
      ]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4">
            NUESTROS NIVELES EDUCATIVOS
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Educación Integral de Kínder a Secundaria
          </h2>
          <div className="w-16 h-1 bg-green-600 mx-auto mb-6"></div>
          <p className="text-slate-600 max-w-3xl mx-auto">
            Acompañamos a nuestros estudiantes en cada etapa de su desarrollo educativo, desde los primeros pasos en kínder hasta la preparación para la preparatoria.
          </p>
        </div>

        {/* Levels Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {levels.map((level, index) => {
            const Icon = level.icon;
            return (
              <div
                key={index}
                className="bg-slate-50 rounded-2xl p-8 hover:shadow-xl transition-shadow border border-slate-100"
              >
                {/* Icon */}
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6">
                  <Icon className="text-white text-2xl" />
                </div>

                {/* Title & Age Range */}
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  {level.title}
                </h3>
                <p className="text-green-600 font-semibold mb-4">
                  {level.ageRange}
                </p>

                {/* Description */}
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {level.description}
                </p>

                {/* Highlights */}
                <div className="space-y-3">
                  {level.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-slate-700 text-sm">{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
