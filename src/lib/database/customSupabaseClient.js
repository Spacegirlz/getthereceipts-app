import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dpzalqyrmjuuhvcquyzc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwemFscXlybWp1dWh2Y3F1eXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NDgwMjMsImV4cCI6MjA3MTUyNDAyM30.hUwv38jR4O0cC7hEDFQP0zu94zeVyVukc0-eY4fsbX0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // Better for mobile
    // Performance optimizations
    storage: window?.localStorage,
    storageKey: 'supabase.auth.token',
    debug: process.env.NODE_ENV === 'development',
    // Add timeout and retry configuration
    storageOptions: {
      secure: window?.location?.protocol === 'https:',
    },
    // Reduce auth state change frequency
    refreshTokenRetryAttempts: 3,
    refreshTokenRetryInterval: 2000,
  },
  // Add global configuration for better handling of concurrent requests
  global: {
    headers: {
      'X-Client-Info': 'getthereceipts-web@1.0.0',
    },
    // Add timeout for all requests
    fetch: (url, options = {}) => {
      return fetch(url, {
        ...options,
        // 10 second timeout for all requests
        signal: AbortSignal.timeout(10000),
      });
    },
  },
  // Add retry configuration for high load scenarios
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 5, // Reduced from 10 to improve performance
    },
  },
});

// Add utility function for retry logic
export const withRetry = async (fn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      console.log(`Attempt ${i + 1} failed:`, error.message);
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
};

// Add utility function for timeout
export const withTimeout = (promise, timeoutMs = 10000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
    )
  ]);
};