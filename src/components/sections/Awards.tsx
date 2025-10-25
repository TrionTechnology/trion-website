"use client";

import { motion } from "framer-motion";
import { Award, Star, Trophy, Medal } from "lucide-react";

const awards = [
  {
    icon: Trophy,
    title: "Best Software Development Company 2023",
    organization: "Malaysia Tech Awards",
    year: "2023",
    description: "Recognized for excellence in custom software development and client satisfaction.",
  },
  {
    icon: Award,
    title: "Innovation in ERP Solutions",
    organization: "ASEAN Business Excellence",
    year: "2023",
    description: "Awarded for outstanding Odoo ERP implementations across Southeast Asia.",
  },
  {
    icon: Star,
    title: "Top Mobile App Developer",
    organization: "Digital Malaysia",
    year: "2022",
    description: "Recognized for exceptional Flutter mobile applications with high user ratings.",
  },
  {
    icon: Medal,
    title: "AI Innovation Excellence",
    organization: "TechCrunch Malaysia",
    year: "2023",
    description: "Awarded for pioneering AI chatbot solutions in the Malaysian market.",
  },
];

const certifications = [
  "AWS Certified Solutions Architect",
  "Google Cloud Professional Developer",
  "Microsoft Azure Developer Associate",
  "Odoo Certified Partner",
  "ISO 27001:2013 Information Security",
];

export function Awards() {
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
            Awards & <span className="text-gradient">Recognition</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our commitment to excellence has been recognized by industry leaders 
            and we're proud to showcase our achievements and certifications.
          </p>
        </motion.div>

        {/* Awards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {awards.map((award, index) => (
            <motion.div
              key={award.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="card-hover"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gold-gradient rounded-xl flex items-center justify-center flex-shrink-0">
                  <award.icon className="w-6 h-6 text-black" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-heading font-semibold text-lg text-foreground">
                      {award.title}
                    </h3>
                    <span className="text-gold-500 font-semibold text-sm">
                      {award.year}
                    </span>
                  </div>
                  <p className="text-gold-500 font-medium text-sm mb-2">
                    {award.organization}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {award.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="font-heading font-semibold text-2xl text-foreground mb-8">
            Professional Certifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                viewport={{ once: true }}
                className="flex items-center p-4 rounded-xl bg-card/50 border border-border/50 hover:border-gold-500/30 transition-all duration-300"
              >
                <div className="w-2 h-2 bg-gold-500 rounded-full mr-3 flex-shrink-0" />
                <span className="text-foreground font-medium text-sm">{cert}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
