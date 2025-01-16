import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { mockAPI } from "@/services/mockCleanCloudAPI";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import PromotionalCards from "@/components/collection/PromotionalCards";
import BookingForm from "@/components/collection/BookingForm";

const CollectionBooking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (bookingData: {
    date: string;
    time: string;
    items: string[];
    notes: string;
  }) => {
    setIsLoading(true);

    try {
      const order = await mockAPI.createOrder({
        customerId: "demo-customer",
        plan: "one-time",
        deliveryOption: "pickup",
        addons: {
          homeDelivery: false,
          sortingService: false,
        },
        total: 29.99,
        billingPeriod: "monthly",
      });

      // After order creation, redirect to payment
      navigate("/payment", {
        state: {
          orderDetails: {
            orderId: order.id,
            total: 29.99,
            items: bookingData.items,
            date: bookingData.date,
            time: bookingData.time,
          },
        },
      });

      toast({
        title: "Booking Created!",
        description: `Your collection is scheduled for ${bookingData.date} at ${bookingData.time}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-primary hover:text-primary-dark"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-primary mb-8 text-center">
            Book a Collection
          </h1>

          <PromotionalCards />

          <Card className="p-6 shadow-lg">
            <BookingForm onSubmit={handleSubmit} isLoading={isLoading} />
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CollectionBooking;