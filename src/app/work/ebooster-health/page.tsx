import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Users, DollarSign, CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "EBooster Health Platform - AI Healthcare Development | Trion Creation",
  description: "AI-powered health monitoring platform with chatbot consultation, appointment scheduling, and telemedicine features. Built with Next.js, OpenAI, and WebRTC.",
  keywords: "AI healthcare platform, telemedicine app, health chatbot, medical AI solutions Malaysia",
};

export default function EBoosterHealthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-slate-900">
      {/* Header */}
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button variant="outline" asChild className="mb-6">
              <Link href="/work">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Portfolio
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-500 text-sm font-medium mb-6">
                Healthcare AI
              </div>
              <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6">
                EBooster <span className="text-gradient">Health Platform</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                AI-powered health monitoring platform with chatbot consultation, 
                appointment scheduling, and telemedicine features.
              </p>
              
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gold-gradient rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-black" />
                  </div>
                  <div className="text-2xl font-bold text-gold-500 mb-1">8 months</div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gold-gradient rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-black" />
                  </div>
                  <div className="text-2xl font-bold text-gold-500 mb-1">6 developers</div>
                  <div className="text-sm text-muted-foreground">Team Size</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gold-gradient rounded-xl flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="w-6 h-6 text-black" />
                  </div>
                  <div className="text-2xl font-bold text-gold-500 mb-1">RM 200,000</div>
                  <div className="text-sm text-muted-foreground">Budget</div>
                </div>
              </div>

              <div className="text-center p-4 bg-gold-500/10 rounded-xl mb-8">
                <div className="text-gold-500 font-semibold text-lg">80% patient satisfaction</div>
                <div className="text-sm text-muted-foreground">Measured Impact</div>
              </div>
            </div>

            <div className="relative">
              <div className="relative h-96 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden">
                <Image
                  src="/images/projects/ebooster-health.svg"
                  alt="EBooster Health Platform"
                  fill
                  className="object-cover"
                  style={{
                    background: 'linear-gradient(45deg, rgba(201, 162, 39, 0.1), rgba(230, 198, 107, 0.1))'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="py-16 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="font-heading font-bold text-3xl text-foreground mb-6">Project Overview</h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  A healthcare provider needed a comprehensive platform to offer telemedicine services 
                  and AI-powered health consultations. They wanted to modernize their patient care 
                  delivery and provide 24/7 health support through intelligent automation.
                </p>
                <p>
                  We developed a full-stack platform with AI chatbot integration, video consultation 
                  capabilities, and health monitoring features. The system includes appointment scheduling, 
                  patient records management, and real-time health data analysis.
                </p>
              </div>

              <h3 className="font-heading font-semibold text-2xl text-foreground mb-6 mt-12">Key Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-gold-500 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground mb-1">Improved patient engagement by 80%</div>
                    <div className="text-sm text-muted-foreground">AI-powered interactions</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-gold-500 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground mb-1">Reduced consultation wait times by 50%</div>
                    <div className="text-sm text-muted-foreground">Efficient scheduling</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-gold-500 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground mb-1">Enhanced diagnostic accuracy</div>
                    <div className="text-sm text-muted-foreground">AI assistance</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-gold-500 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground mb-1">Streamlined appointment scheduling</div>
                    <div className="text-sm text-muted-foreground">Automated processes</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-xl text-foreground mb-6">Technologies Used</h3>
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                  <span className="font-medium text-foreground">Next.js</span>
                  <span className="text-sm text-muted-foreground">Frontend</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                  <span className="font-medium text-foreground">OpenAI</span>
                  <span className="text-sm text-muted-foreground">AI Integration</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                  <span className="font-medium text-foreground">PostgreSQL</span>
                  <span className="text-sm text-muted-foreground">Database</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                  <span className="font-medium text-foreground">WebRTC</span>
                  <span className="text-sm text-muted-foreground">Video Calls</span>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-gold-500/10 to-gold-500/5 border border-gold-500/20 rounded-xl">
                <h4 className="font-semibold text-foreground mb-3">Project Impact</h4>
                <div className="text-3xl font-bold text-gold-500 mb-2">80%</div>
                <div className="text-sm text-muted-foreground mb-4">Patient satisfaction</div>
                <div className="text-sm text-muted-foreground">
                  The AI-powered platform revolutionized healthcare delivery, 
                  providing patients with accessible and intelligent health services.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading font-bold text-3xl text-foreground mb-6">
            Ready to Build <span className="text-gradient">AI Healthcare Solutions?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let's discuss your healthcare technology needs and create innovative solutions that improve patient care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/contact">
                Start Your Project
                <ExternalLink className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/work">
                View More Projects
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
