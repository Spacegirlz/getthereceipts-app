import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Sparkles, HelpCircle, Upload } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { Helmet } from 'react-helmet';
import AnalysisLoader from '@/components/AnalysisLoader';
import { generateAlignedResults } from '@/lib/analysis/advancedAnalysis';
import { getUserCredits, deductCredits } from '@/lib/services/creditsSystem';
import sageCharacter from '@/assets/sage-dark-circle.png';

const ChatInputPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, session } = useAuth();
  const { openModal, closeModal } = useAuthModal();

  const { quizAnswers } = location.state || {};
  const [texts, setTexts] = useState('');
  const [background, setBackground] = useState('');
  const [gutFeel, setGutFeel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // New quiz fields integrated into the input page
  const [userName, setUserName] = useState('');
  const [otherName, setOtherName] = useState(''); // Add separate state for other person's name
  const [contextType, setContextType] = useState('');
  const [otherPartyPronouns, setOtherPartyPronouns] = useState('');
  const [userPronouns, setUserPronouns] = useState('');
  const [userQuestion, setUserQuestion] = useState('');
  const [colorMapping, setColorMapping] = useState('');
  
  // Image upload state
  const [extractedTexts, setExtractedTexts] = useState([]);
  
  // User credits state
  const [userCredits, setUserCredits] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [creditsLoading, setCreditsLoading] = useState(true);
  
  // Help popup state
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  
  // Upgrade modal state
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // Anonymous/Observational mode state
  const [analysisMode, setAnalysisMode] = useState(null); // null, 'personal' or 'anonymous'
  
  // Form data preservation key
  const FORM_DATA_KEY = 'chatInputFormData';
  
  // Character limits
  const TEXTS_LIMIT = 2500;
  const BACKGROUND_LIMIT = 500;
  const QUESTION_LIMIT = 300;
  
  const generateMessage = () => {
    let message = '';
    
    // Auto-detect if this is an observational conversation (dialogue format)
    const combinedText = texts.trim() + ' ' + (extractedTexts || []).join(' ');
    const isDialogueFormat = /\w+\d*\s*:\s*/.test(combinedText) && combinedText.includes(':');
    const hasMultipleSpeakers = (combinedText.match(/\w+\d*\s*:/g) || []).length >= 2;
    
    const shouldUseObservationalMode = analysisMode === 'anonymous' || (isDialogueFormat && hasMultipleSpeakers);
    
    // Handle analysis mode
    if (shouldUseObservationalMode) {
      message += `ANALYSIS MODE: Observational - Analyzing someone else's conversation from one person's perspective\n\n`;
      
      // For anonymous mode, still maintain perspective structure but with generic labels
      if (texts.trim()) {
        message += `CONVERSATION:\n${texts.trim()}\n\n`;
      }
    } else {
      // Personal mode - include names and relationship context
      if (userName.trim() && otherName.trim()) {
        message += `USER: ${userName.trim()} (${userPronouns || 'they/them'})\n`;
        message += `OTHER: ${otherName.trim()} (${otherPartyPronouns || 'they/them'})\n`;
      }
      if (contextType) {
        message += `RELATIONSHIP: ${contextType}\n\n`;
      } else {
        message += '\n';
      }
      if (texts.trim()) {
        message += `EVIDENCE:\n${texts.trim()}\n\n`;
      }
    }
    
    // Add extracted text from images
    if (extractedTexts.length > 0) {
      message += `EXTRACTED TEXT FROM IMAGES:\n`;
      extractedTexts.forEach((text, index) => {
        message += `Image ${index + 1}: ${text}\n\n`;
      });
    }
    if (background.trim()) {
      message += `QUICK CONTEXT: ${background.trim()}\n\n`;
    }
    if (gutFeel.trim()) {
      message += `YOUR VIBE: ${gutFeel.trim()}\n\n`;
    }
    if (userQuestion.trim()) {
      message += `YOUR QUESTION: ${userQuestion.trim()}`;
    }
    
    return message.trim();
  };
  
  const currentMessage = generateMessage();

  // Save form data to localStorage
  const saveFormData = () => {
    const formData = {
      texts,
      background,
      gutFeel,
      userName,
      otherName,
      contextType,
      otherPartyPronouns,
      userPronouns,
      userQuestion,
      colorMapping,
      extractedTexts
    };
    console.log('💾 ChatInput: Saving form data to localStorage', { 
      textsLength: texts.length, 
      contextType, 
      hasBackground: !!background 
    });
    localStorage.setItem(FORM_DATA_KEY, JSON.stringify(formData));
  };

  // Load form data from localStorage
  const loadFormData = () => {
    try {
      const saved = localStorage.getItem(FORM_DATA_KEY);
      if (saved) {
        console.log('📂 ChatInput: Loading saved form data...');
        const formData = JSON.parse(saved);
        setTexts(formData.texts || '');
        setBackground(formData.background || '');
        setGutFeel(formData.gutFeel || '');
        setUserName(formData.userName || '');
        setOtherName(formData.otherName || '');
        setContextType(formData.contextType || '');
        setOtherPartyPronouns(formData.otherPartyPronouns || '');
        setUserPronouns(formData.userPronouns || '');
        setUserQuestion(formData.userQuestion || '');
        setColorMapping(formData.colorMapping || '');
        setExtractedTexts(formData.extractedTexts || []);
        
        console.log('📂 ChatInput: Form data restored', { 
          textsLength: (formData.texts || '').length,
          contextType: formData.contextType
        });
        
        // Clear saved data after restoring
        localStorage.removeItem(FORM_DATA_KEY);
        
        // Set a flag for auto-submit after restoration
        localStorage.setItem('shouldAutoSubmit', 'true');
        console.log('📂 ChatInput: Auto-submit flag set');
      } else {
        console.log('📂 ChatInput: No saved form data found');
      }
    } catch (error) {
      console.error('Error loading saved form data:', error);
    }
  };

  const handleBack = () => navigate('/');
  
  const textsPlaceholder = `[Paste your conversation here...]

Example:

Her: you were kinda quiet tonight, everything good?
Me: yea just tired
Her: okay :) well I had a really fun time
Me: same
Her: we should do it again next week!
Me: fs
Her: cool, let me know <3

---
(Also add any background info & what you're REALLY wondering about)

Background: I actually like her a lot, maybe too much. It's freaking me out. I feel like I'm either gonna mess this up or get trapped. So I go cold.

My REAL question is: How do I figure out if she's worth the risk without losing her in the process? Am I already sabotaging this?`;

  const backgroundPlaceholder = `My ex from 3 months ago`;

  // Fetch user credits on component mount
  // Load saved form data on component mount
  useEffect(() => {
    loadFormData();
  }, []);
  
  useEffect(() => {
    const fetchCredits = async () => {
      setCreditsLoading(true);
      try {
        if (user?.id) {
          const credits = await getUserCredits(user.id);
          setUserCredits(credits);
          setIsPremium(credits.subscription === 'premium' || credits.subscription === 'yearly' || credits.subscription === 'founder');
        } else {
          // Non-logged in users need to create account for free daily credit
          setUserCredits({ deepDivesRemaining: 0, subscription: 'free' });
          setIsPremium(false);
        }
      } catch (error) {
        console.error('Error fetching credits:', error);
        // Default to free user on error
        setUserCredits({ credits: 0, subscription: 'free' });
        setIsPremium(false);
      } finally {
        setCreditsLoading(false);
      }
    };
    
    fetchCredits();
  }, [user]);

  // Auto-submit when credits finish loading (if flag is set)
  useEffect(() => {
    if (!creditsLoading && user && localStorage.getItem('shouldAutoSubmit') === 'true') {
      console.log('🚀 ChatInput: Auto-submit triggered!', { 
        textsLength: texts.trim().length, 
        extractedTextsLength: extractedTexts.length,
        userEmail: user.email 
      });
      localStorage.removeItem('shouldAutoSubmit');
      
      // Close any open modals before auto-submit
      setShowUpgradeModal(false);
      closeModal();
      
      if ((texts.trim() || extractedTexts.length > 0)) {
        // Small delay to ensure UI is ready
        setTimeout(() => {
          console.log('🚀 ChatInput: Executing auto-submit...');
          handleSubmit();
        }, 500);
      } else {
        console.warn('🚀 ChatInput: Auto-submit skipped - no text data available');
      }
    }
  }, [creditsLoading, user, texts, extractedTexts]);

  const handleSubmit = async () => {
    console.log('🚀 ChatInput: handleSubmit called', { 
      hasUser: !!user, 
      textsLength: texts.length,
      analysisMode 
    });
    
    // Check if analysis mode is selected
    if (!analysisMode) {
      toast({
        title: 'Analysis Mode Required',
        description: 'Please select whether this is your conversation or you\'re observing others.',
      });
      return;
    }

    // Check if tea/text input is provided (either pasted or from screenshots)
    if (!texts.trim() && extractedTexts.length === 0) {
      toast({
        title: 'Tea Required',
        description: 'Please paste your conversation or upload screenshots with text.',
      });
      return;
    }

    // Check if relationship type is selected (only for personal mode)
    if (analysisMode === 'personal' && !contextType) {
      toast({
        title: 'Relationship Required',
        description: 'Please select the relationship dynamic.',
      });
      return;
    }

    // Check if main person is identified (required for both modes)
    if (!userName.trim()) {
      const title = analysisMode === 'anonymous' ? 'Main Person Required' : 'Your Name Required';
      const description = analysisMode === 'anonymous' 
        ? 'Please identify the main person whose perspective to analyze from.'
        : 'Please enter your name or use "Me" to stay anonymous.';
      toast({
        title,
        description,
      });
      return;
    }
    
    // Check if user is logged in first
    if (!user) {
      console.log('🚀 ChatInput: No user found, saving form data and opening auth modal');
      // Save form data before opening auth modal
      saveFormData();
      openModal();
      toast({
        title: 'Create Account for Free Daily Receipt',
        description: 'Sign up to get 1 free Truth Receipt every day!',
      });
      return;
    }

    // Prevent submission if credits are still loading
    if (creditsLoading) {
      toast({
        title: 'Loading your account...',
        description: 'Please wait while we check your credits.',
      });
      return;
    }

    // Check if user has credits (only for non-premium users)
    if (!isPremium && (!userCredits?.credits || userCredits.credits <= 0)) {
      setShowUpgradeModal(true);
      return;
    }

    if (!texts.trim() && extractedTexts.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Texts required',
        description: 'Please paste the texts you want analyzed or upload images with text.',
      });
      return;
    }

    if (!contextType.trim()) {
      toast({
        variant: 'destructive',
        title: 'Context required',
        description: 'Please select what type of relationship this is.',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate processing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Build comprehensive context object with ALL user inputs for GPT
      const analysisContext = {
        ...quizAnswers,
        
        // Core user identification with multiple tag variations
        user_name: userName.trim() || 'Alex',
        user_side: userName.trim() || 'Alex',
        username: userName.trim() || 'Alex',
        
        // Other party identification - NOW USING CORRECT FIELD
        other_name: otherName.trim() || 'them',
        their_name: otherName.trim() || 'them',
        other_party_name: otherName.trim() || 'them',
        
        // Pronouns with multiple tag variations for GPT recognition
        user_pronoun: userPronouns || 'they/them',
        user_pronouns: userPronouns || 'they/them',
        their_pronoun: otherPartyPronouns || 'they/them',
        their_pronouns: otherPartyPronouns || 'they/them',
        otherperson_pronoun: otherPartyPronouns || 'they/them',
        other_party_pronoun: otherPartyPronouns || 'they/them',
        known_pronouns: { 
          user: userPronouns || 'they/them',
          other_party: otherPartyPronouns || 'they/them',
          them: otherPartyPronouns || 'they/them'
        },
        
        // Situation context with multiple tags
        context: 'Dating/romantic',
        context_type: contextType || 'dating',
        situation_category: contextType,
        situation_type: contextType,
        relationship_type: contextType,
        
        // Text evidence with multiple tags
        evidence_text: texts.trim(),
        messages: texts.trim(),
        conversation: texts.trim(),
        texts: texts.trim(),
        message_content: texts.trim(),
        
        // Background context with multiple tags
        background_context: background.trim(),
        relationship_background: background.trim(),
        context_info: background.trim(),
        additional_context: background.trim(),
        
        // User's emotional state (keeping existing gut feel tags)
        gut_feeling: gutFeel,
        user_vibe: gutFeel,
        emotional_state: gutFeel,
        
        // Color mapping for screenshots
        colorMapping: colorMapping,
        
        // Meta information for AI processing awareness
        has_user_name: !!userName.trim(),
        has_other_name: !!background.trim(),
        has_situation_context: !!contextType,
        has_background_info: !!background.trim(),
        has_emotional_state: !!gutFeel,
        has_user_pronouns: !!userPronouns,
        has_other_pronouns: !!otherPartyPronouns,
        
        // Input quality metrics
        evidence_length: texts.trim().length,
        background_length: background.trim().length,
        total_context_provided: [userName, background, contextType, userPronouns, otherPartyPronouns, gutFeel].filter(Boolean).length,
        
        // Page source for AI context
        input_source: 'streamlined_chat_input_page',
        form_version: 'premium_numbered_sections'
      };
      
      const analysisResult = await generateAlignedResults(currentMessage, analysisContext);

      // Deduct credits after successful analysis (only for logged-in users)
      if (user?.id && !isPremium) {
        console.log('💳 Deducting credit for analysis...');
        const deductionResult = await deductCredits(user.id, 1);
        if (deductionResult.success) {
          console.log('✅ Credit deducted successfully');
          // Update local credit state
          setUserCredits(prev => ({
            ...prev,
            credits: deductionResult.newCredits || (prev.credits - 1)
          }));
        } else {
          console.error('❌ Failed to deduct credit:', deductionResult.error);
        }
      }

      const uniqueId = Math.random().toString(36).substr(2, 9);
      
      navigate('/receipts', { 
        state: { 
          analysis: {
            ...analysisResult,
            id: uniqueId,
            timestamp: new Date().toISOString()
          }, 
          originalMessage: currentMessage, 
          quizAnswers 
        } 
      });

    } catch (err) {
      console.error('Analysis failed:', err);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Something went wrong with the analysis. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-stone-100">
      <Helmet>
        <title>Get Your Truth Receipt - Sage's Dating Analysis</title>
        <meta name="description" content="Get instant AI-powered dating advice. Share your texts and context, get your personalized truth receipt from Sage." />
        <meta property="og:title" content="Get Your Truth Receipt - Sage's Dating Analysis" />
        <meta property="og:description" content="Get instant AI-powered dating advice. Share your texts and context, get your personalized truth receipt from Sage." />
      </Helmet>
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-2xl"
      >
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack} className="text-stone-100 hover:bg-white/10" disabled={isLoading}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Home
          </Button>
        </div>

        {/* Header - Sage Section */}
        <header className="text-center mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 gap-3 sm:gap-0">
            <img 
              src={sageCharacter} 
              alt="Sage" 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mr-3 flex-shrink-0"
              loading="lazy"
              style={{ minWidth: '64px', minHeight: '64px' }}
            />
            <h1 className="text-2xl sm:text-3xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5), 0 0 40px rgba(212, 175, 55, 0.3)'
              }}>
              See What They're Really Saying
            </h1>
          </div>
          <p className="text-gray-300 mb-2">
            Your gut feels off for a reason. Let's get the receipts to prove it.
          </p>
        </header>

        {/* Sage's Welcome Message */}
        <div className="bg-black/20 p-5 rounded-xl border border-white/5 mb-8">
          <p className="text-stone-300 text-sm leading-relaxed">
            <span className="text-cyan-400/70 font-medium">👋 Hey, it's Sage.</span> I know you've been staring at that text, re-reading it until the words lose all meaning. You're in the right place. Paste the conversation below, and let's decode it together. No judgment, just clarity.
          </p>
        </div>

        {isLoading ? (
          <div className="bg-gradient-to-br from-slate-900/50 to-indigo-900/30 rounded-3xl border border-white/10 backdrop-blur-sm">
            <AnalysisLoader />
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Step 1: The Cast (Optional) */}
            <div className="bg-black/30 p-6 rounded-xl border border-white/10">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-black font-bold text-sm mr-3"
                  style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)' }}>
                  1
                </div>
                <h3 className="text-xl font-bold text-stone-100">The Cast</h3>
              </div>
              
              {analysisMode === 'personal' ? (
                <>
                  <p className="text-stone-300 text-sm mb-4">
                    Who's in this story? <span className="text-orange-400">*Required</span> - This helps Sage understand the dynamic from <strong>your perspective</strong>. Use real names or stay anonymous with "Me" and "Person 1".
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Your Name */}
                    <div>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value.slice(0, 20))}
                        placeholder="Your Name (e.g., Alex, Me, Person 1)"
                        className="w-full p-4 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:border-purple-500 transition-colors placeholder-gray-500"
                        disabled={isLoading}
                      />
                    </div>

                    {/* Their Name */}
                    <div>
                      <input
                        type="text"
                        value={otherName}
                        onChange={(e) => setOtherName(e.target.value.slice(0, 50))}
                        placeholder="Their Name (e.g., Taylor, Person 2)"
                        className="w-full p-4 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:border-purple-500 transition-colors placeholder-gray-500"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Pronouns (Optional) */}
                  <div className="mt-4">
                    <label className="text-stone-400 text-xs mb-2 block">Pronouns (Optional)</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-stone-400 mb-2">You:</p>
                        <div className="flex gap-2">
                          {['she/her', 'he/him', 'they/them'].map((pronoun) => (
                            <button
                              key={pronoun}
                              onClick={() => setUserPronouns(pronoun)}
                              className={`px-1.5 py-0.5 rounded text-[10px] transition-all flex-1 min-w-0 ${
                                userPronouns === pronoun
                                  ? 'bg-purple-600/20 border border-purple-500 text-stone-100'
                                  : 'bg-black/20 border border-gray-600 text-stone-300 hover:border-purple-500/60'
                              }`}
                            >
                              {pronoun}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-stone-400 mb-2">Them:</p>
                        <div className="flex gap-2">
                          {['he/him', 'she/her', 'they/them'].map((pronoun) => (
                            <button
                              key={pronoun}
                              onClick={() => setOtherPartyPronouns(pronoun)}
                              className={`px-1.5 py-0.5 rounded text-[10px] transition-all flex-1 min-w-0 ${
                                otherPartyPronouns === pronoun
                                  ? 'bg-purple-600/20 border border-purple-500 text-stone-100'
                                  : 'bg-black/20 border border-gray-600 text-stone-300 hover:border-purple-500/60'
                              }`}
                            >
                              {pronoun}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : analysisMode === 'anonymous' ? (
                <>
                  <p className="text-stone-300 text-sm mb-4">
                    Whose perspective should Sage analyze from? <span className="text-orange-400">*Required</span> - Choose one person from the conversation. Use labels like "Person 1", "Guy 1", or whatever they're called in your text.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Main Person */}
                    <div>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value.slice(0, 20))}
                        placeholder="Main Person (e.g., Person 1, Guy 1, Sarah)"
                        className="w-full p-4 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:border-purple-500 transition-colors placeholder-gray-500"
                        disabled={isLoading}
                      />
                    </div>

                    {/* Other Person */}
                    <div>
                      <input
                        type="text"
                        value={otherName}
                        onChange={(e) => setOtherName(e.target.value.slice(0, 50))}
                        placeholder="Other Person (e.g., Person 2, Guy 2, Mike)"
                        className="w-full p-4 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:border-purple-500 transition-colors placeholder-gray-500"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Pronouns (Optional) */}
                  <div className="mt-4">
                    <label className="text-stone-400 text-xs mb-2 block">Pronouns (Optional - helps with analysis)</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-stone-400 mb-2">Main Person:</p>
                        <div className="flex gap-2">
                          {['she/her', 'he/him', 'they/them'].map((pronoun) => (
                            <button
                              key={pronoun}
                              onClick={() => setUserPronouns(pronoun)}
                              className={`px-1.5 py-0.5 rounded text-[10px] transition-all flex-1 min-w-0 ${
                                userPronouns === pronoun
                                  ? 'bg-purple-600/20 border border-purple-500 text-stone-100'
                                  : 'bg-black/20 border border-gray-600 text-stone-300 hover:border-purple-500/60'
                              }`}
                            >
                              {pronoun}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-stone-400 mb-2">Other Person:</p>
                        <div className="flex gap-2">
                          {['he/him', 'she/her', 'they/them'].map((pronoun) => (
                            <button
                              key={pronoun}
                              onClick={() => setOtherPartyPronouns(pronoun)}
                              className={`px-1.5 py-0.5 rounded text-[10px] transition-all flex-1 min-w-0 ${
                                otherPartyPronouns === pronoun
                                  ? 'bg-purple-600/20 border border-purple-500 text-stone-100'
                                  : 'bg-black/20 border border-gray-600 text-stone-300 hover:border-purple-500/60'
                              }`}
                            >
                              {pronoun}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="text-4xl mb-3">👇</div>
                  <p className="text-stone-400 text-sm">
                    Please select an analysis mode above to continue
                  </p>
                </div>
              )}
            </div>

            {/* Analysis Mode Toggle */}
            <div className={`bg-black/30 p-4 rounded-xl border transition-all ${
              !analysisMode ? 'border-orange-500/50 shadow-lg shadow-orange-500/20' : 'border-white/10'
            }`}>
              <p className="text-stone-300 text-sm mb-1">
                Is this your conversation or are you analyzing someone else's? <span className="text-orange-400">*Required</span>
              </p>
              {!analysisMode && (
                <p className="text-orange-400 text-xs mb-3">Please select an analysis mode to continue</p>
              )}
              <div className="mt-3"></div>
              <div className="flex gap-3">
                <button
                  onClick={() => setAnalysisMode('personal')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    analysisMode === 'personal'
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  My Conversation
                </button>
                <button
                  onClick={() => setAnalysisMode('anonymous')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    analysisMode === 'anonymous'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  Observing Others
                </button>
              </div>
            </div>

            {/* Step 2: The Tea ☕ */}
            <div className="bg-black/30 p-6 rounded-xl border border-white/10">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-black font-bold text-sm mr-3"
                  style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)' }}>
                  2
                </div>
                <h3 className="text-xl font-bold text-stone-100 flex items-center gap-2">
                  The Tea ☕
                  <button 
                    onClick={() => setShowHelpPopup(true)}
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                    title="How to get the best receipts"
                  >
                    <HelpCircle className="w-5 h-5" />
                  </button>
                </h3>
              </div>
              
              <p className="text-stone-300 text-sm mb-2">
                Paste the entire conversation here. Background info, confusing texts, screenshots copied as text – the more context, the clearer the truth.
              </p>
              
              {/* Privacy Reminder */}
              <p className="text-stone-400 text-xs mb-4 italic">
                Your messages are analyzed and immediately discarded unless you choose to save them. Your drama stays yours.
              </p>
              
              {/* Image Upload Option */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Upload className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-medium text-stone-300">Upload Screenshots (Optional)</span>
                </div>
                <ImageUpload 
                  onTextExtracted={(extractedText, fileName) => {
                    setExtractedTexts(prev => [...prev, extractedText]);
                    toast({
                      title: "Text Extracted! 📸",
                      description: `Successfully extracted text from ${fileName}`,
                    });
                  }}
                  maxFiles={2}
                  maxSize={5 * 1024 * 1024}
                />
                
                {extractedTexts.length > 0 && (
                  <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                    <p className="text-green-400 text-sm font-medium mb-2">
                      ✅ Text extracted from {extractedTexts.length} image{extractedTexts.length > 1 ? 's' : ''}
                    </p>
                    <p className="text-green-300 text-xs">
                      This text will be included in your analysis along with any pasted messages.
                    </p>
                  </div>
                )}
              </div>
              
              <Textarea
                value={texts}
                onChange={(e) => setTexts(e.target.value.slice(0, TEXTS_LIMIT))}
                placeholder={textsPlaceholder}
                className="w-full h-48 p-4 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:border-purple-500 transition-colors resize-none"
                disabled={isLoading}
              />
              <div className="flex justify-between items-center mt-2">
                <span className={`text-xs ${texts.length > TEXTS_LIMIT * 0.8 ? 'text-orange-400' : 'text-stone-400'} ${texts.length > TEXTS_LIMIT * 0.95 ? 'text-red-400' : ''}`}>
                  {texts.length}/{TEXTS_LIMIT}
                </span>
              </div>
              
              {/* Sage's Input Quality Warnings */}
              {(() => {
                const wordCount = texts.trim().split(/\s+/).filter(word => word.length > 0).length;
                const peopleCount = (() => {
                  const lines = texts.split('\n').filter(line => line.trim());
                  const speakerCounts = new Map();
                  
                  lines.forEach(line => {
                    const match = line.match(/^([^:]+):/);
                    if (match) {
                      const speaker = match[1].trim().toLowerCase();
                      // Filter out common non-speaker patterns
                      if (!speaker.includes('(') && !speaker.includes('timestamp') && !speaker.includes('date')) {
                        speakerCounts.set(speaker, (speakerCounts.get(speaker) || 0) + 1);
                      }
                    }
                  });
                  
                  // Only count speakers who have multiple messages (active participants)
                  const activeSpeakers = Array.from(speakerCounts.entries()).filter(([_, count]) => count >= 2);
                  return activeSpeakers.length;
                })();
                
                const warnings = [];
                
                if (wordCount < 100 && wordCount > 0) {
                  warnings.push({
                    type: 'warning',
                    icon: '⚠️',
                    message: `Bestie, ${wordCount} words is pretty sparse. I'm good, but I'm not psychic. The more tea you spill, the better I can read the room. Consider adding more context or background details.`
                  });
                }
                
                if (peopleCount > 3) {
                  warnings.push({
                    type: 'warning', 
                    icon: '🤯',
                    message: `Whoa there, bestie! ${peopleCount} active people in this conversation? That's getting complicated. I work best analyzing the main dynamic between 2-3 people for the clearest receipts.`
                  });
                }
                
                if (wordCount === 0) {
                  return null;
                }
                
                // Positive reinforcement for good input
                if (warnings.length === 0 && wordCount >= 100) {
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 bg-green-900/20 border border-green-500/30 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-lg flex-shrink-0">✨</span>
                        <p className="text-green-200 text-sm leading-relaxed">
                          Now THIS is what I'm talking about! {wordCount} words of pure tea. I can already feel the drama brewing. Let's get these receipts, bestie.
                        </p>
                      </div>
                    </motion.div>
                  );
                }
                
                return warnings.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {warnings.map((warning, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-lg flex-shrink-0">{warning.icon}</span>
                          <p className="text-yellow-200 text-sm leading-relaxed">
                            {warning.message}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : null;
              })()}
            </div>

            {/* Step 3: The Vibe (Optional) */}
            <div className="bg-black/30 p-6 rounded-xl border border-white/10">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-black font-bold text-sm mr-3"
                  style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)' }}>
                  3
                </div>
                <h3 className="text-xl font-bold text-stone-100">The Relationship</h3>
              </div>
              
              <p className="text-stone-300 text-sm mb-4">
                What kind of situation are we looking at? This helps Sage tune in to the emotional stakes.
              </p>
              
              <div>
                <label className="text-stone-400 text-xs mb-2 block">What's the relationship dynamic? <span className="text-orange-400">*Required</span></label>
                <select
                  value={contextType}
                  onChange={(e) => setContextType(e.target.value)}
                  className="w-full p-4 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:border-purple-500 transition-colors"
                  disabled={isLoading}
                >
                  <option value="">Select relationship...</option>
                  <option value="situationship">Situationship</option>
                  <option value="dating">Dating</option>
                  <option value="ex-drama">Ex Drama</option>
                  <option value="friends">Friends</option>
                  <option value="marriage">Marriage</option>
                  <option value="family">Family</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Step 4: Your Question (Optional) */}
            <div className="bg-black/30 p-6 rounded-xl border border-white/10">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-black font-bold text-sm mr-3"
                  style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)' }}>
                  4
                </div>
                <h3 className="text-xl font-bold text-stone-100">Your Question (Optional)</h3>
              </div>
              
              <p className="text-stone-300 text-sm mb-4">
                Got a specific question for Sage? Ask away! This helps focus the analysis on what matters most to you.
              </p>
              
              <div>
                <label className="text-stone-400 text-xs mb-2 block">What do you want to know?</label>
                <Textarea
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value.slice(0, QUESTION_LIMIT))}
                  placeholder="e.g., 'Should I keep giving him chances?' or 'Is this behavior normal?' or 'What would you do in my situation?'"
                  className="w-full h-24 p-4 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:border-purple-500 transition-colors resize-none"
                  disabled={isLoading}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className={`text-xs ${userQuestion.length > QUESTION_LIMIT * 0.8 ? 'text-orange-400' : 'text-stone-400'} ${userQuestion.length > QUESTION_LIMIT * 0.95 ? 'text-red-400' : ''}`}>
                    {userQuestion.length}/{QUESTION_LIMIT}
                  </span>
                </div>
              </div>

              {/* Color Mapping for Screenshots */}
              <div>
                <label className="text-stone-400 text-xs mb-2 block">
                  For screenshots: Map colors to names (Optional)
                </label>
                <Input
                  type="text"
                  value={colorMapping}
                  onChange={(e) => setColorMapping(e.target.value)}
                  placeholder="e.g., blue = Person 1, grey = Person 2"
                  className="w-full p-3 text-sm bg-gray-800 border border-gray-700 rounded-xl focus:border-purple-500 transition-colors"
                  disabled={isLoading}
                />
                <p className="text-xs text-stone-400 mt-1">
                  If sharing a screenshot, tell us which color bubble is which person
                </p>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="space-y-4">
              <Button
                onClick={handleSubmit}
                disabled={isLoading || creditsLoading || (!texts.trim() && extractedTexts.length === 0)}
                className="w-full py-6 text-xl font-bold text-black rounded-xl transition-all hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)'
                }}
              >
                {!user ? (
                  '🧾 Get My Free Truth Receipt'
                ) : creditsLoading ? (
                  '⏳ Loading Account...'
                ) : isPremium ? (
                  '🧾 Get My Truth Receipt'
                ) : userCredits?.credits > 0 ? (
                  '🧾 Get My Free Truth Receipt'
                ) : (
                  `🧾 Get My Truth Receipt (0 Today)`
                )}
              </Button>
              
              {/* Dynamic sub-text based on user status */}
              {!user ? (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span>Create a free account to get 1 Truth Receipt daily!</span>
                </div>
              ) : isPremium ? (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span>Unlimited Truth Receipts!</span>
                </div>
              ) : userCredits?.credits > 0 ? (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span>Your daily free receipt is ready!</span>
                </div>
              ) : (
                <p className="text-center text-sm text-gray-300">
                  You've used today's free receipt!{' '}
                  <button 
                    onClick={() => navigate('/pricing')}
                    className="text-yellow-400 underline hover:text-yellow-300 transition-colors"
                  >
                    Tap here to get a Quick Fix Pack or go Premium
                  </button>
                </p>
              )}
              
              {/* Legal Disclaimer */}
              <div className="text-center text-xs text-gray-500 mt-6 p-4 bg-gray-900/50 rounded-lg">
                <p className="font-bold mb-2">⚖️ The Legal Tea</p>
                <p className="leading-relaxed">
                  Look, we're really good at reading the room and serving up insights, but we're not your therapist, 
                  not licensed professionals, and for the love of all that's holy, don't take life changing advice 
                  from an AI with opinions and sass. For entertainment only. Think of us as your witty friends with 
                  someone else's lived experience.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Help Popup Modal */}
        {showHelpPopup && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)'
            }}
            onClick={() => setShowHelpPopup(false)}
          >
            <motion.div 
              className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-white/10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4 text-stone-100">
                🔮 How to Get the Best Receipts
              </h3>
              
              <div className="space-y-4 text-stone-300 text-sm">
                <div>
                  <span className="font-semibold text-yellow-400">1. Go Wide:</span> Paste the WHOLE conversation, not just the last text. Sage sees patterns, and patterns need history.
                </div>
                
                <div>
                  <span className="font-semibold text-yellow-400">2. Go Deep:</span> Add any context you think Sage needs. "This is our third date," "He just got out of a long relationship," or "She only texts back after 10 PM."
                </div>
                
                <div>
                  <span className="font-semibold text-yellow-400">3. Go Raw:</span> Don't edit or summarize. Sage is best at reading between the lines of actual messages.
                </div>
                
                <p className="text-center text-yellow-400 font-medium pt-2">
                  The more info, the clearer your truth.
                </p>
              </div>
              
              <Button
                onClick={() => setShowHelpPopup(false)}
                className="w-full mt-6 py-3 text-black font-bold rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)'
                }}
              >
                Got it!
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Upgrade Modal - Critical Conversion Point */}
        {showUpgradeModal && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(15px)'
            }}
            onClick={() => setShowUpgradeModal(false)}
          >
            <motion.div 
              className="bg-gray-900 rounded-2xl p-8 max-w-lg w-full border-2 border-yellow-400/30"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', duration: 0.6 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%)',
                boxShadow: '0 0 40px rgba(212, 175, 55, 0.3)'
              }}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2 text-stone-100">
                  You're Out of Free Receipts for Today!
                </h2>
                <p className="text-gray-300 mb-4">
                  Sage needs more tea to keep spilling the truth. Looks like you've used your free receipt for the day.
                </p>
                <p className="text-stone-300 text-sm">
                  But don't worry, you don't have to wait until tomorrow to get clarity. You can get more receipts right now.
                </p>
              </div>

              {/* Offers */}
              <div className="space-y-4 mb-6">
                {/* Quick Fix Pack - Most Prominent */}
                <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-5 border-2 border-purple-400/50 relative">
                  <div className="absolute -top-3 left-4 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </div>
                  <h3 className="text-xl font-bold text-stone-100 mb-2">Quick Fix Pack</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Get 5 more premium receipts instantly to solve this situation now.
                  </p>
                  <Button
                    onClick={() => navigate('/pricing')}
                    className="w-full py-3 text-lg font-bold text-white rounded-xl"
                    style={{
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                      boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)'
                    }}
                  >
                    Get 5 Receipts for $1.99
                  </Button>
                </div>

                {/* Premium Option */}
                <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-xl p-5 border border-yellow-400/30">
                  <h3 className="text-xl font-bold text-stone-100 mb-2">Go Premium</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Get unlimited receipts, forever. Never get stuck in a spiral again.
                  </p>
                  <Button
                    onClick={() => navigate('/pricing')}
                    className="w-full py-3 text-lg font-bold text-black rounded-xl"
                    style={{
                      background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
                      boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)'
                    }}
                  >
                    Upgrade to Unlimited - $6.99/mo
                  </Button>
                </div>
              </div>

              {/* Closing Text */}
              <div className="text-center">
                <p className="text-stone-300 text-sm font-medium">
                  Your analysis is waiting. Choose an option to see your receipt instantly.
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
      
      {/* Age Disclaimer */}
      <div className="text-center mt-8 pb-4">
        <p className="text-white/40 text-xs">
          This service is intended for users 18+ only
        </p>
      </div>
    </div>
  );
};

export default ChatInputPage;