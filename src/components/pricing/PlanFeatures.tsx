import { motion } from "framer-motion";
import { PricingFeatureItem } from "./PricingFeatureItem";

interface Feature {
  name: string;
  included: boolean;
  description?: string;
}

interface PlanFeaturesProps {
  features: Feature[];
}

export const PlanFeatures = ({ features }: PlanFeaturesProps) => (
  <div className="space-y-3 mb-8">
    {features.map((feature, index) => (
      <motion.div 
        key={index}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <PricingFeatureItem {...feature} />
      </motion.div>
    ))}
  </div>
);