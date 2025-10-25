"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const techStacks = [
  {
    category: "Frontend",
    technologies: [
      { name: "React", logo: "/images/tech/react.svg" },
      { name: "Next.js", logo: "/images/tech/nextjs.svg" },
      { name: "TypeScript", logo: "/images/tech/typescript.svg" },
      { name: "Tailwind CSS", logo: "/images/tech/tailwind.svg" },
      { name: "Flutter", logo: "/images/tech/flutter.svg" },
    ],
  },
  {
    category: "Backend",
    technologies: [
      { name: "Node.js", logo: "/images/tech/nodejs.svg" },
      { name: "Python", logo: "/images/tech/python.svg" },
      { name: "PostgreSQL", logo: "/images/tech/postgresql.svg" },
      { name: "MongoDB", logo: "/images/tech/mongodb.svg" },
      { name: "Redis", logo: "/images/tech/redis.svg" },
    ],
  },
  {
    category: "Cloud & DevOps",
    technologies: [
      { name: "AWS", logo: "/images/tech/aws.svg" },
      { name: "Docker", logo: "/images/tech/docker.svg" },
      { name: "Kubernetes", logo: "/images/tech/kubernetes.svg" },
      { name: "Vercel", logo: "/images/tech/vercel.svg" },
      { name: "Alibaba Cloud", logo: "/images/tech/alibaba.svg" },
    ],
  },
  {
    category: "AI & Data",
    technologies: [
      { name: "OpenAI", logo: "/images/tech/openai.svg" },
      { name: "TensorFlow", logo: "/images/tech/tensorflow.svg" },
      { name: "Pandas", logo: "/images/tech/pandas.svg" },
      { name: "Scikit-learn", logo: "/images/tech/scikit.svg" },
      { name: "Jupyter", logo: "/images/tech/jupyter.svg" },
    ],
  },
];

export function TechStack() {
  return (
    <section className="section-padding bg-gradient-to-br from-jet-900 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-6">
            Our <span className="text-gradient">Technology Stack</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We use cutting-edge technologies and modern frameworks to build 
            scalable, secure, and high-performance software solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {techStacks.map((stack, stackIndex) => (
            <motion.div
              key={stack.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: stackIndex * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="card"
            >
              <h3 className="font-heading font-semibold text-xl text-foreground mb-6 text-center">
                {stack.category}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {stack.technologies.map((tech, techIndex) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: stackIndex * 0.1 + techIndex * 0.05, 
                      duration: 0.4 
                    }}
                    viewport={{ once: true }}
                    className="group"
                  >
                  <div className="tech-card flex flex-col items-center p-6 rounded-xl glass-effect hover:cyber-glow transition-all duration-300 group-hover:scale-110 card-hover magnetic-hover">
                    <div className="w-12 h-12 bg-muted/50 backdrop-blur-sm border border-electric-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:bg-electric-500/20 group-hover:border-electric-500/40 transition-all duration-300 relative overflow-hidden cyber-glow shadow-electric">
                        <Image
                          src={tech.logo}
                          alt={tech.name}
                          width={32}
                          height={32}
                          className="object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-lg filter brightness-110"
                          onError={(e) => {
                            // Fallback to letter if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<span class="text-muted-foreground group-hover:text-electric-500 font-semibold text-sm transition-colors duration-300">${tech.name.charAt(0)}</span>`;
                            }
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground text-center transition-colors duration-300 group-hover:text-electric-500">
                        {tech.name}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gold-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-black font-bold text-xl">5+</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Years Experience</h3>
                <p className="text-muted-foreground text-sm">
                  Building software solutions across various industries
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gold-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-black font-bold text-xl">20+</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Technologies</h3>
                <p className="text-muted-foreground text-sm">
                  Modern frameworks and tools we master
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gold-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-black font-bold text-xl">24/7</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">Support</h3>
                <p className="text-muted-foreground text-sm">
                  Ongoing maintenance and technical support
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
