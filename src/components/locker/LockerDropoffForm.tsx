
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cleanCloudAPI } from "@/services/cleanCloud";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";
import StepThree from "./steps/StepThree";
import StepFour from "./steps/StepFour";
import ProgressBar from "./ProgressBar";

interface LockerDropoffFormProps {
  onSubmit: (data: any) => void;
}

const LockerDropoffForm = ({ onSubmit }: LockerDropoffFormProps) => {
  const [step, setStep] = useState(1);
  const [customerType, setCustomerType] = useState<'new' | 'returning'>('new');
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    lockerNumber: "",
    notes: "",
    serviceTypes: {
      laundry: false,
      duvets: false,
      dryCleaning: false,
    },
    collectionDate: new Date(),
  });
  const { toast } = useToast();

  const calculateTotal = () => {
    let total = 0;
    if (formData.serviceTypes.laundry) total += 25.00;
    if (formData.serviceTypes.duvets) total += 35.00;
    if (formData.serviceTypes.dryCleaning) total += 45.00;
    return total;
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let customerId;

      if (customerType === 'returning') {
        const customers = await cleanCloudAPI.customers.searchCustomers(formData.email);
        if (!customers || customers.length === 0) {
          toast({
            title: "Customer Not Found",
            description: "We couldn't find your account. Please check your email or sign up as a new customer.",
            variant: "destructive",
          });
          return;
        }
        customerId = customers[0].id;
      } else {
        const customer = await cleanCloudAPI.customers.createCustomer({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobile: formData.mobile,
        });
        customerId = customer.id;
      }

      const total = calculateTotal();
      const items = [];
      
      if (formData.serviceTypes.laundry) {
        items.push({
          name: "Regular Laundry",
          quantity: 1,
          price: 25.00,
          service_type: "laundry"
        });
      }
      if (formData.serviceTypes.duvets) {
        items.push({
          name: "Duvets & Bedding",
          quantity: 1,
          price: 35.00,
          service_type: "duvets"
        });
      }
      if (formData.serviceTypes.dryCleaning) {
        items.push({
          name: "Dry Cleaning",
          quantity: 1,
          price: 45.00,
          service_type: "dry_cleaning"
        });
      }

      const order = await cleanCloudAPI.orders.createOrder({
        customerId,
        items,
        lockerNumber: formData.lockerNumber,
        notes: formData.notes,
        serviceTypes: formData.serviceTypes,
        collectionDate: formData.collectionDate,
        total
      });

      toast({
        title: "Success!",
        description: "Your order has been registered successfully.",
      });

      onSubmit({ ...formData, orderId: order.id });
    } catch (error) {
      console.error('Error processing order:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was a problem processing your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepOne
            customerType={customerType}
            setCustomerType={setCustomerType}
          />
        );
      case 2:
        return (
          <StepTwo
            email={formData.email}
            setEmail={(email) => updateFormData("email", email)}
          />
        );
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

  return (
    <Card className="max-w-2xl mx-auto p-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">Locker Drop-off</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Complete your locker dropoff in just a few steps
        </p>
      </div>

      <ProgressBar currentStep={step} totalSteps={4} />

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderStep()}

        <div className="flex justify-between pt-6">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((prev) => prev - 1)}
            >
              Previous
            </Button>
          )}
          {step < 4 ? (
            <Button
              type="button"
              onClick={() => setStep((prev) => prev + 1)}
              className={cn(
                "ml-auto",
                step === 1 && "w-full"
              )}
            >
              Next Step
            </Button>
          ) : (
            <Button type="submit" className="ml-auto">
              Complete Drop-off
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default LockerDropoffForm;
