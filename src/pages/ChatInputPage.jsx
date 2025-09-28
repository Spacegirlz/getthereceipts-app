import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Type, Camera, ChevronDown } from 'lucide-react';
import InputTabs from '@/components/InputTabs';
import SmartCharacterCounter from '@/components/SmartCharacterCounter';
import ColorMappingHelper from '@/components/ColorMappingHelper';
import PronounSelector from '@/components/PronounSelector';
import ImageUpload from '@/components/ImageUpload';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const ChatInputPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
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
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-detect names from conversation
  const detectNames = (text) => {
    try {
      // Handle edge cases
      if (!text || typeof text !== 'string') {
        return [];
      }
      
      // Limit text length to prevent performance issues
      const limitedText = text.length > 10000 ? text.substring(0, 10000) : text;
      
      const lines = limitedText.split('\n');
      const speakers = new Set();
      
      lines.forEach(line => {
        // More robust name detection pattern
        const match = line.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*):/);
        if (match) {
          const name = match[1].trim();
          // Filter out common false positives
          if (!['Me', 'You', 'Them', 'User', 'Other', 'Person'].includes(name)) {
            speakers.add(name);
          }
        }
      });
      
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
    setIsLoading(true);
    
    try {
      // Combine all text inputs
      const message = texts.trim() + '\n' + extractedTexts.join('\n');
      
      // Build comprehensive context object with ALL inputs
      const analysisContext = {
        // Core conversation data
        conversation: message,
        
        // Names (from user input or auto-detected) - PROPERLY TAGGED
        userName: userName || 'Me',
        otherName: otherName || 'Them',
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
        
        // Additional context and question - PROPERLY TAGGED
        background: context || '',
        background_context: context || '', // Legacy API field
        userQuestion: question || '',
        user_question: question || '', // Legacy API field
        
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
          hasQuestion: !!question,
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900 text-white flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl"
          >
        {/* Main Card */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 gradient-text">
              Decode Your Conversation
            </h1>
            <p className="text-gray-400 text-sm">
              Paste your texts. Get clarity in seconds.
            </p>
          </div>

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
                  className="w-full h-48 p-4 text-sm bg-gray-800/50 border border-gray-700 rounded-xl focus:border-purple-500 transition-colors resize-none"
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
            <div className="grid grid-cols-3 gap-3">
              {relationshipTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setContextType(type.toLowerCase())}
                  className={`p-3 rounded-lg transition-all duration-300 font-medium ${
                    contextType === type.toLowerCase()
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
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
                className="mb-6 p-4 bg-purple-900/20 rounded-xl border border-purple-500/30"
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
                      className="p-2 bg-gray-800 rounded-lg text-sm"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                    <input
                      placeholder="Them/Person 2"
                      className="p-2 bg-gray-800 rounded-lg text-sm"
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
                Add context and questions (optional)
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
                    className="w-full px-3 py-2 bg-white/5 rounded-lg text-sm text-white placeholder-white/40 border border-white/10 focus:border-yellow-400/50 focus:outline-none transition-all duration-300"
                  />
                </div>
                
                {/* Specific Question */}
                <div>
                  <label className="text-xs text-white/60 mb-2 block">
                    Specific question for Sage (optional)
                  </label>
                  <input 
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g., 'Are they into me?' or 'Should I respond?'"
                    className="w-full px-3 py-2 bg-white/5 rounded-lg text-sm text-white placeholder-white/40 border border-white/10 focus:border-yellow-400/50 focus:outline-none transition-all duration-300"
                  />
                </div>
              </div>
            </details>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>
        </motion.div>
      </div>

      {/* Footer with Important Disclaimers - High-end SaaS Style */}
      <footer className="w-full border-t border-white/5 bg-black/10 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="space-y-6">
            {/* Authority Notice */}
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-4">
                Make sure you have authority to use someone else's chats.
              </p>
            </div>
            
            {/* Subtle Badges */}
            <div className="flex flex-wrap justify-center gap-3 text-xs">
              <span className="text-gray-500 bg-gray-800/30 px-3 py-1.5 rounded-md border border-gray-700/50">
                16+ only
              </span>
              <span className="text-gray-500 bg-gray-800/30 px-3 py-1.5 rounded-md border border-gray-700/50">
                For Entertainment Purposes Only
              </span>
              <span className="text-gray-500 bg-gray-800/30 px-3 py-1.5 rounded-md border border-gray-700/50">
                Not therapy, legal, or medical advice
              </span>
            </div>
            
            {/* AI Disclaimer */}
            <div className="text-center">
              <p className="text-xs text-gray-500 italic">
                Sage is an AI character with opinions, not facts
              </p>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </ErrorBoundary>
  );
};

export default ChatInputPage;