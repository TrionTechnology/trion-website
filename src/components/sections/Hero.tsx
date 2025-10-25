"use client";

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
      
      {/* Floating elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-trion-500/20 rounded-full blur-3xl floating-animation" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-trion-600/15 rounded-full blur-3xl floating-animation-delayed" />
      <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-trion-500/25 rounded-full blur-2xl floating-animation" />
      
      {/* Small floating dots */}
      <div className="absolute top-10 right-10 w-8 h-8 bg-trion-500 rounded-full magnetic-hover floating-animation" />
      <div className="absolute bottom-10 left-10 w-6 h-6 bg-trion-600/80 rounded-full magnetic-hover floating-animation-delayed" />
      <div className="absolute top-1/3 left-1/3 w-4 h-4 bg-trion-500/60 rounded-full magnetic-hover floating-animation" />
      
      {/* Additional floating elements */}
      <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-trion-600/20 rounded-full floating-animation-delayed" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-trion-500/10 border border-trion-500/20 text-trion-500 text-sm font-medium mb-8">
            🚀 Malaysia's Premier Software Development Company
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Building the Future of
            <span className="block bg-gradient-to-r from-trion-500 via-trion-400 to-trion-600 bg-clip-text text-transparent">
              Digital Innovation
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            From custom software solutions to AI-powered applications, we transform your ideas into 
            cutting-edge technology that drives business growth across Malaysia and beyond.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg" className="group">
              <Link href="/contact">
                Start Your Project
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/work">View Our Work</Link>
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-trion-500/30 transition-all duration-300 hover:scale-105"
                >
                  <div className="w-16 h-16 bg-trion-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 cyber-glow magnetic-hover shadow-trion-lg">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-center">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Additional floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-trion-500/10 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-trion-600/5 rounded-full blur-2xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-trion-500/10 rounded-full blur-lg animate-float" />
    </section>
  );
}