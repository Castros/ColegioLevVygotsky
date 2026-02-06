import { siteConfig } from "@/lib/site-config";

export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": siteConfig.name,
    "alternateName": "Colegio Vigotsky Reynosa",
    "url": "https://vigotskyreynosa.edu.mx",
    "logo": "https://vigotskyreynosa.edu.mx/images/logo.png",
    "description": siteConfig.description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": siteConfig.contact.address.city,
      "addressRegion": siteConfig.contact.address.state,
      "addressCountry": "MX"
    },
    "telephone": siteConfig.contact.phone.display,
    "email": siteConfig.contact.email.display,
    "sameAs": [
      siteConfig.social.facebook,
      siteConfig.social.instagram
    ],
    "priceRange": "$$",
    "educationalCredentialAwarded": "High School Diploma",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Vigotsky Reynosa",
    "url": "https://vigotskyreynosa.edu.mx",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://vigotskyreynosa.edu.mx/blog?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
