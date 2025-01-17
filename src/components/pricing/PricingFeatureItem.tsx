import { Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PricingFeatureItemProps {
  name: string;
  included: boolean;
  description?: string;
}

export const PricingFeatureItem = ({ name, included, description }: PricingFeatureItemProps) => {
  const FeatureContent = () => (
    <div 
      className={`flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors
        ${included ? "text-gray-900" : "text-gray-400"}`}
    >
      <Check
        className={`w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0 
          ${included ? "text-secondary" : "text-gray-300"}`}
      />
      <span className="text-xs md:text-sm flex-grow">{name}</span>
    </div>
  );

  if (description) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <FeatureContent />
        </TooltipTrigger>
        <TooltipContent 
          side="right"
          className="max-w-xs bg-white p-3 rounded-lg shadow-lg border border-gray-200"
        >
          <p className="text-sm text-gray-700">{description}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return <FeatureContent />;
};