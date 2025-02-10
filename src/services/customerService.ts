
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
    // First check if customer exists in Supabase
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (!user) {
      // If no authenticated user, sign in
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

      // Return null to indicate we need to wait for email verification
      return null;
    }

    // If we have an authenticated user, search in CleanCloud
    const response = await fetch(`/api/cleancloud/customers/search?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const responseText = await response.text();
    if (!responseText) {
      return null;
    }

    try {
      const data = JSON.parse(responseText);
      if (!data || !Array.isArray(data)) {
        console.error('Invalid response format:', data);
        return null;
      }

      const customer = data[0];
      if (!customer || !customer.id || !customer.email) {
        return null;
      }

      return customer;
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Invalid response from server');
    }

  } catch (error) {
    console.error('Error searching for customer:', error);
    throw error;
  }
};
