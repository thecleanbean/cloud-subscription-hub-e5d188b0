// Simulating CleanCloud API responses
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  id: string;
  customerId: string;
  plan: string;
  status: 'pending' | 'confirmed' | 'processing' | 'completed';
  deliveryOption: 'pickup' | 'delivery';
  addons: {
    homeDelivery: boolean;
    sortingService: boolean;
  };
  createdAt: string;
}

// Simulate API calls with Promise delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAPI = {
  createCustomer: async (customerData: Omit<Customer, 'id'>): Promise<Customer> => {
    await delay(1000);
    return {
      id: Math.random().toString(36).substr(2, 9),
      ...customerData
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
  }): Promise<Order> => {
    await delay(1000);
    return {
      id: Math.random().toString(36).substr(2, 9),
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
  }
};