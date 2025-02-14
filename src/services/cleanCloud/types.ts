
export interface CleanCloudCustomer {
  id: string;
  customerEmail: string;  // Updated to match API response
  customerName: string;   // Updated to match API response
  customerTel: string;    // Updated to match API response
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

export interface CleanCloudOrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  service_type: string;
  notes?: string;
}

export interface CleanCloudOrder {
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

export interface CreateCustomerInput {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  customerAddress?: string;
}

export interface CreateCustomerParams {
  customerName: string;
  customerEmail: string;
  customerTel: string;
  customerAddress: string;
}
