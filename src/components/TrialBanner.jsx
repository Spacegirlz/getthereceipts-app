'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/database/customSupabaseClient';

export default function TrialBanner({ userId }) {
  const [trialStatus, setTrialStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkTrial() {
      if (!userId) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .rpc('get_user_credits', { user_uuid: userId });

        if (!error && data && data.length > 0) {
          setTrialStatus(data[0]);
        }
      } catch (error) {
        console.error('Error checking trial status:', error);
      }
      setLoading(false);
    }

    checkTrial();
  }, [userId]);

  if (loading || !trialStatus) return null;

  // Premium users - don't show banner
  if (trialStatus.subscription_status === 'premium' || 
      trialStatus.subscription_status === 'yearly' || 
      trialStatus.subscription_status === 'founder') {
    return null;
  }

  // Active trial
  if (trialStatus.is_trial_active) {
    const daysRemaining = Math.ceil(
      (new Date(trialStatus.trial_end) - new Date()) / (1000 * 60 * 60 * 24)
    );

    return (
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg">🎉</span>
          <span className="font-semibold">
            3-Day Premium Trial - {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left!
          </span>
        </div>
        <p className="text-sm opacity-90 mt-1">
          Only {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} of unlimited access remaining! 
          <button className="underline ml-1 font-semibold hover:opacity-80">
            Lock in $4.99/month
          </button>
        </p>
      </div>
    );
  }

  // Trial expired
  if (trialStatus.trial_used && !trialStatus.is_trial_active) {
    return (
      <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3 text-center">
        <div className="text-yellow-900">
          <span className="font-semibold">Your 3-day trial ended.</span>
          <span className="mx-2">•</span>
          <span>Upgrade to get back unlimited access for $4.99/month</span>
          <button className="ml-3 bg-yellow-600 text-white px-4 py-1 rounded-lg hover:bg-yellow-700 font-semibold">
            Upgrade Now
          </button>
        </div>
      </div>
    );
  }

  return null;
}
