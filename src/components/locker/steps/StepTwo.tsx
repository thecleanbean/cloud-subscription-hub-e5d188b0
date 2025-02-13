
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

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
