
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const apiKey = Deno.env.get('CLEANCLOUD_API_KEY');
    if (!apiKey) {
      throw new Error('CleanCloud API key not configured');
    }

    const results: any = {};

    // 1. Search for existing customer by email
    console.log('Step 1: Searching for customer by email');
    const searchUrl = 'https://cleancloudapp.com/api/getCustomer';
    const searchResponse = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        api_token: apiKey.trim(),
        customerEmail: 'david@davidmagnus.co.uk'
      })
    });

    const searchResult = await searchResponse.text();
    console.log('Search customer response:', searchResult);
    results.customerSearch = searchResult;

    let customerData;
    try {
      customerData = JSON.parse(searchResult);
    } catch (e) {
      console.error('Failed to parse customer search result:', e);
    }

    // 2. Create a test order for the existing customer
    if (customerData && customerData.id) {
      console.log('Step 2: Creating order for existing customer:', customerData.id);
      const createOrderUrl = 'https://cleancloudapp.com/api/addOrder';
      const orderData = {
        api_token: apiKey.trim(),
        customerID: customerData.id,
        products: [
          {
            id: '0',
            price: '25.00',
            pieces: '1',
            quantity: '1',
            name: 'Test Laundry Service'
          }
        ],
        finalTotal: '25.00',
        orderNotes: 'Test order via API',
        notifyMethod: '2', // Email notification
        status: '0' // Cleaning Order
      };

      const orderResponse = await fetch(createOrderUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const orderResult = await orderResponse.text();
      console.log('Create order response:', orderResult);
      results.existingCustomerOrder = orderResult;
    }

    // 3. Create a new test customer and order
    console.log('Step 3: Creating new test customer');
    const createCustomerUrl = 'https://cleancloudapp.com/api/addCustomer';
    const newCustomerData = {
      api_token: apiKey.trim(),
      customerName: 'Test Customer',
      customerTel: '1234567890',
      customerEmail: 'test' + Date.now() + '@example.com' // Make email unique
    };

    const customerResponse = await fetch(createCustomerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newCustomerData)
    });

    const customerResult = await customerResponse.text();
    console.log('Create customer response:', customerResult);
    results.newCustomer = customerResult;

    // If new customer was created successfully, create an order for them
    let newCustomerData;
    try {
      newCustomerData = JSON.parse(customerResult);
    } catch (e) {
      console.error('Failed to parse new customer result:', e);
    }

    if (newCustomerData && newCustomerData.id) {
      console.log('Creating order for new customer:', newCustomerData.id);
      const createOrderUrl = 'https://cleancloudapp.com/api/addOrder';
      const newOrderData = {
        api_token: apiKey.trim(),
        customerID: newCustomerData.id,
        products: [
          {
            id: '0',
            price: '30.00',
            pieces: '1',
            quantity: '1',
            name: 'New Customer Test Service'
          }
        ],
        finalTotal: '30.00',
        orderNotes: 'Test order for new customer via API',
        notifyMethod: '2',
        status: '0'
      };

      const newOrderResponse = await fetch(createOrderUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newOrderData)
      });

      const newOrderResult = await newOrderResponse.text();
      console.log('Create order for new customer response:', newOrderResult);
      results.newCustomerOrder = newOrderResult;
    }

    // Return all results
    return new Response(
      JSON.stringify({
        success: true,
        results
      }),
      { 
        status: 200, 
        headers: corsHeaders 
      }
    );

  } catch (error) {
    console.error('Test error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
