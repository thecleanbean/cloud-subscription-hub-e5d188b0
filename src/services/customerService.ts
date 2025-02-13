
import { supabase } from "@/integrations/supabase/client";
import { cleanCloudAPI } from "@/services/cleanCloud";
import { FormData } from "@/types/locker";

export const createNewCustomer = async (formData: FormData) => {
  console.log('Creating customer with data:', { 
    ...formData,
    email: '***' 
  });
  
  try {
    // First create customer in CleanCloud
    const customer = await cleanCloudAPI.customers.createCustomer({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      mobile: formData.mobile,
    });
    
    // Create customer record in our database with the auth user ID
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: Math.random().toString(36).slice(-8), // Generate a random password
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
        }
      }
    });

    if (authError) {
      console.error('Auth error:', authError);
      throw new Error('Failed to create user account');
    }

    if (!authData.user?.id) {
      throw new Error('No user ID returned from auth signup');
    }

    // Create customer record in our database
    const { error: dbError } = await supabase
      .from('cleancloud_customers')
      .insert({
        id: authData.user.id,
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        mobile: formData.mobile,
        cleancloud_customer_id: customer.id,
      });

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to create customer record');
    }

    return customer;
  } catch (error) {
    console.error('Error in createNewCustomer:', error);
    throw error;
  }
};

export const findCustomerByEmail = async (email: string) => {
  console.log('Searching for customer:', { email: '***' });
  
  try {
    // First check if customer exists in our database
    const { data: customerData, error: dbError } = await supabase
      .from('cleancloud_customers')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to search for customer');
    }

    // If no customer found in our database, try to authenticate them
    if (!customerData) {
      // Try to sign in the user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: Math.random().toString(36).slice(-8), // Use any password since we disabled email verification
      });

      if (signInError) {
        console.error('Auth error:', signInError);
        throw new Error('Authentication failed. Please try again.');
      }

      return null;
    }

    // If we found a customer in our database, get their latest data from CleanCloud
    const customers = await cleanCloudAPI.customers.searchCustomers(email);
    
    if (!customers || customers.length === 0) {
      console.error('Customer not found in CleanCloud');
      return null;
    }

    return customers[0];
  } catch (error) {
    console.error('Error searching for customer:', error);
    throw error;
  }
};
