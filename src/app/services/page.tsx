import { Metadata } from "next";
import { ServicesHero } from "@/components/sections/ServicesHero";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Our Services - Custom Software Development Malaysia",
  description: "Comprehensive software development services including custom software, Odoo ERP, mobile apps, AI solutions, IoT, and cloud services in Malaysia.",
  keywords: [
    "custom software development Malaysia",
    "Odoo ERP Malaysia",
    "mobile app development",
    "AI solutions Malaysia",
    "IoT development",
    "cloud services Malaysia",
  ],
  openGraph: {
    title: "Our Services - Trion Creation Sdn Bhd",
    description: "Comprehensive software development services including custom software, Odoo ERP, mobile apps, AI solutions, IoT, and cloud services in Malaysia.",
  },
};

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesGrid />
      <ProcessSection />
      <CTASection />
    </>
  );
}
