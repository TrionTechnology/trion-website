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
      "D-12-06, Sunway Nexis",
      "1, Jalan PJU 5/1, Kota Damansara",
      "47810 Petaling Jaya, Selangor, Malaysia"
    ]
  },
  {
    icon: Phone,
    title: "Phone Numbers",
    details: [
      "+6016-638 0495 (Office & Mobile)",
      "+6016-638 0495 (WhatsApp)",
      "Available 9:00 AM - 6:00 PM (Mon-Fri)"
    ]
  },
  {
    icon: Mail,
    title: "Email Address",
    details: [
      "freddy890920@gmail.com",
      "Primary contact email",
      "Response within 24 hours"
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
    action: "https://wa.me/60166380495",
    color: "text-green-500"
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us an email anytime",
    action: "mailto:freddy890920@gmail.com",
    color: "text-blue-500"
  },
  {
    icon: Phone,
    title: "Call Now",
    description: "Speak with our team directly",
    action: "tel:+60166380495",
    color: "text-trion-500"
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

      {/* Interactive Map */}
      <div className="card">
        <h3 className="font-heading font-semibold text-xl text-foreground mb-6">
          Our Location
        </h3>
        <div className="space-y-4">
          {/* Address Display */}
          <div className="bg-card/50 border border-border/50 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-trion-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">Trion Creation Sdn Bhd</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  D-12-06, Sunway Nexis<br />
                  1, Jalan PJU 5/1, Kota Damansara<br />
                  47810 Petaling Jaya, Selangor, Malaysia
                </p>
                <p className="text-trion-500 text-xs mt-2">
                  📍 Coordinates: 3.1509°N, 101.5929°E
                </p>
              </div>
            </div>
          </div>
          
          {/* Interactive Google Map */}
          <div className="w-full h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.8!2d101.5929!3d3.1509!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc4c8c8c8c8c8c%3A0x8c8c8c8c8c8c8c8c!2sSunway%20Nexis%2C%20Jalan%20PJU%205%2F1%2C%20Kota%20Damansara%2C%20Petaling%20Jaya%2C%20Selangor!5e0!3m2!1sen!2smy!4v1234567890123!5m2!1sen!2smy"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Trion Creation Office Location"
              className="rounded-xl"
            />
          </div>
          
          {/* Map Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://maps.google.com/?q=D-12-06,+Sunway+Nexis,+1,+Jalan+PJU+5/1,+Kota+Damansara,+47810+Petaling+Jaya,+Selangor"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-trion-gradient text-white rounded-xl hover:shadow-trion-lg transition-all duration-300 hover:scale-105"
            >
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Open in Google Maps</span>
            </a>
            <a
              href="https://waze.com/ul?ll=3.1509,101.5929&navigate=yes"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-card border border-border text-foreground rounded-xl hover:border-trion-500/30 hover:bg-trion-500/5 transition-all duration-300"
            >
              <span className="text-sm font-medium">Navigate with Waze</span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
