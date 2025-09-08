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
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { saveReceiptToDatabase, canUserSaveReceipts } from '@/lib/services/receiptService';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { useStripe } from '@stripe/react-stripe-js';
// Age verification imports removed
// Sage mood images based on red flags
import greenFlag from '@/assets/green-flag.png'; // 0-3 red flags - Happy Sage
import orangeFlag from '@/assets/orange-flag.png'; // 4-6 red flags - Suspicious Sage  
import redFlag from '@/assets/red-flag.png'; // 7-10 red flags - Savage Sage



const ReceiptsCardPage = () => {
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
  const [creditsRemaining, setCreditsRemaining] = useState(2); // Mock data
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
        scale: 2,
        width: element.offsetWidth,
        height: Math.max(element.offsetHeight, element.scrollHeight, element.clientHeight) + 30
      }).then(function(canvas) {
        // Restore original elements
        restoreOriginalElements(originalElements);

        canvas.toBlob(function(blob) {
          const timestamp = Date.now();
          saveAs(blob, `Sage's Truth Receipt #${timestamp}.png`);
          toast({ title: "Receipt saved!", description: "Your truth receipt has been downloaded." });
          element.classList.remove('save-mode'); // Remove save-mode class
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

  useEffect(() => {
    // Handle redirections and data fetching in a single effect
    const handleDataFetching = async () => {
      // If we already have state data, use it
      if (location.state) {
        setReceiptData(location.state);
        setLoading(false);
        
        // Receipt saving disabled
        // await saveReceiptIfEnabled(location.state, location.state?.originalMessage);
        
        // Age verification removed - handled at input level
        
        return;
      }

      // LOCAL DEVELOPMENT TEST RECEIPT
      if (receiptId === 'test-immunity' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
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
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-400 mb-4" />
          <p>Serving the tea... it's hot!</p>
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
          const file = new File([blob], "receipt.png", { type: "image/png" });
          if (navigator.share && navigator.canShare({ files: [file] })) {
            navigator.share({
              files: [file],
              title: 'My Receipt from Get The Receipts',
              text: `Just got my receipts and... ${receiptData?.analysis?.archetype || 'the accuracy'} 😭 The accuracy is scary accurate`
            });
          } else {
            // Fallback: download
            const timestamp = Date.now();
            saveAs(blob, `Sage's Truth Receipt #${timestamp}.png`);
            toast({ title: "Screenshot saved!", description: "Your receipt has been downloaded." });
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
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="w-full max-w-none relative pb-20"
      >
        {user && receiptId && (
           <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="absolute -top-10 left-0 text-white hover:bg-white/10">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
        )}

        {/* Credits Remaining Indicator */}
        {!isPremium && (
          <div className="text-center mb-4 p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
            <p className="text-purple-300 text-sm">
              {creditsRemaining} Truth Receipts left this month
            </p>
          </div>
        )}

        {/* Page Title */}
        <div className="text-center mb-6 md:mb-8 py-2 md:py-4 px-2">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 md:mb-6 heading-font gradient-text px-2 md:px-4 py-1 md:py-2 leading-tight">
            Sage's Truth Receipts
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
              {/* TODO: Implement TabbedReceiptInterface - for now using original layout */}
              
              {/* Receipt Card */}
              <div className="mb-8">
                <ReceiptCardViral 
                  results={analysis}
                  onSaveReceipt={handleSaveReceipt}
                  onScreenshot={handleScreenshot}
                  isSharing={isSharing}
                />
              </div>

              {/* Deep Dive */}
              <div className="mb-8">
                <DeepDive 
                  deepDive={analysis.deepDive}
                  analysisData={analysis}
                  onSaveReceipt={handleSaveReceipt}
                  onScreenshot={handleScreenshot}
                  isSharing={isSharing}
                />
              </div>

              {/* Immunity Training */}
              <div className="mb-8">
                <ImmunityTraining 
                  immunityData={analysis.immunityTraining}
                  archetypeName={archetypeNameForImmunity}
                  riskLevel={analysis.immunityTraining?.riskLevel || 'medium'}
                  onSaveReceipt={handleSaveReceipt}
                  onScreenshot={handleScreenshot}
                  isSharing={isSharing}
                />
              </div>
            </motion.div>

        {/* 5. CTA SECTION - Bottom */}
        <div className="w-full max-w-2xl mx-auto space-y-6">
          <Button
            onClick={() => navigate('/chat-input')}
            className="w-full py-6 text-black rounded-full text-xl font-bold hover:scale-105 transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
              border: '1px solid rgba(212, 175, 55, 0.9)',
              boxShadow: '0 0 30px rgba(212, 175, 55, 0.4), 0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(245, 230, 211, 0.8)',
              filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.3))'
            }}
          >
            ✨ Decode Another Message
          </Button>
          
          <div className="text-center p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur rounded-2xl border border-purple-500/30">
            <h3 className="text-xl font-bold mb-4 text-white">
              Need More Truth Receipts?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={handleFounderCheckout}
                disabled={loadingCheckout}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-full py-3 hover:scale-105 transition"
                style={{
                  border: '1px solid rgba(234, 179, 8, 0.8)',
                  boxShadow: '0 0 10px rgba(234, 179, 8, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 4px 8px rgba(0, 0, 0, 0.15)'
                }}
              >
                {loadingCheckout ? 'Redirecting...' : '⚡ Go Premium'}
              </Button>
              <Button
                onClick={() => navigate('/refer')}
                variant="outline"
                className="border-purple-400 text-white hover:bg-purple-500/20 rounded-full py-3"
              >
                🎁 Earn Free Truth Receipts
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
      
      {/* Age Verification Modal - Removed */}
    </div>
  );
};

export default ReceiptsCardPage;