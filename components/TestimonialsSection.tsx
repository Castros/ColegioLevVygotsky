"use client";
import { useEffect, useRef } from "react";
import { FaStar } from "react-icons/fa";
import { TestimonialExtended } from "@/lib/types";

interface TestimonialsSectionProps {
  testimonials: TestimonialExtended[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fallback data in case no testimonials provided
  const fallbackTestimonials = [
    {
      id: 1,
      name: "María González",
      role: "Madre de Estudiante",
      rating: 5,
      text: "Vigotsky Reynosa ha transformado la educación de mi hijo. Los maestros son dedicados y el ambiente es perfecto para el aprendizaje.",
      message: "",
      order: 1,
      created_at: "",
      updated_at: "",
      published_at: ""
    },
    {
      id: 2,
      name: "Carlos Ramírez",
      role: "Padre de Estudiante",
      rating: 5,
      text: "Excelente institución educativa. Mi hija ha desarrollado habilidades académicas y sociales excepcionales gracias al equipo de Vigotsky.",
      message: "",
      order: 2,
      created_at: "",
      updated_at: "",
      published_at: ""
    },
    {
      id: 3,
      name: "Ana López",
      role: "Madre de Estudiante",
      rating: 5,
      text: "La mejor decisión que tomamos fue inscribir a nuestros hijos aquí. El enfoque integral y personalizado hace la diferencia.",
      message: "",
      order: 3,
      created_at: "",
      updated_at: "",
      published_at: ""
    },
    {
      id: 4,
      name: "Roberto Silva",
      role: "Padre de Estudiante",
      rating: 5,
      text: "Los programas extracurriculares son increíbles. Mi hijo está más motivado que nunca y realmente disfruta ir a la escuela.",
      message: "",
      order: 4,
      created_at: "",
      updated_at: "",
      published_at: ""
    },
    {
      id: 5,
      name: "Patricia Morales",
      role: "Madre de Estudiante",
      rating: 5,
      text: "El nivel académico es excelente y los valores que inculcan son fundamentales para el desarrollo de nuestros hijos.",
      message: "",
      order: 5,
      created_at: "",
      updated_at: "",
      published_at: ""
    }
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : fallbackTestimonials;

  // Duplicate testimonials for seamless loop
  const duplicatedTestimonials = [...displayTestimonials, ...displayTestimonials];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number | null = null;
    let scrollPosition = 0;
    let isPointerPaused = false;
    let isFocusPaused = false;
    let isVisible = false;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const canScroll = () =>
      isVisible && !isPointerPaused && !isFocusPaused && !motionQuery.matches;

    const scroll = () => {
      if (!canScroll()) {
        animationId = null;
        return;
      }

      scrollPosition += 1;

      // Reset scroll position when reaching halfway (creates seamless loop)
      const maxScroll = scrollContainer.scrollWidth / 2;
      if (scrollPosition >= maxScroll) {
        scrollPosition = 0;
      }

      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(scroll);
    };

    const startScroll = () => {
      if (animationId === null && canScroll()) {
        animationId = requestAnimationFrame(scroll);
      }
    };

    const stopScroll = () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    };

    const handleMouseEnter = () => {
      isPointerPaused = true;
      stopScroll();
    };

    const handleMouseLeave = () => {
      isPointerPaused = false;
      startScroll();
    };

    const handleFocusIn = () => {
      isFocusPaused = true;
      stopScroll();
    };

    const handleFocusOut = () => {
      isFocusPaused = false;
      startScroll();
    };

    const handleMotionChange = () => {
      if (!motionQuery.matches) {
        startScroll();
      } else {
        stopScroll();
      }
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startScroll();
        } else {
          stopScroll();
        }
      },
      { threshold: 0.1 }
    );

    visibilityObserver.observe(scrollContainer);

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);
    scrollContainer.addEventListener('focusin', handleFocusIn);
    scrollContainer.addEventListener('focusout', handleFocusOut);
    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      stopScroll();
      visibilityObserver.disconnect();
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      scrollContainer.removeEventListener('focusin', handleFocusIn);
      scrollContainer.removeEventListener('focusout', handleFocusOut);
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-12" data-reveal="fade">
        {/* Header */}
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4">
            OPINIONES DE PADRES
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Lo Que Dicen Nuestros Padres
          </h2>
          <div className="w-16 h-1 bg-green-600 mx-auto"></div>
        </div>
      </div>

      {/* Auto-scrolling testimonials */}
      <div
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto md:overflow-x-hidden px-4 focus-within:overflow-x-auto"
        style={{ scrollBehavior: 'auto' }}
      >
        {duplicatedTestimonials.map((testimonial, index) => {
          // Alternate between different card sizes and heights
          const isLarge = index % 3 === 0;
          const isMedium = index % 3 === 1;

          return (
            <div
              key={index}
              className={`flex-shrink-0 bg-gradient-to-br from-white to-slate-50 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 border border-slate-100 flex flex-col justify-center p-8 md:p-10 ${
                isLarge ? 'w-[350px] md:w-[420px] min-h-[350px] md:min-h-[320px]' :
                isMedium ? 'w-[320px] md:w-[380px] min-h-[360px] md:min-h-[340px]' :
                'w-[300px] md:w-[360px] min-h-[355px] md:min-h-[330px]'
              }`}
              style={{
                borderRadius: '50%'
              }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4 justify-center">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 w-4 h-4 md:w-5 md:h-5" />
                ))}
              </div>

              {/* Text */}
              <p className="text-slate-700 text-sm md:text-base leading-relaxed italic text-center mb-6 line-clamp-4">
                &quot;{testimonial.text || testimonial.message}&quot;
              </p>

              {/* Author */}
              <div className="border-t border-slate-200 pt-4 text-center">
                <p className="font-bold text-slate-900 text-base md:text-lg">
                  {testimonial.name}
                </p>
                <p className="text-slate-600 text-xs md:text-sm">
                  {testimonial.role}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hint text */}
      <p className="text-center text-slate-500 text-sm mt-8">
        Pasa el cursor, enfoca o desplaza horizontalmente para revisar las opiniones
      </p>
    </section>
  );
}
