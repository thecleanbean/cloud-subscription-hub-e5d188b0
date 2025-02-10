
import { supabase } from "@/integrations/supabase/client";
import { BaseCleanCloudClient } from "./baseClient";
import { CleanCloudOrder } from "./types";

export class OrderService extends BaseCleanCloudClient {
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
