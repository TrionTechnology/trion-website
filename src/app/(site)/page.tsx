import { Hero } from "@/components/sections/Hero";
import { ServicesOverview } from "@/components/sections/ServicesOverview";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { TechStack } from "@/components/sections/TechStack";
import { SocialProof } from "@/components/sections/SocialProof";
import { CTA } from "@/components/sections/CTA";
import { Awards } from "@/components/sections/Awards";
import { AboutSection } from "@/components/sections/AboutSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SocialProof />
      <ServicesOverview />
      <FeaturedWork />
      <TechStack />
      <AboutSection />
      <Awards />
      <CTA />
    </>
  );
}
