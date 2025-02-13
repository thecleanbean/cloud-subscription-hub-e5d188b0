
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json'
  };

  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const apiKey = Deno.env.get('CLEANCLOUD_API_KEY');
    if (!apiKey) {
      throw new Error('CleanCloud API key not configured');
    }

    // Parse the request body
    const requestData = await req.json();
    console.log('Received request:', {
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
    console.log('Making request to:', cleanCloudUrl);

    try {
      // Test the API key first
      const response = await fetch(cleanCloudUrl, {
        method: requestData.method || 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: requestData.body ? requestData.body : undefined,
      });

      // Get response body as text first
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      // Try to parse as JSON if possible
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        responseData = { message: responseText };
      }

      if (!response.ok) {
        throw new Error(`CleanCloud API responded with status ${response.status}: ${JSON.stringify(responseData)}`);
      }

      return new Response(
        JSON.stringify(responseData),
        { 
          status: response.status, 
          headers: corsHeaders
        }
      );

    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      throw new Error(`Failed to communicate with CleanCloud API: ${fetchError.message}`);
    }

  } catch (error) {
    console.error('Error in edge function:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.stack,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
