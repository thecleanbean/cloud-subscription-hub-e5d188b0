
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PricingSection from "./components/PricingSection";
import PaymentPage from "./pages/PaymentPage";
import LockerDropoff from "./pages/LockerDropoff";
import { useState } from "react";
import RegistrationForm from "./components/RegistrationForm";
import { AuthProvider } from "./contexts/AuthContext";
import { Navbar } from "./components/layout/Navbar";
import Home from "./pages/Home";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route 
                  path="/subscriptions" 
                  element={
                    selectedPlan ? (
                      <RegistrationForm 
                        selectedPlan={selectedPlan} 
                        onSubmit={() => {}} 
                      />
                    ) : (
                      <PricingSection onPlanSelect={setSelectedPlan} />
                    )
                  } 
                />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/locker-dropoff" element={<LockerDropoff />} />
                {/* Redirect index to home */}
                <Route path="/index" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
