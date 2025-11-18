"use client";
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaArrowRight, FaChevronDown } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { navLinks } from "@/lib/data";
import { niveles } from "@/data/niveles";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [nivelesOpen, setNivelesOpen] = useState(false);

  // Close mobile menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (open) {
        setOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [open]);

  return (
    <header className="sticky top-0 z-[100] bg-white border-b border-slate-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between relative">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/navbar-logo.png"
            alt="Vigotsky Reynosa"
            width={180}
            height={60}
            className="h-16 w-auto"
            priority
            unoptimized
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 justify-center gap-8 items-center">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-md font-semibold text-slate-700 hover:text-green-700 transition"
            >
              {l.label}
            </Link>
          ))}

          {/* Niveles Dropdown */}
          <div className="relative group">
            <button className="text-md font-semibold text-slate-700 hover:text-green-700 transition flex items-center gap-1">
              Niveles
              <FaChevronDown className="w-3 h-3" />
            </button>
            <div className="absolute left-0 mt-2 w-56 bg-white shadow-xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border-t-4 border-green-600">
              {niveles.map((nivel, index) => (
                <Link
                  key={nivel.id}
                  href={`/niveles/${nivel.id}`}
                  className={`block px-4 py-3 hover:bg-green-50 hover:text-green-700 text-slate-700 transition font-medium ${index === 0 ? 'rounded-t-lg' : ''} ${index === niveles.length - 1 ? 'rounded-b-lg' : ''}`}
                >
                  {nivel.name}
                  <span className="block text-xs text-slate-500">{nivel.ageRange}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold bg-green-700 text-white hover:bg-green-800 shadow-lg hover:shadow-xl transition-all"
          >
            INSCRÍBETE AHORA <FaArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="p-2 border-2 border-green-700 rounded-lg text-green-700 hover:bg-green-50 transition"
          >
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`absolute left-0 right-0 top-full max-h-[70vh] bg-white border-t border-slate-200 z-50 flex flex-col shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${open ? 'opacity-100' : 'opacity-0 pointer-events-none max-h-0 border-t-0'}`}>
            {/* Links */}
            <div className="overflow-y-auto p-4 flex flex-col gap-4">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-base font-semibold text-slate-800 active:text-green-700 py-2 px-2 rounded-lg active:bg-green-50 transition"
                >
                  {l.label}
                </Link>
              ))}

              {/* Niveles Mobile Dropdown */}
              <div>
                <button
                  onClick={() => setNivelesOpen(!nivelesOpen)}
                  className="w-full flex items-center justify-between text-base font-semibold text-slate-800 py-2 px-2 rounded-lg active:bg-green-50 transition"
                >
                  Niveles
                  <FaChevronDown className={`w-3 h-3 transform transition ${nivelesOpen ? 'rotate-180' : ''}`} />
                </button>
                {nivelesOpen && (
                  <div className="ml-4 mt-2 space-y-2">
                    {niveles.map((nivel) => (
                      <Link
                        key={nivel.id}
                        href={`/niveles/${nivel.id}`}
                        onClick={() => setOpen(false)}
                        className="block py-2 px-3 text-sm text-slate-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition"
                      >
                        {nivel.name}
                        <span className="block text-xs text-slate-500">{nivel.ageRange}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* CTA at bottom */}
            <div className="p-4 border-t bg-white">
              <Link
                href="/contacto"
                onClick={() => setOpen(false)}
                className="w-full inline-flex items-center font-semibold justify-center gap-2 rounded-full px-4 py-3 text-base bg-green-700 text-white hover:bg-green-800 shadow-lg transition"
              >
                INSCRÍBETE AHORA <FaArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
      </div>
    </header>
  );
}
