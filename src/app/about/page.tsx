import { Metadata } from "next";
import { AboutHero } from "@/components/sections/AboutHero";
import { CompanyStory } from "@/components/sections/CompanyStory";
import { TeamSection } from "@/components/sections/TeamSection";
import { ValuesSection } from "@/components/sections/ValuesSection";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "About Us - Trion Creation Sdn Bhd | Software Development Malaysia",
  description: "Learn about Trion Creation Sdn Bhd, Malaysia's leading software development company. Our story, team, values, and commitment to delivering exceptional solutions.",
  keywords: [
    "about Trion Creation",
    "software development company Malaysia",
    "Malaysian tech company",
    "custom software development team",
    "Odoo ERP Malaysia team",
  ],
  openGraph: {
    title: "About Us - Trion Creation Sdn Bhd",
    description: "Learn about Trion Creation Sdn Bhd, Malaysia's leading software development company. Our story, team, values, and commitment to delivering exceptional solutions.",
  },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <CompanyStory />
      <ValuesSection />
      <TeamSection />
      <CTASection />
    </>
  );
}
