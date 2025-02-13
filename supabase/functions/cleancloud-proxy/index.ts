
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

    // Parse the request body
    const requestData = await req.json();
    console.log('Received request:', {
      path: requestData.path,
      method: requestData.method,
      body: requestData.method !== 'GET' ? JSON.stringify(requestData.body).replace(/(email|password)":"[^"]+/g, '$1":"***') : undefined
    });

    if (!requestData.path) {
      throw new Error('Path is required');
    }

    // Construct the CleanCloud API URL
    const cleanCloudUrl = new URL(`https://cleancloudapp.com/api/${requestData.path.replace(/^\/+/, '')}`);
    
    console.log('Making request to:', cleanCloudUrl.toString());

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const requestInit: RequestInit = {
        method: requestData.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        signal: controller.signal
      };

      // For all requests, include api_token in the body for CleanCloud
      const body = typeof requestData.body === 'object' ? requestData.body : {};
      requestInit.body = JSON.stringify({
        ...body,
        api_token: apiKey.trim()
      });

      console.log('Request configuration:', {
        method: requestInit.method,
        headers: requestInit.headers,
        body: JSON.stringify(body).replace(/(email|password)":"[^"]+/g, '$1":"***')
      });

      const response = await fetch(cleanCloudUrl.toString(), requestInit);
      clearTimeout(timeoutId);

      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        responseData = { message: responseText };
      }

      if (!response.ok || responseData.error) {
        console.error('CleanCloud API error:', {
          status: response.status,
          statusText: response.statusText,
          data: responseData
        });
        throw new Error(`CleanCloud API Error: ${responseData.error || responseData.message || 'Unknown error'}`);
      }

      return new Response(
        JSON.stringify(responseData),
        { 
          status: 200,
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
      throw fetchError;
    }

  } catch (error) {
    console.error('Error in edge function:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message,
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
