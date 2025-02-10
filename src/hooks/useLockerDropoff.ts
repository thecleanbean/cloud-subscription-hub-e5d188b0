
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { FormData, UseLockerDropoffProps, CustomerType } from "@/types/locker";
import { calculateTotal, createOrderItems, createOrders } from "@/utils/orderUtils";
import { createNewCustomer, findCustomerByEmail } from "@/services/customerService";
import { supabase } from "@/integrations/supabase/client";

export const useLockerDropoff = ({ onSubmit }: UseLockerDropoffProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [customerType, setCustomerType] = useState<CustomerType>('new');
  const [isLoading, setIsLoading] = useState(false);
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

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && customerType === 'returning') {
        // When a returning customer signs in, try to find their details
        try {
          const customer = await findCustomerByEmail(formData.email);
          if (customer) {
            setFormData(prev => ({
              ...prev,
              firstName: customer.firstName,
              lastName: customer.lastName,
              mobile: customer.mobile || '',
            }));
          }
        } catch (error) {
          console.error('Error fetching customer details:', error);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [customerType, formData.email]);

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (customerType === 'returning') {
        if (!formData.email) {
          toast({
            title: "Email Required",
            description: "Please enter your email address to continue.",
            variant: "destructive",
          });
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // If not authenticated, start auth flow
          const { error: signInError } = await supabase.auth.signInWithOtp({
            email: formData.email,
            options: {
              emailRedirectTo: window.location.origin + '/locker-dropoff'
            }
          });

          if (signInError) {
            toast({
              title: "Authentication Error",
              description: "Failed to send verification email. Please try again.",
              variant: "destructive",
            });
            return;
          }

          toast({
            title: "Check Your Email",
            description: "We've sent you a verification link. Please check your email to continue.",
          });
          return;
        }

        // User is authenticated, proceed with customer lookup
        const existingCustomer = await findCustomerByEmail(formData.email);
        
        if (!existingCustomer) {
          toast({
            title: "Customer Not Found",
            description: "No customer found with this email. Please sign up as a new customer.",
            variant: "destructive",
          });
          setCustomerType('new');
          return;
        }

        // Create orders for the existing customer
        const total = calculateTotal(formData.serviceTypes);
        const items = createOrderItems(formData.serviceTypes);

        await createOrders(
          existingCustomer.id,
          items,
          formData.lockerNumber,
          formData.notes,
          formData.serviceTypes,
          formData.collectionDate,
          total
        );

      } else {
        // For new customers
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.mobile) {
          toast({
            title: "Missing Information",
            description: "Please fill in all required fields.",
            variant: "destructive",
          });
          return;
        }

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
