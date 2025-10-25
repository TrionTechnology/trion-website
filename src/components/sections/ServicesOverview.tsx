"use client";
import Link from "next/link";
import { 
  Code, 
  Smartphone, 
  Brain, 
  Cloud, 
  Cpu, 
  Database,
  ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const services = [
  {
    icon: Code,
    title: "Custom Software & Web Apps",
    description: "Tailored web applications and desktop software built with modern technologies to meet your specific business requirements.",
    features: ["Full-stack development", "API integration", "Database design", "Performance optimization"],
    href: "/services#custom-software",
  },
  {
    icon: Database,
    title: "Odoo ERP Customization",
    description: "Comprehensive ERP solutions with Odoo customization, integration, and training for seamless business operations.",
    features: ["Odoo implementation", "Custom modules", "Data migration", "User training"],
    href: "/services#odoo-erp",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description: "Cross-platform mobile applications using Flutter for iOS and Android with native performance and beautiful UI.",
    features: ["Flutter development", "iOS & Android", "App store deployment", "Push notifications"],
    href: "/services#mobile-apps",
  },
  {
    icon: Brain,
    title: "AI & Data Solutions",
    description: "Intelligent systems powered by machine learning, chatbots, and data analytics to automate and optimize your processes.",
    features: ["LLM integration", "Chatbot development", "Data analytics", "Machine learning"],
    href: "/services#ai-solutions",
  },
  {
    icon: Cpu,
    title: "IoT & Hardware Integration",
    description: "Connected devices and IoT solutions using Arduino, Raspberry Pi, and cloud platforms for smart automation.",
    features: ["Arduino development", "Raspberry Pi", "Sensor integration", "Cloud connectivity"],
    href: "/services#iot",
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps",
    description: "Scalable cloud infrastructure, CI/CD pipelines, and DevOps practices using AWS, Alibaba Cloud, and Vercel.",
    features: ["AWS deployment", "Docker containers", "CI/CD pipelines", "Monitoring"],
    href: "/services#cloud-devops",
  },
];

export function ServicesOverview() {
  return (
        <section className="section-padding bg-gradient-to-br from-background to-jet-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-6">
            Our <span className="text-gradient">Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We provide comprehensive software development services to help your business 
            thrive in the digital age with cutting-edge technology solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="card-hover h-full flex flex-col tech-card magnetic-hover">
                    <div className="w-12 h-12 bg-gradient-to-br from-trion-500/20 to-trion-600/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 border border-trion-500/30 group-hover:border-trion-400/50 group-hover:shadow-trion-500/25 group-hover:shadow-lg">
                      <service.icon className="w-6 h-6 text-trion-400 group-hover:text-electric-300 transition-all duration-300 group-hover:rotate-12" size={24} />
                    </div>

                    <h3 className="font-heading font-semibold text-xl text-foreground mb-4 transition-colors duration-300 group-hover:text-trion-500">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground mb-6 flex-grow transition-colors duration-300 group-hover:text-foreground">
                  {service.description}
                </p>
                
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                        <li key={feature} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-trion-500 rounded-full mr-3" />
                          {feature}
                        </li>
                  ))}
                </ul>
                
                <Button variant="outline" asChild className="group/btn">
                  <Link href={service.href}>
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button asChild size="lg">
            <Link href="/services">View All Services</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
