
import { CustomerType, FormData } from "@/types/locker";
import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";
import StepThree from "./steps/StepThree";
import StepFour from "./steps/StepFour";

interface FormStepRendererProps {
  step: number;
  customerType: CustomerType;
  setCustomerType: (type: CustomerType) => void;
  formData: FormData;
  updateFormData: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  isValidPostcode: boolean;
  onPostcodeValidate: (postcode: string) => void;
  onNext: () => void;
}

const FormStepRenderer = ({
  step,
  customerType,
  setCustomerType,
  formData,
  updateFormData,
  isValidPostcode,
  onPostcodeValidate,
  onNext,
}: FormStepRendererProps) => {
  switch (step) {
    case 1:
      return (
        <StepOne
          customerType={customerType}
          setCustomerType={setCustomerType}
          onNext={onNext}
        />
      );
    case 2:
      return (
        <StepTwo
          formData={formData}
          updateFormData={updateFormData}
          isValidPostcode={isValidPostcode}
          onPostcodeValidate={onPostcodeValidate}
          customerType={customerType}
          onNext={onNext}
        />
      );
    case 3:
      if (customerType === 'returning') {
        return (
          <StepThree
            formData={formData}
            updateFormData={updateFormData}
            isValidPostcode={isValidPostcode}
            onPostcodeValidate={onPostcodeValidate}
          />
        );
      }
      return (
        <StepFour
          lockerNumber={formData.lockerNumber}
          collectionDate={formData.collectionDate}
          notes={formData.notes}
          updateFormData={updateFormData}
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

export default FormStepRenderer;
