
import LockerDropoffForm from "@/components/locker/LockerDropoffForm";
import { BackToHome } from "@/components/ui/back-to-home";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const LockerDropoff = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    try {
      console.log('Form submitted:', data);
      
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
