
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { findCustomerByEmail } from "@/services/customerService";
import { FormData } from "@/types/locker";
import CustomerDetailsForm from "@/components/registration/CustomerDetailsForm";

interface StepTwoProps {
  formData: FormData;
  updateFormData: (field: string, value: string) => void;
  isValidPostcode: boolean;
  onPostcodeValidate: (postcode: string) => void;
}

const StepTwo = ({ formData, updateFormData, isValidPostcode, onPostcodeValidate }: StepTwoProps) => {
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isExistingCustomer, setIsExistingCustomer] = useState(false);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);

  const checkExistingCustomer = async () => {
    if (!formData.email) return;
    
    setIsCheckingEmail(true);
    try {
      const customer = await findCustomerByEmail(formData.email);
      if (customer) {
        setIsExistingCustomer(true);
        // Update form with existing customer details
        updateFormData("firstName", customer.firstName || "");
        updateFormData("lastName", customer.lastName || "");
        updateFormData("mobile", customer.mobile || customer.customerTel || "");
        updateFormData("address", customer.customerAddress || "");
      } else {
        setShowNewCustomerForm(true);
      }
    } catch (error) {
      console.error('Error checking customer:', error);
      setShowNewCustomerForm(true);
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
        <h3 className="text-2xl font-semibold text-primary mb-2">Welcome</h3>
        <p className="text-muted-foreground">
          Please enter your email to continue
        </p>
      </div>

      {!isExistingCustomer && !showNewCustomerForm && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                required
                className="mt-1"
              />
              <Button 
                onClick={checkExistingCustomer}
                disabled={!formData.email || isCheckingEmail}
              >
                {isCheckingEmail ? "Checking..." : "Continue"}
              </Button>
            </div>
          </div>

          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-700">
              Enter your email to check if you have an existing account.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {(isExistingCustomer || showNewCustomerForm) && (
        <div>
          {isExistingCustomer && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <Info className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-700">
                Welcome back! We've found your account and pre-filled your details.
              </AlertDescription>
            </Alert>
          )}

          {showNewCustomerForm && (
            <Alert className="mb-6">
              <Info className="h-4 w-4" />
              <AlertDescription>
                No existing account found. Please fill in your details to continue.
              </AlertDescription>
            </Alert>
          )}

          <CustomerDetailsForm
            formData={formData}
            onChange={updateFormData}
            isValidPostcode={isValidPostcode}
            onPostcodeValidate={onPostcodeValidate}
          />
        </div>
      )}
    </motion.div>
  );
};

export default StepTwo;
