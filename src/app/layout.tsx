import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: {
    default: "Trion Creation Sdn Bhd - Custom Software Development Malaysia",
    template: "%s | Trion Creation Sdn Bhd",
  },
  description: "Leading software development company in Malaysia specializing in custom software, Odoo ERP, mobile apps, AI solutions, IoT, and cloud services. Based in Kota Damansara, Selangor.",
  keywords: [
    "software development Malaysia",
    "custom software company Malaysia",
    "Odoo ERP Malaysia",
    "Flutter app development Malaysia",
    "AI chatbot Malaysia",
    "IoT integration Malaysia",
    "cloud devops Malaysia",
    "web development Malaysia",
    "mobile app development Malaysia",
    "software company Selangor",
    "IT services Malaysia",
    "digital transformation Malaysia",
    "Trion Creation",
    "Kota Damansara software company",
    "Petaling Jaya IT services"
  ],
  authors: [{ name: "Trion Creation Sdn Bhd" }],
  creator: "Trion Creation Sdn Bhd",
  publisher: "Trion Creation Sdn Bhd",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://trioncreation.com"),
  alternates: {
    canonical: "/",
    languages: {
      "en-MY": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_MY",
    url: "https://trioncreation.com",
    title: "Trion Creation Sdn Bhd - Custom Software Development Malaysia",
    description: "Leading software development company in Malaysia specializing in custom software, Odoo ERP, mobile apps, AI solutions, IoT, and cloud services.",
    siteName: "Trion Creation Sdn Bhd",
    images: [
      {
        url: "https://trioncreation.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Trion Creation Sdn Bhd - Software Development Company",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trion Creation Sdn Bhd - Custom Software Development Malaysia",
    description: "Leading software development company in Malaysia specializing in custom software, Odoo ERP, mobile apps, AI solutions, IoT, and cloud services.",
    images: ["https://trioncreation.com/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
  },
  category: "Technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Trion Creation Sdn Bhd",
    "description": "Leading software development company in Malaysia specializing in custom software, Odoo ERP, mobile apps, AI solutions, IoT, and cloud services.",
    "url": "https://trioncreation.com",
    "logo": "https://trioncreation.com/images/trion-creation-logo.png",
    "image": "https://trioncreation.com/images/og-image.jpg",
    "telephone": "+6016-638-0495",
    "email": "freddy890920@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "D-12-06, Sunway Nexis, 1, Jalan PJU 5/1",
      "addressLocality": "Kota Damansara",
      "addressRegion": "Selangor",
      "postalCode": "47810",
      "addressCountry": "MY"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "3.1509",
      "longitude": "101.5929"
    },
    "openingHours": "Mo-Fr 09:00-18:00, Sa 09:00-13:00",
    "sameAs": [
      "https://linkedin.com/company/trion-creation",
      "https://github.com/trion-creation",
      "https://twitter.com/trion_creation"
    ],
    "foundingDate": "2019",
    "numberOfEmployees": "5-10",
    "areaServed": {
      "@type": "Country",
      "name": "Malaysia"
    },
    "serviceType": [
      "Software Development",
      "Web Development",
      "Mobile App Development",
      "ERP Implementation",
      "AI Solutions",
      "IoT Integration",
      "Cloud Services"
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="font-sans antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}