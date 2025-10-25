"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

const contactMethods = [
  {
    icon: Phone,
    title: "Call Us",
    description: "+60 3-1234 5678",
    action: "tel:+60312345678",
    color: "text-green-500"
  },
  {
    icon: Mail,
    title: "Email Us",
    description: "contact@trioncreation.com",
    action: "mailto:contact@trioncreation.com",
    color: "text-blue-500"
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    description: "Quick chat support",
    action: "https://wa.me/60123456789",
    color: "text-green-500"
  }
];

export function CTASection() {
  return (
    <section className="section-padding bg-gradient-to-br from-background via-slate-900 to-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 hero-pattern opacity-10" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 via-transparent to-gold-500/5" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-6">
            Let's Build Something
            <span className="block text-gradient">Amazing Together</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Ready to transform your business with cutting-edge software solutions? 
            Get in touch with our team for a free consultation and project estimate.
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
              <Link href="/work">View Our Work</Link>
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
                  <div className={`w-12 h-12 bg-gradient-to-br from-electric-500/20 to-electric-600/30 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 border border-electric-500/30 group-hover:border-electric-400/50 group-hover:shadow-electric-500/25 group-hover:shadow-lg`}>
                    <method.icon className="w-6 h-6 text-electric-400 group-hover:text-electric-300 transition-all duration-300" />
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-gold-500 mb-2">50+</div>
                <div className="text-muted-foreground text-sm">Projects Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gold-500 mb-2">25+</div>
                <div className="text-muted-foreground text-sm">Happy Clients</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gold-500 mb-2">5+</div>
                <div className="text-muted-foreground text-sm">Years Experience</div>
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
