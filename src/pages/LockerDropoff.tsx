
import LockerDropoffForm from "@/components/locker/LockerDropoffForm";
import { BackToHome } from "@/components/ui/back-to-home";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { FormData } from "@/types/locker";
import { useState } from "react";
import OrderConfirmation from "@/components/OrderConfirmation";

const LockerDropoff = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const handleSubmit = async (formData: FormData) => {
    try {
      console.log('Form submitted with data:', formData);
      
      // Here you would typically make an API call to your backend
      toast({
        title: "Processing Order",
        description: "Please wait while we process your order...",
      });

      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmittedData(formData);
      setIsSubmitted(true);
      
      toast({
        title: "Order Submitted Successfully",
        description: "Your locker dropoff has been registered.",
      });
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "There was a problem processing your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  if (isSubmitted && submittedData) {
    return (
      <OrderConfirmation
        customerName={`${submittedData.firstName} ${submittedData.lastName}`}
        planName={Object.entries(submittedData.serviceTypes)
          .filter(([_, value]) => value)
          .map(([key]) => key)
          .join(", ")}
        deliveryOption="Locker Dropoff"
        onClose={handleClose}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Locker Dropoff Service</h1>
          <p className="text-gray-600 mb-8">
            Please complete your details below to begin the dropoff process.
            All fields marked with <span className="text-red-500">*</span> are required.
          </p>
          
          <LockerDropoffForm onSubmit={handleSubmit} />
        </div>
      </div>
      <BackToHome />
    </div>
  );
};

export default LockerDropoff;
