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

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

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