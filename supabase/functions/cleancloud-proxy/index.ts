
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
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const apiKey = Deno.env.get('CLEANCLOUD_API_KEY');
    if (!apiKey) {
      throw new Error('CleanCloud API key not configured');
    }

    console.log('API Key exists and is set');

    // Parse the request body
    const requestData = await req.json();
    console.log('Received request:', {
      path: requestData.path,
      method: requestData.method,
      body: requestData.method !== 'GET' ? '***' : undefined
    });

    if (!requestData.path) {
      throw new Error('Path is required');
    }

    // Remove /v1 prefix if it exists and construct the correct path
    const cleanPath = requestData.path.replace(/^\/v1/, '');
    
    // Construct the CleanCloud API URL
    const cleanCloudUrl = new URL(`https://cleancloudapp.com/api${cleanPath}`);
    
    // Add api_token as a query parameter for GET requests
    if (requestData.method === 'GET') {
      cleanCloudUrl.searchParams.append('api_token', apiKey.trim());
    }
    
    console.log('Making request to:', cleanCloudUrl.toString().replace(apiKey, '***'));

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const requestInit: RequestInit = {
        method: requestData.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        signal: controller.signal
      };

      // For POST requests, include api_token in the body
      if (requestData.method !== 'GET') {
        const body = typeof requestData.body === 'object' ? requestData.body : {};
        requestInit.body = JSON.stringify({
          ...body,
          api_token: apiKey.trim()
        });
      }

      console.log('Request configuration:', {
        method: requestInit.method,
        url: cleanCloudUrl.toString().replace(apiKey, '***'),
        headers: requestInit.headers
      });

      const response = await fetch(cleanCloudUrl.toString(), requestInit);
      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);
      console.log('Response headers:', Object.fromEntries([...response.headers.entries()]));

      // Get response body as text first
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      // Try to parse as JSON if possible
      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('Parsed response data:', responseData);
      } catch (e) {
        console.log('Failed to parse response as JSON, using text');
        responseData = { message: responseText };
      }

      if (!response.ok) {
        console.error('CleanCloud API error:', {
          status: response.status,
          statusText: response.statusText,
          data: responseData
        });
        throw new Error(`CleanCloud API responded with status ${response.status}: ${JSON.stringify(responseData)}`);
      }

      return new Response(
        JSON.stringify(responseData),
        { 
          status: response.status, 
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );

    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timed out after 30 seconds');
      }
      
      console.error('Fetch error details:', {
        name: fetchError.name,
        message: fetchError.message,
        cause: fetchError.cause,
        stack: fetchError.stack
      });
      
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
