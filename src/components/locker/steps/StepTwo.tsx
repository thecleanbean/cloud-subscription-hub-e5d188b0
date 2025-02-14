
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface StepTwoProps {
  email: string;
  setEmail: (email: string) => void;
}

const StepTwo = ({ email, setEmail }: StepTwoProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold text-primary mb-2">Welcome Back</h3>
        <p className="text-muted-foreground">
          Please enter your email to continue with your order
        </p>
      </div>

      <Alert variant="info" className="mb-6">
        <Info className="h-4 w-4" />
        <AlertDescription>
          If you've previously used CleanCloud's mobile app or website but haven't used our locker service before, 
          you'll need to create a new account specifically for the locker system. This ensures secure access to our lockers.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default StepTwo;
