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
  honeypot: z.string().optional(), // Honeypot field for spam protection
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
    // Check honeypot
    if (data.honeypot) {
      return; // Silent fail for bots
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        setSubmitMessage("Thank you! We'll get back to you within 24 hours.");
        reset();
      } else {
        setSubmitStatus("error");
        setSubmitMessage(result.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage("Network error. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="card"
    >
      <h2 className="font-heading font-semibold text-2xl text-foreground mb-6">
        Get Your Free Quote
      </h2>
      <p className="text-muted-foreground mb-8">
        Fill out the form below and we'll get back to you with a detailed proposal 
        within 24 hours. All consultations are free and confidential.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Honeypot field - hidden from users */}
        <input
          type="text"
          {...register("honeypot")}
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Name and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold-500"
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold-500"
              placeholder="john@company.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Company and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
              Company Name *
            </label>
            <input
              type="text"
              id="company"
              {...register("company")}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold-500"
              placeholder="Your Company Sdn Bhd"
            />
            {errors.company && (
              <p className="text-red-500 text-sm mt-1">{errors.company.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              {...register("phone")}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold-500"
              placeholder="+60 3-1234 5678"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Budget and Project Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-foreground mb-2">
              Budget Range *
            </label>
            <select
              id="budget"
              {...register("budget")}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              <option value="">Select budget range</option>
              {budgetRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
            {errors.budget && (
              <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="projectType" className="block text-sm font-medium text-foreground mb-2">
              Project Type *
            </label>
            <select
              id="projectType"
              {...register("projectType")}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-gold-500"
            >
              <option value="">Select project type</option>
              {projectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.projectType && (
              <p className="text-red-500 text-sm mt-1">{errors.projectType.message}</p>
            )}
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
            Project Description *
          </label>
          <textarea
            id="message"
            rows={5}
            {...register("message")}
            className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold-500"
            placeholder="Tell us about your project requirements, goals, and any specific features you need..."
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
          )}
        </div>

        {/* Submit Status */}
        {submitStatus !== "idle" && (
          <div className={`flex items-center space-x-2 p-4 rounded-xl ${
            submitStatus === "success" 
              ? "bg-green-500/10 text-green-500 border border-green-500/20" 
              : "bg-red-500/10 text-red-500 border border-red-500/20"
          }`}>
            {submitStatus === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{submitMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full group"
        >
          {isSubmitting ? (
            "Sending..."
          ) : (
            <>
              Send Message
              <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
}
