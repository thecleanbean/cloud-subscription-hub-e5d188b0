
import { supabase } from "@/integrations/supabase/client";

export class BaseCleanCloudClient {
  protected apiKey: string | null = null;
  
  protected async makeRequest(path: string, options: RequestInit = {}) {
    // Ensure path is properly formatted
    const apiPath = path.startsWith('/v1') ? path : `/v1${path.startsWith('/') ? path : `/${path}`}`;
    
    console.log(`Making request to CleanCloud:`, {
      path: apiPath,
      method: options.method || 'GET'
    });
    
    const response = await supabase.functions.invoke('cleancloud-proxy', {
      body: {
        path: apiPath,
        method: options.method || 'GET',
        body: options.body
      }
    });
    
    if (response.error) {
      console.error('CleanCloud API Error:', response.error);
      throw new Error(`CleanCloud API Error: ${response.error.message}`);
    }
    
    return response.data;
  }
}
