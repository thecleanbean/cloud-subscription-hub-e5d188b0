import { BaseCleanCloudClient } from "./baseClient";
import { CreateCustomerInput, CreateCustomerParams } from "./types";
import { supabase } from "@/integrations/supabase/client";

export class CustomerService extends BaseCleanCloudClient {
  async searchCustomers(params: { email: string }) {
    console.log('Searching for customer with params:', {
      ...params,
      email: '***'
    });

    try {
      // First check our database
      const { data: existingCustomer, error: dbError } = await supabase
        .from('cleancloud_customers')
        .select('*')
        .eq('email', params.email)
        .maybeSingle();

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to check customer in database');
      }

      // First try to find customer in CleanCloud using loginCustomer
      console.log('Checking if customer exists in CleanCloud');
      
      const loginResponse = await this.makeRequest('/loginCustomer', {
        method: 'POST',
        body: JSON.stringify({
          customerEmail: params.email,
          customerPassword: 'placeholder'
        })
      });

      console.log('CleanCloud login response:', loginResponse);

      // If customer doesn't exist in CleanCloud
      if (loginResponse?.Error === "No Customer With That Email") {
        console.log('No customer found in CleanCloud');
        return [];
      }

      // If there's an unexpected error
      if (loginResponse?.Error && !loginResponse.Error.includes("Invalid Password")) {
        console.error('Unexpected API Error:', loginResponse.Error);
        throw new Error(loginResponse.Error);
      }

      // At this point we know the customer exists in CleanCloud
      // The ID will be in the response even with an "Invalid Password" error
      const cleanCloudId = loginResponse.id;
      console.log('Found customer in CleanCloud, getting full details');

      // Get full customer details using the ID
      const customerDetails = await this.makeRequest('/getCustomer', {
        method: 'POST',
        body: JSON.stringify({
          customerID: cleanCloudId
        })
      });

      if (customerDetails?.Error) {
        console.error('Error fetching customer details:', customerDetails.Error);
        throw new Error(customerDetails.Error);
      }

      console.log('Got customer details from CleanCloud:', customerDetails);

      // If customer isn't in our database yet, add them
      if (!existingCustomer) {
        console.log('Customer not in our database, adding them');
        
        const { error: insertError } = await supabase
          .from('cleancloud_customers')
          .insert({
            email: params.email,
            cleancloud_customer_id: cleanCloudId,
            first_name: customerDetails.firstName || customerDetails.customerName?.split(' ')[0] || '',
            last_name: customerDetails.lastName || customerDetails.customerName?.split(' ')[1] || '',
            mobile: customerDetails.mobile || customerDetails.customerTel || ''
          });

        if (insertError) {
          console.error('Failed to store customer mapping:', insertError);
          throw new Error('Failed to sync customer to database');
        }
        
        console.log('Successfully added customer to database');
      }

      // Return the customer details
      return [{
        ...customerDetails,
        id: cleanCloudId,
        firstName: customerDetails.firstName || customerDetails.customerName?.split(' ')[0] || '',
        lastName: customerDetails.lastName || customerDetails.customerName?.split(' ')[1] || '',
        mobile: customerDetails.mobile || customerDetails.customerTel || '',
        email: params.email
      }];

    } catch (error) {
      console.error('Error in searchCustomers:', error);
      throw error;
    }
  }

  async createCustomer(input: CreateCustomerInput) {
    console.log('Creating customer:', {
      ...input,
      email: '***'
    });

    // First check if this customer already exists in CleanCloud
    const existingCustomers = await this.searchCustomers({ email: input.email });
    if (existingCustomers.length > 0) {
      throw new Error('An account with this email already exists');
    }

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

    if (!response || !response.id) {
      console.error('Invalid customer creation response:', response);
      throw new Error(response?.Error || 'Failed to create customer');
    }

    console.log('CleanCloud customer created with ID:', response.id);

    // Store the mapping in our database
    const { error: insertError } = await supabase
      .from('cleancloud_customers')
      .insert({
        email: input.email,
        cleancloud_customer_id: response.id,
        first_name: input.firstName,
        last_name: input.lastName,
        mobile: input.mobile
      });

    if (insertError) {
      console.error('Failed to store customer mapping:', insertError);
      throw new Error('Failed to complete account creation');
    }

    return response;
  }

  async resetPassword(params: { customerEmail: string }) {
    console.log('Requesting password reset:', {
      ...params,
      customerEmail: '***'
    });

    const response = await this.makeRequest('/passwordCustomer', {
      method: 'POST',
      body: JSON.stringify({
        customerEmail: params.customerEmail
      })
    });

    if (!response || response.Error) {
      console.error('Password reset request failed:', response);
      throw new Error(response?.Error || 'Failed to request password reset');
    }

    return response;
  }
}
