
import LockerDropoffForm from "@/components/locker/LockerDropoffForm";
import { BackToHome } from "@/components/ui/back-to-home";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { FormData } from "@/types/locker";
import { useState } from "react";
import OrderConfirmation from "@/components/OrderConfirmation";
import { cleanCloudAPI } from "@/services/cleanCloud";
import { calculateTotal, createOrderItems } from "@/utils/orderUtils";
import { supabase } from "@/integrations/supabase/client";

const LockerDropoff = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const handleSubmit = async (formData: FormData) => {
    try {
      console.log('Form submitted with data:', formData);
      
      toast({
        title: "Processing Order",
        description: "Please wait while we process your order...",
      });

      // Calculate order total based on selected services
      const total = calculateTotal(formData.serviceTypes);

      // Check if customer already exists in CleanCloud
      const { data: existingCustomer } = await supabase
        .from('cleancloud_customers')
        .select('*')  // Changed to select all fields
        .eq('email', formData.email)
        .maybeSingle();

      let customerResponse;
      let customerData;
      
      if (existingCustomer?.cleancloud_customer_id) {
        console.log('Using existing customer:', existingCustomer.cleancloud_customer_id);
        customerResponse = { id: existingCustomer.cleancloud_customer_id };
        customerData = existingCustomer;
      } else {
        // Create customer in CleanCloud if new
        customerResponse = await cleanCloudAPI.customers.createCustomer({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobile: formData.mobile,
          customerAddress: formData.address,
          customerAddressInstructions: formData.addressInstructions,
          marketingOptIn: formData.marketingOptIn ? 1 : 0
        });

        if (!customerResponse?.id) {
          throw new Error('Failed to create customer in CleanCloud');
        }

        // Store customer mapping in our database
        const { data: newCustomer, error: customerError } = await supabase
          .from('cleancloud_customers')
          .insert({
            cleancloud_customer_id: customerResponse.id,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            mobile: formData.mobile
          })
          .select()
          .single();

        if (customerError || !newCustomer) {
          console.error('Customer mapping error:', customerError);
          throw new Error('Failed to store customer mapping');
        }
        
        customerData = newCustomer;
      }

      // Create order items based on selected services
      const orderItems = createOrderItems(formData.serviceTypes);

      // Create order in CleanCloud
      const orderResponse = await cleanCloudAPI.orders.createOrder({
        customerId: customerResponse.id,
        items: orderItems,
        lockerNumber: formData.lockerNumber.join(', '), // Join multiple locker numbers
        notes: formData.notes || '',
        serviceTypes: formData.serviceTypes,
        collectionDate: formData.collectionDate,
        total: total
      });

      if (!orderResponse?.id) {
        throw new Error('Failed to create order in CleanCloud');
      }

      // Store order in our database
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: customerData.id,
          cleancloud_order_id: orderResponse.id,
          locker_number: formData.lockerNumber.join(', '),
          service_types: formData.serviceTypes,
          notes: formData.notes || null,
          collection_date: formData.collectionDate.toISOString(),
          status: 'pending',
          total: total
        });

      if (orderError) {
        console.error('Order error:', orderError);
        throw new Error('Failed to store order in database');
      }

      setSubmittedData(formData);
      setIsSubmitted(true);
      
      toast({
        title: "Order Submitted Successfully",
        description: "Your locker dropoff has been registered.",
      });
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "There was a problem processing your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  if (isSubmitted && submittedData) {
    return (
      <OrderConfirmation
        customerName={`${submittedData.firstName} ${submittedData.lastName}`}
        planName={Object.entries(submittedData.serviceTypes)
          .filter(([_, value]) => value)
          .map(([key]) => key)
          .join(", ")}
        deliveryOption="Locker Dropoff"
        onClose={handleClose}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-32">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Locker Dropoff Service</h1>
          <p className="text-gray-600 mb-8">
            Please complete your details below to begin the dropoff process.
            All fields marked with <span className="text-red-500">*</span> are required.
          </p>
          
          <LockerDropoffForm onSubmit={handleSubmit} />
        </div>
      </div>
      <BackToHome />
    </div>
  );
};

export default LockerDropoff;
