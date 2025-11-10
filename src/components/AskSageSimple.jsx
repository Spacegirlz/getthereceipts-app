import React, { useState, useRef, useEffect } from 'react';
import { askSage } from '@/lib/chat/askSage';
import { Send, Loader2, Copy, Check, MoreVertical, Heart, ThumbsUp, Maximize2, Minimize2, X, Crown } from 'lucide-react';
import { getUserCredits } from '@/lib/services/creditsSystem';
import sageDarkCircle from '@/assets/sage-dark-circle.png';
import { useStripe } from '@stripe/react-stripe-js';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

export function AskSageChat({ receiptData, isPremium = false, maxExchangesOverride, userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const messagesContainerRef = useRef(null);
  const [maxChatHeight, setMaxChatHeight] = useState(null);
  const introShownRef = useRef(false);
  const [isTrial, setIsTrial] = useState(false);
  const [showChatLimitModal, setShowChatLimitModal] = useState(false);
  const [loadingPriceId, setLoadingPriceId] = useState(null);
  
  const stripe = useStripe();
  const { user } = useAuth();
  const { openModal } = useAuthModal();
  const { toast } = useToast();
  
  // Check trial status for logged-in users
  useEffect(() => {
    async function checkTrialStatus() {
      if (userId && !isPremium) {
        try {
          const userCredits = await getUserCredits(userId);
          const trialActive = userCredits.subscription === 'premium_trial' && userCredits.is_trial_active;
          setIsTrial(trialActive);
        } catch (error) {
          console.error('Error checking trial status:', error);
        }
      }
    }
    checkTrialStatus();
  }, [userId, isPremium]);
  
  // Set exchange limits based on tier, with optional explicit override (e.g., anonymous = 3)
  const maxExchanges = typeof maxExchangesOverride === 'number'
    ? maxExchangesOverride
    : (isPremium || isTrial ? 40 : 3);
  const maxMessages = maxExchanges * 2; // 2 messages per exchange
  
  // Show chat limit modal when limit is reached (only once per session)
  useEffect(() => {
    if (messages.length >= maxMessages && !isPremium && !isTrial && !showChatLimitModal) {
      // Small delay to let user see the last message
      const timer = setTimeout(() => {
        setShowChatLimitModal(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [messages.length, maxMessages, isPremium, isTrial, showChatLimitModal]);
  
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

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Only scroll when messages change, not on typing indicator
    if (messages.length > 0) {
      // Small delay to ensure DOM is updated before scrolling
      setTimeout(() => {
        scrollToBottom();
      }, 150);
    }
  }, [messages]);

  // Seed a friendly intro message once when the panel opens
  useEffect(() => {
    if (!introShownRef.current && isOpen && messages.length === 0) {
      const candidateName = (receiptData?.userName || receiptData?.context?.userName || '').trim();
      const nameForGreeting = candidateName || 'bestie';
      const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const intro = {
        role: 'sage',
        content: `Hey, I'm Sage. Quick check - are you ${candidateName || nameForGreeting}? If not, tell me who you are.\n\nAsk me anything about these receipts, or just tell me what's happening?`,
        id: Date.now(),
        timestamp: ts
      };
      setMessages([intro]);
      introShownRef.current = true;
    }
  }, [isOpen]);

  // Dynamically size chat: grow until a viewport ceiling, then scroll
  useEffect(() => {
    const calcHeights = () => {
      // Reserve ~300px for header/input/spacing; ensure sensible minimum
      const ceiling = Math.max(260, window.innerHeight - 300);
      setMaxChatHeight(ceiling);
    };
    calcHeights();
    window.addEventListener('resize', calcHeights);
    return () => window.removeEventListener('resize', calcHeights);
  }, []);

  // Lock body scroll when expanded
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isExpanded]);

  // Copy message to clipboard
  const copyMessage = async (content, messageId) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading || messages.length >= maxMessages) return;
    
    // Debug: Verify receiptData has conversation field
    if (receiptData) {
      console.log('🔍 AskSageChat - receiptData check:', {
        hasConversation: !!receiptData.conversation,
        conversationLength: receiptData.conversation?.length || 0,
        hasArchetype: !!receiptData.archetype,
        hasVerdict: !!receiptData.verdict,
        hasRedFlags: typeof receiptData.redFlags !== 'undefined',
        receiptDataKeys: Object.keys(receiptData)
      });
    } else {
      console.warn('⚠️ AskSageChat - receiptData is null/undefined');
    }
    
    const userMsg = { 
      role: 'user', 
      content: input, 
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setTypingIndicator(true);

    // Simulate typing delay for more natural feel
    setTimeout(async () => {
      try {
        const response = await askSage(input, receiptData, messages, { userId, isPremium, isTrial });
        const assistantMsg = { 
          role: 'sage', 
          content: response, 
          id: Date.now() + 1,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, assistantMsg]);
      } catch (error) {
        console.error('Ask Sage error:', error);
        const errorMsg = { 
          role: 'sage', 
          content: "Bestie, my brain just glitched. Try again?", 
          id: Date.now() + 1,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, errorMsg]);
      }
      setLoading(false);
      setTypingIndicator(false);
    }, 1000 + Math.random() * 2000); // 1-3 second delay
  };

  if (!isOpen) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-6">
        <button 
          onClick={() => setIsOpen(true)}
          className="w-full p-5 bg-white/8 backdrop-blur-xl rounded-2xl text-white font-bold hover:bg-white/12 transition-all duration-300 shadow-2xl shadow-cyan-500/20 hover:shadow-cyan-500/30 border border-cyan-400/30 hover:border-cyan-400/50 transform hover:scale-[1.02]"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-full flex items-center justify-center shadow-lg border border-cyan-400/30">
              <span className="text-lg">🔮</span>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">Ask Sage Anything</div>
              <div className="text-sm opacity-90">Premium AI analysis for any situation</div>
            </div>
            {isPremium ? (
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-lg"></div>
            ) : (
              <div className="bg-gradient-to-r from-cyan-400 to-purple-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-cyan-400/30">
                PREMIUM
              </div>
            )}
          </div>
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop when expanded */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-[99] bg-black/80 backdrop-blur-sm"
          onClick={() => setIsExpanded(false)}
        />
      )}
      
      <div 
        className={`w-full ${isExpanded ? 'fixed inset-0 z-[100] overflow-y-auto' : 'max-w-2xl mx-auto mt-6'} flex flex-col transition-all duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sage Header - Matching Other Tabs */}
      <div className={`text-center ${isExpanded ? 'mb-4 pt-4' : 'mb-6'} relative z-50`}>
        <div className="inline-flex items-center gap-3 bg-black/30 px-6 py-3 rounded-2xl border border-white/20 mb-4 relative z-50 shadow-lg">
          <img 
            src={sageDarkCircle}
            alt="Sage" 
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-full border-2 border-teal-400/50 relative z-50"
            style={{
              filter: 'brightness(1.2) contrast(1.1)',
              boxShadow: '0 0 24px rgba(20, 184, 166, 0.4)'
            }}
          />
          <span className="text-lg sm:text-xl font-bold tracking-widest relative z-50"
            style={{
              color: '#14B8A6',
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.6), 0 0 50px rgba(20, 184, 166, 0.5)'
            }}>
            CHAT WITH SAGE
          </span>
        </div>
      </div>
      
      {/* Chat Container - Clean Character AI Style */}
      <div className={`bg-white/8 backdrop-blur-xl ${isExpanded ? 'rounded-t-2xl' : 'rounded-2xl'} shadow-2xl shadow-cyan-500/20 border border-cyan-400/30 overflow-hidden flex flex-col ${isExpanded ? 'flex-1' : ''}`} style={{ 
        minHeight: isExpanded ? 'calc(100vh - 200px)' : '600px', 
        maxHeight: isExpanded ? 'none' : 'calc(100vh - 300px)',
        height: isExpanded ? 'calc(100vh - 200px)' : '600px',
        background: isExpanded ? 'rgba(15, 15, 15, 0.98)' : undefined
      }}>
      
      {/* Expand/Collapse Button */}
      <div className="flex justify-end p-3 border-b border-white/10">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all group"
          title={isExpanded ? "Minimize chat" : "Expand to full page"}
        >
          {isExpanded ? (
            <>
              <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:hidden font-medium">Minimize</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:hidden font-medium">Full Page</span>
            </>
          )}
        </button>
      </div>
      
      {/* Chat Content - Clean Character AI Style */}
      <div className="flex flex-col h-full flex-1" style={{ minHeight: 0 }}>
      
        {/* Messages - Cleaner spacing, better bubbles */}
        <div 
          ref={messagesContainerRef} 
          className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-hide"
          style={{ 
            minHeight: 0,
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-400/30">
                <span className="text-3xl">🔮</span>
              </div>
              <p className="text-white font-medium text-base mb-1">
                Ask me anything about these receipts
              </p>
              <p className="text-gray-400 text-xs mb-6">
                {maxExchanges} exchanges available
              </p>
              
              {/* Quick action buttons - Cleaner, more compact */}
              <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                {[
                  "Should I text them?",
                  "What should I do next?",
                  "Are they toxic?",
                  "Should I block them?"
                ].map((suggestion) => (
                <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-300 text-xs transition-all border border-white/10 hover:border-cyan-400/40 hover:text-white"
                >
                    {suggestion}
                </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={msg.id || i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-3 group`}>
              {/* Sage Avatar - Only for Sage messages */}
              {msg.role === 'sage' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border-2 border-teal-400/50" style={{
                  boxShadow: '0 0 12px rgba(20, 184, 166, 0.3)'
                }}>
                  <img 
                    src={sageDarkCircle}
                    alt="Sage"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Message Bubble - Character AI Style */}
              <div className={`max-w-[85%] sm:max-w-[75%] relative ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg rounded-2xl rounded-tr-sm' 
                  : 'bg-slate-800/90 text-slate-100 border border-slate-700/50 backdrop-blur-sm rounded-2xl rounded-tl-sm'
              } px-4 py-3 transition-all duration-200`}>
                <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</div>
                
                {/* Message timestamp - Subtle */}
                <div className={`text-xs mt-2 opacity-60 ${
                  msg.role === 'user' ? 'text-purple-100' : 'text-slate-400'
                }`}>
                  {msg.timestamp}
                </div>
                
                {/* Message actions - Always visible on mobile */}
                <div className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 sm:opacity-0 transition-opacity duration-200 ${
                  msg.role === 'user' ? 'text-purple-100' : 'text-slate-400'
                }`}>
                    <button
                      onClick={() => copyMessage(msg.content, msg.id)}
                    className="p-1.5 hover:bg-white/10 rounded transition-colors"
                      title="Copy message"
                    >
                      {copiedMessageId === msg.id ? (
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                      <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                </div>
              </div>
              
              {/* User Avatar Placeholder - Only for user messages */}
              {msg.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold border-2 border-purple-400/50">
                  You
                </div>
              )}
            </div>
          ))}
          {typingIndicator && (
            <div className="flex justify-start items-start gap-3">
              {/* Sage Avatar */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border-2 border-teal-400/50" style={{
                boxShadow: '0 0 12px rgba(20, 184, 166, 0.3)'
              }}>
                <img 
                  src={sageDarkCircle}
                  alt="Sage"
                  className="w-full h-full object-cover"
                />
                  </div>
              
              {/* Typing Indicator Bubble */}
              <div className="bg-slate-800/90 text-slate-100 border border-slate-700/50 backdrop-blur-sm rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input - Clean Character AI Style - Expandable */}
        <div className="border-t border-white/10 bg-slate-900/50 backdrop-blur-sm p-4 flex-shrink-0">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
              <textarea
                ref={(el) => {
                  if (el) {
                    // Auto-resize textarea to fit content (up to 3 lines)
                    el.style.height = 'auto';
                    const lineHeight = 24; // Approximate line height in pixels
                    const maxLines = 3;
                    const maxHeight = lineHeight * maxLines + 24; // 24px for padding
                    const newHeight = Math.min(el.scrollHeight, maxHeight);
                    el.style.height = `${newHeight}px`;
                    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
                  }
                }}
              value={input}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    setInput(e.target.value);
                    // Trigger resize
                    e.target.style.height = 'auto';
                    const lineHeight = 24;
                    const maxLines = 3;
                    const maxHeight = lineHeight * maxLines + 24;
                    const newHeight = Math.min(e.target.scrollHeight, maxHeight);
                    e.target.style.height = `${newHeight}px`;
                    e.target.style.overflowY = e.target.scrollHeight > maxHeight ? 'auto' : 'hidden';
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              placeholder="Ask Sage anything about this receipt..."
                className="w-full p-3 pr-20 bg-slate-800/80 border border-slate-700/50 rounded-xl text-slate-100 placeholder-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all backdrop-blur-sm resize-none text-sm"
              disabled={loading || messages.length >= maxMessages}
              rows={1}
                style={{ 
                  minHeight: '44px', 
                  maxHeight: '96px',
                  lineHeight: '24px',
                  overflowY: 'auto'
                }}
            />
              <div className="absolute bottom-2 right-2 text-xs text-slate-500 pointer-events-none">
              {input.length}/500
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={loading || messages.length >= maxMessages || !input.trim()}
              className="p-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl hover:from-cyan-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl border border-cyan-400/30 flex-shrink-0"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <Send className="w-5 h-5" />
            )}
          </button>
          </div>
        </div>
        </div>
      
        {messages.length >= maxMessages && (
          <div className="mt-4">
            {!isPremium && !isTrial ? (
              <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 rounded-xl p-4 border border-slate-600/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-full flex items-center justify-center border border-amber-500/30">
                    <span className="text-amber-400 text-sm">💎</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      Chat limit reached ({maxExchanges} exchanges)
                    </p>
                    <p className="text-xs text-slate-400">
                      Upgrade to continue the conversation!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 text-center backdrop-blur-sm">
                <p className="text-sm text-slate-300">
                  Chat limit reached (40 exchanges) - start a new analysis for more
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Chat Limit Modal - Emergency Pack + $4.99 Monthly */}
        <AnimatePresence>
          {showChatLimitModal && !isPremium && !isTrial && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
              onClick={() => setShowChatLimitModal(false)}
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
                  onClick={() => setShowChatLimitModal(false)}
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
                    You're on a roll! 🔥
                  </h2>

                  {/* Description */}
                  <p className="text-gray-300 mb-6 leading-relaxed text-sm sm:text-base">
                    You've used your {maxExchanges} free chats. Keep the conversation going and get unlimited insights!
                  </p>

                  {/* Primary CTA: Emergency Pack */}
                  <div className="space-y-3 mb-4">
                    <button
                      onClick={() => {
                        setShowChatLimitModal(false);
                        handleCheckout('price_1SRl6hG71EqeOEZebPJkKJB6', 'Emergency Pack x5');
                      }}
                      disabled={loadingPriceId === 'price_1SRl6hG71EqeOEZebPJkKJB6'}
                      className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 hover:from-cyan-600 hover:via-purple-600 hover:to-cyan-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {loadingPriceId === 'price_1SRl6hG71EqeOEZebPJkKJB6' ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <span className="text-lg">🆘</span>
                            <span>Continue Chatting - $0.99</span>
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    </button>
                    <p className="text-xs text-gray-400 -mt-2">
                      5 more receipts + 40 chats each
                    </p>
                  </div>

                  {/* Secondary CTA: $4.99 Monthly */}
                  <div className="space-y-3 mb-4">
                    <button
                      onClick={() => {
                        setShowChatLimitModal(false);
                        handleCheckout('price_1SI49tG71EqeOEZe0p9LNpbP', 'Premium Monthly');
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
                          <span>Never Hit Limits - $4.99/month</span>
                        </>
                      )}
                    </button>
                    <p className="text-xs text-gray-400 -mt-2">
                      Unlimited receipts + 40 chats each
                    </p>
                  </div>

                  {/* Dismiss */}
                  <button
                    onClick={() => setShowChatLimitModal(false)}
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
    </>
  );
}
