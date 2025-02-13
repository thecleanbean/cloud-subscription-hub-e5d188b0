
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

    // Create customer in CleanCloud
    const response = await fetch(`${this.baseUrl}/customers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        first_name: customerData.firstName,
        last_name: customerData.lastName,
        email: customerData.email,
        mobile: customerData.mobile,
      }),
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

    // Store the mapping in our database
    const { error } = await supabase
      .from('cleancloud_customers')
      .insert({
        email: customerData.email,
        first_name: customerData.firstName,
        last_name: customerData.lastName,
        mobile: customerData.mobile,
        cleancloud_customer_id: customer.id,
      });

    if (error) {
      console.error('Failed to store customer mapping:', error);
      throw new Error('Failed to store customer mapping');
    }

    return customer;
  }

  async searchCustomers(email: string): Promise<CleanCloudCustomer[]> {
    const apiKey = await this.getApiKey();
    
    console.log('Searching for customer:', { email: '***' });

    // Search in CleanCloud
    const response = await fetch(`${this.baseUrl}/customers/search?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CleanCloud API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Failed to search customers: ${response.statusText}`);
    }

    const customers = await response.json();
    return Array.isArray(customers) ? customers : [];
  }
}
