/**
 * Site-wide configuration
 * Single source of truth for contact information and site settings
 *
 * This file is auto-generated from Strapi before build.
 * To update contact info, edit in Strapi CMS or modify the fallback values in scripts/sync-contact-info.js
 */

export const siteConfig = {
  name: 'Colegio Lev Vygotsky',
  description: 'Educación de calidad en Reynosa, Tamaulipas',

  contact: {
    phone: {
      display: '+52 899 174-0031',
      link: 'tel:+528991740031',
    },
    email: {
      display: 'info@vigotskyreynosa.edu.mx',
      link: 'mailto:info@vigotskyreynosa.edu.mx',
    },
    address: {
      street: 'Calle Dirección',
      city: 'Reynosa',
      state: 'Tamaulipas',
      country: 'México',
      fullAddress: 'Reynosa, Tamaulipas, México',
    },
  },

  social: {
    facebook: 'https://www.facebook.com/profile.php?id=100063574022481',
    instagram: 'https://www.instagram.com/colegiolevvygotsky1/',
    whatsapp: undefined,
  },

  maps: {
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1791.8592520102459!2d-98.36072362627539!3d26.075454551296275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8665058add1dfced%3A0x8d748b063e65e551!2sColegio%20Lev%20Vygotsky!5e0!3m2!1sen!2smx!4v1763515642391!5m2!1sen!2smx',
  },
} as const;
