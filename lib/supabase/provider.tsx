'use client';

import { useState, type ReactNode } from 'react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { 

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [supabaseClient] = useState(() =>
    
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  );
};