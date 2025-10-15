import { useState, useEffect } from 'react';
import { supabase } from '@/lib/database/customSupabaseClient';

export function useTrialStatus(userId) {
  const [status, setStatus] = useState({
    isTrialActive: false,
    daysRemaining: 0,
    trialEnd: null,
    isPremium: false,
    loading: true
  });

  useEffect(() => {
    async function fetchTrialStatus() {
      if (!userId) {
        setStatus(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        const { data, error } = await supabase
          .rpc('get_user_credits', { user_uuid: userId });

        if (error || !data || data.length === 0) {
          setStatus(prev => ({ ...prev, loading: false }));
          return;
        }

        const credits = data[0];
        const trialEnd = credits.trial_end ? new Date(credits.trial_end) : null;
        const daysRemaining = trialEnd 
          ? Math.max(0, Math.ceil((trialEnd - new Date()) / (1000 * 60 * 60 * 24)))
          : 0;

        setStatus({
          isTrialActive: credits.is_trial_active || false,
          daysRemaining,
          trialEnd: credits.trial_end,
          isPremium: ['premium', 'yearly', 'founder'].includes(credits.subscription_status),
          loading: false
        });
      } catch (error) {
        console.error('Error fetching trial status:', error);
        setStatus(prev => ({ ...prev, loading: false }));
      }
    }

    fetchTrialStatus();
  }, [userId]);

  return status;
}
