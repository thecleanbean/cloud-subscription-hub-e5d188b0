
import { motion } from "framer-motion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { PricingCard } from "../PricingCard";
import { pricingPlans, getCommonFeatures, calculateYearlyPrice } from "@/config/pricingPlans";

interface PricingGridProps {
  isYearly: boolean;
  onPlanSelect: (plan: string) => void;
}

export const PricingGrid = ({ isYearly, onPlanSelect }: PricingGridProps) => {
  const isMobile = useIsMobile();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <ScrollArea className="w-full rounded-lg">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-8 pb-4 
          ${isMobile ? 'min-w-[calc(100vw-2rem)]' : 'max-w-[1920px] mx-auto'}`}
      >
        {pricingPlans.map((plan, index) => {
          const features = plan.customFeatures 
            ? [
                { 
                  name: plan.name === "Weekly Plan" ? "1 Bag per week" : "Unlimited bag swaps (twice weekly)", 
                  included: true,
                  description: plan.name === "Weekly Plan" 
                    ? "One standard-sized laundry bag collected and returned weekly, perfect for regular laundry needs"
                    : "Exchange your dirty laundry bag for a clean one twice a week, perfect for high-volume needs"
                },
                ...getCommonFeatures("1 Bag", isYearly).slice(1)
              ]
            : getCommonFeatures(plan.icon === "1" ? "1 Bag" : `${plan.icon} Bags`, isYearly);

          return (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              className="h-full"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <PricingCard
                {...plan}
                price={isYearly ? calculateYearlyPrice(plan.monthlyPrice) : plan.monthlyPrice}
                annualPrice={isYearly ? `or ${plan.monthlyPrice}/month` : "Save 10% annually"}
                features={features}
                onSelect={() => onPlanSelect(plan.name)}
              />
            </motion.div>
          );
        })}
      </motion.div>
      <ScrollBar orientation="horizontal" className="md:hidden" />
    </ScrollArea>
  );
};
