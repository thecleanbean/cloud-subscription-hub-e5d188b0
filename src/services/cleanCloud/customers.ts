import { BaseCleanCloudClient } from "./baseClient";
import { CreateCustomerInput, CreateCustomerParams } from "./types";
import { supabase } from "@/integrations/supabase/client";

export class CustomerService extends BaseCleanCloudClient {
  async searchCustomers(params: { email: string }) {
    console.log('=== Starting customer search ===');
    console.log('Searching for customer with email:', params.email);

    try {
      // First check our database
      console.log('Step 1: Checking local database...');
      const { data: existingCustomer, error: dbError } = await supabase
        .from('cleancloud_customers')
        .select('*')
        .eq('email', params.email)
        .maybeSingle();

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to check customer in database');
      }

      if (existingCustomer) {
        console.log('Found customer in local database:', {
          id: existingCustomer.id,
          cleancloud_id: existingCustomer.cleancloud_customer_id,
          email: existingCustomer.email
        });
        
        // Get fresh details from CleanCloud
        const customerDetails = await this.makeRequest('/getCustomer', {
          method: 'POST',
          body: JSON.stringify({
            customerID: existingCustomer.cleancloud_customer_id
          })
        });

        if (!customerDetails?.Error) {
          return [{
            ...customerDetails,
            id: existingCustomer.cleancloud_customer_id,
            firstName: customerDetails.Name?.split(' ')[0] || existingCustomer.first_name || '',
            lastName: customerDetails.Name?.split(' ').slice(1).join(' ') || existingCustomer.last_name || '',
            mobile: customerDetails.Tel || existingCustomer.mobile || '',
            email: params.email
          }];
        }
      }

      // Search for customer in CleanCloud
      console.log('Step 2: Searching CleanCloud for customer...');
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);

      const customerListResponse = await this.makeRequest('/getCustomer', {
        method: 'POST',
        body: JSON.stringify({
          dateFrom: thirtyDaysAgo.toISOString().split('T')[0],
          dateTo: today.toISOString().split('T')[0]
        })
      });

      console.log('CleanCloud search response:', customerListResponse);

      if (customerListResponse?.Success === "True" && Array.isArray(customerListResponse.Customers)) {
        // Debug: Log customer search
        console.log('Searching for email:', params.email.toLowerCase());

        const foundCustomer = customerListResponse.Customers.find(c => {
          const searchEmail = params.email.toLowerCase();
          const customerEmail = (c.Email || '').toLowerCase(); // Using Email as that's what we see in the response
          
          console.log('Comparing:', { 
            customer: c.Name,
            customerEmail, 
            searchEmail,
            matches: customerEmail === searchEmail 
          });
          
          return customerEmail === searchEmail;
        });

        if (foundCustomer) {
          console.log('Found matching customer:', foundCustomer);

          // Process the customer details according to actual API response fields
          const processedCustomer = {
            id: foundCustomer.ID,
            firstName: foundCustomer.Name?.split(' ')[0] || '',
            lastName: foundCustomer.Name?.split(' ').slice(1).join(' ') || '',
            mobile: foundCustomer.Tel || '',
            email: params.email,
            customerAddress: foundCustomer.Address || ''
          };

          // If customer isn't in our database yet, add them
          if (!existingCustomer) {
            console.log('Step 3: Syncing customer to local database...');
            
            const { error: insertError } = await supabase
              .from('cleancloud_customers')
              .insert({
                email: params.email,
                cleancloud_customer_id: processedCustomer.id,
                first_name: processedCustomer.firstName,
                last_name: processedCustomer.lastName,
                mobile: processedCustomer.mobile
              });

            if (insertError) {
              console.error('Failed to store customer mapping:', insertError);
              throw new Error('Failed to sync customer to database');
            }
            
            console.log('Successfully synced customer to database');
          }

          return [processedCustomer];
        }
      }

      console.log('No matching customer found');
      return [];

    } catch (error) {
      console.error('=== Error in searchCustomers ===', error);
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
