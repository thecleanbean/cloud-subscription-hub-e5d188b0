
import { BaseCleanCloudClient } from "./baseClient";
import { CreateCustomerInput, CreateCustomerParams } from "./types";
import { supabase } from "@/integrations/supabase/client";

export class CustomerService extends BaseCleanCloudClient {
  async searchCustomers(params: { email: string }) {
    console.log('=== Starting customer search ===');
    console.log('Searching for customer with email:', params.email);

    try {
      // First check our database
      console.log('Step 1: Checking local database...');
      const { data: existingCustomer, error: dbError } = await supabase
        .from('cleancloud_customers')
        .select('*')
        .eq('email', params.email)
        .maybeSingle();

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to check customer in database');
      }

      if (existingCustomer) {
        console.log('Found customer in local database:', {
          id: existingCustomer.id,
          cleancloud_id: existingCustomer.cleancloud_customer_id,
          email: existingCustomer.email
        });
      } else {
        console.log('Customer not found in local database');
      }

      // First try to find customer in CleanCloud using loginCustomer
      console.log('Step 2: Checking CleanCloud via loginCustomer...');
      
      const loginRequest = {
        customerEmail: params.email,
        customerPassword: 'placeholder'
      };
      console.log('Login request payload:', loginRequest);

      const loginResponse = await this.makeRequest('/loginCustomer', {
        method: 'POST',
        body: JSON.stringify(loginRequest)
      });

      console.log('CleanCloud login response:', loginResponse);

      // If customer doesn't exist in CleanCloud
      if (loginResponse?.Error === "No Customer With That Email") {
        console.log('Result: No customer found in CleanCloud');
        return [];
      }

      // If there's a password error, it means the customer exists!
      // Extract the customer ID from the response
      const customerExists = loginResponse?.Error?.includes("Incorrect email and password");
      if (!customerExists && loginResponse?.Error) {
        console.error('Unexpected API Error:', loginResponse.Error);
        throw new Error(loginResponse.Error);
      }

      // At this point we know the customer exists in CleanCloud
      // The customer ID should be in the response even with password error
      const cleanCloudId = loginResponse.id;
      console.log('Step 3: Customer found in CleanCloud with ID:', cleanCloudId);
      console.log('Fetching full customer details...');

      // Get full customer details using the ID
      const customerDetails = await this.makeRequest('/getCustomer', {
        method: 'POST',
        body: JSON.stringify({
          customerID: cleanCloudId
        })
      });

      console.log('Raw customer details response:', customerDetails);

      if (customerDetails?.Error) {
        console.error('Error fetching customer details:', customerDetails.Error);
        throw new Error(customerDetails.Error);
      }

      // Process the customer details
      const processedCustomer = {
        ...customerDetails,
        id: cleanCloudId,
        firstName: customerDetails.firstName || customerDetails.customerName?.split(' ')[0] || '',
        lastName: customerDetails.lastName || customerDetails.customerName?.split(' ')[1] || '',
        mobile: customerDetails.mobile || customerDetails.customerTel || '',
        email: params.email
      };

      console.log('Processed customer details:', {
        ...processedCustomer,
        email: '***'
      });

      // If customer isn't in our database yet, add them
      if (!existingCustomer) {
        console.log('Step 4: Syncing customer to local database...');
        
        const { error: insertError } = await supabase
          .from('cleancloud_customers')
          .insert({
            email: params.email,
            cleancloud_customer_id: cleanCloudId,
            first_name: processedCustomer.firstName,
            last_name: processedCustomer.lastName,
            mobile: processedCustomer.mobile
          });

        if (insertError) {
          console.error('Failed to store customer mapping:', insertError);
          throw new Error('Failed to sync customer to database');
        }
        
        console.log('Successfully synced customer to database');
      }

      console.log('=== Customer search completed successfully ===');
      return [processedCustomer];

    } catch (error) {
      console.error('=== Error in searchCustomers ===', error);
      throw error;
    }
  }

  async createCustomer(input: CreateCustomerInput) {
    console.log('Creating customer:', {
      ...input,
      email: '***'
    });

    // First check if this customer already exists in CleanCloud
    const existingCustomers = await this.searchCustomers({ email: input.email });
    if (existingCustomers.length > 0) {
      throw new Error('An account with this email already exists');
    }

    // Transform the input into the format expected by the API
    const params: CreateCustomerParams = {
      customerName: `${input.firstName} ${input.lastName}`,
      customerEmail: input.email,
      customerTel: input.mobile,
      customerAddress: input.customerAddress || ''
    };

    const response = await this.makeRequest('/addCustomer', {
      method: 'POST',
      body: JSON.stringify(params)
    });

    if (!response || !response.id) {
      console.error('Invalid customer creation response:', response);
      throw new Error(response?.Error || 'Failed to create customer');
    }

    console.log('CleanCloud customer created with ID:', response.id);

    // Store the mapping in our database
    const { error: insertError } = await supabase
      .from('cleancloud_customers')
      .insert({
        email: input.email,
        cleancloud_customer_id: response.id,
        first_name: input.firstName,
        last_name: input.lastName,
        mobile: input.mobile
      });

    if (insertError) {
      console.error('Failed to store customer mapping:', insertError);
      throw new Error('Failed to complete account creation');
    }

    return response;
  }

  async resetPassword(params: { customerEmail: string }) {
    console.log('Requesting password reset:', {
      ...params,
      customerEmail: '***'
    });

    const response = await this.makeRequest('/passwordCustomer', {
      method: 'POST',
      body: JSON.stringify({
        customerEmail: params.customerEmail
      })
    });

    if (!response || response.Error) {
      console.error('Password reset request failed:', response);
      throw new Error(response?.Error || 'Failed to request password reset');
    }

    return response;
  }
}
