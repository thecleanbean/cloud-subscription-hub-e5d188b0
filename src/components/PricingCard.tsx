import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { TooltipProvider } from "./ui/tooltip";
import { PricingFeatureItem } from "./pricing/PricingFeatureItem";
import { PricingCardHeader } from "./pricing/PricingCardHeader";

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
      >
        <Card 
          className={`relative h-full p-6 bg-white rounded-xl shadow-lg border 
            ${isPopular ? "border-secondary border-2" : "border-gray-200"} 
            transition-all duration-300 hover:shadow-xl
            before:absolute before:inset-0 before:z-0 before:bg-gradient-to-b before:from-white before:to-gray-50 before:opacity-50 before:rounded-xl
            ${isPopular ? "bg-gradient-to-b from-secondary/5 to-secondary/10" : ""}`}
        >
          {isPopular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <motion.span 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ 
                  duration: 0.2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="bg-secondary text-primary px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap shadow-lg"
              >
                Most Popular
              </motion.span>
            </div>
          )}
          
          <PricingCardHeader
            name={name}
            price={price}
            annualPrice={annualPrice}
            description={description}
            icon={icon}
            isPopular={isPopular}
          />
          
          <ul className="space-y-3 mb-6 relative z-10">
            {features.map((feature, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PricingFeatureItem {...feature} />
              </motion.li>
            ))}
          </ul>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSelect}
            className={`w-full py-3 px-4 rounded-lg transition-all duration-300 text-base font-semibold relative z-10
              ${isPopular
                ? "bg-secondary text-primary shadow-lg hover:bg-secondary-dark hover:shadow-xl"
                : "bg-primary text-white hover:bg-primary-light"}`}
          >
            Select Plan
          </motion.button>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
};