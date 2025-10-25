"use client";

import { motion } from "framer-motion";
import { Code, Smartphone, Brain, Database } from "lucide-react";

const projectStats = [
  { icon: Code, number: "50+", label: "Projects Completed" },
  { icon: Smartphone, number: "25+", label: "Mobile Apps" },
  { icon: Database, number: "15+", label: "ERP Systems" },
  { icon: Brain, number: "10+", label: "AI Solutions" },
];

export function WorkHero() {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-background to-slate-900 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-15">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/backgrounds/work-hero-bg.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
      </div>
      
      {/* Portfolio Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/backgrounds/portfolio-grid-bg.svg')",
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
            Our <span className="text-gradient">Portfolio</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Discover how we've helped businesses across Malaysia transform their operations 
            with innovative software solutions, from ERP systems to AI-powered applications.
          </p>

          {/* Project Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {projectStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-trion-500/20 to-trion-600/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 border border-trion-500/30 group-hover:border-trion-400/50 group-hover:shadow-trion-500/25 group-hover:shadow-lg">
                  <stat.icon className="w-8 h-8 text-trion-400 group-hover:text-electric-300 transition-all duration-300" />
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
