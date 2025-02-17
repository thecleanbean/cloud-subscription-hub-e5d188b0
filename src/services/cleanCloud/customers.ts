
import { BaseCleanCloudClient } from "./baseClient";
import { CreateCustomerInput, CreateCustomerParams } from "./types";
import { supabase } from "@/integrations/supabase/client";

export class CustomerService extends BaseCleanCloudClient {
  async searchCustomers(params: { email: string }) {
    console.log('Searching for customer with params:', {
      ...params,
      email: '***'
    });

    // First try to get customer directly from CleanCloud
    const response = await this.makeRequest('/getCustomer', {
      method: 'POST',
      body: JSON.stringify({
        customerEmail: params.email,
        excludeDeactivated: 1
      })
    });

    if (!response) {
      console.error('No response from API');
      throw new Error('Failed to search for customer');
    }

    if (response.Error) {
      console.error('API Error:', response.Error);
      if (response.Error === "No Customer With That ID") {
        return [];
      }
      throw new Error(response.Error);
    }

    const customers = Array.isArray(response) ? response : [response];

    // If we found a customer in CleanCloud, make sure we have them in our database
    if (customers.length > 0) {
      const customer = customers[0];
      
      // Check if we already have this customer in our database
      const { data: existingCustomer, error: dbError } = await supabase
        .from('cleancloud_customers')
        .select('*')
        .eq('email', params.email)
        .maybeSingle();

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to check customer in database');
      }

      // If not in our database, add them
      if (!existingCustomer) {
        const { error: insertError } = await supabase
          .from('cleancloud_customers')
          .insert({
            email: params.email,
            cleancloud_customer_id: customer.id,
            first_name: customer.firstName || customer.customerName?.split(' ')[0] || '',
            last_name: customer.lastName || customer.customerName?.split(' ')[1] || '',
            mobile: customer.mobile || customer.customerTel || ''
          });

        if (insertError) {
          console.error('Failed to store customer mapping:', insertError);
          throw new Error('Failed to sync customer to database');
        }
      }
    }

    return customers;
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
