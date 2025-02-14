
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FormNavigationProps {
  step: number;
  totalSteps: number;
  isLoading: boolean;
  canProceed: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const FormNavigation = ({
  step,
  totalSteps,
  isLoading,
  canProceed,
  onPrevious,
  onNext,
}: FormNavigationProps) => {
  return (
    <div className="flex justify-between pt-6">
      {step > 1 && (
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={isLoading}
        >
          Previous
        </Button>
      )}
      {step < totalSteps ? (
        <Button
          type="button"
          onClick={onNext}
          className={cn(
            "ml-auto",
            step === 1 && "w-full"
          )}
          disabled={!canProceed || isLoading}
        >
          Next Step
        </Button>
      ) : (
        <Button type="submit" className="ml-auto" disabled={isLoading}>
          {isLoading ? "Processing..." : "Complete Drop-off"}
        </Button>
      )}
    </div>
  );
};

export default FormNavigation;
