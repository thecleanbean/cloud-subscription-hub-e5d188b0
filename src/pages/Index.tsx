import { useState } from "react";
import { Link } from "react-router-dom";
import CustomerJourney from "@/components/CustomerJourney";
import PricingSection from "@/components/PricingSection";
import DeliverySection from "@/components/DeliverySection";
import RegistrationForm from "@/components/RegistrationForm";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);

  const handlePlanSelect = (planName: string) => {
    setSelectedPlan(planName);
    setShowRegistration(true);
  };

  const handleRegistrationSubmit = (data: any) => {
    console.log("Registration data:", data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 font-sans">
      {!showRegistration ? (
        <>
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <Button asChild variant="outline">
                <Link to="/book-collection">Book a One-time Collection</Link>
              </Button>
            </div>
          </div>
          <PricingSection onPlanSelect={handlePlanSelect} />
          <CustomerJourney />
          <DeliverySection />
        </>
      ) : (
        <div className="container mx-auto px-4 py-16">
          <RegistrationForm
            selectedPlan={selectedPlan!}
            onSubmit={handleRegistrationSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default Index;