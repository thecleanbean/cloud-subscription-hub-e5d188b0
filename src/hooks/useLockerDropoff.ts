
import { useState } from "react";
import { cleanCloudAPI } from "@/services/cleanCloud";
import { useToast } from "@/components/ui/use-toast";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  lockerNumber: string[];
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
    lockerNumber: [],
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
        // For returning customers, we'll handle authentication separately
        toast({
          title: "Authentication Required",
          description: "Please log in to continue as a returning customer.",
          variant: "destructive",
        });
        return;
      }

      // For new customers, create a customer record
      const customer = await cleanCloudAPI.customers.createCustomer({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobile: formData.mobile,
      });
      
      customerId = customer.id;
      const total = calculateTotal();
      
      const items = Object.entries(formData.serviceTypes)
        .filter(([_, isSelected]) => isSelected)
        .map(([service]) => {
          switch (service) {
            case 'laundry':
              return {
                name: "Regular Laundry",
                quantity: 1,
                price: 25.00,
                service_type: "laundry"
              };
            case 'duvets':
              return {
                name: "Duvets & Bedding",
                quantity: 1,
                price: 35.00,
                service_type: "duvets"
              };
            case 'dryCleaning':
              return {
                name: "Dry Cleaning",
                quantity: 1,
                price: 45.00,
                service_type: "dry_cleaning"
              };
            default:
              return null;
          }
        })
        .filter(Boolean);

      // Create an order for each selected locker
      for (const lockerNum of formData.lockerNumber) {
        await cleanCloudAPI.orders.createOrder({
          customerId,
          items,
          lockerNumber: lockerNum,
          notes: formData.notes,
          serviceTypes: formData.serviceTypes,
          collectionDate: formData.collectionDate,
          total: total / formData.lockerNumber.length
        });
      }

      toast({
        title: "Success!",
        description: `Your order${formData.lockerNumber.length > 1 ? 's have' : ' has'} been registered successfully.`,
      });

      onSubmit(formData);
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
