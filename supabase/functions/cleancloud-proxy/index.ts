
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// This function handles the API proxy requests
serve(async (req) => {
  try {
    const apiKey = Deno.env.get('CLEANCLOUD_API_KEY');
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'CleanCloud API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Content-Type': 'application/json'
    };

    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Parse the request body
    const { path, method, body } = await req.json();

    // Construct the CleanCloud API URL
    const cleanCloudUrl = `https://api.cleancloud.io/v1${path}`;
    console.log('Proxying request to:', cleanCloudUrl);

    // Forward the request to CleanCloud
    const response = await fetch(cleanCloudUrl, {
      method: method,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: body ? body : undefined,
    });

    const data = await response.json();
    
    return new Response(
      JSON.stringify(data),
      { 
        status: response.status, 
        headers: corsHeaders
      }
    );

  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    );
  }
});
