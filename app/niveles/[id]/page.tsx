import { notFound } from "next/navigation";
import { getNivelById, niveles } from "@/data/niveles";
import { getEducationLevels, getEducationLevelBySlug } from "@/lib/strapi";
import { EducationLevel } from "@/lib/types";
import NivelContent from "./NivelContent";

function nivelToEducationLevel(n: ReturnType<typeof getNivelById>): EducationLevel {
  if (!n) throw new Error("Nivel not found");
  return {
    id: 0,
    slug: n.id,
    title: n.name,
    description: n.description,
    ageRange: n.ageRange,
    features: n.features.map((text, i) => ({ id: i, text })),
    image: null as unknown as EducationLevel["image"],
    color: "",
    order: 0,
    created_at: "",
    updated_at: "",
    published_at: "",
  };
}

export async function generateStaticParams() {
  const strapiLevels: EducationLevel[] = await getEducationLevels();

  if (strapiLevels && strapiLevels.length > 0) {
    return strapiLevels.map((n) => ({ id: n.slug }));
  }

  // Fallback to static data
  return niveles.map((n) => ({ id: n.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const strapiNivel: EducationLevel | null = await getEducationLevelBySlug(id);
  if (strapiNivel) {
    return {
      title: `${strapiNivel.title} - Vigotsky Reynosa`,
      description: strapiNivel.description,
    };
  }

  // Fallback to static data
  const nivel = getNivelById(id);
  if (!nivel) {
    return { title: "Nivel no encontrado - Vigotsky Reynosa" };
  }
  return {
    title: `${nivel.name} - Vigotsky Reynosa`,
    description: nivel.description,
  };
}

export default async function NivelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const strapiNivel: EducationLevel | null = await getEducationLevelBySlug(id);
  if (strapiNivel) {
    return <NivelContent nivel={strapiNivel} />;
  }

  // Fallback to static data
  const staticNivel = getNivelById(id);
  if (!staticNivel) notFound();

  return <NivelContent nivel={nivelToEducationLevel(staticNivel)} />;
}
