import { notFound } from "next/navigation";
import { getNivelById, niveles } from "@/data/niveles";
import NivelContent from "./NivelContent";

export async function generateStaticParams() {
  return niveles.map((nivel) => ({
    id: nivel.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const nivel = getNivelById(id);

  if (!nivel) {
    return {
      title: "Nivel no encontrado - Vigotsky Reynosa",
    };
  }

  return {
    title: `${nivel.name} - Vigotsky Reynosa`,
    description: nivel.description,
  };
}

export default async function NivelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const nivel = getNivelById(id);

  if (!nivel) {
    notFound();
  }

  return <NivelContent nivel={nivel} />;
}
