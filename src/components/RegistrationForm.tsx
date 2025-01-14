import { useState } from "react";
import { Button } from "./ui/button";
import { mockAPI } from "@/services/mockCleanCloudAPI";
import { useToast } from "./ui/use-toast";
import OrderConfirmation from "./OrderConfirmation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "./ui/card";
import BillingPeriodSelector from "./registration/BillingPeriodSelector";
import CustomerDetailsForm from "./registration/CustomerDetailsForm";
import AddOnServices from "./registration/AddOnServices";

interface RegistrationFormProps {
  selectedPlan: string;
  onSubmit: (data: any) => void;
}

const RegistrationForm = ({ selectedPlan, onSubmit }: RegistrationFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    postcode: "",
    deliveryOption: "pickup",
    homeDelivery: false,
    sortingService: false,
    billingPeriod: "monthly"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [isValidPostcode, setIsValidPostcode] = useState(true);
  const { toast } = useToast();

  const getPlanDetails = () => {
    const monthlyPrices = {
      "1 Bag Plan": "31.95",
      "2 Bags Plan": "57.95",
      "3 Bags Plan": "78.95",
      "4 Bags Plan": "100.95",
      "Weekly Plan": "109.95",
      "Bag Swap": "179.95",
    };

    const monthlyPrice = monthlyPrices[selectedPlan as keyof typeof monthlyPrices];
    const yearlyPrice = (parseFloat(monthlyPrice) * 12 * 0.9).toFixed(2);

    return {
      monthly: `£${monthlyPrice}`,
      yearly: `£${yearlyPrice}`,
    };
  };

  const calculateTotalPrice = () => {
    const planPrices = getPlanDetails();
    if (!planPrices) return "0.00";
    
    const basePrice = parseFloat(planPrices[formData.billingPeriod as 'monthly' | 'yearly'].replace('£', ''));
    const deliveryPrice = formData.homeDelivery ? 
      (formData.billingPeriod === 'yearly' ? 7.95 * 12 * 0.9 : 7.95) : 0;
    const sortingPrice = formData.sortingService ? 
      (formData.billingPeriod === 'yearly' ? 5.95 * 12 * 0.9 : 5.95) : 0;
    
    return (basePrice + deliveryPrice + sortingPrice).toFixed(2);
  };

  const validatePostcode = async (postcode: string) => {
    const isValid = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(postcode);
    setIsValidPostcode(isValid);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!await validatePostcode(formData.postcode)) {
      toast({
        title: "Invalid Postcode",
        description: "Please enter a valid UK postcode",
        variant: "destructive",
      });
      return;
    }

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
          
          <BillingPeriodSelector
            billingPeriod={formData.billingPeriod}
            onChange={(value) => setFormData({ ...formData, billingPeriod: value })}
            planDetails={getPlanDetails()}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <CustomerDetailsForm
            formData={formData}
            onChange={(field, value) => setFormData({ ...formData, [field]: value })}
            isValidPostcode={isValidPostcode}
            onPostcodeValidate={validatePostcode}
          />

          <AddOnServices
            billingPeriod={formData.billingPeriod}
            homeDelivery={formData.homeDelivery}
            sortingService={formData.sortingService}
            onToggleDelivery={(checked) => setFormData({ ...formData, homeDelivery: checked })}
            onToggleSorting={(checked) => setFormData({ ...formData, sortingService: checked })}
          />

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total {formData.billingPeriod === 'monthly' ? 'Monthly' : 'Yearly'} Price:</span>
              <span className="text-xl font-bold text-primary">£{calculateTotalPrice()}</span>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300" 
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Complete Registration"}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default RegistrationForm;