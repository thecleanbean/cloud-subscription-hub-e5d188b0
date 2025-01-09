import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { mockAPI } from "@/services/mockCleanCloudAPI";
import { useToast } from "./ui/use-toast";
import OrderConfirmation from "./OrderConfirmation";

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
  });
  const [isLoading, setIsLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create customer
      const customer = await mockAPI.createCustomer({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });

      // Create order
      await mockAPI.createOrder({
        customerId: customer.id,
        plan: selectedPlan,
        deliveryOption: formData.deliveryOption as 'pickup' | 'delivery',
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
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-primary mb-6">
        Register for {selectedPlan}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div>
          <Input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
        <div className="flex gap-4">
          <Button
            type="button"
            variant={formData.deliveryOption === "pickup" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setFormData({ ...formData, deliveryOption: "pickup" })}
          >
            Store Pickup
          </Button>
          <Button
            type="button"
            variant={formData.deliveryOption === "delivery" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setFormData({ ...formData, deliveryOption: "delivery" })}
          >
            Home Delivery
          </Button>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Processing..." : "Complete Registration"}
        </Button>
      </form>
    </div>
  );
};

export default RegistrationForm;