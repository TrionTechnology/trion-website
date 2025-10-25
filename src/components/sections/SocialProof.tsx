"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const clients = [
  { name: "TechCorp Malaysia", logo: "/images/clients/techcorp.png" },
  { name: "Manufacturing Plus", logo: "/images/clients/manufacturing-plus.png" },
  { name: "Retail Solutions", logo: "/images/clients/retail-solutions.png" },
  { name: "Healthcare Systems", logo: "/images/clients/healthcare-systems.png" },
  { name: "Finance First", logo: "/images/clients/finance-first.png" },
  { name: "Education Hub", logo: "/images/clients/education-hub.png" },
];

const stats = [
  { number: "50+", label: "Projects Completed" },
  { number: "25+", label: "Happy Clients" },
  { number: "5+", label: "Years Experience" },
  { number: "99%", label: "Client Satisfaction" },
];

export function SocialProof() {
  return (
    <section className="py-16 bg-card/30 border-y border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-electric-500 mb-2">
                {stat.number}
              </div>
              <div className="text-muted-foreground font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Client Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-lg font-semibold text-muted-foreground mb-8">
            Trusted by Leading Companies
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {clients.map((client, index) => (
              <motion.div
                key={client.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="flex items-center justify-center p-4 rounded-xl bg-card/50 border border-border/50 hover:border-electric-500/30 transition-all duration-300"
              >
                <div className="w-24 h-12 relative">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    fill
                    className="object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-muted-foreground text-sm font-medium">${client.name.split(' ')[0]}</span>`;
                      }
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
