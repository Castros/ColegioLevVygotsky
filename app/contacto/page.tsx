import { Metadata } from "next";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contáctanos para más información sobre inscripciones, horarios y programas educativos en Vigotsky Reynosa.",
  openGraph: {
    title: "Contacto - Vigotsky Reynosa",
    description: "Contáctanos para más información sobre nuestros programas educativos",
  },
};

export default function ContactPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-500" />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 w-full text-center">
          <p className="text-white text-sm md:text-base font-medium tracking-wider mb-4 uppercase">
            ESTAMOS AQUÍ PARA TI
          </p>
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Contáctanos
          </h1>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Phone */}
            <div className="text-center p-8 bg-slate-50 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPhone className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Teléfono</h3>
              <a href="tel:+525589174-0031" className="text-slate-600 hover:text-green-600 transition-colors">
                +52 558 917 4-0031
              </a>
            </div>

            {/* Email */}
            <div className="text-center p-8 bg-slate-50 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaEnvelope className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Email</h3>
              <a href="mailto:info@vigotskyreynosa.edu.mx" className="text-slate-600 hover:text-green-600 transition-colors">
                info@vigotskyreynosa.edu.mx
              </a>
            </div>

            {/* Address */}
            <div className="text-center p-8 bg-slate-50 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMapMarkerAlt className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Ubicación</h3>
              <p className="text-slate-600">
                Reynosa, Tamaulipas<br />México
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <ContactForm />

            {/* Map */}
            <div>
              <div className="mb-8">
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4">
                  ENCUÉNTRANOS
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Nuestra Ubicación
                </h2>
                <div className="w-16 h-1 bg-green-600"></div>
              </div>

              {/* Google Maps */}
              <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1791.8592520102459!2d-98.36072362627539!3d26.075454551296275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8665058add1dfced%3A0x8d748b063e65e551!2sColegio%20Lev%20Vygotsky!5e0!3m2!1sen!2smx!4v1763515642391!5m2!1sen!2smx"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de Colegio Lev Vygotsky"
                />
              </div>

              {/* Opening Hours */}
              <div className="mt-8 bg-white p-6 rounded-2xl shadow-md">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Horario de Atención</h3>
                <div className="space-y-2 text-slate-600">
                  <div className="flex justify-between">
                    <span className="font-semibold">Lunes - Viernes:</span>
                    <span>7:00 AM - 3:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Sábado:</span>
                    <span>Cerrado</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Domingo:</span>
                    <span>Cerrado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
