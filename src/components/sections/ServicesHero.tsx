"use client";

import { motion } from "framer-motion";
import { Code, Smartphone, Brain, Cloud, Cpu, Database } from "lucide-react";

const services = [
  { icon: Code, name: "Custom Software" },
  { icon: Database, name: "Odoo ERP" },
  { icon: Smartphone, name: "Mobile Apps" },
  { icon: Brain, name: "AI Solutions" },
  { icon: Cpu, name: "IoT & Hardware" },
  { icon: Cloud, name: "Cloud & DevOps" },
];

export function ServicesHero() {
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
            Our <span className="text-gradient">Services</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            We provide comprehensive software development services to help your business 
            thrive in the digital age with cutting-edge technology solutions tailored 
            to your specific needs.
          </p>

          {/* Service Icons */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-4xl mx-auto">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-electric-500/20 to-electric-600/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 border border-electric-500/30 group-hover:border-electric-400/50 group-hover:shadow-electric-500/25 group-hover:shadow-lg">
                  <service.icon className="w-8 h-8 text-electric-400 group-hover:text-electric-300 transition-all duration-300" />
                </div>
                <span className="text-sm font-medium text-foreground">{service.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
