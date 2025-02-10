
interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNumber) => (
          <div key={stepNumber} className="text-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-1
                ${currentStep >= stepNumber ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}
            >
              {stepNumber}
            </div>
            <span className={`text-xs ${
              currentStep >= stepNumber ? 'text-primary font-medium' : 'text-gray-400'
            }`}>
              Step {stepNumber}
            </span>
          </div>
        ))}
      </div>
      <div className="h-2 bg-gray-100 rounded-full mt-2">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
