import { Metadata } from "next";
import { ContactHero } from "@/components/sections/ContactHero";
import { ContactForm } from "@/components/sections/ContactForm";
import { ContactInfo } from "@/components/sections/ContactInfo";

export const metadata: Metadata = {
  title: "Contact Us - Get Your Free Quote | Trion Creation Sdn Bhd",
  description: "Get in touch with Trion Creation for custom software development, Odoo ERP, mobile apps, AI solutions, and more. Free consultation and quote available.",
  keywords: [
    "contact software development Malaysia",
    "get quote custom software",
    "Odoo ERP consultation",
    "mobile app development quote",
    "AI solutions consultation Malaysia",
  ],
  openGraph: {
    title: "Contact Us - Trion Creation Sdn Bhd",
    description: "Get in touch with Trion Creation for custom software development, Odoo ERP, mobile apps, AI solutions, and more. Free consultation and quote available.",
  },
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ContactForm />
          <ContactInfo />
        </div>
      </div>
    </>
  );
}
