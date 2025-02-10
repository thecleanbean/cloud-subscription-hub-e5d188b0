import { supabase } from "@/integrations/supabase/client";

// Types from the mock API that we'll keep using
interface CleanCloudCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface CleanCloudOrder {
  id: string;
  customerId: string;
  plan?: string;
  deliveryOption?: 'pickup' | 'delivery';
  addons?: {
    homeDelivery: boolean;
    sortingService: boolean;
  };
  lockerNumber?: string;
  pin?: string;
  instructions?: string;
  serviceTypes?: {
    laundry: boolean;
    duvets: boolean;
    dryCleaning: boolean;
  };
  collectionDate?: Date;
  total: number;
  billingPeriod?: 'monthly' | 'yearly';
}

class CleanCloudAPI {
  private apiKey: string | null = null;
  private baseUrl = 'https://api.cleancloud.com/v1'; // Update this if your API base URL is different

  private async getApiKey(): Promise<string> {
    if (this.apiKey) return this.apiKey;
    
    const { data, error } = await supabase.functions.invoke('get-cleancloud-key');
    if (error) throw new Error('Failed to get CleanCloud API key');
    
    this.apiKey = data.key;
    return this.apiKey;
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const apiKey = await this.getApiKey();
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to make CleanCloud API request');
    }

    return response.json();
  }

  async createCustomer(customerData: {
    name: string;
    email: string;
    phone: string;
  }): Promise<CleanCloudCustomer> {
    const customer = await this.request('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });

    // Store the mapping in our database
    const { error } = await supabase
      .from('cleancloud_customers')
      .insert({
        email: customerData.email,
        cleancloud_customer_id: customer.id,
      });

    if (error) {
      console.error('Failed to store CleanCloud customer mapping:', error);
      throw new Error('Failed to store customer mapping');
    }

    return customer;
  }

  async createOrder(orderData: {
    customerId: string;
    plan?: string;
    deliveryOption?: 'pickup' | 'delivery';
    addons?: {
      homeDelivery: boolean;
      sortingService: boolean;
    };
    lockerNumber?: string;
    pin?: string;
    instructions?: string;
    serviceTypes?: {
      laundry: boolean;
      duvets: boolean;
      dryCleaning: boolean;
    };
    collectionDate?: Date;
    total: number;
    billingPeriod?: 'monthly' | 'yearly';
  }): Promise<CleanCloudOrder> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async processPayment(orderId: string, paymentDetails: any): Promise<{ success: boolean; message: string }> {
    return this.request(`/orders/${orderId}/payment`, {
      method: 'POST',
      body: JSON.stringify(paymentDetails),
    });
  }
}

export const cleanCloudAPI = new CleanCloudAPI();
