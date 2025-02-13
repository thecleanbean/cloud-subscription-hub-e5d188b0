
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

    // 1. Search for existing customer
    console.log('Step 1: Searching for existing customer');
    const searchUrl = 'https://cleancloudapp.com/api/getCustomer';
    const searchResponse = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        api_token: apiKey.trim(),
        dateFrom: '2024-01-01',
        dateTo: '2024-12-31'
      })
    });

    const searchResult = await searchResponse.text();
    console.log('Search customer response:', searchResult);
    results.customerSearch = searchResult;

    // 2. Create a test order for the existing customer
    console.log('Step 2: Creating order for existing customer');
    const createOrderUrl = 'https://cleancloudapp.com/api/addOrder';
    const orderData = {
      api_token: apiKey.trim(),
      customerID: '1', // We'll update this with the actual ID from search
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

    // 3. Create a new test customer
    console.log('Step 3: Creating new test customer');
    const createCustomerUrl = 'https://cleancloudapp.com/api/addCustomer';
    const newCustomerData = {
      api_token: apiKey.trim(),
      customerName: 'Test Customer',
      customerTel: '1234567890',
      customerEmail: 'test@example.com'
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
