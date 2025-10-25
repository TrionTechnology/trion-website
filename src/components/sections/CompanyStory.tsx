"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Target } from "lucide-react";

const timeline = [
  {
    year: "2019",
    title: "Company Founded",
    description: "Trion Creation Sdn Bhd was established in Kuala Lumpur with a vision to revolutionize software development in Malaysia.",
    icon: Calendar
  },
  {
    year: "2020",
    title: "First Major Project",
    description: "Successfully delivered our first large-scale ERP implementation for a manufacturing company, establishing our expertise in Odoo development.",
    icon: Target
  },
  {
    year: "2021",
    title: "Team Expansion",
    description: "Grew our team to 15+ developers and expanded our services to include mobile app development and AI solutions.",
    icon: Users
  },
  {
    year: "2022",
    title: "Regional Recognition",
    description: "Received the 'Best Software Development Company' award at the Malaysia Tech Awards, recognizing our innovation and client satisfaction.",
    icon: Target
  },
  {
    year: "2023",
    title: "AI Integration",
    description: "Launched our AI and data analytics division, helping businesses leverage machine learning and artificial intelligence.",
    icon: Target
  },
  {
    year: "2024",
    title: "Future Vision",
    description: "Continuing to expand our services across Southeast Asia with a focus on IoT, cloud solutions, and emerging technologies.",
    icon: MapPin
  }
];

const values = [
  {
    title: "Innovation",
    description: "We stay at the forefront of technology, constantly exploring new tools and methodologies to deliver cutting-edge solutions."
  },
  {
    title: "Quality",
    description: "Every project undergoes rigorous testing and quality assurance to ensure reliable, scalable, and maintainable software."
  },
  {
    title: "Partnership",
    description: "We work closely with our clients as partners, understanding their business goals and providing ongoing support."
  },
  {
    title: "Excellence",
    description: "We are committed to delivering exceptional results that exceed expectations and drive measurable business value."
  }
];

export function CompanyStory() {
  return (
    <section className="section-padding bg-card/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-6">
            Our <span className="text-gradient">Story</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Founded in 2019, Trion Creation has grown from a small startup to one of Malaysia's 
            leading software development companies, helping businesses transform through technology.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto mb-16 relative">
          {/* Connecting Line - centered through icons */}
          <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-trion-500/30 via-trion-400/50 to-trion-500/30"></div>
          
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="flex items-start space-x-6 relative"
              >
                <div className="flex-shrink-0 relative z-20">
                  <div className="w-12 h-12 bg-gradient-to-br from-trion-500/20 to-trion-600/30 rounded-xl flex items-center justify-center border border-trion-500/30 group-hover:border-trion-400/50 group-hover:shadow-trion-500/25 group-hover:shadow-lg transition-all duration-300 bg-background/90 backdrop-blur-sm">
                    <item.icon className="w-6 h-6 text-trion-400 group-hover:text-trion-300 transition-all duration-300" />
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center space-x-4 mb-2">
                    <span className="text-trion-500 font-bold text-lg group-hover:text-trion-400 transition-colors duration-300">{item.year}</span>
                    <h3 className="font-heading font-semibold text-xl text-foreground">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="font-heading font-semibold text-2xl text-foreground mb-8">
            Our Core Values
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="card text-center"
              >
                <h4 className="font-semibold text-foreground mb-3">{value.title}</h4>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="card max-w-4xl mx-auto">
            <h3 className="font-heading font-semibold text-2xl text-foreground mb-6">
              Our Mission
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              To empower businesses across Malaysia and Southeast Asia with innovative software 
              solutions that drive growth, efficiency, and digital transformation. We believe 
              technology should be accessible, reliable, and transformative.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-gold-500 mb-2">50+</div>
                <div className="text-muted-foreground text-sm">Successful Projects</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gold-500 mb-2">25+</div>
                <div className="text-muted-foreground text-sm">Happy Clients</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gold-500 mb-2">5+</div>
                <div className="text-muted-foreground text-sm">Years of Excellence</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
