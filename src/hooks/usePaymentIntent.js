import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export const usePaymentIntent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const navigateToPricing = (specificPriceId = null, tierName = 'General Pricing') => {
    // Store payment intent for non-logged-in users
    if (!user) {
      localStorage.setItem('pendingCheckout', JSON.stringify({
        priceId: specificPriceId,
        tierName: tierName,
        timestamp: Date.now()
      }));
    }
    navigate('/pricing');
  };

  const navigateToSpecificCheckout = (priceId, tierName) => {
    // Store specific payment intent for non-logged-in users
    if (!user) {
      localStorage.setItem('pendingCheckout', JSON.stringify({
        priceId: priceId,
        tierName: tierName,
        timestamp: Date.now()
      }));
    }
    navigate('/pricing');
  };

  return {
    navigateToPricing,
    navigateToSpecificCheckout
  };
};
