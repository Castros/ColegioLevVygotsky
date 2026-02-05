import HeroStrapi from "@/components/HeroStrapi";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import NivelesSection from "@/components/NivelesSection";
import CTASection from "@/components/CTASection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ValuePropositionSection from "@/components/ValuePropositionSection";
import { getTestimonials } from "@/lib/strapi";

export default async function Home() {
  // Fetch testimonials from Strapi
  const testimonials = await getTestimonials();

  return (
    <div>
      <HeroStrapi />
      <ServicesSection />
      <AboutSection />
      <NivelesSection />
      <ValuePropositionSection />
      <TestimonialsSection testimonials={testimonials} />
      <CTASection />
    </div>
  );
}
