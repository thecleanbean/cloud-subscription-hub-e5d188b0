
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
    // Only search in CleanCloud
    const customers = await cleanCloudAPI.customers.searchCustomers(email);
    
    // Add proper error handling and type checking
    if (!Array.isArray(customers)) {
      console.error('Unexpected response format:', customers);
      throw new Error('Invalid response from CleanCloud API');
    }
    
    return customers.length > 0 ? customers[0] : null;
  } catch (error) {
    console.error('Error searching for customer:', error);
    throw new Error('Failed to search for customer');
  }
};
