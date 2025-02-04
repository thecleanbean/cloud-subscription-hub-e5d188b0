import { useState } from "react";
import { PricingCard } from "./PricingCard";
import { motion } from "framer-motion";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import BillingToggle from "./pricing/BillingToggle";
import PricingHeader from "./pricing/PricingHeader";

const PricingSection = ({ onPlanSelect }: { onPlanSelect: (plan: string) => void }) => {
  const [isYearly, setIsYearly] = useState(false);
  const isMobile = useIsMobile();

  const calculateYearlyPrice = (monthlyPrice: string) => {
    const price = parseFloat(monthlyPrice.replace('£', ''));
    const yearlyPrice = (price * 12 * 0.9).toFixed(2); // 10% discount
    return `£${yearlyPrice}`;
  };

  const calculateYearlyAddonPrice = (monthlyPrice: number) => {
    return (monthlyPrice * 12 * 0.9).toFixed(2); // 10% discount on annual addons
  };

  const getCommonFeatures = (bagCount: string) => [
    { 
      name: `${bagCount} per month`, 
      included: true,
      description: `${bagCount === '1 Bag' ? 'One' : bagCount} standard-sized laundry bag${bagCount !== '1 Bag' ? 's' : ''} that can hold up to ${parseInt(bagCount) * 8}kg of clothes total`
    },
    { 
      name: "Smart locker access", 
      included: true,
      description: "24/7 access to our secure smart lockers. Drop off and pick up your laundry at your convenience"
    },
    { 
      name: "2-day turnaround", 
      included: true,
      description: "Get your clean clothes back within 48 hours of drop-off"
    },
    { 
      name: "In-store pickup included", 
      included: true,
      description: "Free pickup from any of our store locations"
    },
    { 
      name: `Optional home delivery (${isYearly ? '£' + calculateYearlyAddonPrice(7.95) : '£7.95'})/${isYearly ? 'year' : 'month'}`, 
      included: true,
      description: "Have your clean clothes delivered right to your doorstep"
    },
    { 
      name: `Optional sorting service (${isYearly ? '£' + calculateYearlyAddonPrice(5.95) : '£5.95'})/${isYearly ? 'year' : 'month'}`, 
      included: true,
      description: "We'll sort your clothes by color, fabric type, and care instructions"
    },
  ];

  const plans = [
    {
      name: "1 Bag Plan",
      monthlyPrice: "£31.95",
      yearlyPrice: calculateYearlyPrice("£31.95"),
      annualPrice: "Save 10% annually",
      description: "Perfect for individuals with minimal laundry needs",
      features: getCommonFeatures("1 Bag"),
      icon: "1",
    },
    {
      name: "2 Bags Plan",
      monthlyPrice: "£57.95",
      yearlyPrice: calculateYearlyPrice("£57.95"),
      annualPrice: "Save 10% annually",
      description: "Ideal for couples or small households",
      features: getCommonFeatures("2 Bags"),
      icon: "2",
    },
    {
      name: "3 Bags Plan",
      monthlyPrice: "£78.95",
      yearlyPrice: calculateYearlyPrice("£78.95"),
      annualPrice: "Save 10% annually",
      description: "Perfect for families",
      features: getCommonFeatures("3 Bags"),
      isPopular: true,
      icon: "3",
    },
    {
      name: "4 Bags Plan",
      monthlyPrice: "£100.95",
      yearlyPrice: calculateYearlyPrice("£100.95"),
      annualPrice: "Save 10% annually",
      description: "Best value for large families",
      features: getCommonFeatures("4 Bags"),
      icon: "4",
    },
    {
      name: "Weekly Plan",
      monthlyPrice: "£109.95",
      yearlyPrice: calculateYearlyPrice("£109.95"),
      annualPrice: "Save 10% annually",
      description: "1 Bag collected, cleaned and returned weekly",
      features: [
        { 
          name: "1 Bag per week", 
          included: true,
          description: "One standard-sized laundry bag collected and returned weekly, perfect for regular laundry needs"
        },
        ...getCommonFeatures("1 Bag").slice(1)
      ],
      icon: "W",
    },
    {
      name: "Bag Swap",
      monthlyPrice: "£179.95",
      yearlyPrice: calculateYearlyPrice("£179.95"),
      annualPrice: "Save 10% annually",
      description: "Drop Clean, Take Dirty - twice a week",
      features: [
        { 
          name: "Unlimited bag swaps (twice weekly)", 
          included: true,
          description: "Exchange your dirty laundry bag for a clean one twice a week, perfect for high-volume needs"
        },
        ...getCommonFeatures("1 Bag").slice(1)
      ],
      icon: "↻",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <PricingHeader />
      
      <div className="flex flex-col items-center gap-8 mb-12">
        <BillingToggle isYearly={isYearly} onToggle={setIsYearly} />
      </div>

      <ScrollArea className="w-full rounded-lg">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-6 md:gap-8 pb-4 ${isMobile ? 'min-w-[calc(100vw-2rem)]' : 'max-w-[1920px]'} mx-auto`}>
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <PricingCard
                {...plan}
                price={isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                annualPrice={isYearly ? `or ${plan.monthlyPrice}/month` : plan.annualPrice}
                onSelect={() => onPlanSelect(plan.name)}
              />
            </motion.div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="md:hidden" />
      </ScrollArea>
    </div>
  );
};

export default PricingSection;