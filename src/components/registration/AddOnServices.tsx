import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AddOnServicesProps {
  billingPeriod: string;
  homeDelivery: boolean;
  sortingService: boolean;
  onToggleDelivery: (checked: boolean) => void;
  onToggleSorting: (checked: boolean) => void;
}

const calculateYearlyPrice = (monthlyPrice: number) => {
  return (monthlyPrice * 12 * 0.9).toFixed(2); // Apply 10% discount for annual
};

const AddOnServices = ({
  billingPeriod,
  homeDelivery,
  sortingService,
  onToggleDelivery,
  onToggleSorting,
}: AddOnServicesProps) => (
  <div className="space-y-4 pt-4 border-t">
    <h3 className="font-semibold">Add-on Services</h3>
    
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label htmlFor="delivery">Home Delivery</Label>
        <p className="text-sm text-gray-500">
          {billingPeriod === "yearly"
            ? `£${calculateYearlyPrice(7.95)}/year`
            : "£7.95/month"}
        </p>
        <p className="text-sm text-gray-600">
          Get your clean laundry delivered right to your doorstep, saving you time and effort.
        </p>
      </div>
      <Switch
        id="delivery"
        checked={homeDelivery}
        onCheckedChange={onToggleDelivery}
      />
    </div>

    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label htmlFor="sorting">Sorting Service</Label>
        <p className="text-sm text-gray-500">
          {billingPeriod === "yearly"
            ? `£${calculateYearlyPrice(5.95)}/year`
            : "£5.95/month"}
        </p>
        <p className="text-sm text-gray-600">
          Let us sort your laundry by color and fabric type, ensuring optimal cleaning results.
        </p>
      </div>
      <Switch
        id="sorting"
        checked={sortingService}
        onCheckedChange={onToggleSorting}
      />
    </div>
  </div>
);

export default AddOnServices;