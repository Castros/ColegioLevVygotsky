"use client";
import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    website: "", // Honeypot field
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Replace with your actual API endpoint after deployment
      const API_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_API_ENDPOINT ||
                          "https://YOUR_API_GATEWAY_URL/prod/contact";

      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus({
          type: "success",
          message: data.message || "¡Mensaje enviado exitosamente! Nos pondremos en contacto pronto.",
        });
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          website: "",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.message || "Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({
        type: "error",
        message: "Error de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4">
          ENVÍANOS UN MENSAJE
        </p>
        <div className="w-16 h-1 bg-green-600"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Honeypot field - hidden from users, bots will fill it */}
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={handleChange}
          style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Status messages */}
        {submitStatus.type && (
          <div
            className={`p-4 rounded-lg ${
              submitStatus.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {submitStatus.message}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
            Nombre Completo *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all placeholder:text-slate-300 text-slate-900"
            placeholder="Tu nombre completo"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all placeholder:text-slate-300 text-slate-900"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all placeholder:text-slate-300 text-slate-900"
              placeholder="+52 123 456 7890"
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-2">
            Asunto *
          </label>
          <select
            id="subject"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all text-slate-900"
          >
            <option value="">Selecciona un asunto</option>
            <option value="informacion-general">Información General</option>
            <option value="inscripciones">Inscripciones</option>
            <option value="visita">Agendar Visita</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
            Mensaje *
          </label>
          <textarea
            id="message"
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            rows={6}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all resize-none placeholder:text-slate-300 text-slate-900"
            placeholder="Cuéntanos cómo podemos ayudarte..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-lg transition-colors uppercase tracking-wide shadow-lg"
        >
          {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
        </button>
      </form>
    </div>
  );
}
