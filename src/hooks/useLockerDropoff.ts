
import { useState } from "react";
import { FormData, UseLockerDropoffProps, CustomerType } from "@/types/locker";
import { createNewCustomer, findCustomerByEmail } from "@/services/customerService";
import { toast } from "@/components/ui/use-toast";
import { addDays } from "date-fns";

export const useLockerDropoff = ({ onSubmit }: UseLockerDropoffProps) => {  
  const [customerType, setCustomerType] = useState<CustomerType>('new');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    postcode: "",
    address: "",
    addressInstructions: "",
    marketingOptIn: false,
    lockerNumber: [],
    notes: "",
    serviceTypes: {
      laundry: false,
      duvets: false,
      dryCleaning: false,
    },
    collectionDate: addDays(new Date(), 2),
  });

  const updateFormData = (field: string, value: any) => {
    console.log('Updating form data:', field, value); // Debug log
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit pressed, current form data:', formData); // Debug log

    setIsLoading(true);
    try {
      if (customerType === 'returning') {
        const customer = await findCustomerByEmail(formData.email);
        if (!customer) {
          toast({
            title: "Account Not Found",
            description: "We couldn't find an account with this email. Please create a new account.",
            variant: "destructive",
          });
          setCustomerType('new');
          return;
        }
      }

      onSubmit(formData);
      
      toast({
        title: "Success",
        description: "Your locker dropoff order has been submitted.",
      });
    } catch (error) {
      console.error('Error processing order:', error);
      toast({
        title: "Error",
        description: "There was a problem submitting your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    customerType,
    setCustomerType,
    formData,
    updateFormData,
    handleSubmit,
    isLoading
  };
};
