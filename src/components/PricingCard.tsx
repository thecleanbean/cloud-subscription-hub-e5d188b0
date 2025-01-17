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
      <Card 
        className={`relative h-full p-4 md:p-6 bg-white rounded-xl shadow-lg border 
          ${isPopular ? "border-secondary" : "border-gray-200"} 
          transition-all duration-300 hover:shadow-xl hover:border-accent-light`}
      >
        {isPopular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-secondary text-primary px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
              Most Popular
            </span>
          </div>
        )}
        
        <PricingCardHeader
          name={name}
          price={price}
          annualPrice={annualPrice}
          description={description}
          icon={icon}
        />
        
        <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6">
          {features.map((feature, index) => (
            <li key={index}>
              <PricingFeatureItem {...feature} />
            </li>
          ))}
        </ul>
        
        <button
          onClick={onSelect}
          className={`w-full py-2 px-4 rounded-lg transition-all duration-300 text-sm md:text-base 
            ${isPopular
              ? "bg-secondary text-primary-dark hover:bg-secondary-dark"
              : "bg-primary text-white hover:bg-primary-light"}`}
        >
          Select Plan
        </button>
      </Card>
    </TooltipProvider>
  );
};