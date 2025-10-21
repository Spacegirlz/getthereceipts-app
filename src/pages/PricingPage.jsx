import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Check, Shield, Zap } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import HorizontalTicker from '../components/HorizontalTicker';
import { useAuth } from '../contexts/SupabaseAuthContext';
import { useAuthModal } from '../contexts/AuthModalContext';
import { useToast } from '../components/ui/use-toast';

const PricingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openModal } = useAuthModal();
  const { toast } = useToast();

  const handlePremiumPurchase = async () => {
    if (!user) {
      openModal('sign_up');
      toast({ 
        title: 'Create an account to upgrade!', 
        description: 'Sign up to unlock premium features and get receipts.'
      });
      return;
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: 'price_1SI49tG71EqeOEZe0p9LNpbP', // Premium Monthly $4.99
          userId: user.email,
          referralId: null
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        console.error('Stripe checkout error:', error);
        toast({
          title: 'Payment Error',
          description: 'There was an issue processing your payment. Please try again.'
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Payment Error',
        description: 'Unable to process payment. Please try again later.'
      });
    }
  };

  const handleFounderPurchase = async () => {
    if (!user) {
      openModal('sign_up');
      toast({ 
        title: 'Create an account to upgrade!', 
        description: 'Sign up to unlock premium features and get receipts.'
      });
      return;
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: 'price_1RzgBYG71EqeOEZer7ojcw0R', // OG Founders Club $29.99
          userId: user.email,
          referralId: null
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        console.error('Stripe checkout error:', error);
        toast({
          title: 'Payment Error',
          description: 'There was an issue processing your payment. Please try again.'
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Payment Error',
        description: 'Unable to process payment. Please try again later.'
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden text-white px-4 py-8">
      {/* Clean Black Background for Maximum Readability */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Subtle Depth - No Blur for Performance */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 via-transparent to-black/20" />
      
      {/* Minimal Accent - Just for Visual Interest */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(139,92,246,0.03),rgba(255,255,255,0))] pointer-events-none" />
      
      <div className="relative z-10">
      <Helmet>
        <title>Pricing - Get The Receipts</title>
        <meta name="description" content="Choose your truth level. From free daily receipts to unlimited chaos decoded." />
      </Helmet>

        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
              initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Simple pricing.{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-lime-400 bg-clip-text text-transparent">
            No surprises.
          </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 mb-6"
          >
            Receipts in 60 seconds. No shame. No storage. Just Sage's take.
          </motion.p>
          
          
          {/* Privacy First Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-400/30 rounded-full text-sm text-green-300 font-medium">
              <Shield className="h-4 w-4" />
              <span>Bank-level encryption</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-sm text-cyan-300 font-medium">
              <Check className="h-4 w-4" />
              <span>Privacy First</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-400/30 rounded-full text-sm text-purple-300 font-medium">
              <Zap className="h-4 w-4" />
              <span>Anonymous</span>
            </div>
          </motion.div>

          {/* Netflix-Style Clean Cards - All Same Size */}
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-12">
              {/* MOST POPULAR Badge for Premium Card */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 z-20">
                <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                  MOST POPULAR
                </div>
              </div>
              
              {/* BEST VALUE Badge for OG Founder Card */}
              <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-3 z-20">
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  BEST VALUE
                </div>
              </div>
              
              {/* Free Daily Receipt Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="meme-card p-8 rounded-2xl flex flex-col border-2 border-lime-400/60 bg-lime-500/5 shadow-lg shadow-lime-500/20" 
                style={{ minHeight: '420px' }}
              >
                <div className="flex-grow">
                    <div className="text-center mb-6">
                      <h3 className="font-semibold text-xl mb-3 text-lime-400">Start Free</h3>
                      <div className="text-3xl font-bold text-white mb-2">$0</div>
                      <p className="text-gray-400 text-sm mb-1">Join 5K+ Getting Clarity</p>
                      <p className="text-blue-400 text-xs">No Login Needed</p>
                    </div>
                    
                  <div className="space-y-4 text-sm text-gray-300 text-left">
                    <div className="flex items-start"><span className="text-lime-400 mr-2 mt-0.5">🧠</span><span>3 Truth Receipts to try</span></div>
                    <div className="flex items-start"><span className="text-lime-400 mr-2 mt-0.5">💬</span><span>3 Ask Sage Anything chats</span></div>
                    <div className="flex items-start"><span className="text-lime-400 mr-2 mt-0.5">👀</span><span>See why everyone's obsessed</span></div>
                    <div className="flex items-start"><span className="text-lime-400 mr-2 mt-0.5">🆓</span><span>No commitment required</span></div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-700">
                      <div className="flex items-center text-cyan-400 text-xs">
                        <span className="mr-2">→</span>
                        <span>Login to get daily FREE Receipts</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="pt-2 text-xs text-lime-400 font-medium mb-4">Perfect for: Curious but cautious</div>
                  <Button onClick={() => navigate('/chat-input')} variant="outline" className="border-lime-400 text-white hover:bg-lime-500/20 w-full">
                    Start Free →
                  </Button>
                </div>
              </motion.div>
              
              {/* Premium Monthly Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="meme-card p-8 rounded-2xl flex flex-col border-2 border-orange-500/60 bg-orange-500/5 shadow-lg shadow-orange-500/20" 
                style={{ minHeight: '420px' }}
              >
                <div className="flex-grow">
                  <div className="text-center mb-6">
                    <h3 className="font-semibold text-xl mb-3 text-orange-400">Premium Monthly</h3>
                    <div className="text-4xl font-black text-white mb-2">$4.99</div>
                    <p className="text-gray-400 text-sm">per month</p>
                  </div>
                  <div className="space-y-4 text-sm text-gray-300 text-left">
                    <div className="text-xs text-gray-400 mb-2">Everything in Free, plus:</div>
                    <div className="flex items-start"><span className="text-orange-400 mr-2 mt-0.5">🧠</span><span>UNLIMITED Truth Receipts</span></div>
                    <div className="flex items-start"><span className="text-orange-400 mr-2 mt-0.5">💬</span><span>UNLIMITED Ask Sage Anything</span></div>
                    <div className="flex items-start"><span className="text-orange-400 mr-2 mt-0.5">🛡️</span><span>Sage's Immunity Training (NEW!)</span></div>
                    <div className="flex items-start"><span className="text-orange-400 mr-2 mt-0.5">⚡</span><span>Vibe Check™ real-time analysis</span></div>
                    <div className="flex items-start"><span className="text-orange-400 mr-2 mt-0.5">🚀</span><span>Priority processing</span></div>
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="pt-2 text-xs text-orange-400 font-medium mb-4">Perfect for: Done with the drama</div>
                  <Button onClick={handlePremiumPurchase} className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white w-full font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-orange-500/25">
                    Go Premium
                  </Button>
                </div>
              </motion.div>
              
              {/* OG Founder's Club Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="p-8 rounded-2xl flex flex-col border-2 border-purple-400/60 bg-purple-500/5 shadow-lg shadow-purple-500/20" 
                style={{ minHeight: '420px' }}
              >
                
                <div className="flex-grow">
                  <div className="text-center mb-6">
                    <h3 className="font-bold text-2xl mb-3 text-purple-400">OG Founder's Club</h3>
                    <div className="text-4xl font-black text-white mb-1">$29.99 / year</div>
                    <p className="text-gray-400 text-sm">($2.49/month) <span className="text-green-400 font-semibold">40% OFF</span></p>
                  </div>
                  <div className="space-y-4 text-sm text-gray-300 text-left">
                    <div className="text-xs text-gray-400 mb-2">Everything in Premium, plus:</div>
                    <div className="flex items-start"><span className="text-purple-400 mr-2 mt-0.5">🔒</span><span>Price locked FOREVER</span></div>
                    <div className="flex items-start"><span className="text-purple-400 mr-2 mt-0.5">🛡️</span><span>Build emotional defense strategies</span></div>
                    <div className="flex items-start"><span className="text-purple-400 mr-2 mt-0.5">⚡</span><span>Priority support for 2am spiral texting</span></div>
                    <div className="flex items-start"><span className="text-purple-400 mr-2 mt-0.5">🏆</span><span>Beta features first</span></div>
                    <div className="flex items-start"><span className="text-purple-400 mr-2 mt-0.5">💬</span><span>Direct feedback channel</span></div>
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="pt-2 text-xs text-purple-400 font-medium mb-4">Perfect for: First 500 who get it</div>
                  <Button onClick={handleFounderPurchase} className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white w-full font-bold py-3 rounded-xl shadow-lg transition-all duration-300 hover:shadow-purple-500/25">
                    Lock In Founder's Price
                  </Button>
                </div>
              </motion.div>
            </div>
            
            {/* Subtitle under pricing table */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-lg text-gray-400 text-center mt-8"
            >
              Start free, upgrade when you're ready for unlimited clarity
            </motion.p>
          </div>
        </section>

        {/* Horizontal Ticker */}
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <HorizontalTicker />
          </div>
        </section>

        {/* How OG Founder Pricing Works */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                How OG Founder Pricing Works
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Let's be real: <span className="text-yellow-400 font-semibold">OG Founders and Early Birds get the best perks.</span>
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left Side - Explanation */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="space-y-6"
              >
                <div className="bg-gradient-to-br from-cyan-500/15 to-blue-500/10 border border-cyan-400/40 rounded-2xl p-6 backdrop-blur-sm shadow-lg shadow-cyan-500/10">
                  <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🔒</span>
                    Lifetime Locked Price Deal
                  </h3>
                  <p className="text-gray-300 mb-4">
                    When you lock in your Founder's price, you're not just getting a discount - you're getting a <span className="text-cyan-400 font-semibold">lifetime locked price deal that gets better as we grow.</span>
                  </p>
                  <p className="text-gray-300">
                    Lock in your <span className="text-cyan-400 font-bold text-lg">$29.99/year</span> before this one-time OG Launch Offer disappears forever.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-slate-500/15 to-gray-500/10 border border-slate-400/40 rounded-2xl p-6 backdrop-blur-sm shadow-lg shadow-slate-500/10">
                  <h3 className="text-xl font-bold text-slate-300 mb-4 flex items-center gap-2">
                    <span className="text-2xl">⏰</span>
                    The Cost of Confusion
                  </h3>
                  <p className="text-gray-300 mb-4">
                    That feeling of confusion is costing you more than just your peace of mind - <span className="text-slate-300 font-semibold">it's costing you time.</span>
                  </p>
                  <p className="text-gray-300">
                    Our OG Founder's Deal gives you unlimited access to Sage's wisdom for just <span className="text-cyan-400 font-bold text-lg">$2.49/month</span> (billed annually at $29.99).
                  </p>
                </div>

                <div className="bg-gradient-to-br from-cyan-500/15 to-blue-500/10 border border-cyan-400/40 rounded-2xl p-6 backdrop-blur-sm shadow-lg shadow-cyan-500/10">
                  <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🛡️</span>
                    Privacy First
                  </h3>
                  <p className="text-gray-300">
                    Never stored. Never used for training. <span className="text-cyan-400 font-semibold">Deleted instantly.</span>
                  </p>
                </div>
              </motion.div>

              {/* Right Side - CTA */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 border border-slate-600/50 rounded-3xl p-8 backdrop-blur-xl shadow-2xl shadow-slate-900/50">
                  <div className="mb-8">
                    <div className="text-6xl font-black text-white mb-2">$29.99</div>
                    <div className="text-xl text-gray-300 mb-2">per year</div>
                    <div className="text-sm text-cyan-400 font-semibold bg-cyan-500/10 px-3 py-1 rounded-full inline-block">
                      ($2.49/month) • 40% OFF
                    </div>
                  </div>

                  <div className="space-y-5 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-300 font-medium">Price locked FOREVER</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-300 font-medium">Unlimited receipts</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-300 font-medium">All premium features</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-300 font-medium">Founder badge</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleFounderPurchase}
                    className="w-full bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 hover:from-blue-500 hover:via-cyan-500 hover:to-teal-500 text-white font-bold py-4 text-lg rounded-xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="mr-2">🔒</span>
                    Lock In Founder's Price
                  </Button>
                  
                  <p className="text-xs text-gray-400 mt-4 text-center">
                    Secure your clarity - before it disappears.
                  </p>
                  
                  <div className="mt-6 pt-6 border-t border-slate-600/30">
                    <p className="text-sm text-gray-400 mb-4 text-center">Not ready to commit?</p>
                    <Button 
                      onClick={() => navigate('/chat-input')}
                      variant="outline"
                      className="border-slate-500/50 text-gray-300 hover:bg-slate-700/30 hover:border-slate-400/70 w-full transition-all duration-300"
                    >
                      Get your free daily receipt first
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Value Comparison */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="text-3xl md:text-4xl font-bold mb-8"
            >
              Let's Do The Math
            </motion.h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 }}
                className="bg-slate-800/40 border border-slate-500/30 rounded-2xl p-6 backdrop-blur-sm"
              >
                <h3 className="text-xl font-bold mb-4 text-slate-300">"What $4.99 gets you elsewhere:"</h3>
                <ul className="space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <span className="text-slate-400">❌</span>
                    <span>One overpriced cold latte you'll Instagram anyway</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-slate-400">❌</span>
                    <span>Fraction of a therapy session you'll cancel</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-slate-400">❌</span>
                    <span>3 minutes with a psychic who'll say "someone's thinking of you"</span>
                  </li>
                </ul>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6 }}
                className="bg-cyan-900/40 border border-cyan-500/30 rounded-2xl p-6 backdrop-blur-sm"
              >
                <h3 className="text-xl font-bold mb-4 text-cyan-400">"What $4.99 gets you here:"</h3>
                <ul className="space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-400">✅</span>
                    <span>Unlimited receipts from someone who gets it</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-400">✅</span>
                    <span>'OMG' Screenshots that'll vindicate you in the group chat</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-400">✅</span>
                    <span>Finally knowing if 'k' was shady or just lazy</span>
                  </li>
                </ul>
              </motion.div>
            </div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
              className="text-xl font-bold mt-8 text-cyan-400"
            >
              The math is mathing, bestie.
            </motion.p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl shadow-black/20"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Ready to stop guessing?<br />
                <span className="bg-gradient-to-r from-cyan-400 via-lime-400 to-pink-400 bg-clip-text text-transparent">
                  Start knowing. 💅
                </span>
              </h2>
              
              <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
                Join 5K+ early adopters getting the truth about their chats. 
                <span className="text-white font-semibold italic"> No more mixed signals.</span>
              </p>
              
              {/* Live Social Proof Counter */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-sm text-gray-300 mb-8 shadow-lg shadow-black/10"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                <span className="font-medium">1,247</span> people getting Sage's take right now
              </motion.div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <Button
                  onClick={handleFounderPurchase}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-2xl shadow-cyan-500/25 transition-all duration-300 hover:scale-105 min-h-[56px] min-w-[200px]"
                >
                  Lock In Founder's Price
                </Button>
                
                <Button
                  onClick={handlePremiumPurchase}
                  variant="outline"
                  className="border-cyan-400/60 text-white hover:bg-cyan-500/10 hover:border-cyan-400/80 font-medium px-6 py-4 rounded-xl transition-all duration-300 min-h-[56px] shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
                >
                  Go Unlimited Monthly
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-cyan-400" />
                  <span>Bank-level encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-cyan-400" />
                  <span>Results in 60 seconds</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-cyan-400" />
                  <span>Never stored or shared</span>
                </div>
              </div>
              
              {/* Tiny Badge - Clickable Link */}
              <div className="mt-6">
                <button
                  onClick={() => navigate('/chat-input')}
                  className="inline-flex items-center px-3 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded-full text-xs text-cyan-300 font-medium hover:bg-cyan-500/20 hover:border-cyan-400/50 hover:text-cyan-200 transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  Click Here to Start Free. Anonymous. No Login Required.
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Privacy Footer */}
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
              <p className="text-sm text-gray-400 mb-2">
                For 16+ Entertainment Purposes Only. Sage is an AI character with opinions, not facts. Her takes are for fun and perspective, not professional advice.
              </p>
              <p className="text-xs text-gray-500">
                By using this site, you agree to our <Link to="/terms-of-service" className="text-cyan-400 hover:text-cyan-300 underline">Terms</Link> & <Link to="/privacy-policy" className="text-cyan-400 hover:text-cyan-300 underline">Privacy Policy</Link>.
              </p>
            </div>
              </div>
        </section>

        {/* Simple Clean Footer */}
        <footer className="px-6 py-8 bg-black border-t border-white/10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Navigation Links */}
            <div className="flex flex-wrap justify-center gap-6 mb-4">
              <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About</Link>
              <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</Link>
              <Link to="/refer" className="text-gray-400 hover:text-white transition-colors text-sm">Earn & Refer</Link>
              <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</Link>
            </div>
            
            {/* Disclaimer */}
            <p className="text-gray-500 text-xs mb-2">For Entertainment Purposes Only</p>
            
            {/* Copyright */}
            <p className="text-gray-500 text-xs mb-2">© 2025 Get The Receipts. All rights reserved.</p>
            
            {/* Support */}
            <p className="text-gray-500 text-xs">
              Support: <a href="mailto:support@getthereceipts.com" className="text-gray-400 hover:text-white transition-colors">support@gettherecipts.com</a>
            </p>
          </div>
        </footer>
        </div>
    </div>
  );
};

export default PricingPage;