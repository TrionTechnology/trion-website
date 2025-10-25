"use client";

import { motion } from "framer-motion";
import { Linkedin, Github, Mail } from "lucide-react";

const teamMembers = [
  {
    name: "Ahmad Rahman",
    role: "Founder & CEO",
    bio: "15+ years in software development, passionate about building solutions that make a difference.",
    image: "/images/team/ahmad-rahman.jpg",
    linkedin: "https://linkedin.com/in/ahmad-rahman",
    github: "https://github.com/ahmad-rahman",
    email: "ahmad@trioncreation.com"
  },
  {
    name: "Sarah Lim",
    role: "CTO",
    bio: "Expert in cloud architecture and AI/ML solutions with a focus on scalable systems.",
    image: "/images/team/sarah-lim.jpg",
    linkedin: "https://linkedin.com/in/sarah-lim",
    github: "https://github.com/sarah-lim",
    email: "sarah@trioncreation.com"
  },
  {
    name: "Raj Kumar",
    role: "Lead Developer",
    bio: "Full-stack developer specializing in React, Node.js, and mobile app development.",
    image: "/images/team/raj-kumar.jpg",
    linkedin: "https://linkedin.com/in/raj-kumar",
    github: "https://github.com/raj-kumar",
    email: "raj@trioncreation.com"
  },
  {
    name: "Fatimah Ali",
    role: "UI/UX Designer",
    bio: "Creative designer focused on user experience and modern interface design.",
    image: "/images/team/fatimah-ali.jpg",
    linkedin: "https://linkedin.com/in/fatimah-ali",
    github: "https://github.com/fatimah-ali",
    email: "fatimah@trioncreation.com"
  },
  {
    name: "David Chen",
    role: "DevOps Engineer",
    bio: "Infrastructure specialist with expertise in AWS, Docker, and CI/CD pipelines.",
    image: "/images/team/david-chen.jpg",
    linkedin: "https://linkedin.com/in/david-chen",
    github: "https://github.com/david-chen",
    email: "david@trioncreation.com"
  },
  {
    name: "Priya Sharma",
    role: "Project Manager",
    bio: "Agile project management expert ensuring smooth delivery and client satisfaction.",
    image: "/images/team/priya-sharma.jpg",
    linkedin: "https://linkedin.com/in/priya-sharma",
    github: "https://github.com/priya-sharma",
    email: "priya@trioncreation.com"
  }
];

export function TeamSection() {
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
            Meet Our <span className="text-gradient">Team</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our diverse team of talented professionals brings together years of experience 
            in software development, design, and project management.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="card-hover text-center">
                {/* Team Member Image */}
                <div className="relative w-32 h-32 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full mx-auto mb-6 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-gold-500/5" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gold-500">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>

                <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
                  {member.name}
                </h3>
                <p className="text-gold-500 font-medium mb-4">{member.role}</p>
                <p className="text-muted-foreground text-sm mb-6">
                  {member.bio}
                </p>

                {/* Social Links */}
                <div className="flex justify-center space-x-4">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-card border border-border rounded-lg flex items-center justify-center hover:border-gold-500/30 hover:bg-gold-500/5 transition-all duration-300"
                  >
                    <Linkedin className="w-4 h-4 text-muted-foreground hover:text-gold-500" />
                  </a>
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-card border border-border rounded-lg flex items-center justify-center hover:border-gold-500/30 hover:bg-gold-500/5 transition-all duration-300"
                  >
                    <Github className="w-4 h-4 text-muted-foreground hover:text-gold-500" />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="w-8 h-8 bg-card border border-border rounded-lg flex items-center justify-center hover:border-gold-500/30 hover:bg-gold-500/5 transition-all duration-300"
                  >
                    <Mail className="w-4 h-4 text-muted-foreground hover:text-gold-500" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Join Our Team CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="card max-w-2xl mx-auto">
            <h3 className="font-heading font-semibold text-2xl text-foreground mb-4">
              Join Our Team
            </h3>
            <p className="text-muted-foreground mb-6">
              We're always looking for talented individuals to join our growing team. 
              Check out our current openings and be part of our mission to transform 
              businesses through technology.
            </p>
            <a
              href="/careers"
              className="btn-primary"
            >
              View Open Positions
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
