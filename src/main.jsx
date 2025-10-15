import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import { AuthModalProvider } from '@/contexts/AuthModalContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Toaster } from '@/components/ui/toaster';
import { BrowserRouter } from 'react-router-dom';

// Suppress external service errors in development
if (import.meta.env.DEV) {
  const originalError = console.error;
  console.error = (...args) => {
    const message = args[0]?.toString() || '';
    // Suppress known external service errors
    if (
      message.includes('r.stripe.com') ||
      message.includes('chrome-extension://') ||
      message.includes('grm ERROR') ||
      message.includes('PostHog')
    ) {
      return; // Don't log these errors
    }
    originalError.apply(console, args);
  };
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY, {
  // Disable fraud detection in development to reduce errors
  fraudDetection: import.meta.env.DEV ? false : true,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthModalProvider>
      <AuthProvider>
        <Elements stripe={stripePromise}>
          <App />
        </Elements>
        <Toaster />
      </AuthProvider>
    </AuthModalProvider>
  </BrowserRouter>
);