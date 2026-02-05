import React from 'react';
import { Instagram, Facebook, Phone } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="bg-green-800 text-white py-2 px-4">
      <div className="container mx-auto flex justify-between items-center text-sm">
        {/* Phone Number */}
        <a
          href="tel:+5289174-0031"
          className="flex items-center gap-2 hover:text-green-200 transition-colors"
        >
          <Phone size={16} />
          <span>+52 899 174-0031</span>
        </a>

        {/* Social Media Links */}
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">Signos en nuestro redes</span>
          <div className="flex gap-3">
            <a
              href="https://www.instagram.com/colegiolevvygotsky1/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-200 transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100063574022481"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-200 transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={18} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
