import { motion } from "framer-motion";
import { Check, ShoppingBag } from "lucide-react";

interface PricingFeature {
  name: string;
  included: boolean;
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative p-6 bg-white rounded-xl shadow-lg border ${
        isPopular ? "border-accent" : "border-gray-200"
      } transition-all duration-300 hover:shadow-xl hover:border-accent-light`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="relative w-16 h-16">
            <ShoppingBag className="w-full h-full text-primary" />
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-primary">
              {icon}
            </span>
          </div>
        </div>
        <h3 className="text-lg font-bold text-primary mb-2">{name}</h3>
        <div className="text-3xl font-black text-primary mb-2">{price}</div>
        <div className="text-sm text-accent mb-2">{annualPrice}</div>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li
            key={index}
            className={`flex items-center ${
              feature.included ? "text-gray-900" : "text-gray-400"
            }`}
          >
            <Check
              className={`w-5 h-5 mr-2 ${
                feature.included ? "text-accent" : "text-gray-300"
              }`}
            />
            <span className="text-sm">{feature.name}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onSelect}
        className={`w-full py-2 px-4 rounded-lg transition-all duration-300 ${
          isPopular
            ? "bg-accent text-white hover:bg-accent-dark"
            : "bg-primary text-white hover:bg-primary-light"
        }`}
      >
        Select Plan
      </button>
    </motion.div>
  );
};