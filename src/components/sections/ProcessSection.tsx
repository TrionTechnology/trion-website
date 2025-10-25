"use client";

import { motion } from "framer-motion";
import { 
  MessageCircle, 
  PenTool, 
  Code, 
  Rocket, 
  Wrench,
  CheckCircle
} from "lucide-react";

const processSteps = [
  {
    icon: MessageCircle,
    title: "Discovery & Consultation",
    description: "We start by understanding your business needs, goals, and challenges through detailed consultation sessions.",
    duration: "1-2 weeks",
    deliverables: [
      "Requirements analysis",
      "Technical feasibility study",
      "Project roadmap",
      "Cost estimation"
    ]
  },
  {
    icon: PenTool,
    title: "Design & Planning",
    description: "Our team creates detailed wireframes, user flows, and technical architecture for your project.",
    duration: "1-3 weeks",
    deliverables: [
      "UI/UX wireframes",
      "System architecture",
      "Database design",
      "Project timeline"
    ]
  },
  {
    icon: Code,
    title: "Development & Testing",
    description: "We build your solution using agile methodology with regular updates and quality assurance.",
    duration: "2-8 weeks",
    deliverables: [
      "Core development",
      "Feature implementation",
      "Quality testing",
      "Performance optimization"
    ]
  },
  {
    icon: Rocket,
    title: "Deployment & Launch",
    description: "We deploy your solution to production with proper monitoring and launch support.",
    duration: "1-2 weeks",
    deliverables: [
      "Production deployment",
      "Performance monitoring",
      "User training",
      "Launch support"
    ]
  },
  {
    icon: Wrench,
    title: "Maintenance & Support",
    description: "Ongoing support, updates, and maintenance to ensure your solution continues to perform optimally.",
    duration: "Ongoing",
    deliverables: [
      "Bug fixes",
      "Feature updates",
      "Performance monitoring",
      "Technical support"
    ]
  }
];

export function ProcessSection() {
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
            Our <span className="text-gradient">Development Process</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We follow a proven 5-step process that ensures your project is delivered 
            on time, within budget, and exceeds your expectations.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          {/* Connecting Line - perfectly centered through icons */}
          <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-trion-500/30 via-trion-400/50 to-trion-500/30 hidden md:block"></div>
          
          {processSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12 last:mb-0 relative"
            >
              <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
                {/* Step Number & Icon */}
                <div className="flex items-center space-x-4 md:w-48 flex-shrink-0 relative">
                  {/* Connecting Line for Mobile */}
                  {index < processSteps.length - 1 && (
                    <div className="absolute left-[23px] top-12 w-0.5 h-12 bg-gradient-to-b from-trion-500/30 to-trion-400/50 md:hidden"></div>
                  )}
                  
                  {/* Icon centered on timeline */}
                  <div className="w-12 h-12 bg-gradient-to-br from-trion-500/20 to-trion-600/30 rounded-xl flex items-center justify-center border border-trion-500/30 group-hover:border-trion-400/50 group-hover:shadow-trion-500/25 group-hover:shadow-lg transition-all duration-300 relative z-20 bg-background/90 backdrop-blur-sm flex-shrink-0">
                    <step.icon className="w-6 h-6 text-trion-400 group-hover:text-trion-300 transition-all duration-300" />
                  </div>
                  <div className="text-center md:text-left flex-shrink-0">
                    <div className="text-2xl font-bold text-trion-500 group-hover:text-trion-400 transition-colors duration-300">0{index + 1}</div>
                    <div className="text-sm text-trion-400/80 font-medium">{step.duration}</div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <h3 className="font-heading font-semibold text-xl text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {step.description}
                  </p>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Deliverables:</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {step.deliverables.map((deliverable) => (
                        <li key={deliverable} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-trion-500 mr-3 flex-shrink-0" />
                          {deliverable}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Connector Line */}
              {index < processSteps.length - 1 && (
                <div className="hidden md:block ml-6 mt-6 mb-6">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-trion-500 to-transparent"></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="card max-w-2xl mx-auto">
            <h3 className="font-heading font-semibold text-2xl text-foreground mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="text-muted-foreground mb-6">
              Let's discuss your requirements and create a custom development plan 
              that fits your timeline and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Schedule Consultation
              </button>
              <button className="btn-secondary">
                View Portfolio
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
