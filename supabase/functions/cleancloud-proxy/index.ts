
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

    // Extract the email from query params for customer search
    const email = url.searchParams.get('email');
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email parameter is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Call CleanCloud API
    const cleanCloudResponse = await fetch(
      `https://cleancloudapp.com/api/v1/customers/search?email=${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await cleanCloudResponse.json();
    
    return new Response(
      JSON.stringify(data),
      { 
        status: cleanCloudResponse.status, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        } 
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
