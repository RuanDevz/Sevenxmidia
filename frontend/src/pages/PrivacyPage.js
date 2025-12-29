import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-background" data-testid="privacy-page">
      <div className="container mx-auto max-w-4xl px-6 py-16">
        <Link to="/">
          <Button variant="ghost" className="mb-8" data-testid="back-button">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-5xl font-bold mb-8" data-testid="privacy-title">Privacy Policy</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Our Commitment to Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              At SevenX Media, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect
              your personal information in compliance with applicable data protection laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We collect minimal information necessary to provide our services:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Email Address:</strong> Used for account authentication and service communications</li>
              <li><strong>Payment Information:</strong> Processed securely through Stripe (we do not store credit card details)</li>
              <li><strong>Usage Data:</strong> Basic analytics to improve our service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Your information is used exclusively for:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Providing authentication and account access</li>
              <li>Processing payments and subscriptions</li>
              <li>Delivering premium ad-free experiences</li>
              <li>Sending important service updates and notifications</li>
              <li>Improving our services and user experience</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Data Protection and Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures to protect your data. All payment processing is handled by Stripe,
              a PCI-compliant payment processor. We use encryption for data transmission and storage.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use the following third-party services:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Stripe:</strong> Payment processing</li>
              <li><strong>Analytics Tools:</strong> To understand usage patterns and improve our service</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              These services have their own privacy policies and we encourage you to review them.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data in a portable format</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal information only for as long as necessary to provide our services and comply with legal
              obligations. Payment transaction records are retained as required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">We Do Not Sell Your Data</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell, rent, or trade your personal information to third parties for marketing purposes. Your data
              is used solely to provide and improve our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Cookies and Tracking</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use essential cookies for authentication and service functionality. We do not use third-party advertising
              cookies on premium accounts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes via email or
              through our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy or how we handle your data, please contact our support team.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;