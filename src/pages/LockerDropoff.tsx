import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import LockerDropoffForm from "@/components/locker/LockerDropoffForm";
import { useToast } from "@/components/ui/use-toast";
import { mockAPI } from "@/services/mockCleanCloudAPI";
import { useNavigate } from "react-router-dom";

const LockerDropoff = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
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
        pin: data.pin,
        instructions: data.instructions,
        serviceTypes: data.serviceTypes,
        collectionDate: data.collectionDate,
        total: 0, // To be calculated based on items
      });

      toast({
        title: "Drop-off Registered",
        description: "We'll process your items according to your instructions.",
      });

      navigate("/");
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <LockerDropoffForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default LockerDropoff;