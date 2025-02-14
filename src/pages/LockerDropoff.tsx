
import LockerDropoffForm from "@/components/locker/LockerDropoffForm";
import { BackToHome } from "@/components/ui/back-to-home";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { FormData } from "@/types/locker";

const LockerDropoff = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData: FormData) => {
    try {
      // Validate required fields
      if (!formData.mobile || !formData.address?.trim()) {
        toast({
          title: "Required Fields Missing",
          description: "Please fill in all required fields including mobile number and address.",
          variant: "destructive",
        });
        return;
      }

      // Validate mobile number format (UK format)
      const mobileRegex = /^(?:\+44|0)[0-9]{10}$/;
      if (!mobileRegex.test(formData.mobile)) {
        toast({
          title: "Invalid Mobile Number",
          description: "Please enter a valid UK mobile number.",
          variant: "destructive",
        });
        return;
      }

      // Validate address length
      if (formData.address.trim().length < 5) {
        toast({
          title: "Invalid Address",
          description: "Please enter a complete address.",
          variant: "destructive",
        });
        return;
      }

      // Validate service type selection
      if (!formData.serviceTypes.laundry && !formData.serviceTypes.duvets && !formData.serviceTypes.dryCleaning) {
        toast({
          title: "Service Type Required",
          description: "Please select at least one service type.",
          variant: "destructive",
        });
        return;
      }

      // Validate locker selection
      if (formData.lockerNumber.length === 0) {
        toast({
          title: "Locker Selection Required",
          description: "Please select at least one locker.",
          variant: "destructive",
        });
        return;
      }

      console.log('Form submitted with valid data:', {
        ...formData,
        collectionDate: formData.collectionDate.toISOString(),
      });
      
      toast({
        title: "Order Submitted Successfully",
        description: "Your locker dropoff has been registered.",
      });
      
      // Redirect to home or confirmation page
      navigate('/');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "There was a problem processing your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Locker Dropoff Service</h1>
          <p className="text-gray-600 mb-8">
            Please complete your details below to begin the dropoff process.
          </p>
          
          <LockerDropoffForm onSubmit={handleSubmit} />
        </div>
      </div>
      <BackToHome />
    </div>
  );
};

export default LockerDropoff;
