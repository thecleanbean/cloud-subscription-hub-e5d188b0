import { Package } from "lucide-react";
import { motion } from "framer-motion";

interface PlanIconProps {
  icon: string;
  isPopular?: boolean;
}

export const PlanIcon = ({ icon, isPopular }: PlanIconProps) => (
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
);