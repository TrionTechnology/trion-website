import { Metadata } from "next";
import { WorkHero } from "@/components/sections/WorkHero";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Our Work - Case Studies & Portfolio | Trion Creation Sdn Bhd",
  description: "Explore our successful software development projects including ERP systems, mobile apps, AI solutions, and custom software for Malaysian businesses.",
  keywords: [
    "software development portfolio Malaysia",
    "case studies custom software",
    "ERP implementation examples",
    "mobile app development portfolio",
    "AI solutions case studies",
  ],
  openGraph: {
    title: "Our Work - Trion Creation Sdn Bhd",
    description: "Explore our successful software development projects including ERP systems, mobile apps, AI solutions, and custom software for Malaysian businesses.",
  },
};

export default function WorkPage() {
  return (
    <>
      <WorkHero />
      <WorkGrid />
      <CTASection />
    </>
  );
}
