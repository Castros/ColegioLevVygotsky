import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="bg-green-700 rounded-3xl px-8 py-16 text-center">
          <p className="text-white/90 text-sm font-semibold uppercase tracking-wider mb-4">
            ÚNETE A NUESTRA COMUNIDAD
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-4xl mx-auto">
            Inscribe a Tu Hijo en un Futuro Brillante Hoy
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Vive un modelo educativo progresivo que empodera y fomenta el crecimiento de cada estudiante.
          </p>
          <Link
            href="/contacto"
            className="inline-block bg-white text-green-700 hover:bg-slate-100 font-bold px-10 py-4 rounded-full transition-colors text-lg uppercase tracking-wide shadow-lg"
          >
            INSCRÍBETE AHORA
          </Link>
        </div>
      </div>
    </section>
  );
}
