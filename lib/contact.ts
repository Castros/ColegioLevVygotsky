/**
 * Contact Information utilities
 * Fetches from Strapi with fallback to defaults
 */

import { getContactPage } from './strapi';
import { siteConfig } from './site-config';
import type { ContactPage } from './types';

export interface ContactInfo {
  phone: {
    display: string;
    link: string;
  };
  email: {
    display: string;
    link: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    fullAddress: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
  maps: {
    embedUrl: string;
  };
  hours?: string;
}

/**
 * Get contact information from Strapi or fallback to defaults
 * This is called at build time for static generation
 */
export async function getContactInfo(): Promise<ContactInfo> {
  try {
    const contactPage = await getContactPage();

    if (contactPage) {
      // Parse phone to create tel: link (remove spaces and hyphens)
      const phoneLink = contactPage.phone
        ? `tel:${contactPage.phone.replace(/[\s-]/g, '')}`
        : siteConfig.contact.phone.link;

      // Parse email to create mailto: link
      const emailLink = contactPage.email
        ? `mailto:${contactPage.email}`
        : siteConfig.contact.email.link;

      return {
        phone: {
          display: contactPage.phone || siteConfig.contact.phone.display,
          link: phoneLink,
        },
        email: {
          display: contactPage.email || siteConfig.contact.email.display,
          link: emailLink,
        },
        address: {
          street: contactPage.address || siteConfig.contact.address.street,
          city: siteConfig.contact.address.city,
          state: siteConfig.contact.address.state,
          country: siteConfig.contact.address.country,
          fullAddress: contactPage.address || siteConfig.contact.address.fullAddress,
        },
        social: {
          facebook: contactPage.facebook || siteConfig.social.facebook,
          instagram: contactPage.instagram || siteConfig.social.instagram,
          whatsapp: contactPage.whatsapp,
        },
        maps: {
          embedUrl: contactPage.mapUrl || siteConfig.maps.embedUrl,
        },
        hours: contactPage.hours,
      };
    }
  } catch (error) {
    console.warn('Failed to fetch contact info from Strapi, using defaults:', error);
  }

  // Fallback to site config defaults
  return {
    phone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: siteConfig.contact.address,
    social: siteConfig.social,
    maps: siteConfig.maps,
  };
}
