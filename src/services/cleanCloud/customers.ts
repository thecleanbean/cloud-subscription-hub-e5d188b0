
import { BaseCleanCloudClient } from "./baseClient";
import { CreateCustomerInput, CreateCustomerParams } from "./types";
import { supabase } from "@/integrations/supabase/client";

export class CustomerService extends BaseCleanCloudClient {
  async searchCustomers(params: { email: string }) {
    console.log('Searching for customer with params:', {
      ...params,
      email: '***'
    });

    // First check if we have this customer in our Supabase database
    const { data: existingCustomer, error: dbError } = await supabase
      .from('cleancloud_customers')
      .select('*')
      .eq('email', params.email)
      .single();

    if (dbError && dbError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Database error:', dbError);
      throw new Error('Failed to search for customer in database');
    }

    if (existingCustomer?.cleancloud_customer_id) {
      // If we have the CleanCloud ID, use it to fetch the latest customer data
      const response = await this.makeRequest('/getCustomer', {
        method: 'POST',
        body: JSON.stringify({
          customerID: existingCustomer.cleancloud_customer_id,
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

      return Array.isArray(response) ? response : [response];
    }

    // If we don't have the customer in our database, they're new
    return [];
  }

  async createCustomer(input: CreateCustomerInput) {
    console.log('Creating customer:', {
      ...input,
      email: '***'
    });

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

    if (!response || response.Error) {
      console.error('Invalid customer creation response:', response);
      throw new Error(response?.Error || 'Failed to create customer');
    }

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
      // Don't throw here - the customer was created in CleanCloud successfully
      // We'll try to insert the mapping again next time
    }

    return response;
  }
}
