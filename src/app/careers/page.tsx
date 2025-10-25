import { Metadata } from "next";
import { CareersHero } from "@/components/sections/CareersHero";
import { JobListings } from "@/components/sections/JobListings";
import { CTASection } from "@/components/sections/CTASection";

export const metadata: Metadata = {
  title: "Careers - Join Our Team | Trion Creation Sdn Bhd",
  description: "Join Trion Creation's talented team of software developers, designers, and technology experts. Explore career opportunities in Malaysia.",
  keywords: [
    "software developer jobs Malaysia",
    "tech careers Kuala Lumpur",
    "developer positions Malaysia",
    "IT jobs Malaysia",
    "software engineering careers",
  ],
  openGraph: {
    title: "Careers - Trion Creation Sdn Bhd",
    description: "Join Trion Creation's talented team of software developers, designers, and technology experts. Explore career opportunities in Malaysia.",
  },
};

export default function CareersPage() {
  return (
    <>
      <CareersHero />
      <JobListings />
      <CTASection />
    </>
  );
}
