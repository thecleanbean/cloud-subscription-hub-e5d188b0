
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
    const requestData = await req.json();
    console.log('Received request data:', {
      path: requestData.path,
      method: requestData.method,
    });

    if (!requestData.path) {
      throw new Error('Path is required');
    }

    // Ensure path starts with /v1
    const apiPath = requestData.path.startsWith('/v1') ? 
      requestData.path : 
      `/v1${requestData.path.startsWith('/') ? requestData.path : `/${requestData.path}`}`;

    // Construct the CleanCloud API URL
    const cleanCloudUrl = `https://api.cleancloud.io${apiPath}`;
    console.log('Proxying request to:', cleanCloudUrl);

    // Forward the request to CleanCloud
    const response = await fetch(cleanCloudUrl, {
      method: requestData.method || 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: requestData.body ? requestData.body : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('CleanCloud API error:', {
        status: response.status,
        statusText: response.statusText,
        data: errorData
      });
      throw new Error(`CleanCloud API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('CleanCloud API response:', { status: response.status });
    
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
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
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
