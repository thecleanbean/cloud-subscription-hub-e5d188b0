
import { useState } from "react";
import { cleanCloudAPI } from "@/services/cleanCloud";
import { useToast } from "@/components/ui/use-toast";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  lockerNumber: string[];  // Changed to array
  notes: string;
  serviceTypes: {
    laundry: boolean;
    duvets: boolean;
    dryCleaning: boolean;
  };
  collectionDate: Date;
}

interface UseLockerDropoffProps {
  onSubmit: (data: any) => void;
}

export const useLockerDropoff = ({ onSubmit }: UseLockerDropoffProps) => {
  const [customerType, setCustomerType] = useState<'new' | 'returning'>('new');
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    lockerNumber: [],  // Initialize as empty array
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
        // For returning customers, use the Edge Function to handle CleanCloud API call
        const response = await fetch('/api/cleancloud-proxy?email=' + encodeURIComponent(formData.email));
        const customers = await response.json();
        
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

      // Create an order for each selected locker
      for (const lockerNum of formData.lockerNumber) {
        await cleanCloudAPI.orders.createOrder({
          customerId,
          items,
          lockerNumber: lockerNum,
          notes: formData.notes,
          serviceTypes: formData.serviceTypes,
          collectionDate: formData.collectionDate,
          total: total / formData.lockerNumber.length // Split total across lockers
        });
      }

      toast({
        title: "Success!",
        description: `Your order${formData.lockerNumber.length > 1 ? 's have' : ' has'} been registered successfully.`,
      });

      onSubmit({ ...formData });
    } catch (error) {
      console.error('Error processing order:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was a problem processing your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    customerType,
    setCustomerType,
    formData,
    updateFormData,
    handleSubmit,
  };
};
