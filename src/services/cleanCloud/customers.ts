
import { BaseCleanCloudClient } from "./baseClient";
import { CreateCustomerInput, CreateCustomerParams } from "./types";

export class CustomerService extends BaseCleanCloudClient {
  async searchCustomers(params: { email: string }) {
    console.log('Searching for customer with params:', {
      ...params,
      email: '***'
    });

    // Use a 7-day range instead of 31 days to be safe
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const dateFrom = sevenDaysAgo.toISOString().slice(0, 10); // Format as YYYY-MM-DD
    const dateTo = today.toISOString().slice(0, 10); // Format as YYYY-MM-DD

    console.log('Searching with date range:', { dateFrom, dateTo });

    const response = await this.makeRequest('/getCustomer', {
      method: 'POST',
      body: JSON.stringify({
        dateFrom,
        dateTo
      })
    });

    if (!response || response.Error) {
      console.error('Invalid customer search response:', response);
      throw new Error(response?.Error || 'Failed to search for customer');
    }

    // Filter customers by email since we get all customers in date range
    const customers = Array.isArray(response) ? response : [response];
    return customers.filter(customer => customer.customerEmail === params.email);
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
