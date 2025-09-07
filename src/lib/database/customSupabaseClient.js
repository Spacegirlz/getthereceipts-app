import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dpzalqyrmjuuhvcquyzc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwemFscXlybWp1dWh2Y3F1eXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NDgwMjMsImV4cCI6MjA3MTUyNDAyM30.hUwv38jR4O0cC7hEDFQP0zu94zeVyVukc0-eY4fsbX0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // Better for mobile
    // Additional mobile-friendly settings
    storage: window?.localStorage,
    storageKey: 'supabase.auth.token',
    debug: process.env.NODE_ENV === 'development'
  },
  // Add global configuration for better handling of concurrent requests
  global: {
    headers: {
      'X-Client-Info': 'getthereceipts-web@1.0.0',
    },
  },
  // Add retry configuration for high load scenarios
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});