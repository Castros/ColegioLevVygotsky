"use client";
import { navLinks } from "@/lib/data";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const quickLinks = [
    { name: "Inicio", href: "/" },
    { name: "Acerca de", href: "/acerca" },
    { name: "Servicios", href: "/servicios" },
    { name: "Blog", href: "/blog" },
    { name: "Contacto", href: "/contacto" },
  ];

  const levels = [
    { name: "Preescolar", href: "/servicios/preescolar" },
    { name: "Primaria", href: "/servicios/primaria" },
    { name: "Secundaria", href: "/servicios/secundaria" },
    { name: "Bolsa de Trabajo", href: "/bolsa-de-trabajo" },
  ];

  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-16 grid gap-10 md:grid-cols-4">
        {/* Brand */}
        <div>
          <Image
            src="/images/navbar-logo.png"
            alt="Vigotsky Reynosa"
            width={180}
            height={60}
            className="h-16 w-auto mb-4"
            unoptimized
          />
          <p className="text-slate-400 text-sm leading-relaxed">
            Inspirando mentes jóvenes con educación de excelencia desde kinder hasta preparatoria en Reynosa, México.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-lg">
            Enlaces Rápidos
          </h4>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-slate-400 hover:text-green-400 transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Niveles Educativos */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-lg">
            Niveles Educativos
          </h4>
          <ul className="space-y-2 text-sm">
            {levels.map((level) => (
              <li key={level.href}>
                <Link
                  href={level.href}
                  className="text-slate-400 hover:text-green-400 transition-colors"
                >
                  {level.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-lg">
            Contacto
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="tel:+525589174-0031"
                className="flex items-center gap-3 text-slate-400 hover:text-green-400 transition-colors"
              >
                <FaPhone className="shrink-0" /> 55 89 9174-0031
              </a>
            </li>
            <li>
              <a
                href="mailto:contact@vigotskyreynosa.edu.mx"
                className="flex items-center gap-3 text-slate-400 hover:text-green-400 transition-colors"
              >
                <FaEnvelope className="shrink-0" /> contact@vigotskyreynosa.edu.mx
              </a>
            </li>
            <li className="flex items-start gap-3 text-slate-400">
              <FaMapMarkerAlt className="shrink-0 mt-1" />
              <span>Reynosa, México</span>
            </li>
          </ul>

          {/* Social Media */}
          <div className="mt-6 flex items-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-slate-400 hover:text-green-400 transition-colors"
            >
              <FaInstagram className="h-5 w-5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-slate-400 hover:text-green-400 transition-colors"
            >
              <FaFacebook className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-slate-400 hover:text-green-400 transition-colors"
            >
              <FaTwitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <p>
              © {new Date().getFullYear()} Vigotsky Reynosa. Todos los derechos reservados.
            </p>
            <p className="flex items-center gap-2">
              Creado con{" "}
              <span className="text-red-500">❤️</span>
              {" "}por{" "}
              <a
                href="https://fransolution.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 font-semibold transition-colors"
              >
                Fransolutions
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
