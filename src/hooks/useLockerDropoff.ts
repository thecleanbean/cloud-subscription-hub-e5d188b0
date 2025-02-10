
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { FormData, UseLockerDropoffProps, CustomerType } from "@/types/locker";
import { calculateTotal, createOrderItems, createOrders } from "@/utils/orderUtils";
import { createNewCustomer, findCustomerByEmail } from "@/services/customerService";

export const useLockerDropoff = ({ onSubmit }: UseLockerDropoffProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useAuth();
  const [customerType, setCustomerType] = useState<CustomerType>('new');
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

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (customerType === 'returning') {
        // Check if user is logged in
        if (!profile) {
          // Not logged in, redirect to auth page with context
          navigate('/auth', {
            state: { isReturningCustomer: true }
          });
          return;
        }

        // User is logged in, proceed with CleanCloud order
        const existingCustomers = await findCustomerByEmail(profile.email);
        
        if (existingCustomers.length === 0) {
          toast({
            title: "Customer Not Found",
            description: "No customer found with this email. Please sign up as a new customer.",
            variant: "destructive",
          });
          setCustomerType('new');
          return;
        }

        // Use the first matching customer
        const customer = existingCustomers[0];
        
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

        toast({
          title: "Success!",
          description: `Your order${formData.lockerNumber.length > 1 ? 's have' : ' has'} been registered successfully.`,
        });

        onSubmit(formData);
        return;
      }

      // For new customers
      const customer = await createNewCustomer(formData);
      
      // Create orders for the new customer
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
