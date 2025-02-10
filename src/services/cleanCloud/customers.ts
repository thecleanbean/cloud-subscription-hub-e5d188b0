
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

    // First create customer in CleanCloud using the correct endpoint
    const response = await fetch(`${this.baseUrl}/api/addCustomer`, {
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
        first_name: customerData.firstName,
        last_name: customerData.lastName,
        mobile: customerData.mobile,
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
      .select('cleancloud_customer_id, first_name, last_name, mobile, email')
      .eq('email', email)
      .maybeSingle();  // Changed from .single() to .maybeSingle()

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to search for customer');
    }

    if (existingCustomer) {
      // If found in our database, return as a CleanCloud customer format
      return [{
        id: existingCustomer.cleancloud_customer_id,
        firstName: existingCustomer.first_name || '',
        lastName: existingCustomer.last_name || '',
        mobile: existingCustomer.mobile || '',
        email: existingCustomer.email
      }];
    }

    // If not found in our database, we need to search through our Edge Function
    const response = await fetch(`/api/cleancloud/customers/search?email=${encodeURIComponent(email)}`, {
      method: 'GET',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return []; // No customers found
      }
      throw new Error(`Failed to search customers: ${response.statusText}`);
    }

    return response.json();
  }
}
