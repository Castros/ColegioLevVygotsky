import HeroStrapi from "@/components/HeroStrapi";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import NivelesSection from "@/components/NivelesSection";
import CTASection from "@/components/CTASection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ValuePropositionSection from "@/components/ValuePropositionSection";

export default function Home() {
  return (
    <div>
      <HeroStrapi />
      <ServicesSection />
      <AboutSection />
      <NivelesSection />
      <ValuePropositionSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
