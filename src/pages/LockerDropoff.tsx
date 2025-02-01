import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import LockerDropoffForm from "@/components/locker/LockerDropoffForm";
import { useToast } from "@/components/ui/use-toast";
import { mockAPI } from "@/services/mockCleanCloudAPI";
import { useNavigate } from "react-router-dom";

const LockerDropoff = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Create customer if not signed in
      const customer = await mockAPI.createCustomer({
        name: data.name,
        email: data.email,
        phone: data.phone,
      });

      // Create order in CleanCloud
      await mockAPI.createOrder({
        customerId: customer.id,
        lockerNumber: data.lockerNumber,
        instructions: data.instructions,
        serviceTypes: data.serviceTypes,
        collectionDate: data.collectionDate,
        total: 0, // To be calculated based on items
      });

      toast({
        title: "Success!",
        description: "Your locker drop-off has been registered. We'll take care of your items!",
      });

      // Navigate to payment page instead of home
      navigate("/payment");
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <LockerDropoffForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default LockerDropoff;