
import { supabase } from "@/integrations/supabase/client";
import { BaseCleanCloudClient } from "./baseClient";
import { CleanCloudCustomer } from "./types";

export class CustomerService extends BaseCleanCloudClient {
  async createCustomer(customerData: {
    firstName: string;
    lastName: string;
    mobile: string;
    email: string;
    password?: string; // Make password optional
  }): Promise<CleanCloudCustomer> {
    console.log('Creating customer with data:', { 
      ...customerData,
      email: '***',
      password: '***'
    });

    // Create customer through our proxy
    const customer = await this.makeRequest('/customers', {
      method: 'POST',
      body: JSON.stringify({
        first_name: customerData.firstName,
        last_name: customerData.lastName,
        email: customerData.email,
        mobile: customerData.mobile,
        customerPassword: customerData.password // Send password if provided
      }),
    });

    // Store the mapping in our database
    const { error } = await supabase
      .from('cleancloud_customers')
      .insert({
        email: customerData.email,
        first_name: customerData.firstName,
        last_name: customerData.lastName,
        mobile: customerData.mobile,
        cleancloud_customer_id: customer.id,
      });

    if (error) {
      console.error('Failed to store customer mapping:', error);
      throw new Error('Failed to store customer mapping');
    }

    return customer;
  }

  async searchCustomers(email: string): Promise<CleanCloudCustomer[]> {
    console.log('Searching for customer:', { email: '***' });

    // Search through our proxy
    const customers = await this.makeRequest(`/customers/search?email=${encodeURIComponent(email)}`);
    return Array.isArray(customers) ? customers : [];
  }

  async loginCustomer(email: string, password: string): Promise<CleanCloudCustomer | null> {
    console.log('Logging in customer:', { email: '***' });
    
    try {
      // Use CleanCloud's login endpoint
      const response = await this.makeRequest('/loginCustomer', {
        method: 'POST',
        body: JSON.stringify({
          customerEmail: email,
          customerPassword: password
        })
      });

      if (response && response.customerID) {
        // Get full customer details after successful login
        const customerDetails = await this.makeRequest(`/customers/${response.customerID}`);
        return customerDetails;
      }

      return null;
    } catch (error) {
      console.error('Login failed:', error);
      return null;
    }
  }
}
