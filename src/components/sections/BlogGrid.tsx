"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const blogPosts = [
  {
    slug: "choosing-right-erp-system-malaysia",
    title: "Choosing the Right ERP System for Malaysian Businesses",
    excerpt: "A comprehensive guide to selecting the perfect ERP solution for your Malaysian business, covering Odoo, SAP, and custom solutions.",
    author: "Ahmad Rahman",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "ERP Solutions",
    image: "/images/blog/erp-guide.jpg",
    tags: ["ERP", "Odoo", "Business", "Malaysia"]
  },
  {
    slug: "flutter-vs-native-mobile-development",
    title: "Flutter vs Native Mobile Development: Which Should You Choose?",
    excerpt: "An in-depth comparison of Flutter and native mobile development approaches, with real-world examples from our Malaysian projects.",
    author: "Sarah Lim",
    date: "2024-01-08",
    readTime: "6 min read",
    category: "Mobile Development",
    image: "/images/blog/flutter-vs-native.jpg",
    tags: ["Flutter", "Mobile", "Development", "Comparison"]
  },
  {
    slug: "ai-chatbots-malaysian-businesses",
    title: "Implementing AI Chatbots for Malaysian Businesses",
    excerpt: "How Malaysian companies can leverage AI chatbots to improve customer service and automate business processes effectively.",
    author: "Raj Kumar",
    date: "2024-01-01",
    readTime: "10 min read",
    category: "AI Solutions",
    image: "/images/blog/ai-chatbots.jpg",
    tags: ["AI", "Chatbots", "Automation", "Customer Service"]
  },
  {
    slug: "cloud-migration-strategy-malaysia",
    title: "Cloud Migration Strategy for Malaysian Enterprises",
    excerpt: "Best practices for migrating your Malaysian business to the cloud, including AWS, Alibaba Cloud, and hybrid solutions.",
    author: "David Chen",
    date: "2023-12-25",
    readTime: "12 min read",
    category: "Cloud & DevOps",
    image: "/images/blog/cloud-migration.jpg",
    tags: ["Cloud", "Migration", "AWS", "DevOps"]
  },
  {
    slug: "iot-solutions-manufacturing-malaysia",
    title: "IoT Solutions for Manufacturing in Malaysia",
    excerpt: "How IoT technology is transforming Malaysian manufacturing companies with real-time monitoring and predictive maintenance.",
    author: "Fatimah Ali",
    date: "2023-12-18",
    readTime: "9 min read",
    category: "IoT & Hardware",
    image: "/images/blog/iot-manufacturing.jpg",
    tags: ["IoT", "Manufacturing", "Hardware", "Monitoring"]
  },
  {
    slug: "data-security-compliance-malaysia",
    title: "Data Security and Compliance in Malaysia",
    excerpt: "Understanding Malaysia's data protection laws and implementing robust security measures for your software applications.",
    author: "Priya Sharma",
    date: "2023-12-11",
    readTime: "7 min read",
    category: "Security",
    image: "/images/blog/data-security.jpg",
    tags: ["Security", "Compliance", "Data Protection", "Malaysia"]
  }
];

const categories = [
  "All",
  "ERP Solutions",
  "Mobile Development",
  "AI Solutions",
  "Cloud & DevOps",
  "IoT & Hardware",
  "Security"
];

export function BlogGrid() {
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
            Latest <span className="text-gradient">Articles</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover insights, best practices, and industry trends from our expert team 
            of software developers and technology consultants.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              viewport={{ once: true }}
              className="px-4 py-2 rounded-xl bg-card border border-border hover:border-gold-500/30 hover:bg-gold-500/5 transition-all duration-300 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="card-hover h-full flex flex-col overflow-hidden">
                {/* Post Image */}
                <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-gold-500/20 text-gold-500 text-sm font-medium rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="font-heading font-semibold text-xl text-foreground mb-3 group-hover:text-gold-500 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 flex-grow">
                    {post.excerpt}
                  </p>

                  {/* Post Meta */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-card border border-border rounded-lg text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Button variant="outline" asChild className="group/btn">
                    <Link href={`/blog/${post.slug}`}>
                      Read More
                      <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="card max-w-2xl mx-auto">
            <h3 className="font-heading font-semibold text-2xl text-foreground mb-4">
              Stay Updated
            </h3>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter and never miss the latest insights on software 
              development and technology trends.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <Button className="sm:w-auto">Subscribe</Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
