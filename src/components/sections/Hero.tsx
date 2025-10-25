"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Code, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";

const features = [
  {
    icon: Code,
    title: "Custom Development",
    description: "Tailored solutions for your business needs",
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    description: "Agile development with clear timelines",
  },
  {
    icon: Shield,
    title: "Reliable Support",
    description: "Ongoing maintenance and support",
  },
];

export function Hero() {
  return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-jet-900 to-black hero-bg interactive-bg">
          {/* Enhanced background pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-trion-500/10 via-transparent to-trion-600/10" />

          {/* Animated floating circles with different speeds */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-trion-500/20 rounded-full blur-3xl floating-animation" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-trion-600/15 rounded-full blur-3xl floating-animation-delayed" />
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-trion-500/25 rounded-full blur-2xl floating-animation" />

          {/* Enhanced floating elements with magnetic effect */}
          <div className="absolute top-10 right-10 w-8 h-8 bg-trion-500 rounded-full magnetic-hover floating-animation" />
          <div className="absolute bottom-10 left-10 w-6 h-6 bg-trion-600/80 rounded-full magnetic-hover floating-animation-delayed" />
          <div className="absolute top-1/3 left-1/3 w-4 h-4 bg-trion-500/60 rounded-full magnetic-hover floating-animation" />

          {/* Additional geometric shapes */}
          <div className="absolute top-1/4 right-1/4 w-16 h-16 border border-trion-500/30 rounded-lg rotate-45 floating-animation" />
          <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-trion-600/20 rounded-full floating-animation-delayed" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-trion-500/10 border border-trion-500/20 text-trion-500 text-sm font-medium mb-8"
          >
            <Zap className="w-4 h-4 mr-2" />
            Malaysia's Leading Software Development Company
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-foreground mb-6"
          >
            Building the Future of
            <span className="block text-gradient">Digital Solutions</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            We create custom software, Odoo ERP solutions, mobile apps, and AI-powered systems 
            that drive business growth across Malaysia and beyond.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Button asChild size="lg" className="group">
              <Link href="/contact">
                Get a Quote
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/work">View Our Work</Link>
            </Button>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto stagger-animation"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                className="group text-center p-8 rounded-2xl glass-effect hover:tech-glow transition-all duration-300 hover:scale-105 tech-card magnetic-hover"
              >
                    <div className="w-16 h-16 bg-trion-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 cyber-glow magnetic-hover shadow-electric-lg">
                      <feature.icon className="w-8 h-8 text-white drop-shadow-lg transition-transform duration-300 group-hover:rotate-12 icon-bright" size={32} />
                    </div>
                    <h3 className="font-semibold text-foreground mb-3 text-lg transition-colors duration-300 group-hover:text-trion-500">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed transition-colors duration-300 group-hover:text-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-trion-500/10 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-trion-600/5 rounded-full blur-2xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-trion-500/10 rounded-full blur-lg animate-float" />
    </section>
  );
}
