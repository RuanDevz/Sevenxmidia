import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("checking");
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 5;
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    const pollPaymentStatus = async (attempt = 0) => {
      if (attempt >= maxAttempts) {
        setStatus("timeout");
        return;
      }

      try {
        const response = await fetch(`${API}/checkout/status/${sessionId}`);
        if (!response.ok) throw new Error("Failed to check payment status");

        const data = await response.json();

        if (data.payment_status === "paid") {
          setStatus("success");
        } else if (data.status === "expired") {
          setStatus("expired");
        } else {
          setAttempts(attempt + 1);
          setTimeout(() => pollPaymentStatus(attempt + 1), 2000);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        setStatus("error");
      }
    };

    pollPaymentStatus();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6" data-testid="success-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        {status === "checking" && (
          <div data-testid="checking-status">
            <Loader2 className="h-16 w-16 mx-auto mb-6 animate-spin text-accent" />
            <h1 className="text-3xl font-bold mb-4">Processing Payment</h1>
            <p className="text-muted-foreground mb-6">
              Please wait while we confirm your payment...
            </p>
            <p className="text-sm text-muted-foreground">
              Attempt {attempts + 1} of {maxAttempts}
            </p>
          </div>
        )}

        {status === "success" && (
          <div data-testid="success-status">
            <CheckCircle className="h-16 w-16 mx-auto mb-6 text-accent" />
            <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
            <p className="text-muted-foreground mb-8">
              Thank you for your purchase. Your premium access has been activated.
            </p>
            <Link to="/">
              <Button className="rounded-md" data-testid="return-home-button">
                Return to Home
              </Button>
            </Link>
          </div>
        )}

        {status === "timeout" && (
          <div data-testid="timeout-status">
            <h1 className="text-3xl font-bold mb-4">Payment Check Timeout</h1>
            <p className="text-muted-foreground mb-8">
              We're still processing your payment. Please check your email for confirmation.
            </p>
            <Link to="/">
              <Button className="rounded-md" data-testid="return-home-button">
                Return to Home
              </Button>
            </Link>
          </div>
        )}

        {(status === "error" || status === "expired") && (
          <div data-testid="error-status">
            <h1 className="text-3xl font-bold mb-4">Payment {status === "expired" ? "Expired" : "Error"}</h1>
            <p className="text-muted-foreground mb-8">
              {status === "expired"
                ? "Your payment session has expired. Please try again."
                : "There was an error processing your payment. Please try again."}
            </p>
            <Link to="/">
              <Button className="rounded-md" data-testid="return-home-button">
                Return to Home
              </Button>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SuccessPage;