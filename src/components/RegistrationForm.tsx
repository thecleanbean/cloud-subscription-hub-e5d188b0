import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { mockAPI } from "@/services/mockCleanCloudAPI";
import { useToast } from "./ui/use-toast";
import OrderConfirmation from "./OrderConfirmation";
import { ArrowLeft } from "lucide-react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { motion } from "framer-motion";
import { Card } from "./ui/card";

interface RegistrationFormProps {
  selectedPlan: string;
  onSubmit: (data: any) => void;
}

const RegistrationForm = ({ selectedPlan, onSubmit }: RegistrationFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    deliveryOption: "pickup",
    homeDelivery: false,
    sortingService: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const { toast } = useToast();

  const getPlanDetails = () => {
    const plans = {
      "1 Bag Plan": { monthly: "£31.95", yearly: "£374.95" },
      "2 Bags Plan": { monthly: "£57.95", yearly: "£690.95" },
      "3 Bags Plan": { monthly: "£78.95", yearly: "£949.95" },
      "4 Bags Plan": { monthly: "£100.95", yearly: "£1,208.95" },
      "Weekly Plan": { monthly: "£109.95", yearly: "£1,324.95" },
      "Bag Swap": { monthly: "£179.95", yearly: "£2,158.95" },
    };
    return plans[selectedPlan as keyof typeof plans];
  };

  const calculateTotalPrice = () => {
    const basePrice = parseFloat(getPlanDetails()?.monthly.replace('£', '')) || 0;
    const deliveryPrice = formData.homeDelivery ? 7.95 : 0;
    const sortingPrice = formData.sortingService ? 5.95 : 0;
    return (basePrice + deliveryPrice + sortingPrice).toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const customer = await mockAPI.createCustomer({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });

      await mockAPI.createOrder({
        customerId: customer.id,
        plan: selectedPlan,
        deliveryOption: formData.deliveryOption as 'pickup' | 'delivery',
        addons: {
          homeDelivery: formData.homeDelivery,
          sortingService: formData.sortingService,
        },
      });

      setOrderComplete(true);
      onSubmit(formData);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <OrderConfirmation
        customerName={formData.name}
        planName={selectedPlan}
        deliveryOption={formData.deliveryOption}
        onClose={() => window.location.reload()}
      />
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto px-4 py-8"
    >
      <Button
        variant="ghost"
        onClick={() => window.location.reload()}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Plans
      </Button>

      <Card className="p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">
            Complete Your Registration
          </h2>
          <p className="text-gray-600">
            You selected the {selectedPlan}
          </p>
          <div className="mt-4 p-4 bg-secondary/10 rounded-lg">
            <h3 className="font-semibold mb-2">Plan Pricing</h3>
            <p>Monthly: {getPlanDetails()?.monthly}</p>
            <p>Yearly: {getPlanDetails()?.yearly} (Save 10%)</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold">Add-on Services</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="delivery">Home Delivery</Label>
                <p className="text-sm text-gray-500">£7.95/month</p>
              </div>
              <Switch
                id="delivery"
                checked={formData.homeDelivery}
                onCheckedChange={(checked) => setFormData({ ...formData, homeDelivery: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sorting">Sorting Service</Label>
                <p className="text-sm text-gray-500">£5.95/month</p>
              </div>
              <Switch
                id="sorting"
                checked={formData.sortingService}
                onCheckedChange={(checked) => setFormData({ ...formData, sortingService: checked })}
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total Monthly Price:</span>
              <span className="text-xl font-bold text-primary">£{calculateTotalPrice()}</span>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : "Complete Registration"}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default RegistrationForm;