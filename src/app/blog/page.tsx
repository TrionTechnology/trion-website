import { Metadata } from "next";
import { BlogHero } from "@/components/sections/BlogHero";
import { BlogGrid } from "@/components/sections/BlogGrid";

export const metadata: Metadata = {
  title: "Blog - Software Development Insights | Trion Creation Sdn Bhd",
  description: "Read our latest insights on software development, technology trends, and industry best practices from the Trion Creation team.",
  keywords: [
    "software development blog Malaysia",
    "technology insights",
    "Odoo ERP best practices",
    "mobile app development tips",
    "AI solutions Malaysia",
  ],
  openGraph: {
    title: "Blog - Trion Creation Sdn Bhd",
    description: "Read our latest insights on software development, technology trends, and industry best practices from the Trion Creation team.",
  },
};

export default function BlogPage() {
  return (
    <>
      <BlogHero />
      <BlogGrid />
    </>
  );
}
