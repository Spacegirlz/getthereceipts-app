import React, { createContext, useContext, useState } from 'react';
import { supabase } from '@/lib/database/customSupabaseClient.js';

const SupabaseContext = createContext(null);

export const useSupabase = () => {
  return useContext(SupabaseContext);
};

export const SupabaseProvider = ({ children }) => {
  const [isSupabaseConnected] = useState(true);

  const value = {
    supabase,
    isSupabaseConnected,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};