
import { supabase } from "@/integrations/supabase/client";
import { cleanCloudAPI } from "@/services/cleanCloud";
import { FormData } from "@/types/locker";

export const createNewCustomer = async (formData: FormData) => {
  console.log('Creating customer with data:', { 
    ...formData,
    email: '***' 
  });
  
  // Create customer in CleanCloud
  const customer = await cleanCloudAPI.customers.createCustomer({
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    mobile: formData.mobile,
  });
  
  // Create Supabase account silently in the background
  await supabase.auth.signUp({
    email: formData.email,
    password: Math.random().toString(36).slice(-8), // Generate a random password
    options: {
      data: {
        first_name: formData.firstName,
        last_name: formData.lastName,
      }
    }
  });
  
  return customer;
};

export const findCustomerByEmail = async (email: string) => {
  console.log('Searching for customer:', { email: '***' });
  
  try {
    // Search in CleanCloud with proper error handling
    const response = await cleanCloudAPI.customers.searchCustomers(email);
    console.log('CleanCloud API Response:', response);

    // Basic validation of response
    if (!response || typeof response !== 'object') {
      console.error('Invalid API response:', response);
      throw new Error('Invalid response from CleanCloud API');
    }

    // Handle potential string response (error message)
    if (typeof response === 'string') {
      console.error('API returned string instead of object:', response);
      throw new Error('Invalid response format from CleanCloud API');
    }

    // Ensure response is array-like
    const customers = Array.isArray(response) ? response : [response];
    
    if (customers.length === 0) {
      return null;
    }

    // Validate customer object structure
    const customer = customers[0];
    if (!customer || !customer.id || !customer.email) {
      console.error('Invalid customer data:', customer);
      throw new Error('Invalid customer data format');
    }

    return customer;
  } catch (error) {
    console.error('Error searching for customer:', error);
    throw new Error('Failed to search for customer');
  }
};
