
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

  const updateFormData = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    console.log('Updating form data:', { field, value });
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    // Validate required fields based on customer type
    if (customerType === 'new') {
      const requiredFields = ['firstName', 'lastName', 'email', 'mobile', 'postcode', 'address'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]);
      
      if (missingFields.length > 0) {
        toast({
          title: "Required Fields Missing",
          description: `Please fill in all required fields: ${missingFields.join(', ')}`,
          variant: "destructive",
        });
        return;
      }
    } else if (!formData.email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    // Validate service selection
    if (!Object.values(formData.serviceTypes).some(Boolean)) {
      toast({
        title: "Service Selection Required",
        description: "Please select at least one service type",
        variant: "destructive",
      });
      return;
    }

    // Validate locker selection
    if (formData.lockerNumber.length === 0) {
      toast({
        title: "Locker Selection Required",
        description: "Please select at least one locker",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Processing order submission...');
      await onSubmit(formData);
      
      toast({
        title: "Success",
        description: "Your locker dropoff order has been submitted.",
      });

      console.log('Order submitted successfully');
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
