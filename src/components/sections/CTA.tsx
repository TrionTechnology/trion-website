"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

const contactMethods = [
  {
    icon: Phone,
    title: "Call Us",
    description: "016-638 0495",
    action: "tel:+60166380495",
  },
  {
    icon: Mail,
    title: "Email Us",
    description: "freddy.chia@trioncreation.com",
    action: "mailto:freddy.chia@trioncreation.com",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    description: "Quick chat support",
    action: "https://wa.me/60166380495",
  },
];

export function CTA() {
  return (
    <section className="section-padding bg-gradient-to-br from-slate-900 via-background to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 hero-pattern opacity-10" />
      
      {/* Background Image */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/backgrounds/cta-bg.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-trion-500/5 via-transparent to-trion-500/5" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-6">
            Ready to Start Your
            <span className="block text-gradient">Digital Transformation?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Let's discuss your project requirements and create a custom solution 
            that drives your business forward. Get a free consultation and quote today.
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Button asChild size="lg" className="group">
              <Link href="/contact">
                Get Free Consultation
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/work">View Our Portfolio</Link>
            </Button>
          </motion.div>

          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            {contactMethods.map((method, index) => (
              <motion.a
                key={method.title}
                href={method.action}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="card-hover text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-trion-500/20 to-trion-600/30 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 border border-trion-500/30 group-hover:border-trion-400/50 group-hover:shadow-trion-500/25 group-hover:shadow-lg">
                    <method.icon className="w-6 h-6 text-trion-400 group-hover:text-electric-300 transition-all duration-300" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{method.title}</h3>
                  <p className="text-muted-foreground text-sm">{method.description}</p>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 pt-8 border-t border-border/50"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-gold-500 mb-2">50+</div>
                <div className="text-muted-foreground text-sm">Projects Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gold-500 mb-2">25+</div>
                <div className="text-muted-foreground text-sm">Happy Clients</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gold-500 mb-2">99%</div>
                <div className="text-muted-foreground text-sm">Client Satisfaction</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gold-500/10 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gold-500/5 rounded-full blur-2xl animate-float-delayed" />
    </section>
  );
}
