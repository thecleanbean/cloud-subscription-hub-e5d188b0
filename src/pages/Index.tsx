import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { ContactSection } from "@/components/sections/ContactSection";
import PricingSection from "@/components/PricingSection";
import CustomerJourney from "@/components/CustomerJourney";
import DeliverySection from "@/components/DeliverySection";
import RegistrationForm from "@/components/RegistrationForm";

const Index = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);

  const handlePlanSelect = (planName: string) => {
    setSelectedPlan(planName);
    setShowRegistration(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {!showRegistration ? (
        <>
          <HeroSection />
          <div className="bg-white">
            <CustomerJourney />
            <PricingSection onPlanSelect={handlePlanSelect} />
            <DeliverySection />
            <TestimonialsSection />
            <FAQSection />
            <ContactSection />
          </div>
        </>
      ) : (
        <div className="container mx-auto px-4 py-32">
          <RegistrationForm
            selectedPlan={selectedPlan!}
            onSubmit={(data) => {
              console.log("Registration data:", data);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Index;