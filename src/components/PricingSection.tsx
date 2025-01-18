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

  const plans = [
    {
      name: "1 Bag Plan",
      monthlyPrice: "£31.95",
      yearlyPrice: calculateYearlyPrice("£31.95"),
      annualPrice: "Save 10% annually",
      description: "Perfect for individuals with minimal laundry needs",
      features: [
        { 
          name: "1 Bag per month", 
          included: true,
          description: "One standard-sized laundry bag that can hold up to 8kg of clothes"
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
      ],
      icon: "1",
    },
    {
      name: "2 Bags Plan",
      monthlyPrice: "£57.95",
      yearlyPrice: calculateYearlyPrice("£57.95"),
      annualPrice: "Save 10% annually",
      description: "Ideal for couples or small households",
      features: [
        { 
          name: "2 Bags per month", 
          included: true,
          description: "Two standard-sized laundry bags that can hold up to 16kg of clothes total"
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
      ],
      icon: "2",
    },
    {
      name: "3 Bags Plan",
      monthlyPrice: "£78.95",
      yearlyPrice: calculateYearlyPrice("£78.95"),
      annualPrice: "Save 10% annually",
      description: "Perfect for families",
      features: [
        { name: "3 Bags per month", included: true },
        { name: "Smart locker access", included: true },
        { name: "2-day turnaround", included: true },
        { name: "In-store pickup included", included: true },
        { name: "Optional home delivery (£7.95/month)", included: true },
        { name: "Optional sorting service (£5.95/month)", included: true },
      ],
      isPopular: true,
      icon: "3",
    },
    {
      name: "4 Bags Plan",
      monthlyPrice: "£100.95",
      yearlyPrice: "£1,208.95",
      annualPrice: "Save 10% annually",
      description: "Best value for large families",
      features: [
        { name: "4 Bags per month", included: true },
        { name: "Smart locker access", included: true },
        { name: "2-day turnaround", included: true },
        { name: "In-store pickup included", included: true },
        { name: "Optional home delivery (£7.95/month)", included: true },
        { name: "Optional sorting service (£5.95/month)", included: true },
      ],
      icon: "4",
    },
    {
      name: "Weekly Plan",
      monthlyPrice: "£109.95",
      yearlyPrice: "£1,324.95",
      annualPrice: "Save 10% annually",
      description: "1 Bag collected, cleaned and returned weekly",
      features: [
        { name: "1 Bag per week", included: true },
        { name: "Smart locker access", included: true },
        { name: "2-day turnaround", included: true },
        { name: "In-store pickup included", included: true },
        { name: "Optional home delivery (£7.95/month)", included: true },
        { name: "Optional sorting service (£5.95/month)", included: true },
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
        { name: "Unlimited bag swaps (twice weekly)", included: true },
        { name: "Smart locker access", included: true },
        { name: "2-day turnaround", included: true },
        { name: "In-store pickup included", included: true },
        { name: "Optional home delivery (£7.95/month)", included: true },
        { name: "Optional sorting service (£5.95/month)", included: true },
      ],
      icon: "↻",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <PricingHeader />
      
      <div className="flex flex-col items-center gap-6 mb-8">
        <BillingToggle isYearly={isYearly} onToggle={setIsYearly} />
      </div>

      <ScrollArea className="w-full rounded-lg">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4 md:gap-6 pb-4 ${isMobile ? 'min-w-[calc(100vw-2rem)]' : 'max-w-[1920px]'} mx-auto`}>
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
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
