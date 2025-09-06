import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/database/customSupabaseClient';

export default function Success() {
  const [userEmail, setUserEmail] = useState('');
  const [credits, setCredits] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
        // Fetch updated credits
        const { data } = await supabase
          .from('users')
          .select('credits_remaining')
          .eq('email', user.email)
          .single();
        if (data) {
          setCredits(data.credits_remaining);
        }
      } else {
        // If not logged in, redirect to home
        navigate('/');
      }
    }
    checkUser();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-800 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-xl text-purple-200">Thank you for your purchase!</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <p className="text-lg mb-2">Your account has been updated</p>
          <p className="text-2xl font-bold">Credits: {credits}</p>
          <p className="text-sm text-purple-200 mt-2">Check {userEmail} for your receipt</p>
        </div>
        
        <a 
          href="/chat-input" 
          className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-8 rounded-lg transition-colors"
        >
          Start Getting Your Receipts →
        </a>
      </div>
    </div>
  );
}