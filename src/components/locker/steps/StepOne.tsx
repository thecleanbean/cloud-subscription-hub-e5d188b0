
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { CustomerType } from "@/types/locker";
import { useEffect } from "react";

interface StepOneProps {
  customerType: CustomerType;
  setCustomerType: (type: CustomerType) => void;
  onNext: () => void;
}

const StepOne = ({ customerType, setCustomerType, onNext }: StepOneProps) => {
  // Use useEffect to handle navigation when customerType changes
  useEffect(() => {
    if (customerType) {
      const timer = setTimeout(onNext, 300);
      return () => clearTimeout(timer);
    }
  }, [customerType, onNext]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold text-primary mb-2">Welcome</h3>
        <p className="text-muted-foreground">
          Are you a new or returning customer?
        </p>
      </div>
      <RadioGroup
        value={customerType}
        onValueChange={(value) => setCustomerType(value as CustomerType)}
        className="grid grid-cols-2 gap-4"
      >
        <div>
          <RadioGroupItem
            value="new"
            id="new"
            className="peer sr-only"
          />
          <Label
            htmlFor="new"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <span className="text-lg font-semibold">New Customer</span>
            <span className="text-sm text-muted-foreground">First time using our service</span>
          </Label>
        </div>
        <div>
          <RadioGroupItem
            value="returning"
            id="returning"
            className="peer sr-only"
          />
          <Label
            htmlFor="returning"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <span className="text-lg font-semibold">Returning Customer</span>
            <span className="text-sm text-muted-foreground">Already have an account</span>
          </Label>
        </div>
      </RadioGroup>
    </motion.div>
  );
};

export default StepOne;
