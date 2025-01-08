import { useState } from "react";
import { motion } from "framer-motion";
import { PricingCard } from "@/components/PricingCard";
import { Store, Home, Clock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import RegistrationForm from "@/components/RegistrationForm";

const plans = [
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

const deliveryOptions = [
  {
    icon: <Store className="w-12 h-12 text-primary" />,
    title: "In-store Pickup",
    description: "Available 7 days a week, 8:30-20:30",
    price: "Included",
  },
  {
    icon: <Home className="w-12 h-12 text-primary" />,
    title: "Home Delivery",
    description: "Monday to Friday, 7am-5PM",
    price: "£8.35/month or £100.20/year",
  },
];

const Index = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [isYearly, setIsYearly] = useState(true);

  const handlePlanSelect = (planName: string) => {
    setSelectedPlan(planName);
    setShowRegistration(true);
  };

  const handleRegistrationSubmit = (data: any) => {
    console.log("Registration data:", data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 font-sans">
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

        {!showRegistration ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16">
              {plans.map((plan) => (
                <PricingCard
                  key={plan.name}
                  {...plan}
                  price={isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  annualPrice={isYearly ? `or ${plan.monthlyPrice}/month` : `or ${plan.annualPrice}`}
                  onSelect={() => handlePlanSelect(plan.name)}
                />
              ))}
            </div>

            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-primary text-center mb-8">
                Delivery Options
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {deliveryOptions.map((option) => (
                  <motion.div
                    key={option.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="p-6 bg-white rounded-xl shadow-lg border border-gray-200 hover:border-secondary transition-colors duration-300"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      {option.icon}
                      <div>
                        <h3 className="text-lg font-bold text-primary">{option.title}</h3>
                        <p className="text-gray-600">{option.description}</p>
                      </div>
                    </div>
                    <p className="text-secondary-dark font-semibold">{option.price}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-white rounded-xl shadow-lg border border-gray-200 hover:border-secondary transition-colors duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <Clock className="w-12 h-12 text-primary" />
                  <div>
                    <h3 className="text-lg font-bold text-primary">Turnaround Time</h3>
                    <p className="text-gray-600">
                      Standard 2-day turnaround for all orders
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  *Excluding Sundays and bank holidays
                </p>
              </div>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <RegistrationForm
              selectedPlan={selectedPlan!}
              onSubmit={handleRegistrationSubmit}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Index;
