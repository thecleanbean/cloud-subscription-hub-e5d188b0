
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
  return cleanCloudAPI.customers.searchCustomers(email);
};
