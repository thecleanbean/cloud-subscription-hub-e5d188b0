
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

    console.log('API Key exists and is set'); // Verify API key exists

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

    // Ensure path starts with /v1
    const apiPath = requestData.path.startsWith('/v1') ? 
      requestData.path : 
      `/v1${requestData.path.startsWith('/') ? requestData.path : `/${requestData.path}`}`;

    // Construct the CleanCloud API URL with encoded parameters
    const cleanCloudUrl = new URL(`https://api.cleancloud.io${apiPath}`);
    console.log('Making request to:', cleanCloudUrl.toString());

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      // Log API key length (don't log the actual key)
      console.log('API Key length:', apiKey.length);
      console.log('First 4 chars of API key:', apiKey.substring(0, 4) + '...');

      const requestInit: RequestInit = {
        method: requestData.method || 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`, // Ensure no whitespace in API key
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: controller.signal,
        // Add proper error handling for network issues
        mode: 'cors',
        credentials: 'omit'
      };

      // Only add body for non-GET requests
      if (requestData.method !== 'GET' && requestData.body) {
        requestInit.body = JSON.stringify(requestData.body);
      }

      console.log('Request configuration:', {
        method: requestInit.method,
        headers: Object.fromEntries(Object.entries(requestInit.headers || {}).map(([k, v]) => [k, k === 'Authorization' ? '***' : v])),
        url: cleanCloudUrl.toString()
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
      
      // Improved error logging
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
