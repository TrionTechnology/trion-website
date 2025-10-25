"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";

const featuredProjects = [
  {
    title: "CartonFlow ERP System",
    category: "Manufacturing ERP",
    description: "Complete ERP solution for a Malaysian packaging company with inventory management, production planning, and financial reporting.",
    image: "/images/cartonflow-erp.jpg",
    href: "/work/cartonflow-erp",
    technologies: ["Odoo", "Python", "PostgreSQL", "React"],
    impact: "40% efficiency increase",
    duration: "6 months",
  },
  {
    title: "RedBox KTV Booking System",
    category: "Mobile App",
    description: "Cross-platform mobile app for KTV room booking with real-time availability, payment integration, and loyalty program.",
    image: "/images/redbox-ktv.jpg",
    href: "/work/redbox-ktv",
    technologies: ["Flutter", "Firebase", "Stripe", "Node.js"],
    impact: "60% booking increase",
    duration: "4 months",
  },
  {
    title: "EBooster Health Platform",
    category: "Healthcare AI",
    description: "AI-powered health monitoring platform with chatbot consultation, appointment scheduling, and telemedicine features.",
    image: "/images/ebooster-health.jpg",
    href: "/work/ebooster-health",
    technologies: ["Next.js", "OpenAI", "PostgreSQL", "WebRTC"],
    impact: "80% patient satisfaction",
    duration: "8 months",
  },
];

export function FeaturedWork() {
  return (
    <section className="section-padding bg-card/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-6">
            Featured <span className="text-gradient">Case Studies</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our successful projects that have transformed businesses across Malaysia 
            with innovative software solutions and measurable results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="card-hover h-full flex flex-col overflow-hidden">
                {/* Project Image */}
                <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    style={{
                      background: 'linear-gradient(45deg, rgba(201, 162, 39, 0.1), rgba(230, 198, 107, 0.1))'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-trion-500/20 text-trion-500 text-sm font-medium rounded-full">
                      {project.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-heading font-semibold text-xl text-white mb-2">
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6 flex-grow flex flex-col">
                  <p className="text-muted-foreground mb-6 flex-grow">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-card border border-border rounded-lg text-sm text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Impact & Duration */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-3 bg-trion-500/10 rounded-lg">
                      <div className="text-trion-500 font-semibold">{project.impact}</div>
                      <div className="text-xs text-muted-foreground">Impact</div>
                    </div>
                    <div className="text-center p-3 bg-card border border-border rounded-lg">
                      <div className="text-foreground font-semibold">{project.duration}</div>
                      <div className="text-xs text-muted-foreground">Duration</div>
                    </div>
                  </div>

                  <Button variant="outline" asChild className="group/btn">
                    <Link href={project.href}>
                      View Case Study
                      <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button asChild size="lg">
            <Link href="/work">
              View All Projects
              <ExternalLink className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
