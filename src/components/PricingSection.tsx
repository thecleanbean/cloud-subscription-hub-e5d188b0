
import { useState } from "react";
import { motion } from "framer-motion";
import BillingToggle from "./pricing/BillingToggle";
import PricingHeader from "./pricing/PricingHeader";
import { PricingGrid } from "./pricing/PricingGrid";

const PricingSection = ({ onPlanSelect }: { onPlanSelect: (plan: string) => void }) => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-20 pb-16 bg-gradient-to-b from-background via-background/95 to-background"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PricingHeader />
        </motion.div>
        
        <div className="flex flex-col items-center gap-8 mb-12">
          <BillingToggle isYearly={isYearly} onToggle={setIsYearly} />
        </div>

        <PricingGrid isYearly={isYearly} onPlanSelect={onPlanSelect} />
      </div>
    </motion.div>
  );
};

export default PricingSection;

