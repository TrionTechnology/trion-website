import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Trion Creation Sdn Bhd",
  description: "Terms of service for Trion Creation Sdn Bhd. Read our terms and conditions for using our website and services.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="pt-24 pb-16 bg-gradient-to-br from-background to-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-heading font-bold text-4xl text-foreground mb-8">
            Terms of Service
          </h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">
              <strong>Last updated:</strong> January 15, 2024
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground mb-6">
              By accessing and using the Trion Creation Sdn Bhd website and services, you accept 
              and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Use License</h2>
            <p className="text-muted-foreground mb-4">
              Permission is granted to temporarily download one copy of the materials on Trion Creation's 
              website for personal, non-commercial transitory viewing only. This is the grant of a license, 
              not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on the website</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Service Description</h2>
            <p className="text-muted-foreground mb-6">
              Trion Creation Sdn Bhd provides software development services including but not limited to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
              <li>Custom software development</li>
              <li>Odoo ERP implementation and customization</li>
              <li>Mobile application development</li>
              <li>AI and data analytics solutions</li>
              <li>IoT and hardware integration</li>
              <li>Cloud and DevOps services</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Client Responsibilities</h2>
            <p className="text-muted-foreground mb-4">
              Clients are responsible for:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
              <li>Providing accurate and complete project requirements</li>
              <li>Timely feedback and approval of deliverables</li>
              <li>Payment according to agreed terms</li>
              <li>Compliance with applicable laws and regulations</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Intellectual Property</h2>
            <p className="text-muted-foreground mb-6">
              All intellectual property rights in the services and deliverables remain with Trion Creation 
              Sdn Bhd unless otherwise agreed in writing. Clients receive a license to use the delivered 
              software according to the terms of the project agreement.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Payment Terms</h2>
            <p className="text-muted-foreground mb-6">
              Payment terms will be specified in individual project agreements. Generally, we require:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
              <li>Initial deposit before project commencement</li>
              <li>Milestone payments based on project progress</li>
              <li>Final payment upon project completion and delivery</li>
              <li>Payment within 30 days of invoice date</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Warranty and Support</h2>
            <p className="text-muted-foreground mb-6">
              We provide warranty and support services as specified in individual project agreements. 
              Standard warranty period is 90 days from project delivery, covering defects in workmanship 
              and functionality as per agreed specifications.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-6">
              Trion Creation Sdn Bhd's liability is limited to the total amount paid by the client for 
              the specific project. We are not liable for indirect, incidental, or consequential damages 
              arising from the use of our services.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Confidentiality</h2>
            <p className="text-muted-foreground mb-6">
              We maintain strict confidentiality regarding all client information and project details. 
              All team members sign non-disclosure agreements to protect client confidentiality.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Termination</h2>
            <p className="text-muted-foreground mb-6">
              Either party may terminate the service agreement with 30 days written notice. Upon termination, 
              all outstanding payments become due, and intellectual property rights are transferred according 
              to the agreement terms.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Governing Law</h2>
            <p className="text-muted-foreground mb-6">
              These terms are governed by the laws of Malaysia. Any disputes will be resolved in the 
              courts of Malaysia.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4">12. Changes to Terms</h2>
            <p className="text-muted-foreground mb-6">
              We reserve the right to modify these terms at any time. Changes will be posted on this page 
              with an updated revision date.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4">13. Contact Information</h2>
            <p className="text-muted-foreground mb-6">
              For questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-card p-6 rounded-xl">
              <p className="text-muted-foreground mb-2">
                <strong>Trion Creation Sdn Bhd</strong>
              </p>
              <p className="text-muted-foreground mb-2">
                Email: legal@trioncreation.com
              </p>
              <p className="text-muted-foreground mb-2">
                Phone: +60 3-1234 5678
              </p>
              <p className="text-muted-foreground">
                Address: Level 15, Menara ABC, 123 Jalan Ampang, 50450 Kuala Lumpur, Malaysia
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
