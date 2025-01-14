import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface BillingPeriodSelectorProps {
  billingPeriod: string;
  onChange: (value: string) => void;
  planDetails: { monthly: string; yearly: string };
}

const BillingPeriodSelector = ({
  billingPeriod,
  onChange,
  planDetails,
}: BillingPeriodSelectorProps) => (
  <div className="mt-4 p-4 bg-secondary/10 rounded-lg">
    <h3 className="font-semibold mb-4">Billing Period</h3>
    <RadioGroup
      defaultValue={billingPeriod}
      onValueChange={onChange}
      className="flex gap-4 mb-4"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="monthly" id="monthly" />
        <Label htmlFor="monthly">Monthly</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="yearly" id="yearly" />
        <Label htmlFor="yearly">Yearly (Save 10%)</Label>
      </div>
    </RadioGroup>
    <p className="font-semibold">Selected Plan Price: {planDetails[billingPeriod as keyof typeof planDetails]}</p>
  </div>
);

export default BillingPeriodSelector;