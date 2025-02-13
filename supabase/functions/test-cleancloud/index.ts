
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

    // Test endpoint: search customers with a test email
    const url = new URL('https://cleancloudapp.com/api/getCustomer');
    const body = {
      api_token: apiKey.trim(),
      customerID: '1' // Using ID 1 as a test
    };

    console.log('Making test request to:', url.toString());
    console.log('With body:', { ...body, api_token: '***' });

    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const responseText = await response.text();
    console.log('Raw response:', responseText);

    return new Response(
      JSON.stringify({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers.entries()]),
        body: responseText
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
