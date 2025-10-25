"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink, Calendar, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/Button";

const projects = [
  {
    id: "cartonflow-erp",
    title: "CartonFlow ERP System",
    category: "Manufacturing ERP",
    description: "Complete ERP solution for a Malaysian packaging company with inventory management, production planning, and financial reporting.",
    image: "/images/cartonflow-erp.jpg",
    technologies: ["Odoo", "Python", "PostgreSQL", "React"],
    duration: "6 months",
    team: "5 developers",
    budget: "RM 150,000",
    impact: "40% efficiency increase",
    results: [
      "Reduced inventory costs by 25%",
      "Improved production planning accuracy by 40%",
      "Streamlined financial reporting",
      "Enhanced customer satisfaction"
    ],
    challenge: "The client needed a comprehensive ERP system to manage their complex manufacturing operations, inventory, and financial processes.",
    solution: "We developed a custom Odoo-based ERP system with modules for inventory management, production planning, quality control, and financial reporting.",
    href: "/work/cartonflow-erp"
  },
  {
    id: "redbox-ktv",
    title: "RedBox KTV Booking System",
    category: "Mobile App",
    description: "Cross-platform mobile app for KTV room booking with real-time availability, payment integration, and loyalty program.",
    image: "/images/redbox-ktv.jpg",
    technologies: ["Flutter", "Firebase", "Stripe", "Node.js"],
    duration: "4 months",
    team: "3 developers",
    budget: "RM 80,000",
    impact: "60% booking increase",
    results: [
      "Increased online bookings by 60%",
      "Reduced no-shows by 30%",
      "Improved customer retention",
      "Streamlined payment processing"
    ],
    challenge: "The KTV chain needed a modern booking system to compete with online platforms and improve customer experience.",
    solution: "We built a Flutter mobile app with real-time room availability, integrated payment processing, and a loyalty program system.",
    href: "/work/redbox-ktv"
  },
  {
    id: "ebooster-health",
    title: "EBooster Health Platform",
    category: "Healthcare AI",
    description: "AI-powered health monitoring platform with chatbot consultation, appointment scheduling, and telemedicine features.",
    image: "/images/ebooster-health.jpg",
    technologies: ["Next.js", "OpenAI", "PostgreSQL", "WebRTC"],
    duration: "8 months",
    team: "6 developers",
    budget: "RM 200,000",
    impact: "80% patient satisfaction",
    results: [
      "Improved patient engagement by 80%",
      "Reduced consultation wait times by 50%",
      "Enhanced diagnostic accuracy",
      "Streamlined appointment scheduling"
    ],
    challenge: "A healthcare provider needed a comprehensive platform to offer telemedicine services and AI-powered health consultations.",
    solution: "We developed a full-stack platform with AI chatbot integration, video consultation capabilities, and health monitoring features.",
    href: "/work/ebooster-health"
  },
  {
    id: "manufacturing-iot",
    title: "Smart Manufacturing IoT System",
    category: "IoT & Hardware",
    description: "IoT solution for a manufacturing plant with real-time monitoring, predictive maintenance, and automated reporting.",
    image: "/images/projects/manufacturing-iot.jpg",
    technologies: ["Arduino", "Raspberry Pi", "Python", "AWS IoT"],
    duration: "5 months",
    team: "4 developers",
    budget: "RM 120,000",
    impact: "35% maintenance cost reduction",
    results: [
      "Reduced maintenance costs by 35%",
      "Improved equipment uptime by 20%",
      "Enhanced production monitoring",
      "Automated reporting system"
    ],
    challenge: "A manufacturing company needed real-time monitoring of their production equipment and predictive maintenance capabilities.",
    solution: "We implemented an IoT system with sensors, data collection, and cloud-based analytics for predictive maintenance.",
    href: "/work/manufacturing-iot"
  },
  {
    id: "retail-analytics",
    title: "Retail Analytics Dashboard",
    category: "AI & Data",
    description: "AI-powered analytics platform for a retail chain with sales forecasting, customer behavior analysis, and inventory optimization.",
    image: "/images/projects/retail-analytics.jpg",
    technologies: ["Python", "TensorFlow", "React", "PostgreSQL"],
    duration: "6 months",
    team: "5 developers",
    budget: "RM 180,000",
    impact: "25% sales increase",
    results: [
      "Increased sales by 25%",
      "Reduced inventory waste by 30%",
      "Improved customer targeting",
      "Enhanced demand forecasting"
    ],
    challenge: "A retail chain needed advanced analytics to optimize inventory, predict sales, and understand customer behavior.",
    solution: "We developed an AI-powered analytics platform with machine learning models for sales forecasting and customer segmentation.",
    href: "/work/retail-analytics"
  },
  {
    id: "fintech-mobile",
    title: "FinTech Mobile Banking App",
    category: "Mobile App",
    description: "Secure mobile banking application with biometric authentication, real-time transactions, and financial planning tools.",
    image: "/images/projects/fintech-mobile.jpg",
    technologies: ["Flutter", "Node.js", "PostgreSQL", "AWS"],
    duration: "7 months",
    team: "6 developers",
    budget: "RM 250,000",
    impact: "90% user satisfaction",
    results: [
      "Achieved 90% user satisfaction",
      "Reduced transaction processing time by 60%",
      "Enhanced security features",
      "Improved user engagement"
    ],
    challenge: "A financial institution needed a modern, secure mobile banking app to compete with digital banks.",
    solution: "We built a comprehensive mobile banking app with advanced security features, real-time transactions, and financial planning tools.",
    href: "/work/fintech-mobile"
  }
];

export function WorkGrid() {
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-gold-500/20 text-gold-500 text-sm font-medium rounded-full">
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

                  {/* Project Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gold-500" />
                      <div>
                        <div className="text-sm font-semibold text-foreground">{project.duration}</div>
                        <div className="text-xs text-muted-foreground">Duration</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gold-500" />
                      <div>
                        <div className="text-sm font-semibold text-foreground">{project.team}</div>
                        <div className="text-xs text-muted-foreground">Team Size</div>
                      </div>
                    </div>
                  </div>

                  {/* Impact */}
                  <div className="text-center p-3 bg-gold-500/10 rounded-lg mb-6">
                    <div className="text-gold-500 font-semibold">{project.impact}</div>
                    <div className="text-xs text-muted-foreground">Measured Impact</div>
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-card border border-border rounded-lg text-sm text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
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
            <Link href="/contact">
              Start Your Project
              <ExternalLink className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
