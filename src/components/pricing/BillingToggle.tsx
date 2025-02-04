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
    className="flex flex-col items-center gap-4 bg-gradient-to-r from-primary/5 to-secondary/5 p-8 rounded-2xl shadow-sm border border-gray-100"
  >
    <h3 className="text-xl font-bold text-primary">Choose Your Billing Period</h3>
    <div className="flex items-center justify-center gap-6 bg-white px-6 py-3 rounded-full shadow-sm">
      <Label 
        htmlFor="billing-toggle" 
        className={`text-base transition-colors cursor-pointer
          ${!isYearly ? 'text-primary font-bold' : 'text-gray-500 hover:text-gray-700'}`}
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
        className={`text-base transition-colors cursor-pointer flex items-center gap-2
          ${isYearly ? 'text-primary font-bold' : 'text-gray-500 hover:text-gray-700'}`}
      >
        Yearly
        <span className="inline-flex items-center text-sm font-semibold px-3 py-1 bg-accent/10 text-accent rounded-full">
          Save 10%
        </span>
      </Label>
    </div>
  </motion.div>
);

export default BillingToggle;