
import { createContext, useContext, useState } from 'react';
import { mockAPI } from '@/services/mockCleanCloudAPI';

export type Profile = {
  id: string;
  email: string;
  cleancloud_customer_id?: string;
  subscription_status: 'active' | 'cancelled' | 'pending';
  created_at: string;
  updated_at: string;
};

interface AuthContextType {
  profile: Profile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <AuthContext.Provider value={{ profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
