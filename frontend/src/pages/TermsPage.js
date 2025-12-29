import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-background" data-testid="terms-page">
      <div className="container mx-auto max-w-4xl px-6 py-16">
        <Link to="/">
          <Button variant="ghost" className="mb-8" data-testid="back-button">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-5xl font-bold mb-8" data-testid="terms-title">Terms of Service</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Company Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              This service is operated by SevenX Media. By using our services, you agree to be bound by these Terms of Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Service Scope</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              SevenX Media provides premium advertising and content services. Our platform offers enhanced browsing experiences
              through premium subscriptions that remove advertisements and provide additional features.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Eligibility</h2>
            <p className="text-muted-foreground leading-relaxed">
              You must be at least 18 years old to use our paid services. By subscribing, you confirm that you meet this
              age requirement and have the authority to enter into this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Use of Services</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Users are expected to use our services responsibly and legally. The following activities are strictly prohibited:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Any form of illegal content or activities</li>
              <li>Harassment, abuse, or harm to others</li>
              <li>Unauthorized access or hacking attempts</li>
              <li>Distribution of malware or viruses</li>
              <li>Violation of intellectual property rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Paid Services and Account Upgrades</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Premium subscriptions provide an enhanced operational account upgrade. Benefits such as ad removal, faster loading
              times, and exclusive badges are complementary features provided alongside this operational improvement.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              All payments are processed securely through Stripe. By subscribing, you authorize recurring charges (for monthly/yearly plans)
              or a one-time charge (for lifetime plans) according to the selected plan.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Artificial Traffic</h2>
            <p className="text-muted-foreground leading-relaxed">
              The use of bots, automated systems, or any artificial means to generate traffic or engagement is strictly prohibited
              and may result in immediate account termination without refund.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Refund Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Due to the instant digital nature of our services, all sales are generally final. For detailed refund information,
              please refer to our <Link to="/refund" className="text-accent hover:underline">Refund Policy</Link>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Governing Law and Jurisdiction</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms of Service are governed by the laws of the United States. Any disputes arising from these terms
              shall be resolved in accordance with applicable law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes
              acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these Terms of Service, please contact us through our support channels.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;