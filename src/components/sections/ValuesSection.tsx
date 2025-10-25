"use client";

import { motion } from "framer-motion";
import { Heart, Shield, Users, Zap } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Client-Centric Approach",
    description: "We put our clients at the center of everything we do, ensuring their success is our primary focus.",
    color: "text-red-500"
  },
  {
    icon: Shield,
    title: "Quality & Security",
    description: "We maintain the highest standards of quality and security in all our software solutions.",
    color: "text-blue-500"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "We foster a collaborative environment where every team member's expertise contributes to project success.",
    color: "text-green-500"
  },
  {
    icon: Zap,
    title: "Innovation & Agility",
    description: "We embrace new technologies and agile methodologies to deliver cutting-edge solutions quickly.",
    color: "text-yellow-500"
  }
];

export function ValuesSection() {
  return (
    <section className="section-padding bg-gradient-to-br from-slate-900 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-6">
            Our <span className="text-gradient">Values</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            These core values guide everything we do and shape how we work with our clients, 
            partners, and team members.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="card-hover text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-electric-500/20 to-electric-600/30 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 border border-electric-500/30 group-hover:border-electric-400/50 group-hover:shadow-electric-500/25 group-hover:shadow-lg">
                  <value.icon className="w-8 h-8 text-electric-400 group-hover:text-electric-300 transition-all duration-300" />
                </div>
                <h3 className="font-heading font-semibold text-xl text-foreground mb-4">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
