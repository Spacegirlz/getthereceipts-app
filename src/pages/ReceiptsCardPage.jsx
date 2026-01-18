import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ReceiptCardViral from '@/components/ReceiptCardViral';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { SocialReceiptCard, SocialPlaybookCard, SocialImmunityCard } from '@/components/exports/SocialCards';
import { useSocialExport } from '@/hooks/useSocialExport';
import { ShareInstructionsModal } from '@/components/ShareInstructionsModal';
import DetailedResults from '@/components/DetailedResults';
import DeepDive from '@/components/DeepDive';
import ImmunityTraining from '@/components/ImmunityTraining';
// import TabbedReceiptInterface from '@/components/TabbedReceiptInterface'; // TODO: Create this component
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/database/customSupabaseClient';
import { Loader2, ArrowLeft, Share2, Shield, Brain, Sparkles, Crown, Gift } from 'lucide-react';
import LinkButton from '@/components/LinkButton';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { saveReceiptToDatabase, canUserSaveReceipts } from '@/lib/services/receiptService';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { useStripe } from '@stripe/react-stripe-js';
import { getUserCredits } from '@/lib/services/creditsSystem';
import TabbedReceiptInterface from '@/components/TabbedReceiptInterface';
import ErrorBoundary from '@/components/ErrorBoundary';
import { injectMovingGradientStyles } from '@/utils/gradientUtils';
// Age verification imports removed
// Sage mood images based on red flags
import greenFlag from '@/assets/green-flag.png'; // 0-3 red flags  -  Happy Sage
import orangeFlag from '@/assets/orange-flag.png'; // 4-6 red flags  -  Suspicious Sage  
import redFlag from '@/assets/red-flag.png'; // 7-10 red flags  -  Savage Sage



const ReceiptsCardPage = () => {
  const { captureById, showInstructions, setShowInstructions, instructionsPlatform, resetInstructions } = useSocialExport();
  // Inject moving gradient styles
  React.useEffect(() => {
    injectMovingGradientStyles();
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  // Function to get Sage's mood image based on red flags
  const getSageImage = (redFlagCount) => {
    const flags = parseInt(redFlagCount) || 5;
    if (flags <= 3) return greenFlag;   // 0-3 red flags  -  Happy Sage with Green Flags
    if (flags <= 6) return orangeFlag;  // 4-6 red flags  -  Suspicious Sage with Orange Flags  
    return redFlag;                     // 7-10 red flags  -  Savage Sage with Red Flags
  };


  const { id: receiptId } = useParams();
  const { toast } = useToast();
  const { user, isPremium } = useAuth();
  const { openModal } = useAuthModal();
  // Age verification variables removed
  const stripe = useStripe();

  const [receiptData, setReceiptData] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [isSharing, setIsSharing] = useState(false);
  const [userCredits, setUserCredits] = useState({ credits: 0, subscription: 'free' });
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const hasRedirectedRef = useRef(false);
  // isPremium now comes from auth context

  // Better element detection using computed styles
  const fixGradientElements = (element) => {
    const allElements = element.querySelectorAll('*');
    const originalElements = [];
    
    allElements.forEach(el => {
      const computedStyle = window.getComputedStyle(el);
      if (computedStyle.webkitBackgroundClip === 'text' || 
          computedStyle.backgroundClip === 'text' ||
          computedStyle.webkitTextFillColor === 'transparent') {
        
        const originalHTML = el.outerHTML;
        originalElements.push({ element: el, originalHTML });
        
        // Create replacement with solid gold color
        const replacement = el.cloneNode(true);
        replacement.style.background = 'none';
        replacement.style.webkitBackgroundClip = 'initial';
        replacement.style.backgroundClip = 'initial';
        replacement.style.webkitTextFillColor = '#D4AF37';
        replacement.style.color = '#D4AF37';
        
        el.parentNode.replaceChild(replacement, el);
      }
    });
    
    return originalElements;
  };
  
  const restoreOriginalElements = (originalElements) => {
    originalElements.forEach(({ element, originalHTML }) => {
      const parent = element.parentNode || element.parentElement;
      if (parent) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = originalHTML;
        const restoredElement = tempDiv.firstChild;
        parent.replaceChild(restoredElement, element);
      }
    });
  };

  const handleSaveReceipt = async () => {
    setIsSharing(true);
    try {
      // Use the new social export system for Truth Receipt  -  direct download only
      await captureById('social-receipt-card', "Sage-Receipt", false);
    } catch (error) {
      console.error('❌ Save failed:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleFounderCheckout = async () => {
    if (!user) {
      // Store the intended destination for after authentication
      localStorage.setItem('postAuthRedirect', '/pricing');
      openModal('sign_up');
      toast({ title: 'Create an account to upgrade!', description: 'Sign up to unlock premium features and get receipts.'})
      return;
    }

    const priceId = 'price_1RzgBYG71EqeOEZer7ojcw0R'; // Founder's Circle price ID
    
    if (!stripe) {
        toast({
            variant: "destructive",
            title: "Stripe Error",
            description: "Stripe is not configured correctly. Please check the console.",
        });
        console.error("Stripe.js has not loaded.");
        return;
    }

    setLoadingCheckout(true);

    try {
        const { error } = await stripe.redirectToCheckout({
            lineItems: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            successUrl: `${window.location.origin}/success`,
            cancelUrl: `${window.location.origin}/pricing`,
            customerEmail: user.email, 
        });

        if (error) {
            console.error("Stripe redirect error:", error);
            toast({
                variant: "destructive",
                title: "Payment Error",
                description: error.message || "Could not redirect to checkout.",
            });
            setLoadingCheckout(false);
        }
    } catch (error) {
        console.error("Stripe catch error:", error);
        toast({
            variant: "destructive",
            title: "Payment Error",
            description: "Redirecting to pricing page...",
        });
        setLoadingCheckout(false);
        // Redirect to pricing page on error
        setTimeout(() => navigate('/pricing'), 1500);
    }
  };

  // Function to save receipt to database if user has saving enabled
  const saveReceiptIfEnabled = async (receiptData, message = '') => {
    if (!user || !receiptData) return;
    
    try {
      const result = await saveReceiptToDatabase(
        user.id,
        message || receiptData.originalMessage || receiptData.message || 'Receipt generated',
        receiptData.analysis || receiptData,
        'truth',
        0 // tokens used  -  could be calculated if needed
      );
      
      if (result.success) {
        console.log('Receipt saved successfully:', result.data);
      } else if (result.error !== 'User has receipt saving disabled' && result.error !== 'Receipt saving is a premium feature') {
        // Only show error if it's not expected (user settings)
        console.warn('Could not save receipt:', result.error);
      }
    } catch (error) {
      console.error('Error saving receipt:', error);
    }
  };

  // Fetch user credits
  useEffect(() => {
    const fetchCredits = async () => {
      if (user?.id) {
        const credits = await getUserCredits(user.id);
        setUserCredits(credits);
      }
    };
    
    fetchCredits();
  }, [user]);

  useEffect(() => {
    // Handle redirections and data fetching in a single effect
    const handleDataFetching = async () => {
      // If we already have state data, use it
      if (location.state) {
        setReceiptData(location.state);
        setLoading(false);
        
        // Save receipt if user has saving enabled  -  DISABLED FOR LAUNCH
        // await saveReceiptIfEnabled(location.state, location.state?.originalMessage);
        
        // Age verification removed  -  handled at input level
        
        return;
      }

      // LOCAL DEVELOPMENT TEST RECEIPT
      if (receiptId === 'test-immunity' && typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        const testReceiptData = {
          analysis: {
            archetype: "The Coward King 👑",
            verdict: "He's treating you like a backup plan while he plays king of the maybe pile",
            realTea: "Bestie, he's got commitment issues bigger than his ego",
            yourMove: ["Block his number", "Date someone with actual intentions"],
            prophecy: "You'll waste 6 more months if you stay",
            wastingTime: 85,
            actuallyIntoYou: 25,
            redFlags: 8,
            confidenceScore: 92,
            confidenceRemark: "TOXIC AF",
            deepDive: {
              patternExpose: "This is a classic avoidant attachment pattern. He's using you as an emotional security blanket while keeping his options open. The hot-and-cold behavior isn't confusion  -  it's calculated emotional manipulation.",
              theirGame: "He's running the 'breadcrumb special'  -  just enough attention to keep you hooked, never enough to actually commit. This man has perfected the art of having his cake and eating it too.",
              whyYoureStuck: "You're stuck because you're hoping potential will become reality. News flash: it won't. You're trauma-bonded to the intermittent reinforcement he's giving you.",
              yourPattern: "You keep accepting crumbs because you're afraid of being alone. But honey, you're already alone  -  he's just making you feel crazy about it.",
              finalRead: "This man will never choose you fully because he doesn't have to. You're giving him relationship benefits without the relationship commitment. Time to stop auditioning for a role that was never going to be yours."
            },
            immunityTraining: {
              redFlagDrills: "Watch for 'I'm not ready for anything serious' while still wanting relationship benefits. Listen for 'I don't want to put a label on it' after months of dating. Notice when they introduce you as 'friend' to important people.",
              patternBreakers: "Set a 90-day relationship timeline. If they can't commit by then, walk away. Stop responding to late-night texts immediately. Refuse to be their emotional support without the title.",
              immunityShield: "Remember: You are not a trial run or a maybe. Someone who truly wants you will claim you proudly and quickly. Stop accepting crumbs and demand the whole damn meal.",
              earlyWarnings: "First date red flags: They avoid talking about relationship goals. They're recently out of a long relationship but 'not looking for anything serious.' They mention being 'bad at relationships' repeatedly.",
              exitStrategy: "Consider limiting contact if patterns persist. Focus on your own growth for 30 days before dating again. Trust that someone better is coming.",
              riskLevel: "high",
              whatGoodLooksLike: [
                "Specific plans locked 24-48h ahead-then kept",
                "Repairs without jokes, blame, or rewrites", 
                "Public and private affection match"
              ],
              menuOfMoves: [
                { effort: "small", option: "Mute late-night threads for 7 days" },
                { effort: "medium", option: "Ask for plans on calendar by Wednesday" },
                { effort: "high", option: "48-hour pause; journal how your body feels post-contact" }
              ],
              twoWeekExperiment: {
                goal: "consistency",
                metrics: ["kept plans", "proactive check-ins", "joke-free repairs"],
                reviewDate: "in 14 days"
              },
              selfCheck: [
                "Do I feel calmer after contact?",
                "Is there a plan, not a promise?", 
                "Am I shrinking to keep peace?"
              ],
              safetyNote: "Only you decide next steps. If you feel unsafe, limit contact and reach out to trusted support."
            }
          },
          originalMessage: "He says he likes me but only texts me late at night and cancels plans last minute...",
          quizAnswers: {}
        };
        
        setReceiptData(testReceiptData);
        setLoading(false);
        
        // Receipt saving disabled
        // await saveReceiptIfEnabled(testReceiptData, testReceiptData.originalMessage);
        
        // Age verification removed  -  handled at input level
        
        return;
      }

      // Fetch from database if we have a receiptId
      if (receiptId) {
        setLoading(true);
        const { data, error } = await supabase
          .from('receipts')
          .select('*')
          .eq('id', receiptId)
          .single();

        if (error || !data) {
          if (!hasRedirectedRef.current) {
            hasRedirectedRef.current = true;
            toast({ title: "Error", description: "Could not find the specified receipt.", variant: "destructive" });
            navigate('/dashboard');
          }
        } else {
          // ✅ FIX: Ensure conversation field is available in analysis for Sage chatbot
          const analysisWithConversation = {
            ...data.analysis_result,
            // If conversation doesn't exist in analysis_result, use the message field as fallback
            conversation: data.analysis_result?.conversation || data.message || data.original_message || ''
          };
          setReceiptData({ 
            ...data, 
            analysis: analysisWithConversation, 
            originalMessage: data.original_message || data.message, 
            quizAnswers: data.quiz_answers 
          });
        }
        setLoading(false);
      } else {
        // No receiptId and no location.state  -  redirect to home
        if (!hasRedirectedRef.current) {
          hasRedirectedRef.current = true;
          toast({
            title: "No analysis data found!",
            description: "Redirecting you to start over.",
            variant: "destructive"
          });
          navigate('/');
        }
      }
    };

    handleDataFetching();
  }, [receiptId, navigate, toast, location.state]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white p-4 bg-[#0F0F0F] relative">
        {/* Glassmorphism Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"></div>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(circle at 20% 80%, rgba(0,229,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(168,85,247,0.05) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(255,255,255,0.02) 0%, transparent 50%)'
        }}></div>
        
        <div className="text-center bg-white/8 backdrop-blur-xl rounded-3xl border border-cyan-400/30 shadow-2xl shadow-cyan-500/20 p-8 max-w-md mx-auto relative z-10">
          <div className="relative">
            {/* Animated background */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-emerald-500/10 animate-pulse"></div>
            </div>
            
            <div className="relative z-10">
              <Loader2 className="h-16 w-16 animate-spin text-cyan-400 mb-6 mx-auto" />
              <p className="text-lg font-medium text-cyan-200 mb-2">
                Serving the tea... it's hot! ☕️
              </p>
              <p className="text-sm text-cyan-300">Preparing your Sage's receipt</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const analysis = receiptData?.analysis;
  const originalMessage = receiptData?.originalMessage;
  const id = receiptData?.id;
  
  
  // Don't early return after hooks  -  handle missing analysis in render instead  
  const shareTitle = analysis ? `Receipts Pulled: They're a ${analysis.archetype}!` : 'Loading...';
  const helmetTitle = analysis ? `Receipts Pulled: They're a ${analysis.archetype}!` : 'Get The Receipts';
  const helmetDesc = analysis ? `The verdict is in: "${analysis.verdict || ''}"` : 'Loading analysis...';
  // Deep Dive data (generated alongside receipt)  -  New 5-field structure
  const deep = analysis?.deepDive || {};
  const { patternExpose, theirGame, whyYoureStuck, yourPattern, finalRead } = deep;
  const archetypeTitle = analysis?.archetype || '';

  const handleScreenshot = async () => {
    console.log('📸 handleScreenshot called!', { analysis: !!analysis });
    
    // Debug: Check if element exists
    const element = document.getElementById('social-receipt-card');
    console.log('🔍 Element check:', { element: !!element, elementId: element?.id });
    
    setIsSharing(true);
    try {
      // Use the new social export system for Truth Receipt sharing  -  with share menu
      await captureById('social-receipt-card', "Sage-Receipt", true);
    } catch (error) {
      console.error('❌ Share failed:', error);
    } finally {
      setIsSharing(false);
    }
  };


  // Extract archetype name (keep full for card), and a "clean" version without a leading 'The' for Immunity Training subtitle only
  const archetypeName = analysis?.archetype?.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim() || 'Breadcrumber';
  const archetypeNameForImmunity = archetypeName.replace(/^The\s+/i, '');

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-2 text-white overflow-y-auto overflow-x-hidden bg-[#0F0F0F] relative">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"></div>
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(circle at 20% 80%, rgba(0,229,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(168,85,247,0.05) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(255,255,255,0.02) 0%, transparent 50%)'
      }}></div>
      {/* Hidden export cards  -  Positioned off-screen to avoid layout gap */}
      {analysis && (
        <div className="fixed - left-[9999px] - top-[9999px] pointer-events-none" aria-hidden="true">
          <SocialReceiptCard analysis={analysis} archetype={analysis.archetype} />
          <SocialPlaybookCard deepDive={analysis.deepDive} archetype={analysis.archetype} analysis={analysis} />
          <SocialImmunityCard immunityData={analysis.immunityTraining} archetype={archetypeNameForImmunity} analysis={analysis} />
        </div>
      )}
       <Helmet>
        <title>{helmetTitle}</title>
        <meta name="description" content={helmetDesc} />
        <meta property="og:title" content={helmetTitle} />
        <meta property="og:description" content={helmetDesc} />
        <meta property="og:image" content={`${window.location.origin}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={helmetTitle} />
        <meta name="twitter:description" content={helmetDesc} />
        <meta name="twitter:image" content={`${window.location.origin}/og-image.png`} />
      </Helmet>
      
      {/* Flowing Gradient CSS */}
      <style>{`
        .gradient-text {
          background: linear-gradient(-45deg, #60A5FA, #A78BFA, #C084FC, #60A5FA);
          background-size: 400% 400%;
          background-clip: text;
          - webkit-background-clip: text;
          - webkit-text-fill-color: transparent;
          text-fill-color: transparent;
        }

        .animate-gradient {
          animation: gradientShift 4s ease-in-out infinite;
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="w-full max-w-none relative pb-24 sm:pb-20"
      >
        {user && receiptId && (
           <LinkButton to="/dashboard" variant="ghost" size="sm" className="absolute - top-10 left-0 text-white hover:bg-white/10">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </LinkButton>
        )}

        {/* Credits Remaining Indicator */}
        {!isPremium && (
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center px-4 py-2 bg-white/8 backdrop-blur-sm rounded-full border border-cyan-400/30">
              <p className="text-cyan-300 text-sm">
                {userCredits.credits || 0} Sage's Receipts left today
              </p>
            </div>
          </div>
        )}

        {/* Page Title - Streamlined for mobile */}
        <div className="text-center mb-6 sm:mb-8 px-2">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Sage's Receipts
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-0 sm:mb-2 md:mb-4">
            Here's what really happened.
          </p>
        </div>

        {/* Conditional render  -  only show content if analysis exists */}
        {analysis ? (
          <div>
            {/* Tabbed Interface */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8,
                ease: "easeOut"
              }}
            >
              <ErrorBoundary>
                <TabbedReceiptInterface 
                  analysis={analysis}
                  originalMessage={originalMessage}
                  context={receiptData?.context}
                  archetypeNameForImmunity={archetypeNameForImmunity}
                  onSaveReceipt={handleSaveReceipt}
                  onScreenshot={handleScreenshot}
                  isSharing={isSharing}
                  onShowInstructions={() => {
                    resetInstructions();
                  }}
                />
              </ErrorBoundary>
            </motion.div>

            {/* Hidden export cards are rendered at the top of the page tree */}

            {/* Next Receipt CTA  -  Right after the receipt */}
            <div className="w-full max-w-2xl mx-auto mt-4 mb-6 px-4">
              <LinkButton
                to="/new-receipt"
                className="w-full flex items-center justify-center gap-2 sm:gap-3 font-bold px-4 sm:px-8 py-3 sm:py-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-black shadow-2xl shadow-cyan-500/60 hover:shadow-cyan-500/80 border border-cyan-300/50 text-sm sm:text-base relative overflow-hidden group"
                style={{
                  boxShadow: '0 0 20px rgba(6, 182, 212, 0.4), 0 0 40px rgba(6, 182, 212, 0.2), 0 4px 20px rgba(0, 0, 0, 0.3)'
                }}
              >
                <span className="text-lg sm:text-xl">✨</span>
                <span className="text-base sm:text-lg">Decode Another Receipt</span>
                <span className="text-lg sm:text-xl">✨</span>
              </LinkButton>
            </div>

            {/* Secondary Actions */}
            <div className="w-full max-w-2xl mx-auto mb-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <div className="space-y-4">
                  {/* Enhanced Premium Upsell */}
                  {!isPremium && (
                    <div className="text-center p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl border border-purple-400/20">
                      <div className="mb-3">
                        <h3 className="text-lg font-bold text-white mb-1">
                          Unlock Unlimited Receipts + Premium Features
                        </h3>
                        <p className="text-sm text-gray-300">
                          Join the first 500 getting unlimited analysis, priority support & exclusive features
                        </p>
                      </div>
                      <Button
                        onClick={handleFounderCheckout}
                        disabled={loadingCheckout}
                        className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-bold px-6 py-3 rounded-xl text-base transition-all duration-300 hover:scale-105 disabled:opacity-50 shadow-lg shadow-purple-500/40 hover:shadow-purple-500/60 relative overflow-hidden group"
                        style={{
                          boxShadow: '0 0 15px rgba(168, 85, 247, 0.3), 0 0 30px rgba(168, 85, 247, 0.15), 0 4px 15px rgba(0, 0, 0, 0.2)'
                        }}
                      >
                        {loadingCheckout ? 'Redirecting…' : '✨ Upgrade to Premium'}
                      </Button>
                      <p className="text-xs text-gray-400 mt-2">7-day money-back guarantee • Cancel anytime</p>
                    </div>
                  )}

                  {/* Share & Earn  -  Enhanced Container */}
                  <div className="text-center pt-4 border-t border-white/10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/8 backdrop-blur-sm rounded-full border border-purple-400/30 shadow-md shadow-purple-500/20">
                      <span className="text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">💜</span>
                      <span className="text-sm text-white font-medium">Love Sage?</span>
                      <span className="text-white/60">•</span>
                      <LinkButton
                        to="/refer"
                        className="text-white hover:text-purple-300 underline underline-offset-2 font-semibold text-sm transition-colors relative"
                        style={{
                          textShadow: '0 0 8px rgba(168, 85, 247, 0.3)'
                        }}
                      >
                        Share & earn 30%
                      </LinkButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>

        {/* Premium Legal Footer */}
        <div className="w-full max-w-2xl mx-auto mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-purple-400/20 p-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-purple-400 text-lg">🔮</span>
                <span className="text-purple-400 font-semibold text-sm">Sage's Disclaimer</span>
              </div>
              <div className="text-xs text-gray-400 leading-relaxed space-y-2">
                <p>
                  <span className="text-purple-400 font-medium">16+ Entertainment Only</span> • I read patterns for fun, not therapy or advice. I'm AI with opinions, not a licensed professional. I can be wrong. I only see texts, not your full story.
                </p>
                <p className="text-gray-500 italic">
                  You make your choices, bestie. By using this site, you agree to our{" "}
                  <Link to="/privacy-policy" className="text-purple-400 hover:text-purple-300 underline underline-offset-2">
                    Privacy Policy
                  </Link>
                  {" "}and{" "}
                  <Link to="/terms-of-service" className="text-purple-400 hover:text-purple-300 underline underline-offset-2">
                    Terms & Conditions
                  </Link>
                  . 💜
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators - Moved below disclaimer */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6 mb-4 px-4">
          <div className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 bg-white/8 backdrop-blur-sm rounded-full border border-purple-400/30 w-full sm:w-auto">
            <span className="text-purple-400 text-sm">🔒</span>
            <span className="text-xs text-white font-semibold">Private & Secure</span>
            <span className="text-gray-400 hidden sm:inline">•</span>
            <span className="text-xs text-gray-300 hidden sm:inline">Chat deleted. Never stored.</span>
            <span className="text-xs text-gray-300 sm:hidden ml-1">Chat deleted. Never stored.</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-2 px-4 py-2 bg-white/8 backdrop-blur-sm rounded-full border border-purple-400/30 w-full sm:w-auto">
            <span className="text-cyan-400 text-sm">📍</span>
            <span className="text-xs text-white font-semibold">Personalized Analysis</span>
            <span className="text-gray-400 hidden sm:inline">•</span>
            <span className="text-xs text-gray-300 hidden sm:inline">Based on your message only</span>
            <span className="text-xs text-gray-300 sm:hidden ml-1">Based on your message only</span>
          </div>
        </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-cyan-400 mb-4 mx-auto" />
            <p className="text-white/70">Loading analysis...</p>
          </div>
        )}
      </motion.div>
      
      
      {/* Age Verification Modal  -  Removed */}
      
      {/* Share Instructions Modal */}
      <ShareInstructionsModal 
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        platform={instructionsPlatform}
      />
    </div>
  );
};

export default ReceiptsCardPage;