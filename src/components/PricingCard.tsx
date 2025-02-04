import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { TooltipProvider } from "./ui/tooltip";
import { PricingFeatureItem } from "./pricing/PricingFeatureItem";
import { Package } from "lucide-react";

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
          
          <div className="text-center mb-8">
            <motion.div 
              className="flex justify-center mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`relative inline-flex items-center justify-center w-16 h-16 rounded-xl
                ${isPopular ? 'bg-secondary/20' : 'bg-primary/10'}`}
              >
                <Package className={`w-8 h-8 ${isPopular ? 'text-secondary' : 'text-primary'}`} />
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-6 h-6 text-sm font-bold 
                  bg-white rounded-full border-2 border-current
                  ${isPopular ? 'text-secondary' : 'text-primary'}">
                  {icon}
                </span>
              </div>
            </motion.div>
            
            <h3 className="text-lg font-bold text-primary mb-2">{name}</h3>
            <div className="text-3xl font-black text-primary mb-2 tracking-tight">{price}</div>
            <div className="text-sm text-accent mb-4 font-medium">{annualPrice}</div>
            <p className="text-sm text-gray-600 leading-relaxed max-w-[250px] mx-auto">{description}</p>
          </div>
          
          <div className="space-y-3 mb-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PricingFeatureItem {...feature} />
              </motion.div>
            ))}
          </div>
          
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