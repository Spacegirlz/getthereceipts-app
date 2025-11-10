import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Type, Camera, ChevronDown, User, Crown, AlertCircle } from 'lucide-react';
import InputTabs from '@/components/InputTabs';
import SmartCharacterCounter from '@/components/SmartCharacterCounter';
import ColorMappingHelper from '@/components/ColorMappingHelper';
import PronounSelector from '@/components/PronounSelector';
import ImageUpload from '@/components/ImageUpload';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { usePerfTimer } from '@/hooks/usePerfTimer';
import { FreeUsageService } from '@/lib/services/freeUsageService';

const ChatInputPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { openModal } = useAuthModal();
  const perf = usePerfTimer();
  
  // State Management
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState('text');
  const [texts, setTexts] = useState('');
  const [contextType, setContextType] = useState('');
  const [detectedNames, setDetectedNames] = useState([]);
  const [userName, setUserName] = useState('');
  const [otherName, setOtherName] = useState('');
  const [userPronouns, setUserPronouns] = useState('');
  const [otherPronouns, setOtherPronouns] = useState('');
  const [showColorHelper, setShowColorHelper] = useState(false);
  const [colorMapping, setColorMapping] = useState('');
  const [extractedTexts, setExtractedTexts] = useState([]);
  const [context, setContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [anonymousStatus, setAnonymousStatus] = useState(null);
  const [showLimitModal, setShowLimitModal] = useState(false);

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

  // Auto-detect names from conversation
  const detectNames = (text) => {
    try {
      // Handle edge cases
      if (!text || typeof text !== 'string') {
        return [];
      }
      
      // Limit text length to prevent performance issues
      const limitedText = text.length > 10000 ? text.substring(0, 10000) : text;
      const speakers = new Set();
      
      // Handle both line-break separated and single-line conversations
      const hasLineBreaks = limitedText.includes('\n');
      
      if (hasLineBreaks) {
        // Original logic for line-break separated messages
        const lines = limitedText.split('\n');
        console.log('🔍 Using line-break logic, found', lines.length, 'lines');
        
        // Process all lines, but also check the entire text for names in case of splitting issues
        lines.forEach((line, index) => {
          // More robust name detection pattern - handles various formats
          const patterns = [
            /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*):/,  // "Jess:", "Tom:"
            /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*\([^)]+\):/,  // "Jess (10:30 PM):"
            /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*:/  // "Jess :" (with spaces)
          ];
          
          for (const pattern of patterns) {
            const match = line.match(pattern);
            if (match) {
              const name = match[1].trim();
              // Filter out common false positives
              if (!['Me', 'You', 'Them', 'User', 'Other', 'Person'].includes(name)) {
                speakers.add(name);
              }
              break; // Stop after first match
            }
          }
        });
        
        // FALLBACK: If we didn't find enough names from lines, search the entire text
        if (speakers.size < 2) {
          console.log('🔍 Fallback: Searching entire text for names');
          const globalPatterns = [
            /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*):/g,  // Global match for all "Name:" patterns
            /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*\([^)]+\):/g,  // "Name (time):" patterns
          ];
          
          for (const pattern of globalPatterns) {
            let match;
            while ((match = pattern.exec(limitedText)) !== null) {
              const name = match[1].trim();
              if (!['Me', 'You', 'Them', 'User', 'Other', 'Person'].includes(name)) {
                if (!speakers.has(name)) {  // Only add if not already present
                  speakers.add(name);
                  console.log('✅ Added name from fallback:', name);
                }
              }
            }
          }
        }
      } else {
        // NEW: Handle single-line conversations like "Jess: text Tom: text Jess: text"
        console.log('🔍 Single-line detection - input text:', limitedText.substring(0, 300));
        const patterns = [
          /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*):/g,  // Global match for all "Name:" patterns
          /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*\([^)]+\):/g,  // "Name (time):" patterns
        ];
        
        for (const pattern of patterns) {
          let match;
          while ((match = pattern.exec(limitedText)) !== null) {
            const name = match[1].trim();
            console.log('🔍 Found potential name:', name);
            // Filter out common false positives
            if (!['Me', 'You', 'Them', 'User', 'Other', 'Person'].includes(name)) {
              if (!speakers.has(name)) {  // Only add if not already present
                speakers.add(name);
                console.log('✅ Added name to speakers:', name);
              }
            } else {
              console.log('❌ Filtered out name:', name);
            }
          }
        }
      }
      
      return Array.from(speakers).slice(0, 2);
    } catch (error) {
      console.warn('Error detecting names:', error);
      return [];
    }
  };

  // Handle text change
  const handleTextChange = (e) => {
    const newText = e.target.value.slice(0, 5000);
    setTexts(newText);
    
    // Auto-detect names but don't auto-populate - let user review in step 2
    const names = detectNames(newText);
    console.log('🔍 Name detection debug:', {
      inputText: newText.substring(0, 200),
      detectedNames: names,
      hasLineBreaks: newText.includes('\n'),
      textLength: newText.length
    });
    if (names.length > 0) {
      setDetectedNames(names);
      // Don't auto-populate - let user review and choose in the "Who's who?" section
    }
  };

  // Handle analyze click
  const handleAnalyze = () => {
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
    
    // Always go to step 2 first (name collection) - same as screenshot option
    if (step === 1) {
      setStep(2);
    } else {
      // We're on step 2 - check if user has selected their name
      if (!userName || !otherName) {
        toast({
          title: 'Name Selection Required',
          description: 'Please select which person you are in the conversation before continuing.'
        });
        return;
      }
      // User has selected names - submit the analysis
      submitAnalysis();
    }
  };

  const submitAnalysis = async () => {
    // 🚨 RACE CONDITION PROTECTION: Prevent multiple simultaneous submissions
    if (isLoading) {
      console.warn('Analysis already in progress, ignoring duplicate request');
      return;
    }
    
    setIsLoading(true);
    
    try {
      perf.mark('total');
      perf.mark('credit_check');
      // 🔐 CREDIT CHECK: Verify user can perform analysis
      const { AnonymousUserService } = await import('@/lib/services/anonymousUserService');
      const { FreeUsageService } = await import('@/lib/services/freeUsageService');
      const { getUserCredits, deductCredits } = await import('@/lib/services/creditsSystem');
      
      let canProceed = false;
      let creditMessage = '';
      let creditCheckResult = null;
      
      if (user) {
        // Logged-in user: check subscription status
        const userCredits = await getUserCredits(user.id);
        const isPaid = (userCredits.subscription === 'premium' || userCredits.subscription === 'yearly' || userCredits.subscription === 'founder' || userCredits.subscription === 'lifetime');
        const isTrial = userCredits.subscription === 'premium_trial' && userCredits.is_trial_active;
        
        if (isPaid || isTrial) {
          canProceed = true;
          if (isTrial) {
            const daysLeft = Math.ceil((new Date(userCredits.trial_end) - new Date()) / (1000 * 60 * 60 * 24));
            creditMessage = `Premium trial - ${daysLeft} days left`;
          } else {
            creditMessage = 'Premium user - unlimited analysis';
          }
        } else {
          // Free user: enforce caps using client-side service
          const starterUsed = FreeUsageService.getStarterUsed(user.id);
          if (starterUsed < 3) {
            const r = FreeUsageService.checkAndIncrementStarterReceipt(user.id);
            canProceed = r.allowed;
            creditMessage = r.allowed ? `Free starter receipt used (${3 - starterUsed - 1} left)` : 'Starter receipts exhausted';
          } else {
            // Daily limit: 1 per UTC day
            const r = FreeUsageService.checkAndIncrementDailyReceipt(user.id);
            canProceed = r.allowed;
            creditMessage = r.allowed ? 'Free daily receipt granted' : 'Daily limit reached. Come back after midnight (UTC).';
          }
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
        
        // For anonymous users, show a modal instead of toast
        if (!user && creditCheckResult.reason === 'limit_reached') {
          setShowLimitModal(true);
        } else {
          // For logged-in users, show simple toast
          toast({
            variant: 'destructive',
            title: 'Analysis Limit Reached',
            description: creditMessage
          });
        }
        return;
      }
      
      const creditMs = perf.end('credit_check');
      console.log('✅ Credit check passed:', creditMessage, `(${Math.round(creditMs)}ms)`);
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
        extractedTexts: extractedTexts,
        
        // Auto-detected data - PROPERLY TAGGED
        detectedNames: detectedNames,
        
        // Input method - PROPERLY TAGGED
        inputMethod: activeTab,
        
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
      perf.mark('import_analysis');
      const { generateAlignedResults } = await import('@/lib/analysis/advancedAnalysis');
      perf.end('import_analysis');
      
      // Call the real analysis API with all inputs
      const analysisResult = await perf.measure('api_analysis', () => generateAlignedResults(message, analysisContext));
      
      console.log('✅ Analysis complete:', analysisResult);
      
      // 🔐 DEDUCT CREDITS: After successful analysis
      perf.mark('deduct');
      if (user) {
        // Check if user is on trial or paid (no deduction needed)
        const userCredits = await getUserCredits(user.id);
        const isPaid = (userCredits.subscription === 'premium' || userCredits.subscription === 'yearly' || userCredits.subscription === 'founder' || userCredits.subscription === 'lifetime');
        const isTrial = userCredits.subscription === 'premium_trial' && userCredits.is_trial_active;
        
        if (isPaid || isTrial) {
          console.log('✅ Premium/Trial user - no credit deduction needed');
        } else {
          // Free user: Credit already deducted in client-side service
          console.log('✅ Free user credit already deducted in client-side service');
        }
      } else {
        // Anonymous user: Credit already deducted in atomic operation
        console.log('✅ Anonymous analysis count already updated in atomic operation');
      }
      perf.end('deduct');
      
      // Navigate to results with real analysis data
      perf.mark('navigate');
      navigate('/receipts', { 
        state: { 
          analysis: analysisResult,
          originalMessage: message,
          context: analysisContext
        } 
      });
      perf.end('navigate');
      
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Please try again. If the problem persists, contact support.'
      });
    } finally {
      perf.end('total');
      perf.report('ChatInput');
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'text', label: 'Text Input', icon: Type },
    { id: 'screenshot', label: 'Screenshot', icon: Camera }
  ];

  const relationshipTypes = ['Dating', 'Situationship', 'Marriage', 'Friend', 'Work', 'Family'];

  return (
    <ErrorBoundary>
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
              Decode Your <span className="text-cyan-400">Conversation</span>
            </h1>
            <p className="text-gray-300 text-sm">
              Paste your texts. Get clarity in seconds.
            </p>
          </div>


          {userName && otherName && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-green-900/20 rounded-lg border border-green-500/30"
            >
              <p className="text-sm text-green-300 flex items-center gap-2">
                <span className="text-green-400">✓</span>
                Got it! Analyzing as <strong>{userName}</strong> about <strong>{otherName}</strong>
              </p>
            </motion.div>
          )}

          {/* Anonymous User Status */}
          {!user && anonymousStatus && (
            <div className="mb-6 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border border-cyan-400/30 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-sm font-medium text-cyan-300">
                      {anonymousStatus.remainingAnalyses > 0 
                        ? 'Free Analysis: 1 remaining'
                        : 'Free analysis used up'
                      }
                    </p>
                    <p className="text-xs text-cyan-400/80">
                      {anonymousStatus.remainingAnalyses > 0 
                        ? 'Sign up to unlock your one free premium decode + daily credits'
                        : 'Sign up now for unlimited analysis and daily credits'
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

          {/* Input Tabs */}
          <InputTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Dynamic Input Area */}
          <div className="mb-6">
            {activeTab === 'text' && (
              <div>
                <textarea
                  value={texts}
                  onChange={handleTextChange}
                  placeholder="Paste your conversation here..."
                  className="w-full h-48 p-4 text-sm bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-xl focus:border-cyan-400/50 focus:outline-none transition-all duration-300 resize-none text-white placeholder-gray-400"
                />
                <SmartCharacterCounter count={texts.length} limit={5000} />
              </div>
            )}
            
            {activeTab === 'screenshot' && (
              <div>
                <ImageUpload 
                  onTextExtracted={(text) => {
                    setExtractedTexts(prev => [...prev, text]);
                    setShowColorHelper(true);
                  }}
                  maxFiles={3}
                />
                
                <AnimatePresence>
                  {showColorHelper && (
                    <ColorMappingHelper 
                      onColorMapping={setColorMapping}
                    />
                  )}
                </AnimatePresence>
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

          {/* Step 2: Name Collection (if needed) - Shows when we need to collect names */}
          <AnimatePresence>
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl border border-cyan-400/30"
              >
                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Almost there! Who are you in this conversation?
                </p>
                
                {detectedNames.length > 0 ? (
                  <div>
                    <p className="text-xs text-gray-400 mb-3">
                      I found these names: {detectedNames.join(' and ')}
                    </p>
                    <div className="space-y-2">
                      <p className="text-xs text-white/80 mb-2">Which person are you?</p>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="userRole"
                          value={detectedNames[0]}
                          checked={userName === detectedNames[0]}
                          onChange={(e) => {
                            setUserName(detectedNames[0]);
                            setOtherName(detectedNames[1]);
                          }}
                          className="text-blue-500"
                        />
                        <span className="text-sm">I am {detectedNames[0]}</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="userRole"
                          value={detectedNames[1]}
                          checked={userName === detectedNames[1]}
                          onChange={(e) => {
                            setUserName(detectedNames[1]);
                            setOtherName(detectedNames[0]);
                          }}
                          className="text-blue-500"
                        />
                        <span className="text-sm">I am {detectedNames[1]}</span>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      placeholder="You/Person 1"
                      className="p-2 bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-lg text-sm text-white placeholder-gray-400 focus:border-cyan-400/50 focus:outline-none transition-all duration-300"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                    <input
                      placeholder="Them/Person 2"
                      className="p-2 bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-lg text-sm text-white placeholder-gray-400 focus:border-cyan-400/50 focus:outline-none transition-all duration-300"
                      value={otherName}
                      onChange={(e) => setOtherName(e.target.value)}
                    />
                  </div>
                )}

                {/* Pronouns section inside the "Almost there! Who's who?" section */}
                <div className="mt-4">
                  <details className="group">
                    <summary className="text-sm text-white/70 cursor-pointer hover:text-white transition-colors duration-300 mb-3 flex items-center gap-2">
                      <span>👤</span>
                      Add pronouns (optional)
                      <ChevronDown className="h-4 w-4 opacity-60 group-open:rotate-180 transition-transform duration-200" />
                    </summary>
                    <div className="grid grid-cols-2 gap-4">
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>


          {/* Context and Questions */}
          <div className="mb-6">
            <details className="group">
              <summary className="text-sm text-white/70 cursor-pointer hover:text-white transition-colors duration-300 mb-3 flex items-center gap-2">
                <span>💡</span>
                Add context (optional)
                <ChevronDown className="h-4 w-4 opacity-60 group-open:rotate-180 transition-transform duration-200" />
              </summary>
              <div className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10">
                {/* Quick Context */}
                <div>
                  <label className="text-xs text-white/60 mb-2 block">
                    Quick context (optional)
                  </label>
                  <input 
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="e.g., 'We've been dating 3 months' or 'My ex from last year'"
                    className="w-full px-3 py-2 bg-white/5 backdrop-blur-sm rounded-lg text-sm text-white placeholder-gray-400 border border-cyan-400/20 focus:border-cyan-400/50 focus:outline-none transition-all duration-300"
                  />
                </div>
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
              step === 2 ? 'Get Your Receipts Now →' : 'Analyze Conversation'
            )}
          </button>

          {/* Enhanced Loading Animation */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-6 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-emerald-500/10 rounded-2xl border border-cyan-400/30 backdrop-blur-sm"
            >
              <div className="text-center">
                {/* Animated Progress Bar */}
                <div className="w-full bg-gray-700/50 rounded-full h-2 mb-4 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-cyan-400 to-purple-500 h-2 rounded-full"
                    initial={{ x: "-100%" }}
                    animate={{ x: "0%" }}
                    transition={{
                      duration: 45, // ~45 seconds for full analysis
                      ease: "linear",
                      repeat: Infinity,
                      repeatType: 'loop'
                    }}
                  />
                </div>
                
                {/* Dynamic Analysis Steps */}
                <motion.div
                  key={isLoading}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-cyan-200 font-medium mb-2"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="animate-bounce text-2xl">🧾</div>
                    <span className="text-lg">Sage is brewing the tea...</span>
                  </div>
                  <div className="text-sm text-cyan-300 space-y-1">
                    <div className="animate-pulse">📊 Analyzing conversation patterns...</div>
                    <div className="animate-pulse delay-100">🔍 Deep diving into the subtext...</div>
                    <div className="animate-pulse delay-200">🛡️ Building your immunity training...</div>
                  </div>
                </motion.div>
                
                <div className="text-xs text-cyan-400 mt-3">
                  This usually takes 30-60 seconds ⏱️
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

      {/* Anonymous User Limit Modal */}
      <AnimatePresence>
        {showLimitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLimitModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/8 backdrop-blur-xl border border-cyan-400/30 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl shadow-cyan-500/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold gradient-text mb-4">
                  🎉 You've Used Your Free Analysis!
                </h2>

                {/* Description */}
                <p className="text-cyan-200 mb-6 leading-relaxed">
                  Great job! You've completed your free analysis. Ready for unlimited insights? 
                  Choose your path to continue getting the tea! ☕️
                </p>

                {/* Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setShowLimitModal(false);
                      openModal('signup');
                    }}
                    className="w-full bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    🆓 Sign Up for Free Credits
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowLimitModal(false);
                      navigate('/pricing');
                    }}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    👑 Go Premium - Unlimited
                  </button>
                  
                  <button
                    onClick={() => setShowLimitModal(false)}
                    className="w-full text-cyan-300 hover:text-white transition-colors duration-300 py-2"
                  >
                    Maybe Later
                  </button>
                </div>

                {/* Benefits */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-xs text-cyan-400 mb-3">What you get with an account:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-cyan-300">
                    <div className="flex items-center gap-1">
                      <span>✅</span>
                      <span>Daily free credits</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>✅</span>
                      <span>Save receipts</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>✅</span>
                      <span>Referral bonuses</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>✅</span>
                      <span>Premium features</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
      </div>
    </ErrorBoundary>
  );
};

export default ChatInputPage;