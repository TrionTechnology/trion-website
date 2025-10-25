import Link from "next/link";
import { Mail, Phone, MapPin, Linkedin, Github, Twitter } from "lucide-react";
import { Button } from "@/components/ui/Button";

const footerLinks = {
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Services", href: "/services" },
    { name: "Case Studies", href: "/work" },
    { name: "Careers", href: "/careers" },
  ],
  services: [
    { name: "Custom Software", href: "/services#custom-software" },
    { name: "Odoo ERP", href: "/services#odoo-erp" },
    { name: "Mobile Apps", href: "/services#mobile-apps" },
    { name: "AI Solutions", href: "/services#ai-solutions" },
  ],
  resources: [
    { name: "Blog", href: "/blog" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Contact", href: "/contact" },
  ],
};

const socialLinks = [
  { name: "LinkedIn", href: "https://linkedin.com/company/trion-creation", icon: Linkedin },
  { name: "GitHub", href: "https://github.com/trion-creation", icon: Github },
  { name: "Twitter", href: "https://twitter.com/trion_creation", icon: Twitter },
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-6">
              <img 
                src="/images/trion-creation-logo.png" 
                alt="Trion Creation" 
                className="h-20 w-auto"
              />
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Leading software development company in Malaysia specializing in custom software, 
              Odoo ERP, mobile apps, AI solutions, IoT, and cloud services.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-trion-500" />
                <span>freddy.chia@trioncreation.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-trion-500" />
                <span>016-638 0495</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-trion-500" />
                <span>Kuala Lumpur, Malaysia</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-trion-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-trion-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & CTA */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3 mb-6">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-trion-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Button asChild>
              <Link href="/contact">Get Started</Link>
            </Button>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="py-8 border-t border-border">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
              Stay Updated
            </h3>
            <p className="text-muted-foreground mb-6">
              Get the latest insights on software development, technology trends, and industry updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-trion-500"
              />
              <Button className="sm:w-auto">Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-trion-500 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              <p>&copy; 2024 Trion Creation Sdn Bhd. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
