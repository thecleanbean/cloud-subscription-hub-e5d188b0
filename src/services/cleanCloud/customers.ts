
import { BaseCleanCloudClient } from "./baseClient";
import { CreateCustomerInput, CreateCustomerParams } from "./types";

export class CustomerService extends BaseCleanCloudClient {
  async searchCustomers(params: { email: string }) {
    console.log('Searching for customer with params:', {
      ...params,
      email: '***'
    });

    const response = await this.makeRequest('/getCustomer', {
      method: 'POST',
      body: JSON.stringify({
        customerEmail: params.email,
        excludeDeactivated: 1
      })
    });

    if (!response) {
      console.error('No response from API');
      throw new Error('Failed to search for customer');
    }

    if (response.Error) {
      console.error('API Error:', response.Error);
      // If it's a new customer, return empty array instead of throwing
      if (response.Error === "No Customer With That ID") {
        return [];
      }
      throw new Error(response.Error);
    }

    // Handle both single customer and array responses
    const customers = Array.isArray(response) ? response : [response];
    return customers;
  }

  async createCustomer(input: CreateCustomerInput) {
    console.log('Creating customer:', {
      ...input,
      email: '***'
    });

    // Transform the input into the format expected by the API
    const params: CreateCustomerParams = {
      customerName: `${input.firstName} ${input.lastName}`,
      customerEmail: input.email,
      customerTel: input.mobile,
      customerAddress: input.customerAddress || ''
    };

    const response = await this.makeRequest('/addCustomer', {
      method: 'POST',
      body: JSON.stringify(params)
    });

    if (!response || response.Error) {
      console.error('Invalid customer creation response:', response);
      throw new Error(response?.Error || 'Failed to create customer');
    }

    return response;
  }
}
