
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
    
    // Create Supabase account and customer record
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

    // Create customer record in our database
    const { error: dbError } = await supabase
      .from('cleancloud_customers')
      .insert({
        id: authData.user?.id,
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
    // First check if customer exists in Supabase
    const { data: customerData, error: dbError } = await supabase
      .from('cleancloud_customers')
      .select('*')
      .eq('email', email)
      .single();

    if (dbError) {
      if (dbError.code === 'PGRST116') {
        // No customer found
        // Send magic link for authentication
        const { error: signInError } = await supabase.auth.signInWithOtp({
          email: email,
          options: {
            emailRedirectTo: window.location.origin + '/locker-dropoff'
          }
        });

        if (signInError) {
          console.error('Auth error:', signInError);
          throw new Error('Authentication failed. Please check your email and try again.');
        }

        return null;
      }
      throw dbError;
    }

    // If we found a customer, search in CleanCloud to get latest data
    const response = await fetch(`/api/cleancloud/customers/search?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    if (!data || !Array.isArray(data) || data.length === 0) {
      return null;
    }

    return data[0];
  } catch (error) {
    console.error('Error searching for customer:', error);
    throw error;
  }
};
