
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
      api_token: undefined, // This will be added by the proxy
      customerId: orderData.customerId, // Changed from customerID to customerId
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
    const response = await this.makeRequest('/addOrder', {
      method: 'POST',
      body: JSON.stringify(cleanCloudOrderData),
    });

    if (!response || response.Error) {
      console.error('Invalid order response:', response);
      throw new Error(response?.Error || 'Failed to create order in CleanCloud');
    }

    return response;
  }
}
