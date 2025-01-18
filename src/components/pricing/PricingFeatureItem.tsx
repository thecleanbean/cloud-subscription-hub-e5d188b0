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
      <span className="text-sm flex-grow text-left">{name}</span>
    </motion.div>
  );

  return description ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="w-full text-left cursor-help">
          <FeatureContent />
        </button>
      </TooltipTrigger>
      <TooltipContent 
        side="right" 
        align="start"
        className="bg-white text-primary p-4 rounded-lg shadow-xl border border-gray-200 max-w-[300px] z-[9999]"
        sideOffset={20}
        avoidCollisions={true}
      >
        <p className="text-sm leading-relaxed whitespace-normal">{description}</p>
      </TooltipContent>
    </Tooltip>
  ) : (
    <FeatureContent />
  );
};