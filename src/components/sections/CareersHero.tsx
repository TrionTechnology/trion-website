"use client";

import { motion } from "framer-motion";
import { Users, Briefcase, Heart, Zap } from "lucide-react";

const benefits = [
  { icon: Users, title: "Collaborative Team", description: "Work with talented professionals" },
  { icon: Briefcase, title: "Career Growth", description: "Opportunities for advancement" },
  { icon: Heart, title: "Work-Life Balance", description: "Flexible working arrangements" },
  { icon: Zap, title: "Innovation", description: "Cutting-edge technology projects" },
];

export function CareersHero() {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-background to-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6">
            Join Our <span className="text-gradient">Team</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Be part of Malaysia's leading software development company. We're looking for 
            talented individuals who are passionate about technology and innovation.
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gold-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-black" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
