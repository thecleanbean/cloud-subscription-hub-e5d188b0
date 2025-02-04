import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { TooltipProvider } from "./ui/tooltip";
import { PricingFeatureItem } from "./pricing/PricingFeatureItem";
import { PricingCardHeader } from "./pricing/PricingCardHeader";
import { ShoppingBag } from "lucide-react";

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
          className={`relative h-full p-6 bg-white rounded-xl shadow-lg border 
            ${isPopular ? "border-secondary border-2" : "border-gray-200"} 
            transition-all duration-300 hover:shadow-xl`}
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
          
          <div className="text-center mb-8 relative z-10">
            <motion.div 
              className="flex justify-center mb-4"
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <div className={`relative w-16 h-16 rounded-full ${isPopular ? 'bg-secondary/10' : 'bg-primary/10'} p-3`}>
                <ShoppingBag className={`w-full h-full ${isPopular ? 'text-secondary' : 'text-primary'}`} />
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-primary">
                  {icon}
                </span>
              </div>
            </motion.div>
            <h3 className="text-lg font-bold text-primary mb-2">{name}</h3>
            <div className="text-3xl font-black text-primary mb-2 tracking-tight">{price}</div>
            <div className="text-sm text-accent mb-3 font-medium">{annualPrice}</div>
            <p className="text-sm text-gray-600 leading-relaxed max-w-[250px] mx-auto">{description}</p>
          </div>
          
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
                ? "bg-secondary text-primary shadow-lg hover:bg-secondary/90 hover:shadow-xl"
                : "bg-primary text-white hover:bg-primary/90"}`}
          >
            Select Plan
          </motion.button>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
};