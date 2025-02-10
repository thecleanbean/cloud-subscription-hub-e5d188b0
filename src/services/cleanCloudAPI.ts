
import { supabase } from "@/integrations/supabase/client";

interface CleanCloudCustomer {
  id: string;
  firstName: string;  // Changed from 'name' to match API
  lastName: string;   // Added to match API
  mobile: string;     // Changed from 'phone' to match API
  email: string;
}

interface CleanCloudOrder {
  id: string;
  customerId: string;
  lockerNumber?: string;
  notes?: string;     // Changed from 'instructions' to match API
  serviceTypes: {     // Keeping these as they match the API
    laundry: boolean;
    duvets: boolean;
    dryCleaning: boolean;
  };
  collectionDate?: Date;
  total: number;
}

class CleanCloudAPI {
  private apiKey: string | null = null;
  private baseUrl = 'https://cleancloudapp.com/api';  // Updated to match specified base URL

  private async getApiKey(): Promise<string> {
    if (this.apiKey) return this.apiKey;
    
    const { data, error } = await supabase.functions.invoke('get-cleancloud-key');
    if (error) throw new Error('Failed to get CleanCloud API key');
    
    this.apiKey = data.key;
    return this.apiKey;
  }

  async createCustomer(customerData: {
    firstName: string;
    lastName: string;
    mobile: string;
    email: string;
  }): Promise<CleanCloudCustomer> {
    const apiKey = await this.getApiKey();
    
    const response = await fetch(`${this.baseUrl}/addCustomer`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      throw new Error('Failed to create customer in CleanCloud');
    }

    const customer = await response.json();

    // Store the customer mapping in our database
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

  async createOrder(orderData: {
    customerId: string;
    lockerNumber?: string;
    notes?: string;
    serviceTypes: {
      laundry: boolean;
      duvets: boolean;
      dryCleaning: boolean;
    };
    collectionDate?: Date;
    total: number;
  }): Promise<CleanCloudOrder> {
    const apiKey = await this.getApiKey();
    
    const response = await fetch(`${this.baseUrl}/store`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error('Failed to create order in CleanCloud');
    }

    const order = await response.json();

    // Get the customer from our database
    const { data: customer, error: customerError } = await supabase
      .from('cleancloud_customers')
      .select('id')
      .eq('cleancloud_customer_id', orderData.customerId)
      .single();

    if (customerError) {
      console.error('Failed to find customer:', customerError);
      throw new Error('Failed to find customer');
    }

    // Convert Date to ISO string for Supabase
    const collectionDateString = orderData.collectionDate?.toISOString();

    // Store the order in our database
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customer.id,
        locker_number: orderData.lockerNumber,
        instructions: orderData.notes,  // Updated to match API field name
        collection_date: collectionDateString,
        service_types: orderData.serviceTypes,
        total: orderData.total,
        cleancloud_order_id: order.id,
      });

    if (orderError) {
      console.error('Failed to store order:', orderError);
      throw new Error('Failed to store order');
    }

    return order;
  }
}

export const cleanCloudAPI = new CleanCloudAPI();

