import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Type, Camera, ChevronDown, User, Crown, AlertCircle, MessageSquare, X, Loader2, CheckCircle2, Upload, Mic, MicOff, Info } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import InputTabs from '@/components/InputTabs';
import SmartCharacterCounter from '@/components/SmartCharacterCounter';
import ColorMappingHelper from '@/components/ColorMappingHelper';
import ColorNameOverrideEditor from '@/components/ColorNameOverrideEditor';
import PronounSelector from '@/components/PronounSelector';
import ImageUpload from '@/components/ImageUpload';
import ConversationTips from '@/components/ConversationTips';
import ProcessingAnimation from '@/components/ProcessingAnimation';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { useStripe } from '@stripe/react-stripe-js';

// Rotating Analysis Text Component - Shows one line at a time
const RotatingAnalysisText = () => {
  const analysisSteps = [
    { text: "Sage is brewing the tea...", emoji: "✨" },
    { text: "Analyzing conversation patterns...", emoji: "📊" },
    { text: "Deep diving into the subtext...", emoji: "🔎" },
    { text: "Building your immunity training...", emoji: "🛡️" },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % analysisSteps.length);
    }, 2500); // Change every 2.5 seconds

    return () => clearInterval(interval);
  }, [analysisSteps.length]);

  return (
    <div className="text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="text-sm sm:text-base text-cyan-300"
        >
          <span className="mr-2">{analysisSteps[currentStep].emoji}</span>
          {analysisSteps[currentStep].text}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const LuxeChatInputPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { openModal } = useAuthModal();
  const stripe = useStripe();
  
  // State Management
  const [activeTab, setActiveTab] = useState('story'); // Default to unified story/chat input
  const [texts, setTexts] = useState('');
  const [contextType, setContextType] = useState('');
  const [detectedNames, setDetectedNames] = useState([]);
  const [userName, setUserName] = useState('');
  const [otherName, setOtherName] = useState('');
  const [namesConfirmed, setNamesConfirmed] = useState(false);
  const [userPronouns, setUserPronouns] = useState('');
  const [otherPronouns, setOtherPronouns] = useState('');
  const [showNameEditor, setShowNameEditor] = useState(false);
  const [isManuallyEditingNames, setIsManuallyEditingNames] = useState(false);
  const [showColorHelper, setShowColorHelper] = useState(false);
  const [colorMapping, setColorMapping] = useState('');
  const [colorNameOverrides, setColorNameOverrides] = useState({});
  const [detectedColors, setDetectedColors] = useState([]);
  const [extractedTexts, setExtractedTexts] = useState([]);
  const [context, setContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [anonymousStatus, setAnonymousStatus] = useState(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [loadingPriceId, setLoadingPriceId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const nameInputRef = useRef(null); // Track if user is typing in name input fields

  // Load color-name overrides from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('colorNameOverrides');
      if (stored) {
        const parsed = JSON.parse(stored);
        setColorNameOverrides(parsed);
        console.log('✅ Loaded color-name overrides from localStorage:', parsed);
      }
    } catch (error) {
      console.warn('⚠️ Failed to load color-name overrides from localStorage:', error);
    }
  }, []);

  // 🎯 AUTO-SELECT "You" or "Me" in "Which person are you?" section when detected
  useEffect(() => {
    // Only auto-select if:
    // 1. We have 2+ detected names
    // 2. userName is not set yet
    // 3. User is not manually editing
    // 4. Context type is selected
    // 5. Names are not already confirmed
    if (detectedNames.length >= 2 && !userName && !isManuallyEditingNames && contextType && !namesConfirmed) {
      // Auto-select "You" or "Me" if detected
      if (detectedNames.includes('You')) {
        setUserName('You');
        const otherNames = detectedNames.filter(n => n !== 'You');
        if (otherNames.length > 0) {
          setOtherName(otherNames[0]);
        }
      } else if (detectedNames.includes('Me')) {
        setUserName('Me');
        const otherNames = detectedNames.filter(n => n !== 'Me');
        if (otherNames.length > 0) {
          setOtherName(otherNames[0]);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detectedNames, contextType]); // Only run when detectedNames or contextType changes

  // Track anonymous user status
  useEffect(() => {
    if (!user) {
      // Load anonymous user status
      import('@/lib/services/anonymousUserService').then(({ AnonymousUserService }) => {
        const status = AnonymousUserService.getAnonymousUserStatus();
        setAnonymousStatus(status);
      });
    } else {
      setAnonymousStatus(null);
    }
  }, [user]);

  // Initialize Speech Recognition API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true; // Keep listening until stopped
        recognitionInstance.interimResults = true; // Show results as you speak
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          // Update text with final results
          if (finalTranscript) {
            setTexts(prev => prev + (prev ? ' ' : '') + finalTranscript.trim());
          }
        };

        recognitionInstance.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          
          if (event.error === 'no-speech') {
            toast({
              title: 'No speech detected',
              description: 'Please try speaking again.',
              variant: 'default'
            });
          } else if (event.error === 'not-allowed') {
            toast({
              title: 'Microphone permission denied',
              description: 'Please allow microphone access in your browser settings.',
              variant: 'destructive'
            });
          } else {
            toast({
              title: 'Speech recognition error',
              description: event.error,
              variant: 'destructive'
            });
          }
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      }
    }

    // Cleanup
    return () => {
      // Cleanup will be handled by the recognition state
    };
  }, []);

  // Cleanup recognition on unmount
  useEffect(() => {
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [recognition]);

  // Handle microphone toggle
  const toggleListening = () => {
    if (!recognition) {
      toast({
        title: 'Speech recognition not supported',
        description: 'Your browser does not support voice input. Please use Chrome, Edge, or Safari.',
        variant: 'destructive'
      });
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
        toast({
          title: 'Listening...',
          description: 'Speak now. Tap the mic again to stop.',
        });
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast({
          title: 'Could not start listening',
          description: 'Please try again.',
          variant: 'destructive'
        });
      }
    }
  };
  
  // Handle checkout for Emergency Pack and Premium
  const handleCheckout = async (priceId, tierName) => {
    if (!user) {
      openModal('sign_up');
      toast({ 
        title: 'Create an account to upgrade!', 
        description: 'Sign up to unlock premium features and get receipts.'
      });
      return;
    }

    if (!stripe) {
      toast({
        variant: "destructive",
        title: "Stripe Error",
        description: "Stripe is not configured correctly. Please check the console.",
      });
      return;
    }

    setLoadingPriceId(priceId);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
          userId: user.email,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();

      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId
      });

      if (error) {
        console.error("Stripe redirect error:", error);
        toast({
          variant: "destructive",
          title: "Payment Error",
          description: error.message || "Could not redirect to checkout.",
        });
        setLoadingPriceId(null);
      }
    } catch (error) {
      console.error("Checkout session error:", error);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error.message || "Could not create checkout session.",
      });
      setLoadingPriceId(null);
    }
  };

  // Auto-detect names from conversation
  const detectNames = (text) => {
    try {
      if (!text || typeof text !== 'string') {
        return [];
      }
      
      // ==================================================
      // MINIMAL FILTERING: Only block OBVIOUS non-names
      // Let the AI handle ambiguous cases using context
      // ==================================================
      
      const obviousNonNames = new Set([
        // Chat artifacts only (removed 'Me' - it's a valid user identifier)
        'You', 'Them', 'User', 'Other', 'Person',
        'Delivered', 'Read', 'Sent', 'Edited', 'Deleted', 'Typing',
        'Today', 'Yesterday', 'Tomorrow'
      ]);
      
      // Helper: Very basic validation
      const isObviouslyNotAName = (str) => {
        // Check obvious non-names
        if (obviousNonNames.has(str)) return true;
        
        // Pure numbers (definitely not names)
        if (/^\d+$/.test(str)) return true;
        
        // Contains time separators like 10:30 or 14-23
        if (/^\d+[:.-]\d+/.test(str)) return true;
        
        // Too short or too long
        if (str.length < 2 || str.length > 30) return true;
        
        return false;
      };
      
      const limitedText = text.length > 10000 ? text.substring(0, 10000) : text;
      const speakers = new Set();
      const hasLineBreaks = limitedText.includes('\n');
      
      if (hasLineBreaks) {
        const lines = limitedText.split('\n');
        
        lines.forEach(line => {
          const trimmedLine = line.trim();
          
          // Flexible patterns - capture almost anything before a colon (including Unicode)
          const patterns = [
            /^([\p{L}][\p{L}\s'-]+):/u,                    // Name: or Name with spaces: (Unicode support)
            /^([\p{L}][\p{L}\s'-]+)\s*\([^)]+\):/u,       // Name (timestamp): (Unicode support)
          ];
          
          for (const pattern of patterns) {
            const match = trimmedLine.match(pattern);
            if (match) {
              const candidateName = match[1].trim();
              
              // Only filter OBVIOUS non-names
              if (!isObviouslyNotAName(candidateName)) {
                speakers.add(candidateName);
              }
              break;
            }
          }
        });
      } else {
        // Single-line format (Unicode support)
        const patterns = [
          /([\p{L}][\p{L}\s'-]+):/gu,
          /([\p{L}][\p{L}\s'-]+)\s*\([^)]+\):/gu,
        ];
        
        for (const pattern of patterns) {
          let match;
          while ((match = pattern.exec(limitedText)) !== null) {
            const candidateName = match[1].trim();
            if (!isObviouslyNotAName(candidateName)) {
              speakers.add(candidateName);
            }
          }
        }
      }
      
      // Special handling for "Me" as user identifier
      const speakerArray = Array.from(speakers);
      
      // If "Me" is detected, prioritize it as the user
      if (speakerArray.includes('Me')) {
        const otherNames = speakerArray.filter(name => name !== 'Me');
        return ['Me', ...otherNames].slice(0, 2);
      }
      
      // Return up to 2 detected names
      // NOTE: AI will validate these using context
      return speakerArray.slice(0, 2);
      
    } catch (error) {
      console.warn('Error detecting names:', error);
      return [];
    }
  };

  // 🎯 SMART FORMAT DETECTION: Detect if input is structured chat or narrative
  const detectInputFormat = (text) => {
    if (!text || text.length < 10) return 'narrative'; // Default to narrative for short text
    
    // Check for structured chat patterns
    const chatPatterns = [
      /^[A-Z][a-z]+:\s/m,           // "Name: message" at start of line
      /^[A-Z][a-z]+\s\(\d+:\d+\):\s/m, // "Name (time): message"
      /\n[A-Z][a-z]+:\s/g,          // "Name:" on new line
      /\n[A-Z][a-z]+\s\(\d+:\d+\):\s/g, // "Name (time):" on new line
    ];
    
    // Count how many chat patterns we find
    const chatPatternCount = chatPatterns.reduce((count, pattern) => {
      const matches = text.match(pattern);
      return count + (matches ? matches.length : 0);
    }, 0);
    
    // If we find 2+ chat patterns, it's likely structured chat
    if (chatPatternCount >= 2) {
      return 'conversation';
    }
    
    // If text has many line breaks and looks structured, treat as conversation
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length >= 3) {
      const linesWithColon = lines.filter(line => /:\s/.test(line));
      if (linesWithColon.length >= 2) {
        return 'conversation';
      }
    }
    
    // Default to narrative (better results, more forgiving)
    return 'narrative';
  };

  // Handle text change
  const handleTextChange = (e) => {
    const newText = e.target.value.slice(0, 10000); // 10,000 character limit
    setTexts(newText);

    // Auto-detect names
    const names = detectNames(newText);
    if (names.length > 0) {
      setDetectedNames(names);

      // 🚫 PREVENT AUTO-POPULATION IF USER IS MANUALLY EDITING NAMES
      // Check if user is currently focused on a name input field
      const activeElement = document.activeElement;
      const isTypingInNameField = activeElement && activeElement.tagName === 'INPUT' && (
        activeElement.placeholder?.toLowerCase().includes('you') || 
        activeElement.placeholder?.toLowerCase().includes('them') ||
        activeElement.placeholder?.toLowerCase().includes('person 1') ||
        activeElement.placeholder?.toLowerCase().includes('person 2') ||
        activeElement.placeholder?.toLowerCase().includes('name') ||
        activeElement.id?.includes('name') ||
        activeElement.className?.includes('name')
      );

      // 🚫 PREVENT AUTO-POPULATION IF NAMES ARE ALREADY SET OR USER IS EDITING
      // Only auto-populate if both fields are completely empty AND user is not editing
      if (isManuallyEditingNames || isTypingInNameField || userName.trim() || otherName.trim()) {
        return; // Don't auto-populate while user is typing or has already set names
      }

      // 🎯 SMART AUTO-SELECTION: If "Me" is detected, auto-select it as the user
      if (names.includes('Me')) {
        setUserName('Me');
        const otherNames = names.filter(name => name !== 'Me');
        if (otherNames.length > 0) {
          setOtherName(otherNames[0]);
        }
      } else if (names.includes('You')) {
        // 🎯 AUTO-POPULATE: If "You" is detected, auto-populate as userName
        setUserName('You');
        setNamesConfirmed(false); // Reset confirmation when new names detected
        const otherNames = names.filter(name => name !== 'You');
        if (otherNames.length > 0) {
          setOtherName(otherNames[0]);
          setNamesConfirmed(false); // Reset confirmation when new names detected
        }
      } else if (names.length >= 2) {
        // 🎯 AUTO-POPULATE: If 2 names detected and fields are empty, auto-populate
        // Assume first name is "You" and second is "Them" (user can edit)
        setUserName(names[0]);
        setOtherName(names[1]);
        setNamesConfirmed(false); // Reset confirmation when new names detected
      } else if (names.length === 1) {
        // If only one name detected, check if it's "You" or auto-populate as "Them"
        if (names[0].toLowerCase() === 'you') {
          setUserName('You');
        } else {
          setOtherName(names[0]);
        }
        setNamesConfirmed(false); // Reset confirmation when new names detected
      }
    }
  };

  // Handle analyze click
  const handleAnalyze = () => {
    console.log('🚀 HandleAnalyze triggered', {
      hasText: !!texts.trim(),
      extractedCount: extractedTexts.length,
      contextType,
      userName,
      otherName,
      detectedNames
    });

    if (!texts.trim() && extractedTexts.length === 0) {
      toast({
        title: 'Conversation Required',
        description: 'Please paste your conversation or upload screenshots.'
      });
      return;
    }
    
    if (!contextType) {
      toast({
        title: 'Relationship Type Required',
        description: 'Please select what type of relationship this is.'
      });
      return;
    }
    
    // 🎯 SMART SUBMIT: Only require names if not auto-detected
    // If "Me" was auto-selected, we can proceed directly
    // Otherwise, check if names are provided
      if (!userName || !otherName) {
      // Try to use detected names as fallback
      if (detectedNames.length >= 2) {
        // If we have 2 names but user hasn't selected, prompt them
        toast({
          title: 'Who are you?',
          description: 'Please select which person you are in the conversation.'
        });
        return;
      } else if (detectedNames.length === 1) {
        // Only one name detected - use it and set other to "Them"
        setUserName(detectedNames[0]);
        setOtherName('Them');
      } else {
        // No names detected - use defaults
        setUserName('Me');
        setOtherName('Them');
      }
    }
    
    if (!userName) setUserName(prev => prev || 'Me');
    if (!otherName) setOtherName(prev => prev || 'Them');

    toast({
      title: 'Processing…',
      description: 'Sage is decoding your chat now.',
    });
    submitAnalysis();
  };

  const submitAnalysis = async () => {
    // 🚨 RACE CONDITION PROTECTION: Prevent multiple simultaneous submissions
    if (isLoading) {
      console.warn('Analysis already in progress, ignoring duplicate request');
      return;
    }
    
    console.log('⚙️ submitAnalysis starting');
    setIsLoading(true);
    
    try {
      // 🔐 CREDIT CHECK: Verify user can perform analysis
      const { AnonymousUserService } = await import('@/lib/services/anonymousUserService');
      const { getUserCredits } = await import('@/lib/services/creditsSystem');
      const { SubscriptionService } = await import('@/lib/services/subscriptionService');
      const FreeUsageService = (await import('@/lib/services/freeUsageService')).default;
      
      let canProceed = false;
      let creditMessage = '';
      let creditCheckResult = null; // Initialize for both user types
      let userCredits = null; // Store for use in deduction phase
      
      if (user) {
        // Logged-in user: Check their credits using proper service
        userCredits = await getUserCredits(user.id);
        console.log('🔐 User credits check:', userCredits);
        
        if (userCredits.subscription === 'premium' || 
            userCredits.subscription === 'yearly' || 
            userCredits.subscription === 'founder') {
          canProceed = true;
          creditMessage = 'Premium user - unlimited analysis';
        } else if (userCredits.subscription === 'free') {
          // Free users: Check Emergency Pack credits first (from database), then FreeUsageService
          if (userCredits.credits > 0) {
            // User has Emergency Pack credits - use those first
          canProceed = true;
            creditMessage = `Free user - ${userCredits.credits} Emergency Pack credits remaining`;
            creditCheckResult = { reason: 'emergency', remaining: userCredits.credits, needsIncrement: true };
          } else {
            // No Emergency Pack credits, check daily limits (3 starter + 1 daily) using FreeUsageService
            const starterUsed = FreeUsageService.getStarterUsed(user.id);
            if (starterUsed < 3) {
              canProceed = true;
              creditMessage = `Free user - ${3 - starterUsed} starter receipts remaining`;
              creditCheckResult = { reason: 'starter', remaining: 3 - starterUsed, needsIncrement: true };
            } else {
              // Starter exhausted, check daily limit
              const todayReceipts = FreeUsageService.getTodayReceiptCount(user.id);
              if (todayReceipts < 1) {
                canProceed = true;
                creditMessage = 'Free user - daily receipt available';
                creditCheckResult = { reason: 'daily', remaining: 1 - todayReceipts, needsIncrement: true };
              } else {
                canProceed = false;
                creditMessage = 'Daily limit reached. Please upgrade or wait for tomorrow.';
                creditCheckResult = { reason: 'limit_reached' };
              }
            }
          }
        } else if (userCredits.credits > 0) {
          // Legacy users with limited credits (non-free subscription with credits)
          canProceed = true;
          creditMessage = `User - ${userCredits.credits} credits remaining`;
        } else {
          canProceed = false;
          creditMessage = 'No credits remaining. Please upgrade or wait for daily reset.';
          creditCheckResult = { reason: 'limit_reached' };
        }
      } else {
        // Anonymous user: Use atomic operation to prevent race conditions
        creditCheckResult = AnonymousUserService.checkAndIncrementAnalysis();
        console.log('🔐 Anonymous user atomic check:', creditCheckResult);
        
        if (creditCheckResult.success) {
          canProceed = true;
          creditMessage = `Anonymous user - ${creditCheckResult.remainingAnalyses} free analysis remaining`;
          
          // Show warning if using fallback storage
          if (creditCheckResult.storageType === 'fallback') {
            console.warn('⚠️ Using fallback storage - localStorage unavailable');
          }
        } else {
          canProceed = false;
          if (creditCheckResult.reason === 'limit_reached') {
            creditMessage = 'Free analysis limit reached. Please sign up for more credits.';
          } else {
            creditMessage = 'Unable to verify analysis limit. Please try again.';
          }
        }
      }
      
      if (!canProceed) {
        setIsLoading(false);
        
        // Show upgrade modal for both anonymous and logged-in users when limit is reached
        const shouldShowUpgradeModal = 
          (!user && creditCheckResult?.reason === 'limit_reached') || 
          (user && creditMessage.includes('No credits remaining'));
          
        if (shouldShowUpgradeModal) {
          setShowLimitModal(true);
        } else {
          // For other errors, show simple toast
          toast({
            variant: 'destructive',
            title: 'Analysis Limit Reached',
            description: creditMessage
          });
        }
        return;
      }
      
      console.log('✅ Credit check passed:', creditMessage);
      
      // Combine all text inputs
      const message = texts.trim() + '\n' + extractedTexts.join('\n');
      
      // Build comprehensive context object with ALL inputs
      const analysisContext = {
        // Core conversation data
        conversation: message,
        
        // Names (from user input or auto-detected) - PROPERLY TAGGED
        userName: userName || 'Me',
        otherName: otherName || 'Them',
        selectedMainUser: userName || 'Me',
        user_name: userName || 'Me', // Legacy API field
        other_name: otherName || 'Them', // Legacy API field
        their_name: otherName || 'Them', // Alternative API field
        
        // Pronouns - PROPERLY TAGGED
        userPronouns: userPronouns || 'they/them',
        otherPronouns: otherPronouns || 'they/them',
        otherPartyPronouns: otherPronouns || 'they/them', // API expects this field name
        known_pronouns: {
          user: userPronouns || 'they/them',
          other_party: otherPronouns || 'they/them'
        },
        
        // Relationship context - PROPERLY TAGGED
        contextType: contextType,
        relationshipType: contextType?.toLowerCase() || 'dating', // API expects lowercase
        context: contextType?.toLowerCase() || 'dating', // Legacy API field
        
        // Additional context - PROPERLY TAGGED
        background: context || '',
        background_context: context || '', // Legacy API field
        
        // Screenshot-specific data - PROPERLY TAGGED
        colorMapping: colorMapping || '',
        colorNameOverrides: colorNameOverrides, // Saved overrides from localStorage
        detectedColors: detectedColors, // Detected colors for validation
        extractedTexts: extractedTexts,
        
        // Auto-detected data - PROPERLY TAGGED
        detectedNames: detectedNames,
        
        // Input method - PROPERLY TAGGED
        inputMethod: activeTab,
        
        // Input format for AI routing - Smart auto-detection for story tab
        inputFormat: activeTab === 'screenshot' ? 'screenshot' : 
                     activeTab === 'story' ? detectInputFormat(texts.trim() || extractedTexts.join('\n')) : 
                     'narrative', // Default to narrative (better results)
        isNarrative: activeTab === 'story' && detectInputFormat(texts.trim() || extractedTexts.join('\n')) === 'narrative',
        narrativeDisclaimer: (activeTab === 'story' && detectInputFormat(texts.trim() || extractedTexts.join('\n')) === 'narrative') ? 'Based on your story:' : null,
        
        // NEW: Detection hints for AI
        detectionHints: {
          frontendDetectedNames: detectedNames, // What frontend thinks
          userConfirmedNames: userName && otherName, // Did user confirm?
          hasTimestamps: /\d+:\d+/.test(message), // Message has times?
          hasDates: /(Mon|Tue|Wed|Thu|Fri|Sat|Sun|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(message),
          conversationFormat: message.includes('\n') ? 'multi-line' : 'single-line'
        },
        
        // Debugging and validation
        _debug: {
          hasUserName: !!userName,
          hasOtherName: !!otherName,
          hasUserPronouns: !!userPronouns,
          hasOtherPronouns: !!otherPronouns,
          hasContext: !!context,
          hasColorMapping: !!colorMapping,
          hasExtractedTexts: extractedTexts.length > 0,
          hasDetectedNames: detectedNames.length > 0,
          detectedNames: detectedNames,
          relationshipType: contextType
        }
      };
      
      console.log('🚀 Submitting analysis with full context:', analysisContext);
      
      // Import the actual analysis function
      const { generateAlignedResults } = await import('@/lib/analysis/advancedAnalysis');
      
      // Call the real analysis API with all inputs
      const analysisResult = await generateAlignedResults(message, analysisContext);
      
      console.log('✅ Analysis complete:', analysisResult);
      
      // 🔐 DEDUCT CREDITS: After successful analysis (atomic operation)
      if (user) {
        // Logged-in user: Consume credit based on subscription type
        if (userCredits.subscription === 'free' && creditCheckResult?.needsIncrement) {
          if (creditCheckResult.reason === 'emergency') {
            // Emergency Pack credits: Deduct from database credits_remaining
            const { deductCredits } = await import('@/lib/services/creditsSystem');
        const deductResult = await deductCredits(user.id, 1);
        if (deductResult.success) {
              console.log(`✅ Emergency Pack credit consumed. Remaining: ${deductResult.newCredits}`);
        } else {
              console.warn('⚠️ Failed to deduct Emergency Pack credit:', deductResult.error);
            }
          } else if (creditCheckResult.reason === 'starter') {
            // Starter receipt: Use FreeUsageService
            FreeUsageService.checkAndIncrementStarterReceipt(user.id);
            console.log('✅ Starter receipt consumed for free user');
            // Also update database via RPC for consistency
            await SubscriptionService.consumeCredit(user.id);
          } else if (creditCheckResult.reason === 'daily') {
            // Daily receipt: Use FreeUsageService
            FreeUsageService.checkAndIncrementDailyReceipt(user.id);
            console.log('✅ Daily receipt consumed for free user');
            // Also update database via RPC for consistency
            await SubscriptionService.consumeCredit(user.id);
        }
        } else if (userCredits.subscription === 'premium' || 
                   userCredits.subscription === 'yearly' || 
                   userCredits.subscription === 'founder') {
          // Premium users: No credit deduction needed, but track usage
          await SubscriptionService.consumeCredit(user.id);
          console.log('✅ Usage tracked for premium user (unlimited)');
      } else {
          // Legacy users (non-free subscription with credits): Use RPC function
          const consumeResult = await SubscriptionService.consumeCredit(user.id);
          if (consumeResult.success) {
            console.log('✅ Credit consumed for logged-in user (atomic operation)');
          } else {
            console.warn('⚠️ Failed to consume credit for logged-in user:', consumeResult.error);
          }
        }
      } else {
        // Anonymous user: Credit already deducted in atomic operation during check
        console.log('✅ Anonymous analysis count already updated in atomic operation');
      }
      
      // Navigate to results with real analysis data
      navigate('/receipts', { 
        state: { 
          analysis: analysisResult,
          originalMessage: message,
          context: analysisContext
        } 
      });
      
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Please try again. If the problem persists, contact support.'
      });
    } finally {
      console.log('✅ submitAnalysis finished');
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'story', label: 'Paste Chat or Tell Your Story', icon: MessageSquare, description: 'Paste formatted chat or write in your own words' },
    { id: 'screenshot', label: 'Upload Screenshots', icon: Camera, description: 'Upload up to 5 screenshots' }
  ];

  const relationshipTypes = ['Dating', 'Situationship', 'Marriage', 'Friend', 'Work', 'Family'];
  
  const isNative = Capacitor.isNativePlatform();

  // Mobile-optimized input page for native apps
  if (isNative) {
    return (
      <div className="h-screen w-full flex flex-col bg-[#0F0F0F] overflow-hidden relative">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,229,255,0.08),rgba(168,85,247,0.05),rgba(255,255,255,0.02))] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="pt-6 pb-3 px-4 flex-shrink-0">
            <h1 className="text-2xl font-black text-white text-center">
              Get Your <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Receipt</span>
            </h1>
            <p className="text-xs text-gray-400 text-center mt-1">Results in 60 seconds</p>
          </div>

          {/* Two Input Tabs */}
          <div className="px-4 mb-3 flex-shrink-0">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('story')}
                className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
                  activeTab === 'story'
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'bg-white/5 backdrop-blur-sm text-gray-300 border border-cyan-400/20'
                }`}
              >
                <Type className="w-4 h-4" />
                <span className="text-sm font-medium">Paste Text</span>
              </button>
              <button
                onClick={() => setActiveTab('screenshot')}
                className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
                  activeTab === 'screenshot'
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'bg-white/5 backdrop-blur-sm text-gray-300 border border-cyan-400/20'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span className="text-sm font-medium">Upload</span>
              </button>
            </div>
          </div>

          {/* Input Area - Takes most space */}
          <div className="flex-1 px-4 mb-3 min-h-0 overflow-y-auto">
            {activeTab === 'story' && (
              <div className="h-full flex flex-col">
                <div className={`relative w-full ${isTextExpanded ? 'h-[280px]' : 'h-[170px]'} transition-all duration-300`}
                >
                  <textarea
                    value={texts}
                    onChange={handleTextChange}
                    placeholder="Paste your chat or tell your story...

Example:
Alex: Hey, how are you?
You: I'm good, thanks!

Or write naturally:
I've been seeing Alex for 3 months. Last week they said they wanted to be exclusive, but yesterday I saw them active on dating apps at 2am..."
                    className="w-full h-full p-4 pr-12 text-sm bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-xl focus:border-cyan-400/50 focus:outline-none transition-all duration-300 resize-none text-white placeholder-gray-400 overflow-y-auto"
                  />
                  {/* Microphone Button */}
                  <button
                    onClick={toggleListening}
                    className={`absolute bottom-4 right-4 p-2.5 rounded-full transition-all duration-300 ${
                      isListening
                        ? 'bg-red-500/90 text-white shadow-lg shadow-red-500/50 animate-pulse'
                        : 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-400/30'
                    }`}
                    title={isListening ? 'Stop recording' : 'Start voice input'}
                  >
                    {isListening ? (
                      <MicOff className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-center flex-1">
                    {texts.length > 0 && (
                      <div>
                        <div className={`text-xs ${
                          texts.length >= 10000
                            ? 'text-red-400 font-medium'
                            : texts.length >= 9000
                            ? 'text-yellow-400'
                            : 'text-gray-400'
                        }`}>
                          {texts.length.toLocaleString()} / 10,000 characters
                          {texts.length >= 10000 && ' (limit reached)'}
                          {texts.length >= 9000 && texts.length < 10000 && ' (approaching limit)'}
                        </div>
                        {/* Dynamic feedback message */}
                        {texts.length < 300 && (
                          <div className="text-xs text-orange-400 mt-1">
                            Minimum 300 characters required
                          </div>
                        )}
                        {texts.length >= 300 && texts.length < 500 && (
                          <div className="text-xs text-cyan-400 mt-1">
                            A good range is between 500-10,000 characters
                          </div>
                        )}
                        {texts.length >= 500 && texts.length <= 10000 && (
                          <div className="text-xs text-green-400 mt-1">
                            A good range is between 500-10,000 characters
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {isListening && (
                    <div className="flex items-center gap-1.5 text-xs text-red-400">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      <span>Listening...</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setIsTextExpanded(prev => !prev)}
                  className="mt-2 text-[11px] text-cyan-400/80 hover:text-cyan-300 transition-colors self-end"
                >
                  {isTextExpanded ? 'Collapse input ↑' : 'Expand input ↓'}
                </button>
              </div>
            )}
            
            {activeTab === 'screenshot' && (
              <div className="h-full">
                <ImageUpload 
                  onTextExtracted={(text) => {
                    setExtractedTexts(prev => [...prev, text]);
                    setTexts(prev => prev + (prev ? '\n\n' : '') + text);
                    setShowColorHelper(true); // Show color mapping helper
                    // Auto-detect names from extracted text
                    const names = detectNames(text);
                    if (names.length > 0) {
                      setDetectedNames(names);
                      // Auto-select "Me" if detected
                      if (names.includes('Me')) {
                        setUserName('Me');
                        const otherNames = names.filter(name => name !== 'Me');
                        if (otherNames.length > 0) {
                          setOtherName(otherNames[0]);
                        }
                      }
                    }
                    // Don't auto-switch tab - let user see the name editor
                  }}
                  maxFiles={5}
                />
                
                {/* Color Mapping Helper - Essential for screenshots */}
                <AnimatePresence>
                  {showColorHelper && extractedTexts.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-3 px-4"
                    >
                      <ColorMappingHelper 
                        onColorMapping={(mapping) => {
                          setColorMapping(mapping);
                          // Parse color mapping to extract colors and set names
                          if (mapping.includes('=')) {
                            const parts = mapping.split(',');
                            const colors = [];
                            parts.forEach(part => {
                              const [color, name] = part.split('=').map(s => s.trim());
                              if (color && name) {
                                colors.push(color.toLowerCase());
                                if (color.toLowerCase().includes('blue') && !userName) {
                                  setUserName(name);
                                } else if (color.toLowerCase().includes('gray') && !otherName) {
                                  setOtherName(name);
                                }
                              }
                            });
                            // Update detected colors
                            if (colors.length > 0) {
                              setDetectedColors(colors);
                            }
                          }
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 🎯 COLOR-NAME OVERRIDE EDITOR - Shows detected colors with editable name fields */}
                {extractedTexts.length > 0 && detectedColors.length >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-3 px-4"
                  >
                    <ColorNameOverrideEditor
                      detectedColors={detectedColors}
                      initialMappings={colorNameOverrides}
                      onSave={(mappings) => {
                        setColorNameOverrides(mappings);
                        // Update userName and otherName from mappings
                        const names = Object.values(mappings).filter(n => n && n.trim());
                        if (names.length >= 2) {
                          setUserName(names[0]);
                          setOtherName(names[1]);
                        }
                        // Update colorMapping string
                        const mappingString = Object.entries(mappings)
                          .filter(([_, name]) => name && name.trim())
                          .map(([color, name]) => `${color} = ${name}`)
                          .join(', ');
                        setColorMapping(mappingString);
                        setShowNameEditor(false);
                      }}
                      onCancel={() => setShowNameEditor(false)}
                    />
                  </motion.div>
                )}

                {/* 🎯 NAME EDITING FOR SCREENSHOTS - Fallback when colors not detected */}
                {extractedTexts.length > 0 && detectedColors.length < 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 px-4"
                  >
                    {!showNameEditor ? (
                      <div className="p-3 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-cyan-400/30">
                        <p className="text-xs font-medium mb-2 flex items-center gap-1.5 text-white">
                          <Sparkles className="w-3.5 h-3.5" />
                          Who is who in these screenshots?
                        </p>
                        
                        {/* Show detected names with selection */}
                        {detectedNames.length >= 2 && !userName ? (
                          <div className="space-y-1.5 mb-2">
                            <p className="text-[10px] text-white/70 mb-1.5">Which person are you?</p>
                            {detectedNames.map((name, index) => (
                              <button
                                key={name}
                                onClick={() => {
                                  setUserName(name);
                                  setOtherName(detectedNames[1 - index]);
                                }}
                                className="w-full px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 bg-white/5 backdrop-blur-sm text-gray-300 border border-cyan-400/20 hover:bg-white/10 hover:border-cyan-400/40 active:scale-95"
                              >
                                I am {name}
                              </button>
                            ))}
                          </div>
                        ) : (
                          /* Manual input if names not detected */
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <input
                              placeholder="You/Person 1"
                              value={userName}
                              onFocus={() => setIsManuallyEditingNames(true)}
                              onChange={(e) => {
                                setIsManuallyEditingNames(true);
                                setUserName(e.target.value);
                              }}
                              className="px-2.5 py-2 bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-lg text-xs text-white placeholder-gray-400 focus:border-cyan-400/50 focus:outline-none transition-all"
                            />
                            <input
                              placeholder="Them/Person 2"
                              value={otherName}
                              onFocus={() => setIsManuallyEditingNames(true)}
                              onChange={(e) => {
                                setIsManuallyEditingNames(true);
                                setOtherName(e.target.value);
                              }}
                              className="px-2.5 py-2 bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-lg text-xs text-white placeholder-gray-400 focus:border-cyan-400/50 focus:outline-none transition-all"
                            />
                          </div>
                        )}

                        {/* Show confirmation when names are set */}
                        {userName && otherName ? (
                          <div className="flex items-center justify-between p-2 bg-emerald-500/20 border border-emerald-400/30 rounded-lg">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                              <span className="text-xs text-white">
                                You: <span className="font-semibold">{userName}</span> • Them: <span className="font-semibold">{otherName}</span>
                              </span>
                            </div>
                            <button
                              onClick={() => setShowNameEditor(true)}
                              className="text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                              Edit
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowNameEditor(true)}
                            className="w-full mt-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm text-cyan-300 border border-cyan-400/30 hover:from-cyan-500/30 hover:to-purple-500/30 active:scale-95"
                          >
                            ✏️ Set names →
                          </button>
                        )}
                      </div>
                    ) : (
                      /* Full name editor with pronouns */
                      <div className="p-3 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-cyan-400/30">
                        <p className="text-xs font-medium mb-2 text-white">Customize how names appear on the receipt</p>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wide text-gray-500">You</label>
                            <input
                              placeholder="e.g. Me, Piet, Bestie"
                              value={userName}
                              onFocus={() => setIsManuallyEditingNames(true)}
                              onChange={(e) => {
                                setIsManuallyEditingNames(true);
                                setUserName(e.target.value);
                              }}
                              className="w-full px-2.5 py-2 bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-lg text-xs text-white placeholder-gray-400 focus:border-cyan-400/50 focus:outline-none transition-all"
                            />
                            <PronounSelector
                              label="Pronouns"
                              value={userPronouns}
                              onChange={(value) => setUserPronouns(prev => prev === value ? '' : value)}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wide text-gray-500">Them</label>
                            <input
                              placeholder="e.g. Them, Bani, Situationship"
                              value={otherName}
                              onFocus={() => setIsManuallyEditingNames(true)}
                              onChange={(e) => {
                                setIsManuallyEditingNames(true);
                                setOtherName(e.target.value);
                              }}
                              className="w-full px-2.5 py-2 bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-lg text-xs text-white placeholder-gray-400 focus:border-cyan-400/50 focus:outline-none transition-all"
                            />
                            <PronounSelector
                              label="Pronouns"
                              value={otherPronouns}
                              onChange={(value) => setOtherPronouns(prev => prev === value ? '' : value)}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => setShowNameEditor(false)}
                            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                          >
                            Done
                          </button>
                          <button
                            onClick={() => {
                              setUserName('');
                              setOtherName('');
                              setUserPronouns('');
                              setOtherPronouns('');
                              setShowNameEditor(false);
                            }}
                            className="text-xs text-gray-400 hover:text-white transition-colors"
                          >
                            Use defaults
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* 🎯 NAME EDITING - ESSENTIAL: Shows immediately after text is pasted (not screenshots) */}
          {texts.trim() && !extractedTexts.length && (
            <div className="px-4 mb-3 flex-shrink-0">
              <AnimatePresence>
                {/* Show detected names with selection */}
                {detectedNames.length >= 2 && !userName && !showNameEditor && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-cyan-400/30"
                  >
                    <p className="text-xs font-medium mb-2 flex items-center gap-1.5 text-white">
                      <Sparkles className="w-3.5 h-3.5" />
                      Found: {detectedNames.join(' and ')}
                    </p>
                    <p className="text-[10px] text-white/70 mb-2">Which person are you?</p>
                    <div className="space-y-1.5">
                      {detectedNames.map((name, index) => (
                        <button
                          key={name}
                          onClick={() => {
                            setUserName(name);
                            setOtherName(detectedNames[1 - index]);
                          }}
                          className="w-full px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 bg-white/5 backdrop-blur-sm text-gray-300 border border-cyan-400/20 hover:bg-white/10 hover:border-cyan-400/40 active:scale-95"
                        >
                          I am {name}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowNameEditor(true)}
                      className="mt-2 w-full px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm text-cyan-300 border border-cyan-400/30 hover:from-cyan-500/30 hover:to-purple-500/30 active:scale-95"
                    >
                      ✏️ Edit names →
                    </button>
                  </motion.div>
                )}

                {/* Show manual input if 1 or 0 names detected */}
                {detectedNames.length < 2 && !userName && !showNameEditor && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-cyan-400/30"
                  >
                    <p className="text-xs font-medium mb-2 text-white">Who's in this conversation?</p>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input
                        placeholder="You/Person 1"
                        value={userName}
                        onFocus={() => setIsManuallyEditingNames(true)}
                        onChange={(e) => {
                          setIsManuallyEditingNames(true);
                          setUserName(e.target.value);
                        }}
                        className="px-2.5 py-2 bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-lg text-xs text-white placeholder-gray-400 focus:border-cyan-400/50 focus:outline-none transition-all"
                      />
                      <input
                        placeholder="Them/Person 2"
                        value={otherName}
                        onFocus={() => setIsManuallyEditingNames(true)}
                        onChange={(e) => {
                          setIsManuallyEditingNames(true);
                          setOtherName(e.target.value);
                        }}
                        className="px-2.5 py-2 bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-lg text-xs text-white placeholder-gray-400 focus:border-cyan-400/50 focus:outline-none transition-all"
                      />
                    </div>
                    <button
                      onClick={() => setShowNameEditor(true)}
                      className="w-full px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm text-cyan-300 border border-cyan-400/30 hover:from-cyan-500/30 hover:to-purple-500/30 active:scale-95"
                    >
                      ✏️ Advanced editor with pronouns →
                    </button>
                  </motion.div>
                )}

                {/* Show confirmation when names are set - ALWAYS SHOW EDIT BUTTON */}
                {userName && otherName && !showNameEditor && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-2.5 bg-emerald-500/20 border border-emerald-400/30 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="text-xs text-white">
                          You: <span className="font-semibold">{userName}</span> • Them: <span className="font-semibold">{otherName}</span>
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowNameEditor(true)}
                      className="w-full px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm text-cyan-300 border border-cyan-400/30 hover:from-cyan-500/30 hover:to-purple-500/30 active:scale-95"
                    >
                      ✏️ Edit names & pronouns
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Relationship Type - Compact for Mobile */}
          {(texts.trim() || extractedTexts.length > 0) && !contextType && (
            <div className="px-4 mb-2 flex-shrink-0">
              <p className="text-xs text-cyan-400/80 mb-1.5 text-center font-medium">Select relationship type to continue</p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {['Dating', 'Situationship', 'Friend', 'Work', 'Family', 'Other'].map(type => (
                  <button
                    key={type}
                    onClick={() => setContextType(type.toLowerCase())}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                      contextType === type.toLowerCase()
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30'
                        : 'bg-white/5 backdrop-blur-sm text-gray-300 border border-cyan-400/20'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Name Editor - Manual override - STAYS VISIBLE WHILE EDITING */}
          {(texts.trim() || extractedTexts.length > 0) && contextType && showNameEditor && (
            <div className="px-4 mb-2 flex-shrink-0">
              <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-cyan-400/30 p-3 mb-2">
                <p className="text-xs font-medium mb-2 flex items-center gap-1.5 text-white">
                  <Sparkles className="w-3.5 h-3.5" />
                  Edit names
                </p>
                <p className="text-[10px] text-white/70 mb-3">
                  Customize how names appear on the receipt. You can edit these at any time.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-cyan-400/80 mb-1 block">
                      You = <span className="text-white/70">Add your name</span>
                    </label>
                    <input
                      placeholder={detectedNames[0] || "e.g. Me, Piet, Bestie"}
                      value={userName}
                      onFocus={() => setIsManuallyEditingNames(true)}
                      onChange={(e) => {
                        setIsManuallyEditingNames(true);
                        setUserName(e.target.value);
                      }}
                      className="w-full px-3 py-2 bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-lg text-sm text-white placeholder-gray-400 focus:border-cyan-400/50 focus:outline-none transition-all"
                    />
                    <div className="pt-1">
                      <PronounSelector
                        label="Pronouns"
                        value={userPronouns}
                        onChange={(value) => setUserPronouns(prev => prev === value ? '' : value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-cyan-400/80 mb-1 block">
                      Them = <span className="text-white/70">
                        {detectedNames.length > 0 && detectedNames[0] !== userName
                          ? `${detectedNames.find(n => n !== userName) || detectedNames[0]} (auto-detected)`
                          : 'Add their name'}
                      </span>
                    </label>
                    <input
                      placeholder={detectedNames.find(n => n !== userName) || detectedNames[0] || "e.g. Them, Bani, Tyler"}
                      value={otherName}
                      onFocus={() => setIsManuallyEditingNames(true)}
                      onChange={(e) => {
                        setIsManuallyEditingNames(true);
                        setOtherName(e.target.value);
                      }}
                      className="w-full px-3 py-2 bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-lg text-sm text-white placeholder-gray-400 focus:border-cyan-400/50 focus:outline-none transition-all"
                    />
                    <div className="pt-1">
                      <PronounSelector
                        label="Pronouns"
                        value={otherPronouns}
                        onChange={(value) => setOtherPronouns(prev => prev === value ? '' : value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-cyan-400/20">
                  <button
                    onClick={() => {
                      setNamesConfirmed(true);
                      setShowNameEditor(false);
                    }}
                    className="text-[10px] text-cyan-400/80 hover:text-cyan-300 transition-colors px-3 py-1.5 rounded hover:bg-cyan-500/10"
                  >
                    ✓ Done
                  </button>
                  <button
                    onClick={() => {
                      setUserName('');
                      setOtherName('');
                      setUserPronouns('');
                      setOtherPronouns('');
                      setNamesConfirmed(false);
                      setShowNameEditor(false);
                    }}
                    className="text-[10px] text-gray-400 hover:text-gray-300 transition-colors px-3 py-1.5 rounded hover:bg-white/5"
                  >
                    Reset to defaults
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Who Are You? - Shows after relationship type selected - ALWAYS EDITABLE */}
          {(texts.trim() || extractedTexts.length > 0) && contextType && !showNameEditor && detectedNames.length >= 2 && !userName && (
            <div className="px-4 mb-2 flex-shrink-0">
              <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-cyan-400/30 p-3 mb-2">
                <p className="text-xs font-medium mb-2 flex items-center gap-1.5 text-white">
                  <Sparkles className="w-3.5 h-3.5" />
                  We found: {detectedNames.join(' and ')}
                </p>
                <p className="text-[10px] text-white/70 mb-3">
                  Which person are you? We'll auto-fill the other name.
                </p>
                <div className="flex flex-col gap-2">
                  {detectedNames.map((name) => {
                    // 🎯 HIGHLIGHT: If "You" or "Me" is detected and already selected
                    const isAutoSelected = (name === 'You' || name === 'Me') && userName === name;
                    return (
                      <button
                        key={name}
                        onClick={() => {
                          setIsManuallyEditingNames(false); // Reset flag when user clicks
                          setUserName(name);
                          const otherNames = detectedNames.filter(n => n !== name);
                          setOtherName(otherNames[0] || 'Them');
                        }}
                        className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 backdrop-blur-sm border ${
                          isAutoSelected 
                            ? 'bg-cyan-500/20 text-white border-cyan-400/50' 
                            : 'bg-white/5 text-gray-300 border-cyan-400/20 hover:bg-white/10 hover:border-cyan-400/40'
                        }`}
                      >
                        I am {name}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => {
                    setIsManuallyEditingNames(true);
                    setShowNameEditor(true);
                  }}
                  className="mt-2 text-[10px] text-cyan-400/80 hover:text-cyan-300 transition-colors text-center w-full py-1 rounded hover:bg-cyan-500/10"
                >
                  ✏️ Or edit names manually →
                </button>
              </div>
            </div>
          )}
          
          {/* ALWAYS SHOW EDIT OPTION - Even when names are complete and 2+ names detected */}
          {(texts.trim() || extractedTexts.length > 0) && contextType && !showNameEditor && detectedNames.length >= 2 && userName && otherName && namesConfirmed && (
            <div className="px-4 mb-2 flex-shrink-0">
              <button
                onClick={() => setShowNameEditor(true)}
                className="w-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm rounded-lg border border-cyan-400/30 p-2 flex items-center justify-between hover:from-cyan-500/20 hover:to-purple-500/20 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-xs text-white">
                    ✓ You: <span className="font-semibold">{userName}</span> • Them: <span className="font-semibold">{otherName}</span>
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-cyan-400/80 group-hover:text-cyan-300 transition-colors">
                  <span>✏️ Edit</span>
                  <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            </div>
          )}

          {/* Confirmation Question - Shows when names are auto-detected and auto-populated */}
          {(texts.trim() || extractedTexts.length > 0) && contextType && !showNameEditor && userName && otherName && !namesConfirmed && (
            <div className="px-4 mb-2 flex-shrink-0">
              <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-cyan-400/30 p-3 mb-2">
                <p className="text-xs font-medium mb-3 flex items-center gap-1.5 text-white">
                  <Sparkles className="w-3.5 h-3.5" />
                  Is this correct?
                </p>
                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wide">Person 1</span>
                    <span className="text-sm text-white font-semibold">{userName}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wide">Person 2</span>
                    <span className="text-sm text-white font-semibold">{otherName}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNamesConfirmed(true)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Yes, correct
                  </button>
                  <button
                    onClick={() => setShowNameEditor(true)}
                    className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-cyan-400/20 text-cyan-300 rounded-lg text-sm font-medium hover:bg-white/10 hover:border-cyan-400/40 transition-all"
                  >
                    ✏️ Edit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Manual Name Input - If only one name detected or none - STAYS VISIBLE WHILE TYPING - ALWAYS EDITABLE */}
          {(texts.trim() || extractedTexts.length > 0) && contextType && !showNameEditor && detectedNames.length < 2 && (!userName || !otherName) && (
            <div className="px-4 mb-2 flex-shrink-0">
              <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-cyan-400/30 p-3 mb-2">
                <p className="text-xs font-medium mb-2 flex items-center gap-1.5 text-white">
                  <Sparkles className="w-3.5 h-3.5" />
                  Identify who's who
                </p>
                <p className="text-[10px] text-white/70 mb-3">
                  {detectedNames.length > 0 
                    ? `We detected: ${detectedNames.join(', ')}. Please confirm or edit the names below.`
                    : 'Add the names of the people in this conversation.'}
                </p>
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] text-cyan-400/80 mb-1 block">
                      You = <span className="text-white/70">Add your name</span>
                    </label>
                    <input
                      placeholder={detectedNames[0] || "Your name"}
                      value={userName}
                      onFocus={() => setIsManuallyEditingNames(true)}
                      onChange={(e) => {
                        setIsManuallyEditingNames(true);
                        setUserName(e.target.value);
                      }}
                      className="w-full px-3 py-2 bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-lg text-sm text-white placeholder-gray-400 focus:border-cyan-400/50 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-cyan-400/80 mb-1 block">
                      Them = <span className="text-white/70">
                        {detectedNames.length > 0 
                          ? `${detectedNames[0]} (auto-detected)` 
                          : 'Add their name'}
                      </span>
                    </label>
                    <input
                      placeholder={detectedNames[0] || "Their name"}
                      value={otherName}
                      onFocus={() => setIsManuallyEditingNames(true)}
                      onChange={(e) => {
                        setIsManuallyEditingNames(true);
                        setOtherName(e.target.value);
                      }}
                      className="w-full px-3 py-2 bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-lg text-sm text-white placeholder-gray-400 focus:border-cyan-400/50 focus:outline-none transition-all"
                    />
                  </div>
                </div>
                {detectedNames.length > 0 && (
                  <p className="text-[9px] text-cyan-400/60 mt-2 italic">
                    💡 If these names are wrong, edit them above
                  </p>
                )}
                {/* Always show edit option even when both names are filled */}
                {userName && otherName && namesConfirmed && (
                  <button
                    onClick={() => setShowNameEditor(true)}
                    className="mt-2 w-full text-[10px] text-cyan-400/80 hover:text-cyan-300 transition-colors text-center py-1 rounded hover:bg-cyan-500/10"
                  >
                    ✏️ Click to edit names
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* ALWAYS SHOW EDIT OPTION - Even when only 1 name detected and names are complete */}
          {(texts.trim() || extractedTexts.length > 0) && contextType && !showNameEditor && detectedNames.length === 1 && userName && otherName && namesConfirmed && (
            <div className="px-4 mb-2 flex-shrink-0">
              <button
                onClick={() => setShowNameEditor(true)}
                className="w-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm rounded-lg border border-cyan-400/30 p-2 flex items-center justify-between hover:from-cyan-500/20 hover:to-purple-500/20 transition-all group"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-xs text-white">
                    ✓ You: <span className="font-semibold">{userName}</span> • Them: <span className="font-semibold">{otherName}</span>
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-cyan-400/80 group-hover:text-cyan-300 transition-colors">
                  <span>✏️ Edit</span>
                  <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            </div>
          )}

          {/* Confirmation - Shows when names are set and confirmed - ALWAYS EDITABLE WITH CLICK */}
          {(texts.trim() || extractedTexts.length > 0) && contextType && userName && otherName && !showNameEditor && namesConfirmed && (
            <div className="px-4 mb-2 flex-shrink-0">
              <div 
                onClick={() => setShowNameEditor(true)}
                className="bg-emerald-500/20 border border-emerald-400/30 rounded-lg p-2 flex items-center justify-between cursor-pointer hover:bg-emerald-500/30 transition-all group"
              >
                <div className="flex items-center gap-2 flex-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-xs text-white">
                    ✓ You: <span className="font-semibold">{userName}</span> • Them: <span className="font-semibold">{otherName}</span>
                    {detectedNames.includes(otherName) && (
                      <span className="text-[9px] text-emerald-400/70 ml-1">(auto-detected)</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400/80 group-hover:text-emerald-300 transition-colors">
                  <span>✏️ Edit</span>
                  <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button - Fixed at bottom, always visible */}
          <div className="px-4 pb-4 pt-2 flex-shrink-0 space-y-1.5 border-t border-white/5">
            <button
              onClick={handleAnalyze}
              disabled={isLoading || (!texts.trim() && extractedTexts.length === 0) || !contextType}
              className="w-full bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-[length:200%_100%] hover:bg-[length:200%_100%] animate-gradient text-black font-black text-base py-4 rounded-xl shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 z-10 relative"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </div>
              ) : (
                'Get Receipt →'
              )}
            </button>
            <p className="text-[10px] text-gray-500 text-center">
              For 16+ Entertainment Purposes Only
            </p>
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="text-center space-y-4">
              <RotatingAnalysisText />
              <ProcessingAnimation />
            </div>
          </motion.div>
        )}

        {/* Gradient Animation */}
        <style>{`
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-gradient {
            animation: gradient 3s ease infinite;
          }
        `}</style>
      </div>
    );
  }

  // Desktop/Web version (existing code)
  return (
    <div className="min-h-screen relative overflow-hidden text-white flex flex-col">
      {/* Deep Charcoal Background - Glassmorphism Optimized */}
      <div className="absolute inset-0 bg-[#0F0F0F]" />
      
      {/* Subtle Depth with Cyan Accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5" />
      
      {/* Glassmorphism Glow Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,229,255,0.08),rgba(168,85,247,0.05),rgba(255,255,255,0.02))] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col flex-1">
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
        {/* Main Card */}
        <div className="bg-white/8 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-cyan-400/30 shadow-2xl shadow-cyan-500/20">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
              New <span className="text-cyan-400">Receipt</span>
            </h1>
            <p className="text-gray-300 text-sm">
              Decode your conversation. Get the receipts.
            </p>
          </div>


          {/* Anonymous User Status */}
          {!user && anonymousStatus && (
            <div className="mb-6 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border border-cyan-400/30 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-sm font-medium text-cyan-300">
                      {anonymousStatus.remainingAnalyses > 0 
                        ? `Free Analysis: ${anonymousStatus.remainingAnalyses} remaining`
                        : 'Free analysis used up'
                      }
                    </p>
                    <p className="text-xs text-cyan-400/80">
                      {anonymousStatus.remainingAnalyses > 0 
                        ? 'Sign up for unlimited analysis + daily credits'
                        : 'Sign up now for unlimited analysis'
                      }
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => openModal()}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm font-medium rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all duration-200 flex items-center gap-2"
                >
                  <Crown className="w-4 h-4" />
                  Sign Up
                </button>
              </div>
            </div>
          )}

          {/* Input Tabs - Vertical on mobile, horizontal on desktop */}
          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full sm:flex-1 py-3 px-4 rounded-lg flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30' 
                    : 'bg-white/5 backdrop-blur-sm text-gray-300 hover:bg-white/10 border border-cyan-400/20'
                }`}
              >
                <div className="flex items-center gap-2">
                <tab.icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium text-center">{tab.label}</span>
                </div>
                {tab.description && (
                  <span className="text-xs opacity-70 text-center">{tab.description}</span>
                )}
              </button>
            ))}
          </div>

          {/* Dynamic Input Area */}
          <div className="mb-6">
            {activeTab === 'story' && (
              <div>
                <textarea
                  value={texts}
                  onChange={handleTextChange}
                  placeholder="Paste your formatted chat (Name: message) OR tell your story in your own words.

For chat: Copy and paste exactly as it appears
Alex: Hey, how are you?
You: I'm good, thanks!

For story: Write naturally using 'I' for yourself
I've been seeing Alex for 3 months. Last week they said they wanted to be exclusive, but yesterday I saw them active on dating apps at 2am..."
                  className="w-full h-48 p-4 text-sm bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-xl focus:border-cyan-400/50 focus:outline-none transition-all duration-300 resize-none text-white placeholder-gray-400"
                />
                <SmartCharacterCounter count={texts.length} limit={10000} />
                <ConversationTips />
                
                {/* 🎯 INLINE NAME SELECTION - Shows when names detected but not auto-selected */}
                {/* 🚫 PREVENT UI JUMPING: Keep section visible even when user is typing */}
                <AnimatePresence>
                  {detectedNames.length > 0 && (!namesConfirmed || (!userName && !otherName) || isManuallyEditingNames || (!userName || !otherName)) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-cyan-400/30"
                    >
                      <p className="text-sm font-medium mb-3 flex items-center gap-2 text-white">
                        <Sparkles className="w-4 h-4" />
                        I found these names: {detectedNames.join(' and ')}
                      </p>
                      
                      {/* Confirmation Question - Shows when both names are filled but not confirmed */}
                      {userName && otherName && !namesConfirmed ? (
                        <div>
                          <p className="text-xs font-medium mb-3 text-white">Is this correct?</p>
                          <div className="space-y-2 mb-3">
                            <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                              <span className="text-[10px] text-gray-400 uppercase tracking-wide">Person 1</span>
                              <span className="text-sm text-white font-semibold">{userName}</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                              <span className="text-[10px] text-gray-400 uppercase tracking-wide">Person 2</span>
                              <span className="text-sm text-white font-semibold">{otherName}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setNamesConfirmed(true)}
                              className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Yes, correct
                            </button>
                            <button
                              onClick={() => setShowNameEditor(true)}
                              className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-cyan-400/20 text-cyan-300 rounded-lg text-sm font-medium hover:bg-white/10 hover:border-cyan-400/40 transition-all"
                            >
                              ✏️ Edit
                            </button>
                          </div>
                        </div>
                      ) : detectedNames.length >= 2 ? (
                        <div className="space-y-2">
                          <p className="text-xs text-white/80 mb-2">Which person are you?</p>
                          {detectedNames.map((name, index) => (
                            <label key={name} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors">
                              <input 
                                type="radio" 
                                name="userRole"
                                value={name}
                                checked={userName === name}
                                onChange={(e) => {
                                  setUserName(name);
                                  setOtherName(detectedNames[1 - index]); // Set the other name
                                  setNamesConfirmed(false);
                                }}
                                className="text-cyan-500"
                              />
                              <span className="text-sm text-white">I am {name}</span>
                            </label>
                          ))}
                          <button
                            onClick={() => setShowNameEditor(true)}
                            className="mt-2 w-full text-[10px] text-cyan-400/80 hover:text-cyan-300 transition-colors text-center py-1 rounded hover:bg-cyan-500/10"
                          >
                            ✏️ Or edit names manually →
                          </button>
                        </div>
                      ) : (
                        <div>
                          <div className="grid grid-cols-2 gap-3 mb-2">
                            <div>
                              <label className="text-[10px] text-cyan-400/80 mb-1 block">
                                Person 1 (You)
                              </label>
                              <input
                                placeholder="You/Person 1"
                                className="w-full p-2 bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-lg text-sm text-white placeholder-gray-400 focus:border-cyan-400/50 focus:outline-none transition-all duration-300"
                                value={userName}
                                onFocus={() => setIsManuallyEditingNames(true)}
                                onChange={(e) => {
                                  setIsManuallyEditingNames(true);
                                  setUserName(e.target.value);
                                  setNamesConfirmed(false);
                                }}
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-cyan-400/80 mb-1 block">
                                Person 2 (Them)
                              </label>
                              <input
                                placeholder={detectedNames[0] || "Them/Person 2"}
                                className="w-full p-2 bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-lg text-sm text-white placeholder-gray-400 focus:border-cyan-400/50 focus:outline-none transition-all duration-300"
                                value={otherName}
                                onFocus={() => setIsManuallyEditingNames(true)}
                                onChange={(e) => {
                                  setIsManuallyEditingNames(true);
                                  setOtherName(e.target.value);
                                  setNamesConfirmed(false);
                                }}
                              />
                            </div>
                          </div>
                          {userName && otherName && (
                            <button
                              onClick={() => setNamesConfirmed(true)}
                              className="w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Confirm names
                            </button>
                          )}
                          <button
                            onClick={() => setShowNameEditor(true)}
                            className="mt-2 w-full text-[10px] text-cyan-400/80 hover:text-cyan-300 transition-colors text-center py-1 rounded hover:bg-cyan-500/10"
                          >
                            ✏️ Or edit names manually →
                          </button>
                        </div>
                      )}
                      
                      {/* Always show edit option when names are confirmed */}
                      {userName && otherName && namesConfirmed && (
                        <button
                          onClick={() => setShowNameEditor(true)}
                          className="mt-2 w-full text-[10px] text-cyan-400/80 hover:text-cyan-300 transition-colors text-center py-1 rounded hover:bg-cyan-500/10"
                        >
                          ✏️ Click to edit names
                        </button>
                      )}
                    </motion.div>
                  )}
                  
                  {/* 🎯 AUTO-SELECTED CONFIRMATION - Shows when "Me" is auto-selected */}
                  {userName === 'Me' && detectedNames.includes('Me') && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 p-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-sm rounded-lg border border-emerald-400/30 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm text-white">
                        ✓ You're <span className="font-semibold">Me</span>, they're <span className="font-semibold">{otherName || 'Them'}</span>
                      </span>
                      <button
                        onClick={() => {
                          setShowNameEditor(true);
                        }}
                        className="ml-auto text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        Edit names
                      </button>
                    </motion.div>
                  )}

                  {/* 🎯 NAME CONFIRMATION - Shows when names are set and confirmed (not "Me") */}
                  {userName && otherName && userName !== 'Me' && namesConfirmed && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 p-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-sm rounded-lg border border-emerald-400/30 flex items-center gap-2 cursor-pointer hover:from-emerald-500/30 hover:to-cyan-500/30 transition-all group"
                      onClick={() => setShowNameEditor(true)}
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm text-white flex-1">
                        ✓ You: <span className="font-semibold">{userName}</span> • Them: <span className="font-semibold">{otherName}</span>
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-cyan-400/80 group-hover:text-cyan-300 transition-colors">
                        <span>✏️ Edit</span>
                        <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 🎯 NAME EDITOR - Full editor with pronouns (Desktop) */}
                {showNameEditor && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-cyan-400/30"
                  >
                    <p className="text-sm font-medium mb-3 text-white">Customize how names appear on the receipt</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wide text-gray-400">You</label>
                        <input
                          placeholder="e.g. Me, Piet, Bestie"
                          value={userName}
                          onFocus={() => setIsManuallyEditingNames(true)}
                          onChange={(e) => {
                            setIsManuallyEditingNames(true);
                            setUserName(e.target.value);
                          }}
                          className="w-full px-3 py-2 bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-lg text-sm text-white placeholder-gray-400 focus:border-cyan-400/50 focus:outline-none transition-all"
                        />
                        <PronounSelector
                          label="Pronouns"
                          value={userPronouns}
                          onChange={(value) => setUserPronouns(prev => prev === value ? '' : value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wide text-gray-400">Them</label>
                        <input
                          placeholder="e.g. Them, Bani, Situationship"
                          value={otherName}
                          onFocus={() => setIsManuallyEditingNames(true)}
                          onChange={(e) => {
                            setIsManuallyEditingNames(true);
                            setOtherName(e.target.value);
                          }}
                          className="w-full px-3 py-2 bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-lg text-sm text-white placeholder-gray-400 focus:border-cyan-400/50 focus:outline-none transition-all"
                        />
                        <PronounSelector
                          label="Pronouns"
                          value={otherPronouns}
                          onChange={(value) => setOtherPronouns(prev => prev === value ? '' : value)}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <button
                        onClick={() => setShowNameEditor(false)}
                        className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        Done
                      </button>
                      <button
                        onClick={() => {
                          setUserName('');
                          setOtherName('');
                          setUserPronouns('');
                          setOtherPronouns('');
                          setShowNameEditor(false);
                        }}
                        className="text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        Use defaults
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
            
            {activeTab === 'screenshot' && (
              <div>
                <ImageUpload 
                  onTextExtracted={(text) => {
                    setExtractedTexts(prev => [...prev, text]);
                    setShowColorHelper(true);
                    // Auto-detect names from extracted text
                    const names = detectNames(text);
                    if (names.length > 0) {
                      setDetectedNames(names);
                      // Auto-select "Me" if detected
                      if (names.includes('Me')) {
                        setUserName('Me');
                        const otherNames = names.filter(name => name !== 'Me');
                        if (otherNames.length > 0) {
                          setOtherName(otherNames[0]);
                        }
                      }
                    }
                  }}
                  maxFiles={5}
                />
                
                <AnimatePresence>
                  {showColorHelper && extractedTexts.length > 0 && (
                    <ColorMappingHelper 
                      onColorMapping={(mapping) => {
                        setColorMapping(mapping);
                        // Parse color mapping to set names if provided
                        if (mapping.includes('=')) {
                          const parts = mapping.split(',');
                          parts.forEach(part => {
                            const [color, name] = part.split('=').map(s => s.trim());
                            if (color && name) {
                              if (color.toLowerCase().includes('blue') && !userName) {
                                setUserName(name);
                              } else if (color.toLowerCase().includes('gray') && !otherName) {
                                setOtherName(name);
                              }
                            }
                          });
                        }
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* 🎯 NAME EDITING FOR SCREENSHOTS - Desktop version */}
                {extractedTexts.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-cyan-400/30"
                  >
                    {!showNameEditor ? (
                      <>
                        <p className="text-sm font-medium mb-3 flex items-center gap-2 text-white">
                          <Sparkles className="w-4 h-4" />
                          Who is who in these screenshots?
                        </p>
                        
                        {/* Show detected names with selection */}
                        {detectedNames.length >= 2 && !userName ? (
                          <div className="space-y-2 mb-3">
                            <p className="text-xs text-white/80 mb-2">Which person are you?</p>
                            {detectedNames.map((name, index) => (
                              <label key={name} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors">
                                <input 
                                  type="radio" 
                                  name="userRoleScreenshot"
                                  value={name}
                                  checked={userName === name}
                                  onChange={(e) => {
                                    setUserName(name);
                                    setOtherName(detectedNames[1 - index]);
                                  }}
                                  className="text-cyan-500"
                                />
                                <span className="text-sm text-white">I am {name}</span>
                              </label>
                            ))}
                          </div>
                        ) : (
                          /* Manual input if names not detected */
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <input
                              placeholder="You/Person 1"
                              value={userName}
                              onFocus={() => setIsManuallyEditingNames(true)}
                              onChange={(e) => {
                                setIsManuallyEditingNames(true);
                                setUserName(e.target.value);
                              }}
                              className="p-2 bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-lg text-sm text-white placeholder-gray-400 focus:border-cyan-400/50 focus:outline-none transition-all duration-300"
                            />
                            <input
                              placeholder="Them/Person 2"
                              value={otherName}
                              onFocus={() => setIsManuallyEditingNames(true)}
                              onChange={(e) => {
                                setIsManuallyEditingNames(true);
                                setOtherName(e.target.value);
                              }}
                              className="p-2 bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-lg text-sm text-white placeholder-gray-400 focus:border-cyan-400/50 focus:outline-none transition-all duration-300"
                            />
                          </div>
                        )}

                        {/* Show confirmation when names are set */}
                        {userName && otherName ? (
                          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-sm rounded-lg border border-emerald-400/30">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                              <span className="text-sm text-white">
                                ✓ You: <span className="font-semibold">{userName}</span> • Them: <span className="font-semibold">{otherName}</span>
                              </span>
                            </div>
                            <button
                              onClick={() => setShowNameEditor(true)}
                              className="text-xs text-gray-400 hover:text-white transition-colors"
                            >
                              Edit names
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowNameEditor(true)}
                            className="w-full mt-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm text-cyan-300 border border-cyan-400/30 hover:from-cyan-500/30 hover:to-purple-500/30 active:scale-95"
                          >
                            ✏️ Set names →
                          </button>
                        )}
                      </>
                    ) : (
                      /* Full name editor with pronouns */
                      <>
                        <p className="text-sm font-medium mb-3 text-white">Customize how names appear on the receipt</p>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wide text-gray-400">You</label>
                            <input
                              placeholder="e.g. Me, Piet, Bestie"
                              value={userName}
                              onChange={(e) => setUserName(e.target.value)}
                              className="w-full px-3 py-2 bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-lg text-sm text-white placeholder-gray-400 focus:border-cyan-400/50 focus:outline-none transition-all"
                            />
                            <PronounSelector
                              label="Pronouns"
                              value={userPronouns}
                              onChange={(value) => setUserPronouns(prev => prev === value ? '' : value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wide text-gray-400">Them</label>
                            <input
                              placeholder="e.g. Them, Bani, Situationship"
                              value={otherName}
                              onChange={(e) => setOtherName(e.target.value)}
                              className="w-full px-3 py-2 bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-lg text-sm text-white placeholder-gray-400 focus:border-cyan-400/50 focus:outline-none transition-all"
                            />
                            <PronounSelector
                              label="Pronouns"
                              value={otherPronouns}
                              onChange={(value) => setOtherPronouns(prev => prev === value ? '' : value)}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => setShowNameEditor(false)}
                            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                          >
                            Done
                          </button>
                          <button
                            onClick={() => {
                              setUserName('');
                              setOtherName('');
                              setUserPronouns('');
                              setOtherPronouns('');
                              setShowNameEditor(false);
                            }}
                            className="text-xs text-gray-400 hover:text-white transition-colors"
                          >
                            Use defaults
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </div>
            )}
          </div>


          {/* Relationship Type */}
          <div className="mb-6">
            <p className="text-sm text-white/60 mb-4 text-center">
              What type of relationship?
            </p>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {relationshipTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setContextType(type.toLowerCase())}
                  className={`p-2 sm:p-3 rounded-lg transition-all duration-300 text-xs sm:text-sm font-medium ${
                    contextType === type.toLowerCase()
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30'
                      : 'bg-white/5 backdrop-blur-sm text-gray-300 hover:bg-white/10 border border-cyan-400/20'
                  }`}
                  disabled={isLoading}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Optional: Pronouns and Context - Collapsed by default */}
          <div className="mb-6 space-y-3">
                  <details className="group">
              <summary className="text-sm text-white/60 cursor-pointer hover:text-white/80 transition-colors duration-300 flex items-center gap-2">
                      <span>👤</span>
                      Add pronouns (optional)
                <ChevronDown className="h-4 w-4 opacity-60 group-open:rotate-180 transition-transform duration-200 ml-auto" />
                    </summary>
              <div className="mt-3 grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                      <PronounSelector 
                        label="You" 
                        value={userPronouns}
                        onChange={setUserPronouns}
                      />
                      <PronounSelector 
                        label="Them" 
                        value={otherPronouns}
                        onChange={setOtherPronouns}
                      />
                    </div>
                  </details>

            <details className="group">
              <summary className="text-sm text-white/60 cursor-pointer hover:text-white/80 transition-colors duration-300 flex items-center gap-2">
                <span>💡</span>
                Add context (optional)
                <ChevronDown className="h-4 w-4 opacity-60 group-open:rotate-180 transition-transform duration-200 ml-auto" />
              </summary>
              <div className="mt-3 p-4 bg-white/5 rounded-lg border border-white/10">
                  <input 
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="e.g., 'We've been dating 3 months' or 'My ex from last year'"
                    className="w-full px-3 py-2 bg-white/5 backdrop-blur-sm rounded-lg text-sm text-white placeholder-gray-400 border border-cyan-400/20 focus:border-cyan-400/50 focus:outline-none transition-all duration-300"
                  />
              </div>
            </details>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-2xl shadow-cyan-500/40 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Analyzing...</span>
              </div>
            ) : (
              'Get Your Receipts Now →'
            )}
          </button>

          {/* Age & Terms Disclaimer - Subtle, below submit button */}
          <p className="text-xs text-gray-500 text-center mt-3 mb-2">
            By continuing, you confirm you are 16+ and agree to our{' '}
            <Link to="/privacy-policy" className="text-gray-400 hover:text-cyan-400 transition-colors underline underline-offset-2">
              Privacy Policy
            </Link>
            {' '}and{' '}
            <Link to="/terms-of-service" className="text-gray-400 hover:text-cyan-400 transition-colors underline underline-offset-2">
              Terms of Service
            </Link>
          </p>

          {/* Enhanced Loading Animation */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-6 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-emerald-500/10 rounded-2xl border border-cyan-400/30 backdrop-blur-sm"
            >
              <div className="text-center">
                {/* Cute Processing Animation */}
                <div className="mb-6">
                  <ProcessingAnimation />
                </div>
                
                {/* Rotating Analysis Steps - Only 2 lines visible at a time */}
                <div className="text-cyan-200 font-medium mb-2 min-h-[60px] flex flex-col justify-center">
                  <RotatingAnalysisText />
                </div>
                
                {/* Fixed bottom line */}
                <div className="text-xs text-cyan-400 mt-3">
                  This usually takes 30-60 seconds ⏳
                </div>
              </div>
            </motion.div>
          )}
        </div>
        </motion.div>
      </div>

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
          <p className="text-gray-500 text-xs mb-2">For 16+ Entertainment Purposes Only</p>
          
          {/* Copyright */}
          <p className="text-gray-500 text-xs mb-2">© 2025 Get The Receipts. All rights reserved.</p>
          
          {/* Support */}
          <p className="text-gray-500 text-xs">
            Support: <a href="mailto:support@getthereceipts.com" className="text-gray-400 hover:text-white transition-colors">support@getthereceipts.com</a>
          </p>
        </div>
      </footer>

      {/* Receipt Generation Limit Modal - Refined with Emergency Pack + $4.99 Focus */}
      <AnimatePresence>
        {showLimitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLimitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-2 border-cyan-400/40 rounded-3xl p-6 sm:p-8 max-w-md w-full mx-4 shadow-2xl shadow-cyan-500/30"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowLimitModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/30 via-purple-500/30 to-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-cyan-400/50 animate-pulse">
                    <span className="text-4xl">🆘</span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Need answers now? 🔥
                </h2>

                {/* Description */}
                <p className="text-gray-300 mb-6 leading-relaxed text-sm sm:text-base">
                  You've used your free receipts. Get instant access to more insights!
                </p>

                {/* Primary CTA: Emergency Pack - LARGER, MORE PROMINENT */}
                <div className="space-y-3 mb-4">
                  <button
                    onClick={() => {
                      setShowLimitModal(false);
                      if (user) {
                        handleCheckout('price_1SRl6hG71EqeOEZebPJkKJB6', 'Emergency Pack x5');
                      } else {
                        openModal('sign_up');
                        toast({ 
                          title: 'Create an account to upgrade!', 
                          description: 'Sign up to unlock premium features and get receipts.'
                        });
                      }
                    }}
                    disabled={loadingPriceId === 'price_1SRl6hG71EqeOEZebPJkKJB6'}
                    className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 hover:from-cyan-600 hover:via-purple-600 hover:to-cyan-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group text-base sm:text-lg"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loadingPriceId === 'price_1SRl6hG71EqeOEZebPJkKJB6' ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-xl">🆘</span>
                          <span>Get 5 More Receipts - $0.99</span>
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  </button>
                  <p className="text-xs text-gray-400 -mt-2">
                    Instant access, no commitment • 5 receipts + 40 chats each
                  </p>
                </div>
                  
                {/* Secondary CTA: $4.99 Monthly - Clear Value Prop */}
                <div className="space-y-3 mb-4">
                  <button
                    onClick={() => {
                      setShowLimitModal(false);
                      if (user) {
                        handleCheckout('price_1SI49tG71EqeOEZe0p9LNpbP', 'Premium Monthly');
                      } else {
                        openModal('sign_up');
                        toast({ 
                          title: 'Create an account to upgrade!', 
                          description: 'Sign up to unlock premium features and get receipts.'
                        });
                      }
                    }}
                    disabled={loadingPriceId === 'price_1SI49tG71EqeOEZe0p9LNpbP'}
                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loadingPriceId === 'price_1SI49tG71EqeOEZe0p9LNpbP' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Crown className="w-5 h-5" />
                        <span>Unlimited Access - $4.99/month</span>
                      </>
                    )}
                  </button>
                  <p className="text-xs text-gray-400 -mt-2">
                    Best value for regular users • Unlimited receipts + 40 chats each
                  </p>
                </div>

                {/* Tertiary: Sign Up (if anonymous) - Smaller, Less Prominent */}
                {!user && (
                  <div className="mb-4">
                    <button
                      onClick={() => {
                        setShowLimitModal(false);
                        openModal('sign_up');
                      }}
                      className="w-full bg-white/5 hover:bg-white/10 border border-white/20 text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-300 text-sm"
                    >
                      🆓 Sign Up for Free Credits
                    </button>
                  </div>
                )}

                {/* Dismiss */}
                  <button
                    onClick={() => setShowLimitModal(false)}
                  className="w-full text-gray-400 hover:text-white transition-colors duration-300 py-2 text-sm"
                  >
                    Maybe Later
                  </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      </div>
    </div>
  );
};

export default LuxeChatInputPage;
