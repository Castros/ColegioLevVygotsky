import { Metadata } from "next";
import { FaPhone, FaEnvelope, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
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
    <div className="relative min-h-screen bg-white">
      {/* Gradient Background */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-green-100/30 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
        {/* Header */}
        <header className="text-center mb-12 lg:mb-16">
          <p className="text-green-600 font-medium mb-2">Contáctanos</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900">
            Estamos Aquí Para Ti
          </h1>
          <p className="max-w-2xl mx-auto mt-4 text-slate-600">
            ¿Tienes preguntas o comentarios? No dudes en contactarnos usando el formulario a continuación o a través de nuestros datos de contacto.
          </p>
        </header>

        {/* Main Content Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 mb-16 lg:mb-24">
          {/* Contact Form - Left Side (3/5) */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

          {/* Contact Info - Right Side (2/5) */}
          <div className="lg:col-span-2">
            <div className="bg-slate-50 p-6 rounded-2xl shadow-sm lg:mt-16">
              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FaPhone className="text-slate-700 text-xl" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-slate-900">Teléfono</h3>
                    <a href="tel:+528991740031" className="text-slate-600 hover:text-green-600 mt-1 block">
                      +52 899 174 0031
                    </a>
                  </div>
                </div>

                <hr className="border-slate-200" />

                {/* Email */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FaEnvelope className="text-green-600 text-xl" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-green-600">Email</h3>
                    <a href="mailto:info@vigotskyreynosa.edu.mx" className="text-green-600 hover:text-green-700 mt-1 block">
                      info@vigotskyreynosa.edu.mx
                    </a>
                  </div>
                </div>

                <hr className="border-slate-200" />

                {/* Social Media */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-slate-900">Redes Sociales</h3>
                    <div className="mt-3 flex items-center space-x-3">
                      <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-green-600 hover:text-green-600 transition-colors"
                      >
                        <FaFacebook className="text-sm" />
                      </a>
                      <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-green-600 hover:text-green-600 transition-colors"
                      >
                        <FaInstagram className="text-sm" />
                      </a>
                      <a
                        href="https://youtube.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-green-600 hover:text-green-600 transition-colors"
                      >
                        <FaYoutube className="text-sm" />
                      </a>
                      <a
                        href="https://tiktok.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full border border-green-600 flex items-center justify-center text-green-600 hover:bg-green-50 transition-colors"
                      >
                        <FaTiktok className="text-sm" />
                      </a>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-200" />

                {/* Hours */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-slate-900">Horario de Atención</h3>
                    <div className="mt-2 space-y-1 text-slate-600">
                      <p>Lunes - Viernes: 8:30 AM - 5:00 PM</p>
                      <p>Sábado: Cerrado</p>
                      <p>Domingo: Cerrado</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Map Section - Inside Container */}
        <section className="mb-16">
          <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg">
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
        </section>
      </div>
    </div>
  );
}
