import type { Metadata } from "next";
import { Montserrat, Lato } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import ScrollToTop from "@/components/ScrollToTop";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://vigotskyreynosa.edu.mx'),
  title: {
    default: "Vigotsky Reynosa - Escuela Privada de Excelencia en Reynosa",
    template: "%s | Vigotsky Reynosa"
  },
  description: "Escuela privada de excelencia en Reynosa, México. Ofrecemos educación integral desde preescolar hasta preparatoria con métodos innovadores y personal dedicado.",
  keywords: ["escuela privada reynosa", "colegio reynosa", "educación reynosa", "preescolar reynosa", "primaria reynosa", "secundaria reynosa", "preparatoria reynosa", "vigotsky reynosa"],
  authors: [{ name: "Vigotsky Reynosa" }],
  creator: "Fransolutions",
  publisher: "Vigotsky Reynosa",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://vigotskyreynosa.edu.mx',
    title: 'Vigotsky Reynosa - Escuela Privada de Excelencia',
    description: 'Educación integral desde preescolar hasta preparatoria en Reynosa, México',
    siteName: 'Vigotsky Reynosa',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vigotsky Reynosa - Escuela Privada de Excelencia',
    description: 'Educación integral desde preescolar hasta preparatoria en Reynosa, México',
  },
  verification: {
    // google: 'your-google-verification-code', // Add when available
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <StructuredData />
      </head>
      <body
        className={`${montserrat.variable} ${lato.variable} antialiased`}
      >
        <TopBar />
        <Navbar />
        {children}
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
