import { motion } from "framer-motion";
import { Check, ShoppingBag } from "lucide-react";
import { Card } from "./ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

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
        
        <div className="text-center mb-4 md:mb-6">
          <div className="flex justify-center mb-3 md:mb-4">
            <div className="relative w-12 h-12 md:w-16 md:h-16">
              <ShoppingBag className="w-full h-full text-primary" />
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-base md:text-lg font-bold text-primary">
                {icon}
              </span>
            </div>
          </div>
          <h3 className="text-base md:text-lg font-bold text-primary mb-2">{name}</h3>
          <div className="text-2xl md:text-3xl font-black text-primary mb-1 md:mb-2">{price}</div>
          <div className="text-xs md:text-sm text-accent mb-2">{annualPrice}</div>
          <p className="text-xs md:text-sm text-gray-600">{description}</p>
        </div>
        
        <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6">
          {features.map((feature, index) => (
            <li key={index}>
              {feature.description ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className={`flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors
                        ${feature.included ? "text-gray-900" : "text-gray-400"}`}
                    >
                      <Check
                        className={`w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0 
                          ${feature.included ? "text-secondary" : "text-gray-300"}`}
                      />
                      <span className="text-xs md:text-sm flex-grow">{feature.name}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="right"
                    className="max-w-xs bg-white p-3 rounded-lg shadow-lg border border-gray-200"
                  >
                    <p className="text-sm text-gray-700">{feature.description}</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <div 
                  className={`flex items-center p-2 rounded-lg
                    ${feature.included ? "text-gray-900" : "text-gray-400"}`}
                >
                  <Check
                    className={`w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0 
                      ${feature.included ? "text-secondary" : "text-gray-300"}`}
                  />
                  <span className="text-xs md:text-sm flex-grow">{feature.name}</span>
                </div>
              )}
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