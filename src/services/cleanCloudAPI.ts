
import { supabase } from "@/integrations/supabase/client";

interface CleanCloudCustomer {
  id: string;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
}

interface CleanCloudOrder {
  id: string;
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
}

class CleanCloudAPI {
  private apiKey: string | null = null;
  private baseUrl = 'https://cleancloudapp.com/api';  // Base URL from the documentation

  private async getApiKey(): Promise<string> {
    if (this.apiKey) return this.apiKey;
    
    console.log('Fetching CleanCloud API key from Supabase function...');
    const { data, error } = await supabase.functions.invoke('get-cleancloud-key');
    
    if (error) {
      console.error('Failed to get CleanCloud API key:', error);
      throw new Error('Failed to get CleanCloud API key');
    }
    
    if (!data?.key) {
      console.error('No API key returned from function');
      throw new Error('No CleanCloud API key found');
    }

    console.log('Successfully retrieved API key');
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
    
    console.log('Creating customer in CleanCloud:', { ...customerData, email: '***' });
    const response = await fetch(`${this.baseUrl}/createCustomer`, {  // Updated endpoint
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...customerData,
        api_token: apiKey  // Added as per documentation
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

  async getCustomer(customerId: string): Promise<CleanCloudCustomer> {
    const apiKey = await this.getApiKey();
    
    console.log('Fetching customer from CleanCloud:', { customerId: '***' });
    const response = await fetch(`${this.baseUrl}/getCustomer`, {  // Correct endpoint from documentation
      method: 'POST',  // POST method as shown in documentation
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_token: apiKey,  // Required parameter from documentation
        customerID: customerId
      }),
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

    const customer = await response.json();
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
    
    console.log('Creating order in CleanCloud:', {
      ...orderData,
      customerId: '***'
    });

    const response = await fetch(`${this.baseUrl}/createOrder`, {  // Updated endpoint
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_token: apiKey,  // Added as per documentation
        ...orderData
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CleanCloud API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Failed to create order in CleanCloud: ${response.statusText}`);
    }

    const order = await response.json();
    console.log('Order created successfully:', { id: order.id });

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
        instructions: orderData.notes,
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
