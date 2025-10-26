"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Building2, Users, Award, TrendingUp, Star, Shield } from "lucide-react";

const clients = [
  { 
    name: "TechCorp Malaysia", 
    logo: "/images/clients/techcorp.png",
    industry: "Technology",
    description: "Leading tech company in Malaysia"
  },
  { 
    name: "Manufacturing Plus", 
    logo: "/images/clients/manufacturing-plus.png",
    industry: "Manufacturing",
    description: "Industrial automation solutions"
  },
  { 
    name: "Retail Solutions", 
    logo: "/images/clients/retail-solutions.png",
    industry: "Retail",
    description: "E-commerce platform development"
  },
  { 
    name: "Healthcare Systems", 
    logo: "/images/clients/healthcare-systems.png",
    industry: "Healthcare",
    description: "Medical software solutions"
  },
  { 
    name: "Finance First", 
    logo: "/images/clients/finance-first.png",
    industry: "Finance",
    description: "Fintech applications"
  },
  { 
    name: "Education Hub", 
    logo: "/images/clients/education-hub.png",
    industry: "Education",
    description: "Learning management systems"
  },
];

const stats = [
  { number: "50+", label: "Projects Completed", icon: TrendingUp },
  { number: "25+", label: "Happy Clients", icon: Users },
  { number: "5+", label: "Years Experience", icon: Award },
  { number: "99%", label: "Client Satisfaction", icon: Star },
];

const testimonials = [
  {
    quote: "Trion Creation transformed our business operations with their innovative ERP solution.",
    author: "Sarah Chen",
    company: "TechCorp Malaysia",
    role: "CEO"
  },
  {
    quote: "Outstanding development team. They delivered our mobile app ahead of schedule.",
    author: "Ahmad Rahman",
    company: "Manufacturing Plus",
    role: "CTO"
  },
  {
    quote: "Professional, reliable, and innovative. Highly recommended for any software project.",
    author: "Lisa Wong",
    company: "Retail Solutions",
    role: "Project Manager"
  }
];

export function SocialProof() {
  return (
    <section className="py-20 bg-gradient-to-br from-background via-card/20 to-background relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 opacity-15">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/backgrounds/social-proof-bg.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-trion-500/10 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-trion-600/5 rounded-full blur-2xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-trion-500/10 rounded-full blur-lg animate-float" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by <span className="text-gradient">Industry Leaders</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
            We've helped businesses across Malaysia transform their operations with innovative software solutions
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-trion-500/30 hover:shadow-trion-lg transition-all duration-300 group-hover:scale-105">
                    <div className="w-12 h-12 bg-gradient-to-br from-trion-500/20 to-trion-600/30 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-trion-400 group-hover:text-trion-300 transition-colors duration-300" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-trion-500 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-muted-foreground font-medium text-sm">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Enhanced Client Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Our <span className="text-gradient">Valued Partners</span>
          </h3>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
            Leading companies across various industries trust us with their digital transformation
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client, index) => (
              <motion.div
                key={client.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-trion-500/30 hover:shadow-trion-lg transition-all duration-300 group-hover:scale-105">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-trion-500/20 to-trion-600/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Building2 className="w-6 h-6 text-trion-400 group-hover:text-trion-300 transition-colors duration-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground group-hover:text-trion-500 transition-colors duration-300">
                        {client.name}
                      </h4>
                      <p className="text-sm text-trion-500 font-medium">
                        {client.industry}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {client.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Client Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-foreground mb-4">
            What Our <span className="text-gradient">Clients Say</span>
          </h3>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
            Don't just take our word for it - hear from the businesses we've helped transform
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-trion-500/30 hover:shadow-trion-lg transition-all duration-300 group-hover:scale-105 h-full">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-trion-500 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground mb-4 italic group-hover:text-foreground transition-colors duration-300">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="border-t border-border/50 pt-4">
                    <div className="font-semibold text-foreground group-hover:text-trion-500 transition-colors duration-300">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-trion-500">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
