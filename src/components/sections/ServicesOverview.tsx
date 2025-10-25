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
    backgroundImage: "/images/backgrounds/custom-software-bg.svg"
  },
  {
    icon: Database,
    title: "Odoo ERP Customization",
    description: "Comprehensive ERP solutions with Odoo customization, integration, and training for seamless business operations.",
    features: ["Odoo implementation", "Custom modules", "Data migration", "User training"],
    href: "/services#odoo-erp",
    backgroundImage: "/images/backgrounds/odoo-erp-bg.svg"
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description: "Cross-platform mobile applications using Flutter for iOS and Android with native performance and beautiful UI.",
    features: ["Flutter development", "iOS & Android", "App store deployment", "Push notifications"],
    href: "/services#mobile-apps",
    backgroundImage: "/images/backgrounds/mobile-apps-bg.svg"
  },
  {
    icon: Brain,
    title: "AI & Data Solutions",
    description: "Intelligent systems powered by machine learning, chatbots, and data analytics to automate and optimize your processes.",
    features: ["LLM integration", "Chatbot development", "Data analytics", "Machine learning"],
    href: "/services#ai-solutions",
    backgroundImage: "/images/backgrounds/ai-solutions-bg.svg"
  },
  {
    icon: Cpu,
    title: "IoT & Hardware Integration",
    description: "Connected devices and IoT solutions using Arduino, Raspberry Pi, and cloud platforms for smart automation.",
    features: ["Arduino development", "Raspberry Pi", "Sensor integration", "Cloud connectivity"],
    href: "/services#iot",
    backgroundImage: "/images/backgrounds/iot-hardware-bg.svg"
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps",
    description: "Scalable cloud infrastructure, CI/CD pipelines, and DevOps practices using AWS, Alibaba Cloud, and Vercel.",
    features: ["AWS deployment", "Docker containers", "CI/CD pipelines", "Monitoring"],
    href: "/services#cloud-devops",
    backgroundImage: "/images/backgrounds/cloud-devops-bg.svg"
  },
];

export function ServicesOverview() {
  return (
    <section className="section-padding bg-gradient-to-br from-background to-jet-900 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/backgrounds/services-hero-bg.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-6">
            Our <span className="text-gradient">Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We provide comprehensive software development services to help your business 
            thrive in the digital age with cutting-edge technology solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={service.title} className="group">
              <div className="card-hover h-full flex flex-col tech-card magnetic-hover relative overflow-hidden">
                {/* Service Background Image */}
                <div className="absolute inset-0 opacity-10">
                  <div 
                    className="w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url('${service.backgroundImage}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center"
                    }}
                  />
                </div>
                
                {/* Service Content */}
                <div className="relative z-10 p-6">
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
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button asChild size="lg">
            <Link href="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
