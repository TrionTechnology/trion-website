"use client";

import { motion } from "framer-motion";
import { Users, Award, Clock, Target } from "lucide-react";

const companyStats = [
  { icon: Users, number: "25+", label: "Team Members" },
  { icon: Award, number: "50+", label: "Projects Completed" },
  { icon: Clock, number: "5+", label: "Years Experience" },
  { icon: Target, number: "99%", label: "Client Satisfaction" },
];

export function AboutHero() {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-background to-slate-900 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-15">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/backgrounds/about-hero-bg.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
      </div>
      
      {/* Company Story Background */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/backgrounds/company-story-bg.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
      </div>
      
      {/* Team Culture Background */}
      <div className="absolute inset-0 opacity-8">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/backgrounds/team-culture-bg.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6">
            About <span className="text-gradient">Trion Creation</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            We are a Malaysia-based software development company dedicated to creating 
            innovative solutions that drive business growth and digital transformation 
            across Southeast Asia.
          </p>

          {/* Company Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {companyStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-trion-500/20 to-trion-600/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 border border-trion-500/30 group-hover:border-trion-400/50 group-hover:shadow-trion-500/25 group-hover:shadow-lg">
                  <stat.icon className="w-8 h-8 text-trion-400 group-hover:text-trion-300 transition-all duration-300" />
                </div>
                <div className="text-2xl font-bold text-trion-500 mb-2">{stat.number}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
