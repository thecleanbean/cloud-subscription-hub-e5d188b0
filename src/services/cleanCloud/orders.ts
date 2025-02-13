
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
      customerID: orderData.customerId,
      products: orderData.items.map(item => ({
        id: '0', // Custom product
        price: item.price.toString(),
        pieces: '1',
        quantity: item.quantity.toString(),
        name: item.name
      })),
      finalTotal: orderData.total.toString(),
      orderNotes: `Locker: ${orderData.lockerNumber}\n${orderData.notes || ''}`.trim(),
      notifyMethod: '2', // Email notification
      status: '0', // Cleaning Order
      lockerOrder: '1',
      lockerNumber: orderData.lockerNumber
    };

    if (orderData.collectionDate) {
      cleanCloudOrderData['pickupDate'] = Math.floor(orderData.collectionDate.getTime() / 1000).toString();
    }

    // Create order through our proxy
    const order = await this.makeRequest('/addOrder', {
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

    // Create the order data to insert
    const orderInsertData = {
      customer_id: customer.id,
      cleancloud_customer_id: orderData.customerId,
      cleancloud_order_id: order.id,
      locker_numbers: [orderData.lockerNumber],
      service_types: orderData.serviceTypes,
      notes: orderData.notes,
      collection_date: orderData.collectionDate?.toISOString(),
      status: 'pending'
    } as const;

    // Store order in our database
    const { error: orderError } = await supabase
      .from('cleancloud_customers')
      .insert([orderInsertData]);

    if (orderError) {
      console.error('Failed to store order:', orderError);
      throw new Error('Failed to store order');
    }

    return order;
  }
}
