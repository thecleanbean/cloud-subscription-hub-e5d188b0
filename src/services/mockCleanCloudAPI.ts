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
  plan: string;
  deliveryOption: 'pickup' | 'delivery';
  addons: {
    homeDelivery: boolean;
    sortingService: boolean;
  };
}

// Mock API implementation
export const mockAPI = {
  createCustomer: async (customerData: {
    name: string;
    email: string;
    phone: string;
  }): Promise<CleanCloudCustomer> => {
    // Simulate API call to CleanCloud
    console.log('Creating customer in CleanCloud:', customerData);
    
    // In real implementation, this would make an API call to CleanCloud
    return {
      id: `cust_${Math.random().toString(36).substr(2, 9)}`,
      ...customerData,
    };
  },

  createOrder: async (orderData: {
    customerId: string;
    plan: string;
    deliveryOption: 'pickup' | 'delivery';
    addons: {
      homeDelivery: boolean;
      sortingService: boolean;
    };
  }): Promise<CleanCloudOrder> => {
    // Simulate API call to CleanCloud
    console.log('Creating order in CleanCloud:', orderData);
    
    // In real implementation, this would:
    // 1. Create a subscription in CleanCloud
    // 2. Set up recurring billing through CleanCloud's payment system
    // 3. Handle addon services configuration
    return {
      id: `ord_${Math.random().toString(36).substr(2, 9)}`,
      ...orderData,
    };
  },

  // Add method to redirect to CleanCloud's payment page
  initiatePayment: async (orderId: string): Promise<string> => {
    // In real implementation, this would:
    // 1. Create a payment session in CleanCloud
    // 2. Return the URL to CleanCloud's hosted payment page
    console.log('Initiating payment for order:', orderId);
    
    // Simulate payment URL from CleanCloud
    return `https://cleancloud.payment.com/session/${orderId}`;
  }
};