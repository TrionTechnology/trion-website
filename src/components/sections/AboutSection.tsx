"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Code, Users, Award, Target } from "lucide-react";

const stats = [
  {
    icon: Code,
    value: "50+",
    label: "Projects Completed",
    description: "Successfully delivered software solutions across various industries"
  },
  {
    icon: Users,
    value: "25+",
    label: "Happy Clients",
    description: "Building long-term partnerships with businesses in Malaysia"
  },
  {
    icon: Award,
    value: "5+",
    label: "Years Experience",
    description: "Deep expertise in modern software development practices"
  },
  {
    icon: Target,
    value: "99%",
    label: "Client Satisfaction",
    description: "Consistent delivery of high-quality, reliable solutions"
  }
];

const teamImages = [
  {
    src: "/images/team/coding-session.jpg",
    alt: "Development Team",
    title: "Our Development Team",
    description: "Expert developers working on cutting-edge solutions",
    fallbackBg: "bg-gradient-to-br from-trion-500/20 to-trion-600/30"
  },
  {
    src: "/images/backgrounds/team-collaboration-bg.svg",
    alt: "Team Collaboration",
    title: "Collaborative Environment",
    description: "Fostering innovation through teamwork and collaboration",
    fallbackBg: "bg-gradient-to-br from-trion-500/20 to-trion-600/30"
  },
  {
    src: "/images/backgrounds/cloud-infrastructure-bg.svg",
    alt: "Cloud Infrastructure",
    title: "Cloud Solutions",
    description: "Scalable cloud infrastructure and DevOps practices",
    fallbackBg: "bg-gradient-to-br from-trion-500/20 to-trion-600/30"
  },
  {
    src: "/images/technology/ai-brain.jpg",
    alt: "AI Development",
    title: "AI & Machine Learning",
    description: "Advanced AI solutions and data analytics capabilities",
    fallbackBg: "bg-gradient-to-br from-trion-500/20 to-trion-600/30"
  }
];

export function AboutSection() {
  return (
    <section className="section-padding bg-gradient-to-br from-background to-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-6">
            Our <span className="text-gradient">Impact</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-16">
            Numbers that reflect our commitment to delivering exceptional software solutions 
            and driving business growth across Malaysia.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-trion-500/20 to-trion-600/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 border border-trion-500/30 group-hover:border-trion-400/50 group-hover:shadow-trion-500/25 group-hover:shadow-lg">
                  <stat.icon className="w-8 h-8 text-trion-400 group-hover:text-electric-300 transition-all duration-300" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-muted-foreground font-medium mb-2">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Images Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-6">
              Behind the <span className="text-gradient">Scenes</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get a glimpse into our development process, team culture, and the technologies 
              that power our innovative solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamImages.map((image, index) => (
              <motion.div
                key={image.alt}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className={`relative h-64 rounded-2xl overflow-hidden tech-card ${image.fallbackBg}`}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-heading font-semibold text-lg text-white mb-2">
                      {image.title}
                    </h3>
                    <p className="text-sm text-white/80">
                      {image.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Malaysia Focus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
            <Image
              src="/images/hero/malaysia-skyline.jpg"
              alt="Malaysia Skyline"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-center">
              <h3 className="font-heading font-bold text-3xl text-white mb-4">
                Proudly Malaysian
              </h3>
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                Based in Kuala Lumpur, we understand the local business landscape and 
                are committed to driving digital transformation across Malaysia.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
