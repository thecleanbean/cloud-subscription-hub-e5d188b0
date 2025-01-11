import { useState } from "react";
import { PricingCard } from "./PricingCard";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { motion } from "framer-motion";

const PricingSection = ({ onPlanSelect }: { onPlanSelect: (plan: string) => void }) => {
  const [isYearly, setIsYearly] = useState(true);

  const plans = [
    {
      name: "Bag Swap",
      monthlyPrice: "£19.99",
      yearlyPrice: "£17.99",
      annualPrice: "£215.88/year",
      description: "Perfect for occasional laundry needs",
      features: [
        { name: "Pay per bag", included: true },
        { name: "Smart locker access", included: true },
        { name: "3-day turnaround", included: true },
        { name: "In-store pickup available", included: true },
        { name: "Home delivery (£8.35/month or £100.20/year)", included: true },
        { name: "Colour sorting service (£8.35/month or £100.20/year)", included: true },
      ],
      icon: "↻",
    },
    {
      name: "1 Bag Plan",
      monthlyPrice: "£29.99",
      yearlyPrice: "£26.99",
      annualPrice: "£323.89/year",
      description: "Perfect for individuals with minimal laundry needs",
      features: [
        { name: "1 Bag per month", included: true },
        { name: "Smart locker access", included: true },
        { name: "2-day turnaround", included: true },
        { name: "In-store pickup available", included: true },
        { name: "Home delivery (£8.35/month or £100.20/year)", included: true },
        { name: "Colour sorting service (£8.35/month or £100.20/year)", included: true },
      ],
      icon: "1",
    },
    {
      name: "2 Bags Plan",
      monthlyPrice: "£54.00",
      yearlyPrice: "£48.60",
      annualPrice: "£583.20/year",
      description: "Ideal for couples or small households",
      features: [
        { name: "2 Bags per month", included: true },
        { name: "Smart locker access", included: true },
        { name: "2-day turnaround", included: true },
        { name: "In-store pickup available", included: true },
        { name: "Home delivery (£8.35/month or £100.20/year)", included: true },
        { name: "Colour sorting service (£8.35/month or £100.20/year)", included: true },
      ],
      isPopular: true,
      icon: "2",
    },
    {
      name: "3 Bags Plan",
      monthlyPrice: "£78.00",
      yearlyPrice: "£70.20",
      annualPrice: "842.40/year",
      description: "Perfect for families",
      features: [
        { name: "3 Bags per month", included: true },
        { name: "Smart locker access", included: true },
        { name: "2-day turnaround", included: true },
        { name: "Priority processing", included: true },
        { name: "Home delivery (£8.35/month or £100.20/year)", included: true },
        { name: "Colour sorting service (£8.35/month or £100.20/year)", included: true },
      ],
      icon: "3",
    },
    {
      name: "4 Bags Plan",
      monthlyPrice: "£102.00",
      yearlyPrice: "£91.80",
      annualPrice: "£1,101.60/year",
      description: "Best value for large families",
      features: [
        { name: "4 Bags per month", included: true },
        { name: "Smart locker access", included: true },
        { name: "2-day turnaround", included: true },
        { name: "Priority processing", included: true },
        { name: "Home delivery (£8.35/month or £100.20/year)", included: true },
        { name: "Colour sorting service (£8.35/month or £100.20/year)", included: true },
      ],
      icon: "4",
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
            <span className="ml-2 text-sm text-accent">Save up to 10%</span>
          </Label>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <PricingCard
            key={plan.name}
            {...plan}
            price={isYearly ? plan.yearlyPrice : plan.monthlyPrice}
            annualPrice={isYearly ? `or ${plan.monthlyPrice}/month` : `or ${plan.annualPrice}`}
            onSelect={() => onPlanSelect(plan.name)}
          />
        ))}
      </div>
    </div>
  );
};

export default PricingSection;