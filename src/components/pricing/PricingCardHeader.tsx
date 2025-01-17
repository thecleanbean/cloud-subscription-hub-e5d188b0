import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

interface PricingCardHeaderProps {
  name: string;
  price: string;
  annualPrice: string;
  description: string;
  icon: string;
  isPopular?: boolean;
}

export const PricingCardHeader = ({
  name,
  price,
  annualPrice,
  description,
  icon,
  isPopular,
}: PricingCardHeaderProps) => {
  return (
    <div className="text-center mb-8 relative z-10">
      <motion.div 
        className="flex justify-center mb-4"
        whileHover={{ rotate: 5 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative w-16 h-16">
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
  );
};