import { useState } from "react";
import { motion } from "framer-motion";
import BillingToggle from "./pricing/BillingToggle";
import PricingHeader from "./pricing/PricingHeader";
import { PricingGrid } from "./pricing/PricingGrid";

const PricingSection = ({ onPlanSelect }: { onPlanSelect: (plan: string) => void }) => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="container mx-auto px-4 py-16">
      <PricingHeader />
      
      <div className="flex flex-col items-center gap-8 mb-12">
        <BillingToggle isYearly={isYearly} onToggle={setIsYearly} />
      </div>

      <PricingGrid isYearly={isYearly} onPlanSelect={onPlanSelect} />
    </div>
  );
};

export default PricingSection;