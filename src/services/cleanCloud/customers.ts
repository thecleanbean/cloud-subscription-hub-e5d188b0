
import { supabase } from "@/integrations/supabase/client";
import { BaseCleanCloudClient } from "./baseClient";
import { CleanCloudCustomer } from "./types";

export class CustomerService extends BaseCleanCloudClient {
  async createCustomer(customerData: {
    firstName: string;
    lastName: string;
    mobile: string;
    email: string;
  }): Promise<CleanCloudCustomer> {
    const apiKey = await this.getApiKey();
    
    console.log('Creating customer with data:', { 
      ...customerData,
      email: '***' 
    });

    // First create customer in CleanCloud
    const response = await fetch(`${this.baseUrl}/v1/customers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CleanCloud API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Failed to create customer: ${response.statusText}`);
    }

    const customer = await response.json();

    // Then store the mapping in our database
    const { data: cleancloudCustomer, error } = await supabase
      .from('cleancloud_customers')
      .insert({
        email: customerData.email,
        cleancloud_customer_id: customer.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to store customer mapping:', error);
      throw new Error('Failed to store customer mapping');
    }

    return customer;
  }

  async searchCustomers(email: string): Promise<CleanCloudCustomer[]> {
    const apiKey = await this.getApiKey();
    
    console.log('Searching for customer:', { email: '***' });

    // First check our database for the customer
    const { data: existingCustomer, error: dbError } = await supabase
      .from('cleancloud_customers')
      .select('cleancloud_customer_id')
      .eq('email', email)
      .single();

    if (dbError && dbError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Database error:', dbError);
      throw new Error('Failed to search for customer');
    }

    if (existingCustomer) {
      // If found, get customer details from CleanCloud
      const response = await fetch(`${this.baseUrl}/v1/customers/${existingCustomer.cleancloud_customer_id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch customer: ${response.statusText}`);
      }

      const customer = await response.json();
      return [customer];
    }

    // If not found in our database, search CleanCloud directly
    const response = await fetch(`${this.baseUrl}/v1/customers/search?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to search customers: ${response.statusText}`);
    }

    return response.json();
  }
}
