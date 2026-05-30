import Link from "next/link";
import { getCTASection } from "@/lib/strapi";
import { CTASection as CTASectionType } from "@/lib/types";

export default async function CTASection() {
  // Fetch CTA section from Strapi
  const ctaData: CTASectionType | null = await getCTASection();

  // Fallback data
  const fallbackData = {
    badge: "ÚNETE A NUESTRA COMUNIDAD",
    title: "Inscribe a Tu Hijo en un Futuro Brillante Hoy",
    description: "Vive un modelo educativo progresivo que empodera y fomenta el crecimiento de cada estudiante.",
    primaryButtonText: "INSCRÍBETE AHORA",
    primaryButtonLink: "/contacto",
    secondaryButtonText: undefined,
    secondaryButtonLink: undefined,
    backgroundColor: "#15803d"
  };

  const data = ctaData || fallbackData;

  return (
    <section className="py-20 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div
          className="rounded-3xl px-8 py-16 text-center"
          data-reveal="scale"
          style={{ backgroundColor: data.backgroundColor || fallbackData.backgroundColor }}
        >
          {data.badge && (
            <p className="text-white/90 text-sm font-semibold uppercase tracking-wider mb-4">
              {data.badge}
            </p>
          )}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-4xl mx-auto">
            {data.title}
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            {data.description}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href={data.primaryButtonLink}
              className="inline-block bg-white text-green-700 hover:bg-slate-100 font-bold px-10 py-4 rounded-full transition-colors text-lg uppercase tracking-wide shadow-lg"
            >
              {data.primaryButtonText}
            </Link>
            {data.secondaryButtonText && data.secondaryButtonLink && (
              <Link
                href={data.secondaryButtonLink}
                className="inline-block bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold px-10 py-4 rounded-full transition-colors text-lg uppercase tracking-wide"
              >
                {data.secondaryButtonText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
