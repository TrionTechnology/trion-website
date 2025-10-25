"use client";

import { motion } from "framer-motion";
import { 
  Code, 
  Smartphone, 
  Brain, 
  Cloud, 
  Cpu, 
  Database,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const services = [
  {
    icon: Code,
    title: "Custom Software & Web Applications",
    description: "Tailored web applications and desktop software built with modern technologies to meet your specific business requirements.",
    features: [
      "Full-stack web development",
      "API integration and development",
      "Database design and optimization",
      "Performance optimization",
      "Security implementation",
      "Cross-platform compatibility"
    ],
    technologies: ["React", "Next.js", "Node.js", "Python", "PostgreSQL"],
    pricing: "From RM 15,000",
    duration: "2-6 months"
  },
  {
    icon: Database,
    title: "Odoo ERP Customization & Integration",
    description: "Comprehensive ERP solutions with Odoo customization, integration, and training for seamless business operations.",
    features: [
      "Odoo implementation and setup",
      "Custom module development",
      "Third-party system integration",
      "Data migration and import",
      "User training and support",
      "Ongoing maintenance"
    ],
    technologies: ["Odoo", "Python", "PostgreSQL", "XML", "JavaScript"],
    pricing: "From RM 25,000",
    duration: "3-8 months"
  },
  {
    icon: Smartphone,
    title: "Mobile App Development (Flutter)",
    description: "Cross-platform mobile applications using Flutter for iOS and Android with native performance and beautiful UI.",
    features: [
      "iOS and Android development",
      "Cross-platform compatibility",
      "App store deployment",
      "Push notifications",
      "Offline functionality",
      "Performance optimization"
    ],
    technologies: ["Flutter", "Dart", "Firebase", "REST APIs", "State Management"],
    pricing: "From RM 20,000",
    duration: "2-5 months"
  },
  {
    icon: Brain,
    title: "AI & Data Solutions",
    description: "Intelligent systems powered by machine learning, chatbots, and data analytics to automate and optimize your processes.",
    features: [
      "LLM integration and chatbots",
      "Machine learning models",
      "Data analytics and visualization",
      "Predictive analytics",
      "Natural language processing",
      "Computer vision"
    ],
    technologies: ["OpenAI", "TensorFlow", "Python", "Pandas", "Scikit-learn"],
    pricing: "From RM 30,000",
    duration: "3-6 months"
  },
  {
    icon: Cpu,
    title: "IoT & Hardware Integration",
    description: "Connected devices and IoT solutions using Arduino, Raspberry Pi, and cloud platforms for smart automation.",
    features: [
      "Arduino and Raspberry Pi development",
      "Sensor integration",
      "Cloud connectivity",
      "Real-time monitoring",
      "Data collection and analysis",
      "Remote control systems"
    ],
    technologies: ["Arduino", "Raspberry Pi", "Python", "MQTT", "Cloud Platforms"],
    pricing: "From RM 18,000",
    duration: "2-4 months"
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps Services",
    description: "Scalable cloud infrastructure, CI/CD pipelines, and DevOps practices using AWS, Alibaba Cloud, and Vercel.",
    features: [
      "Cloud infrastructure setup",
      "Docker containerization",
      "CI/CD pipeline implementation",
      "Monitoring and logging",
      "Auto-scaling configuration",
      "Security and compliance"
    ],
    technologies: ["AWS", "Docker", "Kubernetes", "Vercel", "Alibaba Cloud"],
    pricing: "From RM 12,000",
    duration: "1-3 months"
  }
];

export function ServicesGrid() {
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
            Comprehensive <span className="text-gradient">Development Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From concept to deployment, we provide end-to-end software development 
            services with clear timelines, transparent pricing, and ongoing support.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="card-hover h-full flex flex-col">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-trion-500/20 to-trion-600/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-300 border border-trion-500/30 group-hover:border-trion-400/50 group-hover:shadow-trion-500/25 group-hover:shadow-lg">
                    <service.icon className="w-6 h-6 text-trion-400 group-hover:text-electric-300 transition-all duration-300" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3">What's Included:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-gold-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3">Technologies:</h4>
                  <div className="flex flex-wrap gap-2">
                    {service.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-card border border-border rounded-lg text-sm text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing & Duration */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gold-500/10 rounded-lg">
                    <div className="text-gold-500 font-semibold">{service.pricing}</div>
                    <div className="text-xs text-muted-foreground">Starting Price</div>
                  </div>
                  <div className="text-center p-3 bg-card border border-border rounded-lg">
                    <div className="text-foreground font-semibold">{service.duration}</div>
                    <div className="text-xs text-muted-foreground">Timeline</div>
                  </div>
                </div>

                <Button variant="outline" className="group/btn">
                  Get Quote
                  <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
