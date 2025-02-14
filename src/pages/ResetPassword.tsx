
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { findCustomerByEmail, resetCustomerPassword } from "@/services/customerService";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First check if the customer exists
      const customer = await findCustomerByEmail(email);
      
      if (!customer) {
        toast({
          title: "Account not found",
          description: "No account was found with this email address.",
          variant: "destructive",
        });
        return;
      }

      // Request password reset
      await resetCustomerPassword(email);
      
      setSubmitted(true);
      toast({
        title: "Reset link sent",
        description: "If an account exists with this email, you will receive password reset instructions.",
      });
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: "Error",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md p-8">
        <Link to="/auth" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center">Reset Password</h2>
          <p className="text-muted-foreground text-center mt-2">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Instructions"}
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">Check your email</h3>
            <p className="text-muted-foreground">
              We've sent password reset instructions to {email}
            </p>
            <Button variant="outline" className="mt-4" onClick={() => setSubmitted(false)}>
              Try another email
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ResetPassword;
