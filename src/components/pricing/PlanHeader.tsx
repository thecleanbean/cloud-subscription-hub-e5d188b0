import { motion } from "framer-motion";
import { PlanIcon } from "./PlanIcon";

interface PlanHeaderProps {
  name: string;
  price: string;
  annualPrice: string;
  description: string;
  icon: string;
  isPopular?: boolean;
}

export const PlanHeader = ({ 
  name, 
  price, 
  annualPrice, 
  description, 
  icon, 
  isPopular 
}: PlanHeaderProps) => (
  <div className="text-center mb-8">
    <PlanIcon icon={icon} isPopular={isPopular} />
    <h3 className="text-lg font-bold text-primary mb-2">{name}</h3>
    <div className="text-3xl font-black text-primary mb-2 tracking-tight">{price}</div>
    <div className="text-sm text-accent mb-4 font-medium">{annualPrice}</div>
    <p className="text-sm text-gray-600 leading-relaxed max-w-[250px] mx-auto">{description}</p>
  </div>
);