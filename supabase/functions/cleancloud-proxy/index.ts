
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// This function handles the API proxy requests
serve(async (req) => {
  try {
    const url = new URL(req.url);
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

    const path = url.pathname.replace('/functions/cleancloud-proxy', '');
    const cleanCloudUrl = `https://api.cleancloud.io${path}${url.search}`;

    // Forward the request to CleanCloud
    const response = await fetch(cleanCloudUrl, {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' ? await req.text() : undefined,
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
