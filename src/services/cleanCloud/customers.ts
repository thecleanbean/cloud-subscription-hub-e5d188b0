
import { BaseCleanCloudClient } from "./baseClient";
import { CreateCustomerInput, CreateCustomerParams } from "./types";
import { supabase } from "@/integrations/supabase/client";

export class CustomerService extends BaseCleanCloudClient {
  async searchCustomers(params: { email: string }) {
    console.log('Searching for customer with params:', {
      ...params,
      email: '***'
    });

    try {
      // First check our database
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
        console.log('Found customer in our database:', existingCustomer);
      }

      // Search in CleanCloud using loginCustomer endpoint
      console.log('Making CleanCloud API request to check customer existence');
      
      const response = await this.makeRequest('/loginCustomer', {
        method: 'POST',
        body: JSON.stringify({
          customerEmail: params.email,
          customerPassword: 'placeholder' // The API will return customer info even with invalid password
        })
      });

      console.log('CleanCloud API response:', response);

      if (response?.Error === "No Customer With That Email") {
        console.log('No customer found in CleanCloud');
        return [];
      }

      if (response?.Error && !response.Error.includes("Invalid Password")) {
        console.error('Unexpected API Error:', response.Error);
        throw new Error(response.Error);
      }

      // If we got here, the customer exists (either we got valid data or an "Invalid Password" error)
      const customerData = response.Error ? { id: response.id } : response;
      console.log('Found customer in CleanCloud:', customerData);

      // If we found a customer in CleanCloud and not in our database, add them
      if (customerData?.id && !existingCustomer) {
        console.log('Syncing CleanCloud customer to our database');
        
        // Get full customer details now that we have the ID
        const customerDetails = await this.makeRequest('/getCustomer', {
          method: 'POST',
          body: JSON.stringify({
            customerID: customerData.id
          })
        });

        console.log('Got customer details:', customerDetails);

        if (!customerDetails?.Error) {
          const { error: insertError } = await supabase
            .from('cleancloud_customers')
            .insert({
              email: params.email,
              cleancloud_customer_id: customerData.id,
              first_name: customerDetails.firstName || customerDetails.customerName?.split(' ')[0] || '',
              last_name: customerDetails.lastName || customerDetails.customerName?.split(' ')[1] || '',
              mobile: customerDetails.mobile || customerDetails.customerTel || ''
            });

          if (insertError) {
            console.error('Failed to store customer mapping:', insertError);
            throw new Error('Failed to sync customer to database');
          }
          console.log('Successfully synced customer to database');
        }
      }

      return customerData ? [customerData] : [];
    } catch (error) {
      console.error('Error in searchCustomers:', error);
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
