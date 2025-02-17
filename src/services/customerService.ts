
import { cleanCloudAPI } from "@/services/cleanCloud";
import { FormData } from "@/types/locker";
import { supabase } from "@/integrations/supabase/client";

export const createNewCustomer = async (formData: FormData) => {
  console.log('Creating customer with data:', { 
    ...formData,
    email: '***',
    password: '***' 
  });
  
  try {
    // First check if the customer exists in our database
    const { data: existingCustomer, error: checkError } = await supabase
      .from('cleancloud_customers')
      .select('*')
      .eq('email', formData.email)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking for existing customer:', checkError);
      throw new Error('Failed to check for existing customer');
    }

    // If customer exists in our database, no need to create them again
    if (existingCustomer) {
      console.log('Customer already exists in database:', existingCustomer);
      return { id: existingCustomer.cleancloud_customer_id };
    }

    // Create customer in CleanCloud
    const customer = await cleanCloudAPI.customers.createCustomer({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      mobile: formData.mobile,
      customerAddress: formData.address || formData.postcode || '',
    });

    return customer;
  } catch (error: any) {
    // If CleanCloud says the customer exists, try to fetch them from CleanCloud
    if (error.message?.includes("account already exists")) {
      console.log('Customer exists in CleanCloud, fetching details...');
      const customer = await findCustomerByEmail(formData.email);
      
      if (customer) {
        // Store the mapping in our database
        const { error: insertError } = await supabase
          .from('cleancloud_customers')
          .insert({
            email: formData.email,
            cleancloud_customer_id: customer.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            mobile: formData.mobile
          });

        if (insertError) {
          console.error('Error storing customer mapping:', insertError);
          throw new Error('Failed to store customer mapping');
        }

        return customer;
      }
    }
    
    console.error('Error in createNewCustomer:', error);
    throw error;
  }
};

export const findCustomerByEmail = async (email: string) => {
  console.log('Searching for customer:', { email: '***' });
  
  try {
    // First check our database
    const { data: existingCustomer, error: dbError } = await supabase
      .from('cleancloud_customers')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to search for customer in database');
    }

    // If we have the customer in our database, get their details from CleanCloud
    if (existingCustomer?.cleancloud_customer_id) {
      const response = await cleanCloudAPI.customers.searchCustomers({
        email: email
      });

      if (response && response.length > 0) {
        return {
          ...response[0],
          firstName: existingCustomer.first_name,
          lastName: existingCustomer.last_name,
          mobile: existingCustomer.mobile,
        };
      }
    }

    // If not in our database, search directly in CleanCloud
    const customers = await cleanCloudAPI.customers.searchCustomers({
      email: email
    });
    
    console.log('Customer search result:', customers);
    return customers.length > 0 ? customers[0] : null;
  } catch (error) {
    console.error('Error searching for customer:', error);
    throw error;
  }
};

export const resetCustomerPassword = async (email: string) => {
  console.log('Requesting password reset for:', { email: '***' });
  
  try {
    // Using CleanCloud's password reset endpoint
    const response = await cleanCloudAPI.customers.resetPassword({
      customerEmail: email
    });
    
    return response;
  } catch (error) {
    console.error('Error requesting password reset:', error);
    throw error;
  }
};
