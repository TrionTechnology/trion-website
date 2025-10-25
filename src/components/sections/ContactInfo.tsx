"use client";

import { motion } from "framer-motion";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageCircle,
  Linkedin,
  Github,
  Twitter
} from "lucide-react";

const contactInfo = [
  {
    icon: MapPin,
    title: "Office Address",
    details: [
      "Trion Creation Sdn Bhd",
      "Level 15, Menara ABC",
      "123 Jalan Ampang",
      "50450 Kuala Lumpur, Malaysia"
    ]
  },
  {
    icon: Phone,
    title: "Phone Numbers",
    details: [
      "+60 3-1234 5678 (Office)",
      "+60 12-345 6789 (Mobile)",
      "+60 3-1234 5679 (Fax)"
    ]
  },
  {
    icon: Mail,
    title: "Email Addresses",
    details: [
      "contact@trioncreation.com",
      "info@trioncreation.com",
      "support@trioncreation.com"
    ]
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: [
      "Monday - Friday: 9:00 AM - 6:00 PM",
      "Saturday: 9:00 AM - 1:00 PM",
      "Sunday: Closed"
    ]
  }
];

const socialLinks = [
  {
    icon: Linkedin,
    name: "LinkedIn",
    href: "https://linkedin.com/company/trion-creation",
    color: "text-blue-500"
  },
  {
    icon: Github,
    name: "GitHub",
    href: "https://github.com/trion-creation",
    color: "text-gray-500"
  },
  {
    icon: Twitter,
    name: "Twitter",
    href: "https://twitter.com/trion_creation",
    color: "text-blue-400"
  }
];

const quickActions = [
  {
    icon: MessageCircle,
    title: "WhatsApp Chat",
    description: "Quick response via WhatsApp",
    action: "https://wa.me/60123456789",
    color: "text-green-500"
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us an email anytime",
    action: "mailto:support@trioncreation.com",
    color: "text-blue-500"
  },
  {
    icon: Phone,
    title: "Call Now",
    description: "Speak with our team directly",
    action: "tel:+60312345678",
    color: "text-gold-500"
  }
];

export function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Contact Information */}
      <div className="card">
        <h3 className="font-heading font-semibold text-xl text-foreground mb-6">
          Contact Information
        </h3>
        <div className="space-y-6">
          {contactInfo.map((info, index) => (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex items-start space-x-4"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-trion-500/20 to-trion-600/30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-300 border border-trion-500/30 group-hover:border-trion-400/50 group-hover:shadow-trion-500/25 group-hover:shadow-lg">
                <info.icon className="w-5 h-5 text-trion-400 group-hover:text-trion-300 transition-all duration-300" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">{info.title}</h4>
                <ul className="space-y-1">
                  {info.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="text-muted-foreground text-sm">
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="font-heading font-semibold text-xl text-foreground mb-6">
          Quick Actions
        </h3>
        <div className="space-y-4">
          {quickActions.map((action, index) => (
            <motion.a
              key={action.title}
              href={action.action}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group block"
            >
              <div className="flex items-center space-x-4 p-4 rounded-xl bg-card/50 border border-border/50 hover:border-trion-500/30 hover:bg-trion-500/5 transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-trion-500/20 to-trion-600/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300 border border-trion-500/30 group-hover:border-trion-400/50 group-hover:shadow-trion-500/25 group-hover:shadow-lg">
                  <action.icon className="w-5 h-5 text-trion-400 group-hover:text-trion-300 transition-all duration-300" />
                </div>
                <div className="flex-grow">
                  <h4 className="font-semibold text-foreground group-hover:text-trion-500 transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-muted-foreground text-sm">{action.description}</p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="card">
        <h3 className="font-heading font-semibold text-xl text-foreground mb-6">
          Follow Us
        </h3>
        <div className="flex space-x-4">
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="w-12 h-12 bg-card border border-border rounded-xl flex items-center justify-center hover:border-gold-500/30 hover:bg-gold-500/5 transition-all duration-300 group"
            >
              <social.icon className={`w-5 h-5 group-hover:scale-110 transition-transform ${social.color}`} />
            </motion.a>
          ))}
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="card">
        <h3 className="font-heading font-semibold text-xl text-foreground mb-6">
          Our Location
        </h3>
        <div className="w-full h-48 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center border border-border">
          <div className="text-center">
            <MapPin className="w-8 h-8 text-gold-500 mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">
              Interactive map would be displayed here
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
