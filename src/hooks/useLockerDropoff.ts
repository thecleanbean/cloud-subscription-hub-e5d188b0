
import { useState } from "react";
import { FormData, UseLockerDropoffProps, CustomerType } from "@/types/locker";
import { calculateTotal, createOrderItems, createOrders } from "@/utils/orderUtils";
import { createNewCustomer, findCustomerByEmail } from "@/services/customerService";
import { toast } from "@/components/ui/use-toast";

export const useLockerDropoff = ({ onSubmit }: UseLockerDropoffProps) => {  
  const [customerType, setCustomerType] = useState<CustomerType>('new');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    postcode: "", // Added postcode field with empty string as initial value
    lockerNumber: [],
    notes: "",
    serviceTypes: {
      laundry: false,
      duvets: false,
      dryCleaning: false,
    },
    collectionDate: new Date(),
  });

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    // For returning customers, only email is required
    if (customerType === 'returning') {
      if (!formData.email) {
        toast({
          title: "Email Required",
          description: "Please enter your email to continue.",
          variant: "destructive",
        });
        return false;
      }
    } else {
      // For new customers, all fields are required
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.mobile || !formData.postcode) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return false;
      }
    }

    // Validate locker number selection
    if (formData.lockerNumber.length === 0) {
      toast({
        title: "Locker Required",
        description: "Please select at least one locker number.",
        variant: "destructive",
      });
      return false;
    }

    // Validate service types
    if (!formData.serviceTypes.laundry && !formData.serviceTypes.duvets && !formData.serviceTypes.dryCleaning) {
      toast({
        title: "Service Required",
        description: "Please select at least one service type.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      if (customerType === 'returning') {
        // Search for existing customer by email
        const customer = await findCustomerByEmail(formData.email);
        
        if (!customer) {
          // Show a more informative message directing them to create a new account
          toast({
            title: "Account Not Found",
            description: "We couldn't find a locker service account with this email. If you've used CleanCloud before but not the locker service, please create a new account to get started.",
            variant: "destructive",
          });
          // Automatically switch to new customer mode
          setCustomerType('new');
          return;
        }
        
        // Create orders for the existing customer
        const total = calculateTotal(formData.serviceTypes);
        const items = createOrderItems(formData.serviceTypes);

        await createOrders(
          customer.id,
          items,
          formData.lockerNumber,
          formData.notes,
          formData.serviceTypes,
          formData.collectionDate,
          total
        );

      } else {
        // For new customers
        const customer = await createNewCustomer(formData);
        
        const total = calculateTotal(formData.serviceTypes);
        const items = createOrderItems(formData.serviceTypes);

        await createOrders(
          customer.id,
          items,
          formData.lockerNumber,
          formData.notes,
          formData.serviceTypes,
          formData.collectionDate,
          total
        );
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
