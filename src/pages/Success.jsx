import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/database/customSupabaseClient';

export default function Success() {
  const [userEmail, setUserEmail] = useState('');
  const [credits, setCredits] = useState(0);
  const [subscriptionStatus, setSubscriptionStatus] = useState('free');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserEmail(user.email);
          
          // Wait a moment for webhook to process
          setTimeout(async () => {
            // Fetch updated user data
            const { data } = await supabase
              .from('users')
              .select('credits_remaining, subscription_status')
              .eq('email', user.email)
              .single();
            if (data) {
              setCredits(data.credits_remaining);
              setSubscriptionStatus(data.subscription_status || 'free');
              
              // Track conversion with Rewardful (official documentation approach)
              if (window.rewardful && user.email) {
                try {
                  window.rewardful('convert', { email: user.email });
                  console.log('Rewardful conversion tracked for:', user.email);
                } catch (error) {
                  console.warn('Rewardful conversion tracking failed:', error);
                }
              }
            }
            setLoading(false);
          }, 2000); // Give webhook 2 seconds to process
        } else {
          // If not logged in, redirect to home
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    }
    checkUser();
  }, [navigate, searchParams]);

  const getStatusMessage = () => {
    if (subscriptionStatus === 'premium') {
      return {
        title: "Welcome to Premium! 🚀",
        subtitle: "You now have unlimited Truth Receipts",
        emoji: "⚡",
        credits: "UNLIMITED"
      };
    } else if (subscriptionStatus === 'yearly') {
      return {
        title: "OG Founder Status Unlocked! 👑", 
        subtitle: "Price locked forever + unlimited receipts",
        emoji: "🏆", 
        credits: "UNLIMITED"
      };
    } else if (credits > 1) {
      return {
        title: "Emergency Pack Ready! 🚨",
        subtitle: "5 receipts added to your account", 
        emoji: "📦",
        credits: credits.toString()
      };
    } else {
      return {
        title: "Payment Successful! 🎉",
        subtitle: "Your purchase is being processed",
        emoji: "⏳",
        credits: credits.toString()
      };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-800 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">{statusInfo.emoji}</div>
          <h1 className="text-4xl font-bold mb-4">{statusInfo.title}</h1>
          <p className="text-xl text-purple-200">{statusInfo.subtitle}</p>
        </div>
        
        {loading ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">Processing your purchase...</p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
            <p className="text-lg mb-2">Your account has been updated</p>
            <p className="text-2xl font-bold">
              {statusInfo.credits === "UNLIMITED" ? (
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  ♾️ UNLIMITED CREDITS
                </span>
              ) : (
                `Credits: ${statusInfo.credits}`
              )}
            </p>
            {subscriptionStatus === 'yearly' && (
              <p className="text-sm text-yellow-300 mt-2 font-semibold">
                🔒 Founder price locked forever
              </p>
            )}
            <p className="text-sm text-purple-200 mt-2">Check {userEmail} for your receipt</p>
          </div>
        )}
        
        <a 
          href="/new-receipt" 
          className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-lg transition-colors shadow-lg"
        >
          Start Getting Your Receipts →
        </a>
        
        {subscriptionStatus !== 'free' && (
          <div className="mt-6 text-sm text-purple-200">
            <p>Need help? Email us at support@getthereceipts.com</p>
          </div>
        )}
      </div>
    </div>
  );
}