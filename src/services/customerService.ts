
import { supabase } from "@/integrations/supabase/client";
import { cleanCloudAPI } from "@/services/cleanCloud";
import { FormData } from "@/types/locker";

export const createNewCustomer = async (formData: FormData) => {
  // Create customer in CleanCloud
  const customer = await cleanCloudAPI.customers.createCustomer({
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    mobile: formData.mobile,
  });
  
  // Sign up the customer in Supabase
  const { error: signUpError } = await supabase.auth.signUp({
    email: formData.email,
    password: Math.random().toString(36).slice(-8), // Generate a random password
    options: {
      data: {
        first_name: formData.firstName,
        last_name: formData.lastName,
      }
    }
  });

  if (signUpError) throw signUpError;
  
  return customer;
};

export const findCustomerByEmail = async (email: string) => {
  // Try to find if customer exists in CleanCloud
  const customers = await cleanCloudAPI.customers.searchCustomers(email);
  
  if (customers.length === 0) {
    return null;
  }

  // If customer exists in CleanCloud but not in Supabase, create Supabase account
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    // Create Supabase account for existing customer
    const customer = customers[0];
    const { error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: Math.random().toString(36).slice(-8), // Generate a random password
      options: {
        data: {
          first_name: customer.firstName || '',
          last_name: customer.lastName || '',
        }
      }
    });

    if (signUpError) throw signUpError;
  }
  
  return customers[0];
};
