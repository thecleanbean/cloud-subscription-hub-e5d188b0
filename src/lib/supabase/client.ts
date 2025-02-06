
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  cleancloud_customer_id?: string;
  subscription_status: 'active' | 'cancelled' | 'pending';
  created_at: string;
  updated_at: string;
};
