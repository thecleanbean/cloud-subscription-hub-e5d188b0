
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
    collectionDate: addDays(new Date(), 2), // Default to 2 days from now
  });

  const updateFormData = (field: string, value: any) => {
    console.log('Updating form data:', field, value);
    setFormData((prev) => {
      // Create a new object with the updated field
      const newData = { ...prev, [field]: value };
      console.log('New form data:', newData);
      return newData;
    });
  };

  const validateForm = () => {
    // For returning customers, only email is required initially
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
      // For new customers, validate all required fields
      const requiredFields = {
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email",
        mobile: "Mobile Number",
        postcode: "Postcode",
        address: "Address"
      };

      for (const [field, label] of Object.entries(requiredFields)) {
        if (!formData[field as keyof typeof requiredFields]) {
          toast({
            title: "Required Field Missing",
            description: `Please enter your ${label}.`,
            variant: "destructive",
          });
          return false;
        }
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

    // Validate collection date
    if (!formData.collectionDate) {
      toast({
        title: "Collection Date Required",
        description: "Please select a collection date.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form with data:', formData);
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      if (customerType === 'returning') {
        const customer = await findCustomerByEmail(formData.email);
        
        if (!customer) {
          toast({
            title: "Account Not Found",
            description: "We couldn't find a locker service account with this email. Please create a new account to get started.",
            variant: "destructive",
          });
          setCustomerType('new');
          return;
        }
        
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
