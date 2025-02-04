import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface BillingToggleProps {
  isYearly: boolean;
  onToggle: (checked: boolean) => void;
}

const BillingToggle = ({ isYearly, onToggle }: BillingToggleProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center gap-4 bg-secondary/20 p-6 rounded-xl shadow-sm"
  >
    <h3 className="text-lg font-semibold text-primary">Billing Period</h3>
    <div className="flex items-center justify-center gap-4">
      <Label 
        htmlFor="billing-toggle" 
        className={`text-base md:text-lg transition-colors ${!isYearly ? 'text-primary font-bold' : 'text-gray-500'}`}
      >
        Monthly
      </Label>
      <Switch
        id="billing-toggle"
        checked={isYearly}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-secondary"
      />
      <Label 
        htmlFor="billing-toggle" 
        className={`text-base md:text-lg transition-colors ${isYearly ? 'text-primary font-bold' : 'text-gray-500'}`}
      >
        Yearly
        <span className="ml-2 text-sm text-accent font-semibold px-2 py-1 bg-accent/10 rounded-full">
          Save 10%
        </span>
      </Label>
    </div>
  </motion.div>
);

export default BillingToggle;