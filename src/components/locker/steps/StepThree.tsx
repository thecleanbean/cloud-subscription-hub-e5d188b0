
import { motion } from "framer-motion";
import { FormData } from "@/types/locker";
import CustomerDetailsForm from "@/components/registration/CustomerDetailsForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface StepThreeProps {
  formData: FormData;
  updateFormData: (field: string, value: any) => void;
  isValidPostcode: boolean;
  onPostcodeValidate: (postcode: string) => void;
}

const StepThree = ({
  formData,
  updateFormData,
  isValidPostcode,
  onPostcodeValidate
}: StepThreeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold text-primary mb-2">Your Details</h3>
        <p className="text-muted-foreground">
          Please review and update your details if needed
        </p>
      </div>

      <Alert className="mb-6 bg-green-50 border-green-200">
        <Info className="h-4 w-4 text-green-500" />
        <AlertDescription className="text-green-700">
          We've pre-filled your details. Please update them if needed.
        </AlertDescription>
      </Alert>

      <CustomerDetailsForm
        formData={formData}
        onChange={(field, value) => updateFormData(field, value)}
        isValidPostcode={isValidPostcode}
        onPostcodeValidate={onPostcodeValidate}
      />
    </motion.div>
  );
};

export default StepThree;
