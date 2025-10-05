import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ReceiptCardViral from '@/components/ReceiptCardViral';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
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
import greenFlag from '@/assets/green-flag.png'; // 0-3 red flags - Happy Sage
import orangeFlag from '@/assets/orange-flag.png'; // 4-6 red flags - Suspicious Sage  
import redFlag from '@/assets/red-flag.png'; // 7-10 red flags - Savage Sage



const ReceiptsCardPage = () => {
  // Inject moving gradient styles
  React.useEffect(() => {
    injectMovingGradientStyles();
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  // Function to get Sage's mood image based on red flags
  const getSageImage = (redFlagCount) => {
    const flags = parseInt(redFlagCount) || 5;
    if (flags <= 3) return greenFlag;   // 0-3 red flags - Happy Sage with Green Flags
    if (flags <= 6) return orangeFlag;  // 4-6 red flags - Suspicious Sage with Orange Flags  
    return redFlag;                     // 7-10 red flags - Savage Sage with Red Flags
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

  const handleSaveReceipt = () => {
    const startTime = performance.now();
    console.log('🚀 Save process started at:', startTime);
    
    const element = document.getElementById('receipt-card-shareable');
    if (!element) {
      toast({ title: "Error", description: "Could not find receipt to save.", variant: "destructive" });
      return;
    }
    
    setIsSharing(true);
    
    // Add save-mode class for cleaner save
    element.classList.add('save-mode');
    
    // Fix gradient elements before screenshot
    const originalElements = fixGradientElements(element);
    console.log(`Found ${originalElements.length} gradient elements in Receipt component`);
    
    // Wait for DOM to update
    setTimeout(() => {
      html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: 'transparent',
        scale: 1.5, // Reduced from 2 to 1.5 for faster processing
        width: element.offsetWidth,
        height: Math.max(element.offsetHeight, element.scrollHeight, element.clientHeight) + 30,
        logging: false, // Disable logging for faster processing
        removeContainer: true // Clean up faster
      }).then(function(canvas) {
        const canvasTime = performance.now();
        console.log('⏱️ Canvas generated in:', (canvasTime - startTime).toFixed(2), 'ms');
        
        // Restore original elements
        restoreOriginalElements(originalElements);

        canvas.toBlob(function(blob) {
          const blobTime = performance.now();
          console.log('⏱️ Blob created in:', (blobTime - startTime).toFixed(2), 'ms');
          // Check if we're on mobile and can use Web Share API for saving to photos
          const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          
          // Always use traditional download for "Save to Files" button
          const timestamp = Date.now();
          saveAs(blob, `Sage's Truth Receipt #${timestamp}.png`);
          toast({ title: "💾 Saved to Files!", description: "Your receipt has been downloaded to your Downloads folder." });
          element.classList.remove('save-mode');
          setIsSharing(false);
        });
      }).catch(function(error) {
        // Restore on error too
        restoreOriginalElements(originalElements);
        
        console.error('Error saving receipt:', error);
        toast({ 
          title: "Error", 
          description: "Could not save receipt. Please try again.", 
          variant: "destructive" 
        });
        setIsSharing(false);
      });
    }, 100);
  };

  const handleFounderCheckout = async () => {
    if (!user) {
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
        0 // tokens used - could be calculated if needed
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
        
        // Save receipt if user has saving enabled - DISABLED FOR LAUNCH
        // await saveReceiptIfEnabled(location.state, location.state?.originalMessage);
        
        // Age verification removed - handled at input level
        
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
              patternExpose: "This is a classic avoidant attachment pattern. He's using you as an emotional security blanket while keeping his options open. The hot-and-cold behavior isn't confusion - it's calculated emotional manipulation.",
              theirGame: "He's running the 'breadcrumb special' - just enough attention to keep you hooked, never enough to actually commit. This man has perfected the art of having his cake and eating it too.",
              whyYoureStuck: "You're stuck because you're hoping potential will become reality. News flash: it won't. You're trauma-bonded to the intermittent reinforcement he's giving you.",
              yourPattern: "You keep accepting crumbs because you're afraid of being alone. But honey, you're already alone - he's just making you feel crazy about it.",
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
                "Specific plans locked 24–48h ahead—then kept",
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
        
        // Age verification removed - handled at input level
        
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
          setReceiptData({ ...data, analysis: data.analysis_result, originalMessage: data.original_message, quizAnswers: data.quiz_answers });
        }
        setLoading(false);
      } else {
        // No receiptId and no location.state - redirect to home
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
      <div className="min-h-screen flex items-center justify-center text-white p-4" style={{
        background: 'linear-gradient(135deg, #1a1a3e 0%, #14142e 100%)',
        backgroundAttachment: 'fixed'
      }}>
        <div className="text-center bg-gradient-to-br from-slate-900/50 to-indigo-900/30 rounded-3xl border border-white/10 backdrop-blur-sm p-8 max-w-md mx-auto">
          <div className="relative">
            {/* Animated background */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-cyan-500/10 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-tl from-indigo-500/5 to-teal-500/10" 
                style={{
                  animation: 'float 6s ease-in-out infinite'
                }}></div>
            </div>
            
            <div className="relative z-10">
              <Loader2 className="h-16 w-16 animate-spin text-purple-400 mb-6 mx-auto" />
              <p className="text-lg font-medium text-gray-200 mb-2" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                Serving the tea... it's hot! ☕️
              </p>
              <p className="text-sm text-gray-400">Preparing your truth receipt</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const analysis = receiptData?.analysis;
  const originalMessage = receiptData?.originalMessage;
  const id = receiptData?.id;
  
  
  // Don't early return after hooks - handle missing analysis in render instead  
  const shareTitle = analysis ? `Receipts Pulled: They're a ${analysis.archetype}!` : 'Loading...';
  const helmetTitle = analysis ? `Receipts Pulled: They're a ${analysis.archetype}!` : 'Get The Receipts';
  const helmetDesc = analysis ? `The verdict is in: "${analysis.verdict || ''}"` : 'Loading analysis...';
  // Deep Dive data (generated alongside receipt) - New 5-field structure
  const deep = analysis?.deepDive || {};
  const { patternExpose, theirGame, whyYoureStuck, yourPattern, finalRead } = deep;

  const handleScreenshot = async () => {
    setIsSharing(true);
    const element = document.getElementById('receipt-card-shareable');
    if (!element) {
      toast({ title: "Error", description: "Could not find receipt card to screenshot.", variant: "destructive" });
      setIsSharing(false);
      return;
    }
    
    // Fix gradient elements before screenshot
    const originalElements = fixGradientElements(element);
    
    // Wait for DOM to update
    setTimeout(() => {
      html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#11162B',
        scale: 2
      }).then(function(canvas) {
        // Restore original elements
        restoreOriginalElements(originalElements);
        
        canvas.toBlob(function(blob) {
          const file = new File([blob], "Sage Truth Receipt.png", { type: "image/png" });
          
          // Check if we're on mobile and can use Web Share API
          const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          
          if (isMobile && navigator.share && navigator.canShare({ files: [file] })) {
            // Mobile: Use Web Share API for sharing and saving to photos
            navigator.share({
              files: [file]
            }).then(() => {
              toast({ title: "📱 Shared!", description: "You can save to Photos from the share menu." });
            }).catch((shareError) => {
              if (shareError.name !== 'AbortError') {
                console.error('Share error:', shareError);
                // Fallback to download
                const timestamp = Date.now();
                saveAs(blob, `Sage's Truth Receipt #${timestamp}.png`);
                toast({ title: "Downloaded instead", description: "Receipt saved to Downloads folder." });
              } else {
                toast({ title: "Share cancelled", description: "No worries, try again when ready!" });
              }
            });
          } else {
            // Desktop: Use traditional download
            const timestamp = Date.now();
            saveAs(blob, `Sage's Truth Receipt #${timestamp}.png`);
            toast({ title: "💾 Downloaded!", description: "Your receipt has been saved to Downloads. You can then save it to Photos manually." });
          }
          setIsSharing(false);
        });
      }).catch(function(error) {
        // Restore on error too
        restoreOriginalElements(originalElements);
        console.error('Screenshot error:', error);
        toast({ title: "Screenshot failed", description: "Please try again.", variant: "destructive" });
        setIsSharing(false);
      });
    }, 100);
  };

  // Extract archetype name (keep full for card), and a "clean" version without a leading 'The' for Immunity Training subtitle only
  const archetypeName = analysis?.archetype?.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '').trim() || 'Breadcrumber';
  const archetypeNameForImmunity = archetypeName.replace(/^The\s+/i, '');

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 text-white overflow-y-auto" style={{minHeight: '200vh'}}>
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
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
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
        className="w-full max-w-none relative pb-20"
      >
        {user && receiptId && (
           <LinkButton to="/dashboard" variant="ghost" size="sm" className="absolute -top-10 left-0 text-white hover:bg-white/10">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </LinkButton>
        )}

        {/* Credits Remaining Indicator */}
        {!isPremium && (
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center px-4 py-2 bg-purple-900/20 rounded-full border border-purple-500/30">
              <p className="text-purple-300 text-sm">
                {userCredits.credits || 0} Truth Receipts left today
              </p>
            </div>
          </div>
        )}

        {/* Page Title */}
        <div className="text-center mb-6 md:mb-8 py-6 md:py-8 px-2">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6 md:mb-8 px-2 md:px-4 py-2 md:py-4 leading-relaxed">
            <span style={{
              background: 'linear-gradient(90deg, #a58bfa 0%, #0a92aa 50%, #59a5fb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              display: 'inline-block',
              paddingBottom: '0.5em',
              lineHeight: '1.4'
            }}>
              Sage's Truth Receipts
            </span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg mb-4 md:mb-6 px-2">
            The receipts are in. Here's what really happened.
          </p>
        </div>


        {/* Conditional render - only show content if analysis exists */}
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
                />
              </ErrorBoundary>
            </motion.div>

        {/* Mobile Navigation Block */}
        <div className="flex justify-center mt-8 mb-16 sm:hidden">
          <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 rounded-2xl p-2 backdrop-blur-md border border-slate-600/40 shadow-lg">
            <div className="flex items-center gap-1">
              <button className="group relative px-2 py-2 rounded-xl flex items-center gap-1 transition-all duration-300 ease-out transform hover:scale-105 bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-500/25 border border-teal-400/30">
                <span className="text-xs">📄</span>
                <span className="text-xs font-medium">Receipt</span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </button>
              <button className="group relative px-2 py-2 rounded-xl flex items-center gap-1 transition-all duration-300 ease-out transform hover:scale-105 text-slate-300 hover:text-white hover:bg-slate-700/50 hover:shadow-md border border-transparent hover:border-slate-600/40">
                <span className="text-xs">☕</span>
                <span className="text-xs font-medium">Tea</span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </button>
              <button className="group relative px-2 py-2 rounded-xl flex items-center gap-1 transition-all duration-300 ease-out transform hover:scale-105 text-slate-300 hover:text-white hover:bg-slate-700/50 hover:shadow-md border border-transparent hover:border-slate-600/40">
                <span className="text-xs">🛡️</span>
                <span className="text-xs font-medium">Immunity</span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </button>
            </div>
          </div>
        </div>


        {/* 3. PREMIUM UPSELL SECTION - Receipt Style */}
        <div className="w-full max-w-2xl mx-auto mt-12 mb-16">
          <div className="bg-white/2 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10">
            {/* Header matching receipt style */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-teal-900/40 px-4 py-2 rounded-2xl border border-teal-500/50 mb-4">
                <span className="text-2xl">✨</span>
                <span className="text-cyan-400 font-bold text-lg tracking-wide">Ready for Sage's Next Take?</span>
              </div>
            </div>
            
            {/* Two centered buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <LinkButton
                to="/luxe-chat-input"
                className="flex items-center justify-center gap-2 text-black font-medium w-full sm:w-auto px-6 py-3 sm:px-4 sm:py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
                  border: '1px solid rgba(212, 175, 55, 0.8)',
                  boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)'
                }}
              >
                <span className="text-base sm:text-lg">✨</span>
                <span className="text-sm sm:text-base">Decode Another</span>
              </LinkButton>
              <Button
                onClick={handleFounderCheckout}
                disabled={loadingCheckout}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-stone-200 font-medium w-full sm:w-auto px-6 py-3 sm:px-4 sm:py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 text-sm sm:text-base whitespace-nowrap"
                style={{
                  border: '1px solid rgba(20, 184, 166, 0.6)',
                  boxShadow: '0 0 20px rgba(20, 184, 166, 0.2)'
                }}
              >
                <span className="text-base sm:text-lg">⚡</span>
                <span className="text-sm sm:text-base">{loadingCheckout ? 'Redirecting...' : 'Go Premium'}</span>
              </Button>
            </div>
          </div>
        </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-purple-400 mb-4 mx-auto" />
            <p className="text-white/70">Loading analysis...</p>
          </div>
        )}
      </motion.div>
      
      {/* Sage Disclaimer */}
      <div className="w-full max-w-2xl mx-auto px-6 py-8">
        <div className="text-center">
          <p className="text-xs text-gray-500 leading-relaxed">
            🔮 Look, we get it. Sage is really good at reading the room and serving up insights, but she’s not a licensed professional. For the love of all that’s holy, never take life‑changing advice from an opinionated AI, even if she’s kinda fire. For entertainment only. Intended for users 16+.
          </p>
        </div>
      </div>
      
      {/* Age Verification Modal - Removed */}
    </div>
  );
};

export default ReceiptsCardPage;