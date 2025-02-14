
import { useState } from "react";
import { FormData, UseLockerDropoffProps, CustomerType } from "@/types/locker";
import { calculateTotal, createOrderItems, createOrders } from "@/utils/orderUtils";
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
    setFormData((prev) => {
      if (field === "address" && typeof value === "string") {
        return {
          ...prev,
          address: value
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const validateForm = () => {
    if (customerType === 'returning') {
      if (!formData.email) {
        toast({
          title: "Email Required",
          description: "Please enter your email to continue.",
          variant: "destructive",
        });
        return false;
      }
      return true;
    }

    // For new customers, validate all required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.mobile || !formData.address) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }

    // Validate mobile number (UK format)
    const mobileRegex = /^(?:\+44|0)[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobile)) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid UK mobile number.",
        variant: "destructive",
      });
      return false;
    }

    // Validate service types
    if (!formData.serviceTypes.laundry && !formData.serviceTypes.duvets && !formData.serviceTypes.dryCleaning) {
      toast({
        title: "Service Type Required",
        description: "Please select at least one service type.",
        variant: "destructive",
      });
      return false;
    }

    // Validate locker selection
    if (formData.lockerNumber.length === 0) {
      toast({
        title: "Locker Required",
        description: "Please select at least one locker.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

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
          setIsLoading(false);
          return;
        }
      }

      // Process the form submission
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
