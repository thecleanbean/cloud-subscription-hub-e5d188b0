
import { BaseCleanCloudClient } from "./baseClient";

export class CustomerService extends BaseCleanCloudClient {
  async searchCustomers(params: { email: string }) {
    console.log('Searching for customer with params:', {
      ...params,
      email: '***'
    });

    const response = await this.makeRequest('/getCustomer', {
      method: 'POST',
      body: JSON.stringify({
        customerEmail: params.email
      })
    });

    if (!response || response.Error) {
      console.error('Invalid customer search response:', response);
      throw new Error(response?.Error || 'Failed to search for customer');
    }

    return Array.isArray(response) ? response : [response];
  }

  async createCustomer(params: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    customerAddress: string;
    customerTel: string;
  }) {
    console.log('Creating customer:', {
      ...params,
      email: '***'
    });

    const response = await this.makeRequest('/addCustomer', {
      method: 'POST',
      body: JSON.stringify({
        customerName: `${params.firstName} ${params.lastName}`,
        customerEmail: params.email,
        customerTel: params.customerTel,
        customerAddress: params.customerAddress
      })
    });

    if (!response || response.Error) {
      console.error('Invalid customer creation response:', response);
      throw new Error(response?.Error || 'Failed to create customer');
    }

    return response;
  }
}
