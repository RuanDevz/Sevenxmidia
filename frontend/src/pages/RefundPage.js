import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const RefundPage = () => {
  return (
    <div className="min-h-screen bg-background" data-testid="refund-page">
      <div className="container mx-auto max-w-4xl px-6 py-16">
        <Link to="/">
          <Button variant="ghost" className="mb-8" data-testid="back-button">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-5xl font-bold mb-8" data-testid="refund-title">Refund Policy</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">General Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Due to the instant digital delivery nature of our premium services, all sales are generally final. Once your
              premium access is activated and you begin using the service, we cannot offer refunds.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Exceptional Circumstances</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may consider refund requests in the following exceptional cases:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-3">
              <li>
                <strong>Technical Errors:</strong> If there was a technical issue that prevented you from accessing your
                premium features and we were unable to resolve it within a reasonable timeframe.
              </li>
              <li>
                <strong>Duplicate Charges:</strong> If you were accidentally charged multiple times for the same subscription.
              </li>
              <li>
                <strong>Unauthorized Charges:</strong> If you can demonstrate that a charge was made without your authorization.
              </li>
              <li>
                <strong>Service Unavailability:</strong> If our service was unavailable for an extended period due to issues
                on our end.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Refund Request Timeline</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Refund requests must be submitted within:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Monthly Subscriptions:</strong> Within 48 hours of purchase</li>
              <li><strong>Yearly Subscriptions:</strong> Within 7 days of purchase</li>
              <li><strong>Lifetime Plans:</strong> Within 14 days of purchase</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              After these periods, we cannot process refund requests except in cases of duplicate or unauthorized charges.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">How to Request a Refund</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To request a refund:
            </p>
            <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
              <li>Contact our support team with your order details</li>
              <li>Provide a clear explanation of why you're requesting a refund</li>
              <li>Include any relevant screenshots or documentation</li>
              <li>Allow 3-5 business days for our team to review your request</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Refund Processing</h2>
            <p className="text-muted-foreground leading-relaxed">
              If your refund request is approved:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
              <li>The refund will be processed to your original payment method</li>
              <li>It may take 5-10 business days for the refund to appear in your account</li>
              <li>Your premium access will be immediately revoked</li>
              <li>You will receive a confirmation email once the refund is processed</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Subscription Cancellations</h2>
            <p className="text-muted-foreground leading-relaxed">
              For monthly and yearly subscriptions:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
              <li>You can cancel your subscription at any time</li>
              <li>Cancellation prevents future charges but does not refund the current period</li>
              <li>You will retain premium access until the end of your current billing period</li>
              <li>No refunds are provided for unused time in the current billing period</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Chargebacks</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you initiate a chargeback through your bank or credit card company without first contacting us:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
              <li>Your account will be immediately suspended</li>
              <li>We will provide evidence of service delivery to your payment provider</li>
              <li>Fraudulent chargebacks may result in permanent account termination</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We strongly encourage you to contact us directly before initiating a chargeback so we can attempt to resolve
              any issues.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Questions or Disputes</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about our refund policy or wish to dispute a charge, please contact our support team.
              We are committed to addressing all concerns fairly and promptly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPage;