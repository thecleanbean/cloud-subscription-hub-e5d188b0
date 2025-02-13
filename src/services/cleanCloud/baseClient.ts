
import { supabase } from "@/integrations/supabase/client";

export class BaseCleanCloudClient {
  protected apiKey: string | null = null;
  
  protected async makeRequest(path: string, options: RequestInit = {}) {
    // Ensure path starts with forward slash
    const apiPath = path.startsWith('/') ? path : `/${path}`;
    
    console.log(`Making request to CleanCloud:`, {
      path: apiPath,
      method: options.method || 'GET'
    });
    
    const response = await supabase.functions.invoke('cleancloud-proxy', {
      body: {
        path: apiPath,
        method: options.method || 'GET',
        body: options.body ? JSON.parse(options.body) : undefined
      }
    });
    
    if (response.error) {
      console.error('CleanCloud API Error:', response.error);
      throw new Error(`CleanCloud API Error: ${response.error.message}`);
    }
    
    return response.data;
  }
}
