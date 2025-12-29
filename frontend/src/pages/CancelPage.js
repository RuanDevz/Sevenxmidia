import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import { Button } from "../components/ui/button";

const CancelPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6" data-testid="cancel-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <XCircle className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
        <h1 className="text-3xl font-bold mb-4" data-testid="cancel-title">Payment Cancelled</h1>
        <p className="text-muted-foreground mb-8" data-testid="cancel-message">
          Your payment was cancelled. No charges have been made to your account.
        </p>
        <Link to="/">
          <Button className="rounded-md" data-testid="return-home-button">
            Return to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default CancelPage;