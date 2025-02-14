
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";
import StepThree from "./steps/StepThree";
import StepFour from "./steps/StepFour";
import CustomerDetailsForm from "../registration/CustomerDetailsForm";
import ProgressBar from "./ProgressBar";
import { useLockerDropoff } from "@/hooks/useLockerDropoff";
import { FormData } from "@/types/locker";
import { toast } from "@/components/ui/use-toast";

interface LockerDropoffFormProps {
  onSubmit: (data: any) => void;
}

const LockerDropoffForm = ({ onSubmit }: LockerDropoffFormProps) => {
  const [step, setStep] = useState(1);
  const [isValidPostcode, setIsValidPostcode] = useState(true);
  const {
    customerType,
    setCustomerType,
    formData,
    updateFormData,
    handleSubmit,
  } = useLockerDropoff({ onSubmit });

  const handlePostcodeValidate = (postcode: string) => {
    const isValid = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i.test(postcode);
    setIsValidPostcode(isValid);
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 2:
        if (customerType === 'new') {
          const requiredFields: (keyof FormData)[] = ['firstName', 'lastName', 'email', 'mobile', 'postcode', 'address'];
          const missingFields = requiredFields.filter(field => !formData[field]);
          
          if (missingFields.length > 0) {
            toast({
              title: "Required Fields Missing",
              description: `Please fill in all required fields: ${missingFields.join(', ')}`,
              variant: "destructive",
            });
            return false;
          }
          return isValidPostcode;
        }
        return formData.email !== '';
      case 3:
        const hasServiceSelected = Object.values(formData.serviceTypes).some(value => value);
        if (!hasServiceSelected) {
          toast({
            title: "Service Selection Required",
            description: "Please select at least one service type",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 4:
        if (formData.lockerNumber.length === 0) {
          toast({
            title: "Locker Selection Required",
            description: "Please select at least one locker",
            variant: "destructive",
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(step)) {
      handleSubmit(e);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepOne
            customerType={customerType}
            setCustomerType={setCustomerType}
          />
        );
      case 2:
        if (customerType === 'returning') {
          return (
            <StepTwo
              email={formData.email}
              setEmail={(email) => updateFormData("email" as keyof FormData, email)}
            />
          );
        } else {
          return (
            <CustomerDetailsForm
              formData={{
                firstName: formData.firstName || "",
                lastName: formData.lastName || "",
                email: formData.email || "",
                mobile: formData.mobile || "",
                postcode: formData.postcode || "",
                address: formData.address || "",
              }}
              onChange={(field, value) => updateFormData(field as keyof FormData, value)}
              isValidPostcode={isValidPostcode}
              onPostcodeValidate={handlePostcodeValidate}
            />
          );
        }
      case 3:
        return (
          <StepThree
            serviceTypes={formData.serviceTypes}
            updateServiceTypes={(newTypes) => updateFormData("serviceTypes", newTypes)}
          />
        );
      case 4:
        return (
          <StepFour
            lockerNumber={formData.lockerNumber}
            collectionDate={formData.collectionDate}
            notes={formData.notes}
            updateFormData={updateFormData}
          />
        );
      default:
        return null;
    }
  };

  const totalSteps = customerType === 'returning' ? 3 : 4;

  const canProceed = () => {
    if (step === 2 && customerType === 'new') {
      return isValidPostcode;
    }
    return true;
  };

  return (
    <Card className="max-w-2xl mx-auto p-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">Locker Drop-off</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Complete your locker dropoff in just a few steps
        </p>
      </div>

      <ProgressBar currentStep={step} totalSteps={totalSteps} />

      <form onSubmit={handleFormSubmit} className="space-y-6">
        {renderStep()}

        <div className="flex justify-between pt-6">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((prev) => prev - 1)}
            >
              Previous
            </Button>
          )}
          {step < totalSteps ? (
            <Button
              type="button"
              onClick={handleNext}
              className={cn(
                "ml-auto",
                step === 1 && "w-full"
              )}
              disabled={!canProceed()}
            >
              Next Step
            </Button>
          ) : (
            <Button type="submit" className="ml-auto">
              Complete Drop-off
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default LockerDropoffForm;
