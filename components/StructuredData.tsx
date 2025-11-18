export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Vigotsky Reynosa",
    "alternateName": "Colegio Vigotsky Reynosa",
    "url": "https://vigotskyreynosa.edu.mx",
    "logo": "https://vigotskyreynosa.edu.mx/images/logo.png",
    "description": "Escuela privada de excelencia en Reynosa, México. Ofrecemos educación integral desde preescolar hasta preparatoria.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Reynosa",
      "addressRegion": "Tamaulipas",
      "addressCountry": "MX"
    },
    "telephone": "+52-558-917-4-0031",
    "email": "info@vigotskyreynosa.edu.mx",
    "sameAs": [
      "https://www.facebook.com/vigotskyreynosa",
      "https://www.instagram.com/vigotskyreynosa",
      "https://twitter.com/vigotskyreynosa"
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
