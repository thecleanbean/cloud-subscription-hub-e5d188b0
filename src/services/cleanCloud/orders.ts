
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
    }>;
    lockerNumber?: string;
    notes?: string;
    serviceTypes?: {
      laundry: boolean;
      duvets: boolean;
      dryCleaning: boolean;
    };
    collectionDate?: Date;
    total: number;
  }): Promise<CleanCloudOrder> {
    console.log('Creating order:', { 
      ...orderData,
      customerId: '***'
    });

    // Format the order data for CleanCloud API
    const cleanCloudOrderData = {
      customer_id: orderData.customerId,
      items: orderData.items,
      pickup_time: orderData.collectionDate?.toISOString(),
      notes: `Locker: ${orderData.lockerNumber}\n${orderData.notes || ''}`.trim(),
      total: orderData.total,
    };

    // Create order through our proxy
    const order = await this.makeRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(cleanCloudOrderData),
    });

    // Get customer from our database
    const { data: customer, error: customerError } = await supabase
      .from('cleancloud_customers')
      .select('id')
      .eq('cleancloud_customer_id', orderData.customerId)
      .single();

    if (customerError) {
      console.error('Failed to find customer:', customerError);
      throw new Error('Failed to find customer');
    }

    // Store order in our database
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customer.id,
        locker_number: orderData.lockerNumber,
        instructions: orderData.notes,
        collection_date: orderData.collectionDate?.toISOString(),
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
