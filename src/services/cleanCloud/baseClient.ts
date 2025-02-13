
import { supabase } from "@/integrations/supabase/client";

export class BaseCleanCloudClient {
  protected apiKey: string | null = null;
  public baseUrl = 'https://api.cleancloud.io';  // Changed from cleancloudapp.com to api.cleancloud.io

  public async getApiKey(): Promise<string> {
    if (this.apiKey) return this.apiKey;
    
    console.log('Fetching CleanCloud API key from Supabase function...');
    const { data, error } = await supabase.functions.invoke('get-cleancloud-key');
    
    if (error) {
      console.error('Failed to get CleanCloud API key:', error);
      throw new Error('Failed to get CleanCloud API key');
    }
    
    if (!data?.key) {
      console.error('No API key returned from function');
      throw new Error('No CleanCloud API key found');
    }

    console.log('Successfully retrieved API key');
    this.apiKey = data.key;
    return this.apiKey;
  }
}
