import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Trion Creation Sdn Bhd",
  description: "Privacy policy for Trion Creation Sdn Bhd. Learn how we collect, use, and protect your personal information.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-16 bg-gradient-to-br from-background to-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-heading font-bold text-4xl text-foreground mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-muted-foreground mb-6">
              <strong>Last updated:</strong> January 15, 2024
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
            <p className="text-muted-foreground mb-6">
              Trion Creation Sdn Bhd ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you visit our website or use our services.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold text-foreground mb-3">2.1 Personal Information</h3>
            <p className="text-muted-foreground mb-4">
              We may collect personal information that you voluntarily provide to us, including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
              <li>Name and contact information (email address, phone number)</li>
              <li>Company information</li>
              <li>Project requirements and specifications</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mb-3">2.2 Automatically Collected Information</h3>
            <p className="text-muted-foreground mb-4">
              We may automatically collect certain information when you visit our website:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
              <li>IP address and location data</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent on our website</li>
              <li>Referring website information</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
              <li>Providing and improving our services</li>
              <li>Responding to your inquiries and requests</li>
              <li>Sending you relevant information about our services</li>
              <li>Analyzing website usage and performance</li>
              <li>Complying with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Information Sharing</h2>
            <p className="text-muted-foreground mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties, except:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
              <li>With your explicit consent</li>
              <li>To comply with legal requirements</li>
              <li>To protect our rights and property</li>
              <li>With trusted service providers who assist us in operating our website</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Security</h2>
            <p className="text-muted-foreground mb-6">
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. However, no method of 
              transmission over the internet is 100% secure.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Your Rights</h2>
            <p className="text-muted-foreground mb-4">
              Under Malaysian data protection laws, you have the right to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to processing of your information</li>
              <li>Withdraw consent at any time</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Cookies and Tracking</h2>
            <p className="text-muted-foreground mb-6">
              We use cookies and similar technologies to enhance your browsing experience, analyze 
              website traffic, and personalize content. You can control cookie settings through 
              your browser preferences.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Third-Party Links</h2>
            <p className="text-muted-foreground mb-6">
              Our website may contain links to third-party websites. We are not responsible for 
              the privacy practices or content of these external sites.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Changes to This Policy</h2>
            <p className="text-muted-foreground mb-6">
              We may update this Privacy Policy from time to time. We will notify you of any 
              changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contact Us</h2>
            <p className="text-muted-foreground mb-6">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-card p-6 rounded-xl">
              <p className="text-muted-foreground mb-2">
                <strong>Trion Creation Sdn Bhd</strong>
              </p>
              <p className="text-muted-foreground mb-2">
                Email: privacy@trioncreation.com
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
