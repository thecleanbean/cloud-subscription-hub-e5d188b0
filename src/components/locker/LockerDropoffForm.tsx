
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";
import StepThree from "./steps/StepThree";
import StepFour from "./steps/StepFour";
import ProgressBar from "./ProgressBar";
import { useLockerDropoff } from "@/hooks/useLockerDropoff";

interface LockerDropoffFormProps {
  onSubmit: (data: any) => void;
}

const LockerDropoffForm = ({ onSubmit }: LockerDropoffFormProps) => {
  const [step, setStep] = useState(1);
  const {
    customerType,
    setCustomerType,
    formData,
    updateFormData,
    handleSubmit,
  } = useLockerDropoff({ onSubmit });

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
        // For returning customers, show email input
        // For new customers, show service types
        if (customerType === 'returning') {
          return (
            <StepTwo
              email={formData.email}
              setEmail={(email) => updateFormData("email", email)}
            />
          );
        } else {
          return (
            <StepThree
              serviceTypes={formData.serviceTypes}
              updateServiceTypes={(newTypes) => updateFormData("serviceTypes", newTypes)}
            />
          );
        }
      case 3:
        // For both types, show locker and collection details
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

  // Both flows now have 3 steps
  const totalSteps = 3;

  return (
    <Card className="max-w-2xl mx-auto p-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">Locker Drop-off</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Complete your locker dropoff in just a few steps
        </p>
      </div>

      <ProgressBar currentStep={step} totalSteps={totalSteps} />

      <form onSubmit={handleSubmit} className="space-y-6">
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
              onClick={() => setStep((prev) => prev + 1)}
              className={cn(
                "ml-auto",
                step === 1 && "w-full"
              )}
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
