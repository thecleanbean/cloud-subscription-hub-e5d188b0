
import { supabase } from "@/integrations/supabase/client";

interface CleanCloudCustomer {
  id: string;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  address?: string;
  postcode?: string;
  notes?: string;
  loyalty_points?: number;
  created_at?: string;
  updated_at?: string;
}

interface CleanCloudOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  service_type: string;
  notes?: string;
}

interface CleanCloudOrder {
  id: string;
  customer_id: string;
  order_number: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
  items: CleanCloudOrderItem[];
  collection_date?: string;
  delivery_date?: string;
  delivery_address?: string;
  delivery_postcode?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  locker_number?: string;
  service_types?: {
    laundry: boolean;
    duvets: boolean;
    dryCleaning: boolean;
  };
}

class CleanCloudAPI {
  private apiKey: string | null = null;
  private baseUrl = 'https://cleancloudapp.com/api';

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

  async createOrder(orderData: {
    customerId: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      service_type: string;
      notes?: string;
    }>;
    lockerNumber?: string;
    notes?: string;
    serviceTypes?: {
      laundry: boolean;
      duvets: boolean;
      dryCleaning: boolean;
    };
    collectionDate?: Date;
    deliveryDate?: Date;
    deliveryAddress?: string;
    deliveryPostcode?: string;
    total: number;
  }): Promise<CleanCloudOrder> {
    const apiKey = await this.getApiKey();
    
    console.log('Creating order in CleanCloud:', {
      ...orderData,
      customerId: '***'
    });

    // Format dates to ISO strings if they exist
    const formattedOrderData = {
      ...orderData,
      collection_date: orderData.collectionDate?.toISOString(),
      delivery_date: orderData.deliveryDate?.toISOString(),
      customer_id: orderData.customerId, // API expects customer_id
      locker_number: orderData.lockerNumber,
      delivery_address: orderData.deliveryAddress,
      delivery_postcode: orderData.deliveryPostcode,
    };

    const response = await fetch(`${this.baseUrl}/orders/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_token: apiKey,
        ...formattedOrderData,
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

    // Store the order in our database
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customer.id,
        locker_number: orderData.lockerNumber,
        instructions: orderData.notes,
        collection_date: orderData.collectionDate?.toISOString(),
        delivery_date: orderData.deliveryDate?.toISOString(),
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

  async getOrder(orderId: string): Promise<CleanCloudOrder> {
    const apiKey = await this.getApiKey();
    
    console.log('Fetching order from CleanCloud:', { orderId: '***' });
    const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
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
      throw new Error(`Failed to fetch order from CleanCloud: ${response.statusText}`);
    }

    return response.json();
  }

  async updateOrderStatus(orderId: string, status: CleanCloudOrder['status']): Promise<CleanCloudOrder> {
    const apiKey = await this.getApiKey();
    
    console.log('Updating order status in CleanCloud:', { orderId: '***', status });
    const response = await fetch(`${this.baseUrl}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_token: apiKey,
        status,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('CleanCloud API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Failed to update order status in CleanCloud: ${response.statusText}`);
    }

    return response.json();
  }
}

export const cleanCloudAPI = new CleanCloudAPI();
