import { useState } from "react";
import { PricingCard } from "./PricingCard";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { motion } from "framer-motion";

const PricingSection = ({ onPlanSelect }: { onPlanSelect: (plan: string) => void }) => {
  const [isYearly, setIsYearly] = useState(true);

  const plans = [
    {
      name: "1 Bag Plan",
      monthlyPrice: "£31.95",
      yearlyPrice: "£374.95",
      annualPrice: "Save 10% annually",
      description: "Perfect for individuals with minimal laundry needs",
      features: [
        { name: "1 Bag per month", included: true },
        { name: "Smart locker access", included: true },
        { name: "2-day turnaround", included: true },
        { name: "In-store pickup included", included: true },
        { name: "Optional home delivery (£7.95/month)", included: true },
        { name: "Optional sorting service (£5.95/month)", included: true },
      ],
      icon: "1",
    },
    {
      name: "2 Bags Plan",
      monthlyPrice: "£57.95",
      yearlyPrice: "£690.95",
      annualPrice: "Save 10% annually",
      description: "Ideal for couples or small households",
      features: [
        { name: "2 Bags per month", included: true },
        { name: "Smart locker access", included: true },
        { name: "2-day turnaround", included: true },
        { name: "In-store pickup included", included: true },
        { name: "Optional home delivery (£7.95/month)", included: true },
        { name: "Optional sorting service (£5.95/month)", included: true },
      ],
      icon: "2",
    },
    {
      name: "3 Bags Plan",
      monthlyPrice: "£78.95",
      yearlyPrice: "£949.95",
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
      yearlyPrice: "£2,158.95",
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
      isPopular: true,
      icon: "↻",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-black text-primary mb-4">
          MORE TIME, LESS LAUNDRY
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Choose your perfect plan and let us handle your laundry. All plans include our
          core features with flexible delivery options.
        </p>
        
        <div className="flex items-center justify-center gap-4 mb-8">
          <Label htmlFor="billing-toggle" className={`text-lg ${!isYearly ? 'text-primary font-bold' : 'text-gray-500'}`}>
            Monthly
          </Label>
          <Switch
            id="billing-toggle"
            checked={isYearly}
            onCheckedChange={setIsYearly}
            className="data-[state=checked]:bg-secondary"
          />
          <Label htmlFor="billing-toggle" className={`text-lg ${isYearly ? 'text-primary font-bold' : 'text-gray-500'}`}>
            Yearly
            <span className="ml-2 text-sm text-accent">Save 10%</span>
          </Label>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-8 max-w-[1920px] mx-auto">
        {plans.map((plan) => (
          <PricingCard
            key={plan.name}
            {...plan}
            price={isYearly ? plan.yearlyPrice : plan.monthlyPrice}
            annualPrice={isYearly ? `or ${plan.monthlyPrice}/month` : plan.annualPrice}
            onSelect={() => onPlanSelect(plan.name)}
          />
        ))}
      </div>
    </div>
  );
};

export default PricingSection;