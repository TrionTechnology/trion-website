"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Users, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";

const jobOpenings = [
  {
    id: "senior-fullstack-developer",
    title: "Senior Full-Stack Developer",
    department: "Engineering",
    location: "Kuala Lumpur, Malaysia",
    type: "Full-time",
    experience: "3-5 years",
    description: "We're looking for an experienced full-stack developer to join our team and work on exciting projects using React, Node.js, and modern web technologies.",
    requirements: [
      "3+ years of experience with React and Node.js",
      "Experience with TypeScript and modern JavaScript",
      "Knowledge of database design and optimization",
      "Experience with cloud platforms (AWS, Azure, or GCP)",
      "Strong problem-solving and communication skills"
    ],
    benefits: [
      "Competitive salary package",
      "Health insurance coverage",
      "Flexible working hours",
      "Professional development opportunities",
      "Modern office environment"
    ]
  },
  {
    id: "mobile-app-developer",
    title: "Mobile App Developer (Flutter)",
    department: "Engineering",
    location: "Kuala Lumpur, Malaysia",
    type: "Full-time",
    experience: "2-4 years",
    description: "Join our mobile development team to create beautiful, performant mobile applications using Flutter for iOS and Android platforms.",
    requirements: [
      "2+ years of Flutter development experience",
      "Strong knowledge of Dart programming language",
      "Experience with mobile app deployment",
      "Understanding of mobile UI/UX principles",
      "Experience with REST APIs and state management"
    ],
    benefits: [
      "Competitive salary package",
      "Health insurance coverage",
      "Flexible working hours",
      "Professional development opportunities",
      "Modern office environment"
    ]
  },
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Kuala Lumpur, Malaysia",
    type: "Full-time",
    experience: "2-4 years",
    description: "We need a DevOps engineer to help us build and maintain our cloud infrastructure, CI/CD pipelines, and deployment processes.",
    requirements: [
      "2+ years of DevOps experience",
      "Experience with Docker and Kubernetes",
      "Knowledge of cloud platforms (AWS, Azure, or GCP)",
      "Experience with CI/CD tools (Jenkins, GitLab CI, etc.)",
      "Strong scripting skills (Bash, Python, or PowerShell)"
    ],
    benefits: [
      "Competitive salary package",
      "Health insurance coverage",
      "Flexible working hours",
      "Professional development opportunities",
      "Modern office environment"
    ]
  },
  {
    id: "ui-ux-designer",
    title: "UI/UX Designer",
    department: "Design",
    location: "Kuala Lumpur, Malaysia",
    type: "Full-time",
    experience: "2-3 years",
    description: "Join our design team to create intuitive and beautiful user interfaces for web and mobile applications.",
    requirements: [
      "2+ years of UI/UX design experience",
      "Proficiency in Figma, Sketch, or Adobe XD",
      "Understanding of design systems and component libraries",
      "Experience with user research and testing",
      "Strong portfolio showcasing design skills"
    ],
    benefits: [
      "Competitive salary package",
      "Health insurance coverage",
      "Flexible working hours",
      "Professional development opportunities",
      "Modern office environment"
    ]
  },
  {
    id: "project-manager",
    title: "Project Manager",
    department: "Project Management",
    location: "Kuala Lumpur, Malaysia",
    type: "Full-time",
    experience: "3-5 years",
    description: "We're seeking an experienced project manager to oversee software development projects and ensure successful delivery.",
    requirements: [
      "3+ years of project management experience",
      "Experience with Agile/Scrum methodologies",
      "Strong communication and leadership skills",
      "Experience with project management tools",
      "Technical background preferred"
    ],
    benefits: [
      "Competitive salary package",
      "Health insurance coverage",
      "Flexible working hours",
      "Professional development opportunities",
      "Modern office environment"
    ]
  },
  {
    id: "business-analyst",
    title: "Business Analyst",
    department: "Business",
    location: "Kuala Lumpur, Malaysia",
    type: "Full-time",
    experience: "2-4 years",
    description: "Join our business team to analyze client requirements and translate them into technical specifications for our development team.",
    requirements: [
      "2+ years of business analysis experience",
      "Strong analytical and problem-solving skills",
      "Experience with requirements gathering and documentation",
      "Knowledge of software development lifecycle",
      "Excellent communication skills"
    ],
    benefits: [
      "Competitive salary package",
      "Health insurance coverage",
      "Flexible working hours",
      "Professional development opportunities",
      "Modern office environment"
    ]
  }
];

export function JobListings() {
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
            Open <span className="text-gradient">Positions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our current job openings and find the perfect role to advance your career 
            in software development and technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {jobOpenings.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="card-hover h-full flex flex-col">
                <div className="p-6 flex-grow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-heading font-semibold text-xl text-foreground mb-2 group-hover:text-gold-500 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-gold-500 font-medium">{job.department}</p>
                    </div>
                    <span className="px-3 py-1 bg-gold-500/10 text-gold-500 text-sm font-medium rounded-full">
                      {job.type}
                    </span>
                  </div>

                  <p className="text-muted-foreground mb-6">
                    {job.description}
                  </p>

                  {/* Job Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gold-500" />
                      <span className="text-sm text-muted-foreground">{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gold-500" />
                      <span className="text-sm text-muted-foreground">{job.experience}</span>
                    </div>
                  </div>

                  {/* Key Requirements */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-foreground mb-3">Key Requirements:</h4>
                    <ul className="space-y-1">
                      {job.requirements.slice(0, 3).map((requirement, reqIndex) => (
                        <li key={reqIndex} className="flex items-start text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-gold-500 rounded-full mr-3 mt-2 flex-shrink-0" />
                          {requirement}
                        </li>
                      ))}
                      {job.requirements.length > 3 && (
                        <li className="text-sm text-muted-foreground">
                          +{job.requirements.length - 3} more requirements
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-foreground mb-3">Benefits:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.benefits.slice(0, 3).map((benefit, benefitIndex) => (
                        <span
                          key={benefitIndex}
                          className="px-2 py-1 bg-card border border-border rounded-lg text-xs text-muted-foreground"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Button variant="outline" asChild className="w-full group/btn">
                    <a href={`mailto:careers@trioncreation.com?subject=Application for ${job.title}`}>
                      Apply Now
                      <ExternalLink className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Suitable Position */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="card max-w-2xl mx-auto">
            <h3 className="font-heading font-semibold text-2xl text-foreground mb-4">
              Don't See a Suitable Position?
            </h3>
            <p className="text-muted-foreground mb-6">
              We're always looking for talented individuals to join our team. 
              Send us your resume and let us know how you can contribute to our mission.
            </p>
            <Button asChild>
              <a href="mailto:careers@trioncreation.com">
                Send Your Resume
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
