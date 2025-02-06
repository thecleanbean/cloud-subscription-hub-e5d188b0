
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface BillingToggleProps {
  isYearly: boolean;
  onToggle: (checked: boolean) => void;
}

const BillingToggle = ({ isYearly, onToggle }: BillingToggleProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center gap-4 bg-gradient-to-r from-secondary/5 via-secondary/20 to-secondary/5 p-8 rounded-2xl shadow-lg border border-secondary/20 backdrop-blur-sm"
  >
    <h3 className="text-xl font-bold text-primary flex items-center gap-2">
      <Sparkles className="w-5 h-5 text-secondary" />
      Choose Your Billing Period
      <Sparkles className="w-5 h-5 text-secondary" />
    </h3>
    <motion.div 
      className="flex items-center justify-center gap-6 bg-white/80 px-8 py-4 rounded-full shadow-lg border border-secondary/10 backdrop-blur-sm"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
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
        className="data-[state=checked]:bg-secondary data-[state=unchecked]:bg-gray-200"
      />
      <Label 
        htmlFor="billing-toggle" 
        className={`text-base transition-colors cursor-pointer flex items-center gap-2
          ${isYearly ? 'text-primary font-bold' : 'text-gray-500 hover:text-gray-700'}`}
      >
        Yearly
        <motion.span 
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="inline-flex items-center text-sm font-semibold px-3 py-1 bg-secondary/10 text-primary rounded-full border border-secondary/20"
        >
          Save 10%
        </motion.span>
      </Label>
    </motion.div>
  </motion.div>
);

export default BillingToggle;

