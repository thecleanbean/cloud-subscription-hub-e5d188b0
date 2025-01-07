import { useState } from "react";
import { motion } from "framer-motion";
import { PricingCard } from "@/components/PricingCard";
import { RegistrationForm } from "@/components/RegistrationForm";

const plans = [
  {
    name: "One Plan",
    price: "£99/month",
    description: "Perfect for small to medium-sized businesses",
    features: [
      { name: "Unlimited Users", included: true },
      { name: "24/7 Support", included: true },
      { name: "Real-time Analytics", included: true },
      { name: "Custom Reports", included: true },
      { name: "API Access", included: true },
      { name: "Advanced Integrations", included: false },
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored solutions for larger organizations",
    features: [
      { name: "Unlimited Users", included: true },
      { name: "24/7 Priority Support", included: true },
      { name: "Real-time Analytics", included: true },
      { name: "Custom Reports", included: true },
      { name: "API Access", included: true },
      { name: "Advanced Integrations", included: true },
    ],
    isPopular: true,
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
    // Additional handling after successful registration
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
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your business needs. All plans include our
            core features with no hidden costs.
          </p>
        </motion.div>

        {!showRegistration ? (
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <PricingCard
                key={plan.name}
                {...plan}
                onSelect={() => handlePlanSelect(plan.name)}
              />
            ))}
          </div>
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