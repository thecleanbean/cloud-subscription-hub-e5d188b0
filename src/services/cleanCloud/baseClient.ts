
import { supabase } from "@/integrations/supabase/client";

export class BaseCleanCloudClient {
  protected apiKey: string | null = null;
  protected async makeRequest(path: string, options: RequestInit = {}) {
    console.log(`Making request to ${path}`);
    
    const response = await supabase.functions.invoke('cleancloud-proxy', {
      body: {
        path,
        ...options
      }
    });
    
    if (response.error) {
      console.error('CleanCloud API Error:', response.error);
      throw new Error(response.error.message);
    }
    
    return response.data;
  }
}
