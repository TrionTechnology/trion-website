"use client";

import { motion } from "framer-motion";
import { BookOpen, Calendar, User } from "lucide-react";

export function BlogHero() {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-background to-slate-900 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-15">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/backgrounds/blog-hero-bg.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
      </div>
      
      {/* Content Creation Background */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/backgrounds/content-creation-bg.svg')",
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
            Our <span className="text-gradient">Blog</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Stay updated with the latest insights on software development, technology trends, 
            and industry best practices from our expert team.
          </p>

          {/* Blog Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-trion-500/20 to-trion-600/30 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-all duration-300 border border-trion-500/30 group-hover:border-trion-400/50 group-hover:shadow-trion-500/25 group-hover:shadow-lg">
                <BookOpen className="w-6 h-6 text-trion-400 group-hover:text-trion-300 transition-all duration-300" />
              </div>
              <div className="text-lg font-semibold text-foreground">Expert Insights</div>
              <div className="text-sm text-muted-foreground">From our development team</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-trion-500/20 to-trion-600/30 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-all duration-300 border border-trion-500/30 group-hover:border-trion-400/50 group-hover:shadow-trion-500/25 group-hover:shadow-lg">
                <Calendar className="w-6 h-6 text-trion-400 group-hover:text-trion-300 transition-all duration-300" />
              </div>
              <div className="text-lg font-semibold text-foreground">Weekly Updates</div>
              <div className="text-sm text-muted-foreground">Fresh content every week</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-trion-500/20 to-trion-600/30 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-all duration-300 border border-trion-500/30 group-hover:border-trion-400/50 group-hover:shadow-trion-500/25 group-hover:shadow-lg">
                <User className="w-6 h-6 text-trion-400 group-hover:text-trion-300 transition-all duration-300" />
              </div>
              <div className="text-lg font-semibold text-foreground">Industry Focus</div>
              <div className="text-sm text-muted-foreground">Malaysia & Southeast Asia</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
