"use client";

import { motion } from "framer-motion";
import { MessageCircle, Mail, Phone } from "lucide-react";

export function ContactHero() {
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
            Let's <span className="text-gradient">Start Your Project</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Ready to transform your business with cutting-edge software solutions? 
            Get in touch with our team for a free consultation and project estimate.
          </p>

          {/* Quick Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-electric-500/20 to-electric-600/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 border border-electric-500/30 group-hover:border-electric-400/50 group-hover:shadow-electric-500/25 group-hover:shadow-lg">
                <MessageCircle className="w-8 h-8 text-electric-400 group-hover:text-electric-300 transition-all duration-300" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Quick Response</h3>
              <p className="text-muted-foreground text-sm">
                We respond within 24 hours
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-electric-500/20 to-electric-600/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 border border-electric-500/30 group-hover:border-electric-400/50 group-hover:shadow-electric-500/25 group-hover:shadow-lg">
                <Mail className="w-8 h-8 text-electric-400 group-hover:text-electric-300 transition-all duration-300" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Free Consultation</h3>
              <p className="text-muted-foreground text-sm">
                No obligation project discussion
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-electric-500/20 to-electric-600/30 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-300 border border-electric-500/30 group-hover:border-electric-400/50 group-hover:shadow-electric-500/25 group-hover:shadow-lg">
                <Phone className="w-8 h-8 text-electric-400 group-hover:text-electric-300 transition-all duration-300" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Direct Contact</h3>
              <p className="text-muted-foreground text-sm">
                Speak with our development team
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
