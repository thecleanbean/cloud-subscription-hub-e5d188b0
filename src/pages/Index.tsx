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

  const handleRegistrationSubmit = (data: any) => {
    console.log("Registration data:", data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      {!showRegistration ? (
        <>
          <HeroSection />
          <CustomerJourney />
          <PricingSection onPlanSelect={handlePlanSelect} />
          <DeliverySection />
          <TestimonialsSection />
          <FAQSection />
          <ContactSection />
        </>
      ) : (
        <div className="container mx-auto px-4 py-32">
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