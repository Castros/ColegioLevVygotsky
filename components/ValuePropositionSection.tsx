import { FaCheck } from "react-icons/fa";
import Image from "next/image";
import { getValuePropositions } from "@/lib/strapi";
import { ValueProposition } from "@/lib/types";

export default async function ValuePropositionSection() {
  // Fetch value propositions from Strapi
  const valueProps: ValueProposition[] = await getValuePropositions();

  // Fallback data
  const fallbackValues = [
    {
      title: "Enfoque Educativo Holístico",
      description: "Nos enfocamos en el desarrollo integral de los estudiantes, fomentando habilidades académicas, sociales y emocionales en un ambiente de cuidado y apoyo."
    },
    {
      title: "Personal Dedicado y Experimentado",
      description: "Nuestros maestros están comprometidos con el aprendizaje individualizado, asegurando que cada estudiante reciba atención y apoyo personalizados."
    },
    {
      title: "Actividades Extracurriculares Dinámicas",
      description: "Ofrecemos una amplia variedad de clases extracurriculares que enriquecen la experiencia de los estudiantes y fomentan intereses personales más allá de lo académico."
    }
  ];

  const values = valueProps.length > 0 ? valueProps : fallbackValues;

  return (
    <section className="relative w-full overflow-hidden bg-green-50">
      <div className="container mx-auto px-6 py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-sm font-semibold tracking-wider uppercase text-slate-600 mb-2">
                LO QUE NOS HACE ÚNICOS
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                Nuestra Propuesta de Valor Única
              </h2>
              <div className="w-20 h-1 bg-green-700 mt-4"></div>
            </div>

            <div className="space-y-8">
              {values.map((value, index) => (
                <div key={index}>
                  <div className="flex items-start gap-4">
                    <FaCheck className="text-green-700 mt-1 text-xl flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {value.title}
                      </h3>
                      <p className="mt-1 text-slate-700">
                        {value.description}
                      </p>
                    </div>
                  </div>
                  {index < values.length - 1 && (
                    <hr className="border-slate-200 mt-8" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative h-[500px] lg:h-[600px] flex items-center justify-center">
            <div className="relative w-[350px] h-full lg:w-[400px] rounded-t-full overflow-hidden shadow-2xl bg-white">
              <Image
                src="/images/boy-holiding-dinosaure.png"
                alt="Niño sonriente sosteniendo un recorte de dinosaurio"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
