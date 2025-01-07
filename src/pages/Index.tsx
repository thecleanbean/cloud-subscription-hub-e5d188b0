import { useState } from "react";
import { motion } from "framer-motion";
import { PricingCard } from "@/components/PricingCard";
import { RegistrationForm } from "@/components/RegistrationForm";
import { Store, Home, RotateCw, Clock } from "lucide-react";

const plans = [
  {
    name: "1 Bag Plan",
    price: "£29.99/month",
    description: "Perfect for individuals with minimal laundry needs",
    features: [
      { name: "1 Bag per month", included: true },
      { name: "Smart locker access", included: true },
      { name: "2-day turnaround", included: true },
      { name: "In-store pickup available", included: true },
      { name: "Home delivery option", included: true },
      { name: "Colour sorting service", included: false },
    ],
    icon: "1",
  },
  {
    name: "2 Bags Plan",
    price: "£54.00/month",
    description: "Ideal for couples or small households",
    features: [
      { name: "2 Bags per month", included: true },
      { name: "Smart locker access", included: true },
      { name: "2-day turnaround", included: true },
      { name: "In-store pickup available", included: true },
      { name: "Home delivery option", included: true },
      { name: "Colour sorting service", included: true },
    ],
    isPopular: true,
    icon: "2",
  },
  {
    name: "3 Bags Plan",
    price: "£78.00/month",
    description: "Perfect for families",
    features: [
      { name: "3 Bags per month", included: true },
      { name: "Smart locker access", included: true },
      { name: "2-day turnaround", included: true },
      { name: "Priority processing", included: true },
      { name: "Home delivery included", included: true },
      { name: "Colour sorting service", included: true },
    ],
    icon: "3",
  },
  {
    name: "4 Bags Plan",
    price: "£102.00/month",
    description: "Best value for large families",
    features: [
      { name: "4 Bags per month", included: true },
      { name: "Smart locker access", included: true },
      { name: "2-day turnaround", included: true },
      { name: "Priority processing", included: true },
      { name: "Home delivery included", included: true },
      { name: "Colour sorting service", included: true },
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
    price: "+£4.50/month",
  },
];

const Index = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);

  const handlePlanSelect = (planName: string) => {
    setSelectedPlan(planName);
    setShowRegistration(true);
  };

  const handleRegistrationSubmit = (data: any) => {
    console.log("Registration data:", data);
    // Handle registration through CleanCloud API
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Laundry Subscription Plans
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your perfect plan and let us handle your laundry. All plans include our
            core features with flexible delivery options.
          </p>
        </motion.div>

        {!showRegistration ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16">
              {plans.map((plan) => (
                <PricingCard
                  key={plan.name}
                  {...plan}
                  onSelect={() => handlePlanSelect(plan.name)}
                />
              ))}
            </div>

            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-semibold text-center mb-8">
                Delivery Options
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {deliveryOptions.map((option) => (
                  <motion.div
                    key={option.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="p-6 bg-white rounded-xl shadow-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      {option.icon}
                      <div>
                        <h3 className="text-lg font-semibold">{option.title}</h3>
                        <p className="text-gray-600">{option.description}</p>
                      </div>
                    </div>
                    <p className="text-primary font-semibold">{option.price}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <Clock className="w-12 h-12 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">Turnaround Time</h3>
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