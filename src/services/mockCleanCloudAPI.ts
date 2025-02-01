// Types for CleanCloud API
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

// Mock API implementation
export const mockAPI = {
  createCustomer: async (customerData: {
    name: string;
    email: string;
    phone: string;
  }): Promise<CleanCloudCustomer> => {
    console.log('Creating customer in CleanCloud:', customerData);
    
    return {
      id: `cust_${Math.random().toString(36).substr(2, 9)}`,
      ...customerData,
    };
  },

  createOrder: async (orderData: {
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
  }): Promise<CleanCloudOrder> => {
    console.log('Creating order in CleanCloud:', orderData);
    
    return {
      id: `ord_${Math.random().toString(36).substr(2, 9)}`,
      ...orderData,
    };
  },

  processPayment: async (orderId: string, paymentDetails: any): Promise<{ success: boolean; message: string }> => {
    console.log('Processing payment for order:', orderId);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      message: 'Payment processed successfully',
    };
  },
};