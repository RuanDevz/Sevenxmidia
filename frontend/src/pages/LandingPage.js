import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}`;

const LandingPage = () => {
  const [loading, setLoading] = useState(null);

const handleCheckout = async (planType) => {
  setLoading(planType);

  try {
    const userEmail = localStorage.getItem("userEmail"); 
    // ou pegue do contexto/auth (o ideal)

    const response = await fetch(`${API}/pay/vip-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userEmail,
        planType: planType === "yearly" ? "annual" : "monthly"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to create checkout session");
    }

    window.location.href = data.url;
  } catch (error) {
    console.error(error);
    toast.error(error.message || "Failed to initiate checkout.");
  } finally {
    setLoading(null);
  }
};


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold tracking-tight" data-testid="logo-link">
              SevenX Media
            </Link>
            <div className="flex items-center gap-8">
              <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors" data-testid="pricing-nav-link">
                Pricing
              </a>
              <Link to="/" className="text-sm font-medium hover:text-primary transition-colors" data-testid="home-nav-link">
                Home
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-32 px-6" data-testid="hero-section">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            <div className="inline-block px-4 py-2 mb-8 border border-border rounded-md">
              <span className="text-xs uppercase tracking-widest font-medium" data-testid="hero-badge">
                Premium Ad-Free Experience
              </span>
            </div>
            <h1 className="text-6xl lg:text-7xl font-bold tracking-tight mb-6" data-testid="hero-title">
              Support SevenX and
              <br />
              browse without distractions
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed" data-testid="hero-subtitle">
              Upgrade your account to remove third-party ads, unlock faster browsing speeds,
              and support our independent content creators.
            </p>
            <Button
              size="lg"
              className="rounded-md px-8 py-6 text-base font-medium active:scale-95 transition-transform"
              onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
              data-testid="hero-cta-button"
            >
              View Plans
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 px-6 bg-secondary/30" data-testid="comparison-section">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="border border-border rounded-md p-8 bg-background/50 opacity-60"
              data-testid="free-user-card"
            >
              <h3 className="text-2xl font-bold mb-6">Free User</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <X className="h-5 w-5 text-destructive" />
                  <span>Standard loading speed</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="h-5 w-5 text-destructive" />
                  <span>Contains Banner Ads</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="h-5 w-5 text-destructive" />
                  <span>Standard Support</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="border-2 border-accent rounded-md p-8 bg-background"
              data-testid="premium-user-card"
            >
              <h3 className="text-2xl font-bold mb-6">Premium User</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-accent" />
                  <span>0% Ads (Ad-free)</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-accent" />
                  <span>2x Faster Loading</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-accent" />
                  <span>Priority Discord Role</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6" data-testid="pricing-section">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold tracking-tight mb-4" data-testid="pricing-title">Choose Your Plan</h2>
            <p className="text-xl text-muted-foreground" data-testid="pricing-subtitle">
              Select the perfect plan for your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Monthly Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="border border-border rounded-md p-8 hover:border-primary/50 transition-colors duration-300"
              data-testid="monthly-plan-card"
            >
              <h3 className="text-2xl font-bold mb-2" data-testid="monthly-plan-title">Monthly Pass</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold" data-testid="monthly-plan-price">$12</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <ul className="space-y-3 mb-8 border-t border-border pt-6">
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent" />
                  <span className="text-sm">Remove all Website Ads</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent" />
                  <span className="text-sm">Support independent journalism</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent" />
                  <span className="text-sm">Premium "Supporter" Badge</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent" />
                  <span className="text-sm">Automated Activation</span>
                </li>
              </ul>
              <Button
                className="w-full rounded-md active:scale-95 transition-transform"
                variant="outline"
                onClick={() => handleCheckout("monthly")}
                disabled={loading === "monthly"}
                data-testid="monthly-plan-button"
              >
                {loading === "monthly" ? "Processing..." : "Subscribe Monthly"}
              </Button>
            </motion.div>

            {/* Yearly Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="border-2 border-accent rounded-md p-8 relative bg-accent/5"
              data-testid="yearly-plan-card"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-accent-foreground text-xs uppercase tracking-widest font-bold rounded-md" data-testid="popular-badge">
                Popular
              </div>
              <h3 className="text-2xl font-bold mb-2" data-testid="yearly-plan-title">Yearly Access</h3>
              <div className="mb-2">
                <span className="text-5xl font-bold" data-testid="yearly-plan-price">$80</span>
                <span className="text-muted-foreground">/year</span>
              </div>
              <p className="text-sm text-accent mb-6" data-testid="yearly-plan-savings">Save 45% vs Monthly</p>
              <ul className="space-y-3 mb-8 border-t border-border pt-6">
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent" />
                  <span className="text-sm">Everything in Monthly</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent" />
                  <span className="text-sm">Save 45% vs Monthly</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent" />
                  <span className="text-sm">Exclusive Discord Channel</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent" />
                  <span className="text-sm">Early Access to New Articles</span>
                </li>
              </ul>
              <Button
                className="w-full rounded-md active:scale-95 transition-transform"
                onClick={() => handleCheckout("yearly")}
                disabled={loading === "yearly"}
                data-testid="yearly-plan-button"
              >
                {loading === "yearly" ? "Processing..." : "Subscribe Yearly"}
              </Button>
            </motion.div>

            {/* Lifetime Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="border border-border rounded-md p-8 hover:border-primary/50 transition-colors duration-300"
              data-testid="lifetime-plan-card"
            >
              <h3 className="text-2xl font-bold mb-2" data-testid="lifetime-plan-title">Lifetime Founder</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold" data-testid="lifetime-plan-price">$199.99</span>
              </div>
              <ul className="space-y-3 mb-8 border-t border-border pt-6">
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent" />
                  <span className="text-sm">One-time Payment</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent" />
                  <span className="text-sm">Never see ads again forever</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent" />
                  <span className="text-sm">Gold "Founder" Profile Badge</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent" />
                  <span className="text-sm">Direct Dev Support</span>
                </li>
              </ul>
              <Button
                className="w-full rounded-md active:scale-95 transition-transform"
                variant="outline"
                onClick={() => handleCheckout("lifetime")}
                disabled={loading === "lifetime"}
                data-testid="lifetime-plan-button"
              >
                {loading === "lifetime" ? "Processing..." : "Become a Founder"}
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6" data-testid="footer">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                © 2024-2025 SevenX Media. All rights reserved.
              </p>
            </div>
            <div className="flex gap-6">
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="footer-terms-link">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="footer-privacy-link">
                Privacy Policy
              </Link>
              <Link to="/refund" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="footer-refund-link">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;