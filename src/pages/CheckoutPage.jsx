import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ plan, amount, description }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: plan,
          amount: amount,
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm payment
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        setError(error.message);
      } else {
        // Payment succeeded
        navigate('/success');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-4 rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay $${amount}`}
      </button>
    </form>
  );
};

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan');
  const navigate = useNavigate();

  const planDetails = {
    'premium-monthly': {
      name: 'Premium Monthly',
      amount: 499, // $4.99 in cents
      description: 'Premium Monthly Subscription'
    },
    'founder-yearly': {
      name: 'OG Founder\'s Club',
      amount: 2999, // $29.99 in cents
      description: 'OG Founder\'s Club - Yearly'
    }
  };

  const currentPlan = planDetails[plan];

  useEffect(() => {
    if (!currentPlan) {
      navigate('/pricing');
    }
  }, [currentPlan, navigate]);

  if (!currentPlan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Complete Your Purchase
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {currentPlan.name} - ${(currentPlan.amount / 100).toFixed(2)}
          </p>
        </div>
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Elements stripe={stripePromise}>
            <CheckoutForm 
              plan={plan}
              amount={currentPlan.amount / 100}
              description={currentPlan.description}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
