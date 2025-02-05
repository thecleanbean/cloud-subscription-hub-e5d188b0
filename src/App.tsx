
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CollectionBooking from "./pages/CollectionBooking";
import PaymentPage from "./pages/PaymentPage";
import LockerDropoff from "./pages/LockerDropoff";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/subscriptions" replace />} />
          <Route path="/subscriptions" element={<CollectionBooking />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/locker-dropoff" element={<LockerDropoff />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
