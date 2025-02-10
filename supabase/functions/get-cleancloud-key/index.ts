
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const key = Deno.env.get('CLEANCLOUD_API_KEY')
    if (!key) {
      throw new Error('CleanCloud API key not found')
    }

    return new Response(
      JSON.stringify({ key }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders,
        } 
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders,
        }
      },
    )
  }
})
