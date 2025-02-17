
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { findCustomerByEmail } from "@/services/customerService";
import { FormData, CustomerType } from "@/types/locker";
import CustomerDetailsForm from "@/components/registration/CustomerDetailsForm";
import { toast } from "@/components/ui/use-toast";

interface StepTwoProps {
  formData: FormData;
  updateFormData: (field: string, value: string) => void;
  isValidPostcode: boolean;
  onPostcodeValidate: (postcode: string) => void;
  customerType: CustomerType;
  onNext: () => void;
}

const StepTwo = ({ 
  formData, 
  updateFormData, 
  isValidPostcode, 
  onPostcodeValidate, 
  customerType,
  onNext 
}: StepTwoProps) => {
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const handleNext = async () => {
    if (!formData.email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    setIsCheckingEmail(true);
    try {
      if (customerType === 'returning') {
        const customer = await findCustomerByEmail(formData.email);
        if (!customer) {
          toast({
            title: "Customer Not Found",
            description: "We couldn't find an account with this email. Please try again or create a new account.",
            variant: "destructive"
          });
          return;
        }
        // Pre-fill the form data with customer details
        updateFormData("firstName", customer.firstName || "");
        updateFormData("lastName", customer.lastName || "");
        updateFormData("mobile", customer.mobile || "");
        updateFormData("address", customer.customerAddress || "");
      } else {
        // For new customers, validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'mobile', 'postcode', 'address'];
        const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]);
        
        if (missingFields.length > 0) {
          toast({
            title: "Required Fields Missing",
            description: `Please fill in all required fields: ${missingFields.join(', ')}`,
            variant: "destructive"
          });
          return;
        }
      }
      
      onNext();
    } catch (error) {
      console.error('Error checking customer:', error);
      toast({
        title: "Error",
        description: "There was a problem checking your account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCheckingEmail(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold text-primary mb-2">
          {customerType === 'returning' ? 'Welcome Back' : 'Create Account'}
        </h3>
        <p className="text-muted-foreground">
          {customerType === 'returning' 
            ? 'Please enter your email to continue'
            : 'Please fill in your details to create an account'}
        </p>
      </div>

      {customerType === 'returning' ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
              placeholder="Enter your email"
              className="mt-1"
            />
          </div>

          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-700">
              Enter your email to continue with your order.
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <CustomerDetailsForm
          formData={formData}
          onChange={updateFormData}
          isValidPostcode={isValidPostcode}
          onPostcodeValidate={onPostcodeValidate}
        />
      )}

      <Button
        onClick={handleNext}
        disabled={isCheckingEmail}
        className="w-full mt-4"
      >
        {isCheckingEmail ? "Checking..." : "Next"}
      </Button>
    </motion.div>
  );
};

export default StepTwo;
