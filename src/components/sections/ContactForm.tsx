"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().min(2, "Company name is required"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  budget: z.string().min(1, "Please select a budget range"),
  projectType: z.string().min(1, "Please select a project type"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const budgetRanges = [
  "Under RM 10,000",
  "RM 10,000 - RM 25,000",
  "RM 25,000 - RM 50,000",
  "RM 50,000 - RM 100,000",
  "RM 100,000 - RM 250,000",
  "Above RM 250,000",
];

const projectTypes = [
  "Custom Software Development",
  "Odoo ERP Implementation",
  "Mobile App Development",
  "AI & Data Solutions",
  "IoT & Hardware Integration",
  "Cloud & DevOps Services",
  "Website Development",
  "Other",
];

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setSubmitMessage("");

    try {
      // Create mailto link with form data
      const subject = `New Contact Form Submission from ${data.name}`;
      const body = `
Name: ${data.name}
Email: ${data.email}
Company: ${data.company}
Phone: ${data.phone}
Budget: ${data.budget}
Project Type: ${data.projectType}

Message:
${data.message}
      `.trim();

      const mailtoLink = `mailto:freddy.chia@trioncreation.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Open mailto link
      window.location.href = mailtoLink;
      
      setSubmitStatus("success");
      setSubmitMessage("Your email client should open with the message pre-filled. Please send the email to complete your inquiry.");
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
      setSubmitMessage("There was an error opening your email client. Please email us directly at freddy.chia@trioncreation.com");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Get in Touch
          </h2>
          <p className="text-muted-foreground text-lg">
            Ready to start your next project? Let's discuss how we can help.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Honeypot field - hidden from users */}
          <input
            type="text"
            name="honeypot"
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Full Name *
              </label>
              <input
                {...register("name")}
                type="text"
                id="name"
                className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-trion-500 focus:border-trion-500 transition-all duration-300"
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address *
              </label>
              <input
                {...register("email")}
                type="email"
                id="email"
                className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-trion-500 focus:border-trion-500 transition-all duration-300"
                placeholder="your.email@company.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                Company *
              </label>
              <input
                {...register("company")}
                type="text"
                id="company"
                className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-trion-500 focus:border-trion-500 transition-all duration-300"
                placeholder="Your company name"
              />
              {errors.company && (
                <p className="mt-1 text-sm text-red-400">{errors.company.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                Phone Number *
              </label>
              <input
                {...register("phone")}
                type="tel"
                id="phone"
                className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-trion-500 focus:border-trion-500 transition-all duration-300"
                placeholder="+60 12-345 6789"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-foreground mb-2">
                Budget Range *
              </label>
              <select
                {...register("budget")}
                id="budget"
                className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-trion-500 focus:border-trion-500 transition-all duration-300"
              >
                <option value="">Select budget range</option>
                {budgetRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
              {errors.budget && (
                <p className="mt-1 text-sm text-red-400">{errors.budget.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="projectType" className="block text-sm font-medium text-foreground mb-2">
                Project Type *
              </label>
              <select
                {...register("projectType")}
                id="projectType"
                className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-trion-500 focus:border-trion-500 transition-all duration-300"
              >
                <option value="">Select project type</option>
                {projectTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.projectType && (
                <p className="mt-1 text-sm text-red-400">{errors.projectType.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
              Project Details *
            </label>
            <textarea
              {...register("message")}
              id="message"
              rows={6}
              className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-trion-500 focus:border-trion-500 transition-all duration-300 resize-none"
              placeholder="Tell us about your project requirements, timeline, and any specific needs..."
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>
            )}
          </div>

          {/* Submit Status Messages */}
          {submitStatus === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400"
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{submitMessage}</p>
            </motion.div>
          )}

          {submitStatus === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{submitMessage}</p>
            </motion.div>
          )}

          <div className="text-center">
            <Button
              type="submit"
              variant="default"
              size="lg"
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </div>
              )}
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Or contact us directly:{" "}
              <a
                href="mailto:freddy.chia@trioncreation.com"
                className="text-trion-500 hover:text-trion-400 transition-colors duration-300"
              >
                freddy.chia@trioncreation.com
              </a>
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
}