
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { FormData } from "@/types/locker";
import { toast } from "@/components/ui/use-toast";
import { useLockerDropoff } from "@/hooks/useLockerDropoff";
import ProgressBar from "./ProgressBar";
import FormHeader from "./FormHeader";
import FormNavigation from "./FormNavigation";
import FormStepRenderer from "./FormStepRenderer";

interface LockerDropoffFormProps {
  onSubmit: (data: FormData) => void;
}

const LockerDropoffForm = ({ onSubmit }: LockerDropoffFormProps) => {
  const [step, setStep] = useState(1);
  const [isValidPostcode, setIsValidPostcode] = useState(true);
  const {
    customerType,
    setCustomerType,
    formData,
    updateFormData,
    submitForm,
    isLoading
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
    console.log('handleNext called on step:', step);
    if (validateStep(step)) {
      if (step === 4) {
        console.log('On final step, calling submitForm');
        submitForm();
      } else {
        setStep(prev => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    setStep(prev => prev - 1);
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
      <FormHeader />
      <ProgressBar currentStep={step} totalSteps={totalSteps} />

      <div className="space-y-6">
        <FormStepRenderer
          step={step}
          customerType={customerType}
          setCustomerType={setCustomerType}
          formData={formData}
          updateFormData={updateFormData}
          isValidPostcode={isValidPostcode}
          onPostcodeValidate={handlePostcodeValidate}
          onNext={handleNext}
        />

        {step !== 1 && (
          <FormNavigation
            step={step}
            totalSteps={totalSteps}
            isLoading={isLoading}
            canProceed={canProceed()}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        )}
      </div>
    </Card>
  );
};

export default LockerDropoffForm;
