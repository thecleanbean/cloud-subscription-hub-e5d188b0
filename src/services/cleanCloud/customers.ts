
import { supabase } from "@/integrations/supabase/client";
import { BaseCleanCloudClient } from "./baseClient";
import { CleanCloudCustomer } from "./types";

export class CustomerService extends BaseCleanCloudClient {
  async createCustomer(customerData: {
    firstName: string;
    lastName: string;
    mobile: string;
    email: string;
    address?: string;
    postcode?: string;
    notes?: string;
  }): Promise<CleanCloudCustomer> {
    const apiKey = await this.getApiKey();
    
    console.log('Creating customer in CleanCloud:', { ...customerData, email: '***' });
    const response = await fetch(`${this.baseUrl}/customers/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_token: apiKey,
        ...customerData,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CleanCloud API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Failed to create customer in CleanCloud: ${response.statusText}`);
    }

    const customer = await response.json();
    console.log('Customer created successfully:', { id: customer.id });

    const { data: cleancloudCustomer, error } = await supabase
      .from('cleancloud_customers')
      .insert({
        email: customerData.email,
        cleancloud_customer_id: customer.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to store CleanCloud customer mapping:', error);
      throw new Error('Failed to store customer mapping');
    }

    return customer;
  }

  async updateCustomer(customerId: string, customerData: Partial<CleanCloudCustomer>): Promise<CleanCloudCustomer> {
    const apiKey = await this.getApiKey();
    
    console.log('Updating customer in CleanCloud:', { customerId: '***', data: customerData });
    const response = await fetch(`${this.baseUrl}/customers/${customerId}/update`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_token: apiKey,
        ...customerData,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CleanCloud API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Failed to update customer in CleanCloud: ${response.statusText}`);
    }

    return response.json();
  }

  async getCustomer(customerId: string): Promise<CleanCloudCustomer> {
    const apiKey = await this.getApiKey();
    
    console.log('Fetching customer from CleanCloud:', { customerId: '***' });
    const response = await fetch(`${this.baseUrl}/customers/${customerId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CleanCloud API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Failed to fetch customer from CleanCloud: ${response.statusText}`);
    }

    return response.json();
  }

  async searchCustomers(query: string): Promise<CleanCloudCustomer[]> {
    const apiKey = await this.getApiKey();
    
    console.log('Searching customers in CleanCloud:', { query: '***' });
    const response = await fetch(`${this.baseUrl}/customers/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_token: apiKey,
        query,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CleanCloud API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Failed to search customers in CleanCloud: ${response.statusText}`);
    }

    return response.json();
  }
}
