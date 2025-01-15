import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface BillingToggleProps {
  isYearly: boolean;
  onToggle: (checked: boolean) => void;
}

const BillingToggle = ({ isYearly, onToggle }: BillingToggleProps) => (
  <div className="flex items-center justify-center gap-4">
    <Label 
      htmlFor="billing-toggle" 
      className={`text-base md:text-lg ${!isYearly ? 'text-primary font-bold' : 'text-gray-500'}`}
    >
      Monthly
    </Label>
    <Switch
      id="billing-toggle"
      checked={isYearly}
      onCheckedChange={onToggle}
      className="data-[state=checked]:bg-secondary"
    />
    <Label 
      htmlFor="billing-toggle" 
      className={`text-base md:text-lg ${isYearly ? 'text-primary font-bold' : 'text-gray-500'}`}
    >
      Yearly
      <span className="ml-2 text-sm text-accent">Save 10%</span>
    </Label>
  </div>
);

export default BillingToggle;