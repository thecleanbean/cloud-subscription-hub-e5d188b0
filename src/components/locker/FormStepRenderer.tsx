
import { CustomerType, FormData } from "@/types/locker";
import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";
import StepThree from "./steps/StepThree";
import StepFour from "./steps/StepFour";
import CustomerDetailsForm from "../registration/CustomerDetailsForm";

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
      if (customerType === 'returning') {
        return (
          <StepTwo
            formData={formData}
            updateFormData={(field, value) => updateFormData(field as keyof FormData, value)}
            isValidPostcode={isValidPostcode}
            onPostcodeValidate={onPostcodeValidate}
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
            onPostcodeValidate={onPostcodeValidate}
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

export default FormStepRenderer;
