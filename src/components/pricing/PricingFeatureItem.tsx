import { Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

interface PricingFeatureItemProps {
  name: string;
  included: boolean;
  description?: string;
}

export const PricingFeatureItem = ({ name, included, description }: PricingFeatureItemProps) => {
  const FeatureContent = () => (
    <motion.div 
      whileHover={{ x: 5 }}
      className={`flex items-center p-2.5 rounded-lg transition-all duration-200
        ${included ? "text-gray-900 hover:bg-gray-50" : "text-gray-400"}
        group relative`}
    >
      <Check
        className={`w-5 h-5 mr-3 flex-shrink-0 transition-transform duration-200 group-hover:scale-110
          ${included ? "text-secondary" : "text-gray-300"}`}
      />
      <span className="text-sm flex-grow font-medium text-left">{name}</span>
    </motion.div>
  );

  return description ? (
    <Tooltip>
      <TooltipTrigger asChild className="w-full text-left">
        <div className="cursor-help">
          <FeatureContent />
        </div>
      </TooltipTrigger>
      <TooltipContent 
        side="right" 
        align="start"
        className="z-50 bg-white p-4 rounded-lg shadow-xl border border-gray-100 max-w-[300px]"
      >
        <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
      </TooltipContent>
    </Tooltip>
  ) : (
    <FeatureContent />
  );
};