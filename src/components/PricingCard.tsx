import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { TooltipProvider } from "./ui/tooltip";
import { PlanHeader } from "./pricing/PlanHeader";
import { PlanFeatures } from "./pricing/PlanFeatures";

interface PricingFeature {
  name: string;
  included: boolean;
  description?: string;
}

interface PricingCardProps {
  name: string;
  price: string;
  annualPrice: string;
  description: string;
  features: PricingFeature[];
  isPopular?: boolean;
  icon: string;
  onSelect: () => void;
}

export const PricingCard = ({
  name,
  price,
  annualPrice,
  description,
  features,
  isPopular,
  icon,
  onSelect,
}: PricingCardProps) => {
  return (
    <TooltipProvider>
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        className="h-full"
      >
        <Card 
          className={`relative h-full p-6 bg-white rounded-xl shadow-lg
            ${isPopular ? "border-2 border-secondary" : "border border-gray-200"} 
            transition-all duration-300 hover:shadow-xl`}
        >
          {isPopular && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-secondary text-primary px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                Most Popular
              </span>
            </div>
          )}
          
          <PlanHeader
            name={name}
            price={price}
            annualPrice={annualPrice}
            description={description}
            icon={icon}
            isPopular={isPopular}
          />
          
          <PlanFeatures features={features} />
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSelect}
            className={`w-full py-3 px-4 rounded-lg transition-all duration-300 text-base font-semibold
              ${isPopular
                ? "bg-secondary text-primary shadow-lg hover:bg-secondary/90"
                : "bg-primary text-white hover:bg-primary/90"}`}
          >
            Select Plan
          </motion.button>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
};