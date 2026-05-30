import Link from "next/link";
import Image from "next/image";
import { getAboutSection, getStrapiMedia } from "@/lib/strapi";
import { AboutSection as AboutSectionType } from "@/lib/types";

export default async function AboutSection() {
  // Fetch about section from Strapi
  const aboutData: AboutSectionType | null = await getAboutSection();

  // Fallback data
  const fallbackData = {
    badge: "DESCÚBRENOS",
    title: "Una Opción Confiable en Educación",
    description: "Fundado con la misión de cultivar mentes jóvenes, Vigotsky Reynosa ofrece un ambiente educativo integral de K-12 que promueve la excelencia académica y el desarrollo personal en Reynosa, México.",
    image: { url: "/images/kids-playing.png" },
    ctaText: "ACERCA DE",
    ctaLink: "/acerca"
  };

  const data = aboutData || fallbackData;
  const imageUrl = aboutData?.image ? getStrapiMedia(aboutData.image.url) : fallbackData.image.url;

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Circular Image */}
          <div className="flex justify-center lg:justify-start" data-reveal="slide-right">
            <div className="relative w-[400px] h-[400px] lg:w-[500px] lg:h-[500px]">
              <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl">
                <Image
                  src={imageUrl || fallbackData.image.url}
                  alt="Niños jugando y aprendiendo"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div data-reveal="slide-left">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4">
              {data.badge}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              {data.title}
            </h2>
            <div className="w-16 h-1 bg-green-600 mb-6"></div>
            <p className="text-slate-600 leading-relaxed mb-8">
              {data.description}
            </p>
            <Link
              href={data.ctaLink}
              className="inline-block border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold px-8 py-3 rounded-full transition-colors uppercase tracking-wide"
            >
              {data.ctaText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
