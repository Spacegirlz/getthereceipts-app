import React, { useState, useRef, useEffect } from 'react';
import { askSage } from '@/lib/chat/askSage';
import { Send, Loader2, Copy, Check, MoreVertical, Heart, ThumbsUp } from 'lucide-react';

export function AskSageChat({ receiptData, isPremium = false }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const messagesContainerRef = useRef(null);
  const [maxChatHeight, setMaxChatHeight] = useState(null);
  const introShownRef = useRef(false);
  
  // Set exchange limits based on premium status
  const maxExchanges = isPremium ? 40 : 5;
  const maxMessages = maxExchanges * 2; // 2 messages per exchange

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
        const response = await askSage(input, receiptData, messages);
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
          className="w-full p-5 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-2xl text-white font-bold hover:from-purple-700 hover:via-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-2xl hover:shadow-3xl border-2 border-purple-400/30 hover:border-purple-300/50 transform hover:scale-[1.02]"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-lg">🔮</span>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">Ask Sage Anything</div>
              <div className="text-sm opacity-90">About This Receipt</div>
            </div>
            {isPremium ? (
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-lg"></div>
            ) : (
              <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                PREMIUM
              </div>
            )}
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/60 overflow-hidden flex flex-col" style={{ boxShadow: '0 0 0 1px rgba(148, 163, 184, 0.15), inset 0 0 0 0.5px rgba(148, 163, 184, 0.15)' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 px-6 py-5 border-b border-purple-400/30">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">🔮</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-xl">Ask Sage</h3>
              <p className="text-purple-100 text-sm">AI-powered analysis for any situation</p>
            </div>
            {isPremium ? (
              <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                PREMIUM
              </div>
            ) : (
              <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                UPGRADE
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white hover:text-white transition-colors shadow-lg"
          >
            ✕
          </button>
        </div>
      </div>
      
      {/* Chat Content */}
      <div className="p-6 flex flex-col h-full">
      
        {/* Messages */}
        <div ref={messagesContainerRef} className="space-y-4 mb-6 flex-1 overflow-y-auto" style={{ maxHeight: (messages.length > 0 && maxChatHeight) ? `${maxChatHeight}px` : undefined }}>
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-3 border border-blue-500/30">
                <span className="text-2xl">💬</span>
              </div>
              <p className="text-slate-200 text-sm">
                Ask me anything about these receipts, bestie...
              </p>
              <p className="text-slate-400 text-xs mt-1">
                {maxExchanges} exchanges available
              </p>
              
              {/* Quick action buttons */}
              <div className="mt-6 grid grid-cols-2 gap-3 max-w-md mx-auto">
                <button
                  onClick={() => setInput("Should I text them?")}
                  className="p-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 rounded-xl text-slate-200 text-xs transition-all border border-purple-500/30 hover:border-purple-400/50"
                >
                  Should I text them?
                </button>
                <button
                  onClick={() => setInput("What should I do next?")}
                  className="p-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 rounded-xl text-slate-200 text-xs transition-all border border-purple-500/30 hover:border-purple-400/50"
                >
                  What should I do next?
                </button>
                <button
                  onClick={() => setInput("Are they toxic?")}
                  className="p-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 rounded-xl text-slate-200 text-xs transition-all border border-purple-500/30 hover:border-purple-400/50"
                >
                  Are they toxic?
                </button>
                <button
                  onClick={() => setInput("Should I block them?")}
                  className="p-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 rounded-xl text-slate-200 text-xs transition-all border border-purple-500/30 hover:border-purple-400/50"
                >
                  Should I block them?
                </button>
                <button
                  onClick={() => setInput("What does this situation mean?")}
                  className="p-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 rounded-xl text-slate-200 text-xs transition-all border border-purple-500/30 hover:border-purple-400/50"
                >
                  What does this mean?
                </button>
                <button
                  onClick={() => setInput("How should I handle this?")}
                  className="p-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 rounded-xl text-slate-200 text-xs transition-all border border-purple-500/30 hover:border-purple-400/50"
                >
                  How should I handle this?
                </button>
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={msg.id || i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}>
              <div className={`max-w-[80%] relative ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                  : 'bg-slate-800/80 text-slate-100 border border-slate-700/50 backdrop-blur-sm'
              } rounded-2xl p-4 transition-all duration-200 hover:shadow-xl`}>
                <div className="text-sm leading-relaxed pr-8 whitespace-pre-wrap">{msg.content}</div>
                
                {/* Message timestamp */}
                <div className={`text-xs mt-2 ${
                  msg.role === 'user' ? 'text-purple-100' : 'text-slate-400'
                }`}>
                  {msg.timestamp}
                </div>
                
                {/* Message actions */}
                <div className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                  msg.role === 'user' ? 'text-purple-100' : 'text-slate-400'
                }`}>
                  <div className="flex gap-1">
                    <button
                      onClick={() => copyMessage(msg.content, msg.id)}
                      className="p-1 hover:bg-white/10 rounded transition-colors"
                      title="Copy message"
                    >
                      {copiedMessageId === msg.id ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                    {msg.role === 'sage' && (
                      <button
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Like response"
                      >
                        <Heart className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {typingIndicator && (
            <div className="flex justify-start">
              <div className="bg-slate-800/80 text-slate-100 border border-slate-700/50 backdrop-blur-sm rounded-2xl p-4 max-w-[80%]">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">🔮</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-300 text-sm">Sage is typing</span>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Ask Sage anything about this receipt..."
              className="w-full p-4 pr-12 bg-slate-800/80 border border-slate-700/50 rounded-xl text-slate-100 placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all backdrop-blur-sm resize-none"
              disabled={loading || messages.length >= maxMessages}
              rows={1}
            />
            <div className="absolute bottom-2 right-2 text-xs text-slate-500">
              {input.length}/500
            </div>
          </div>
          <button
            onClick={handleSend}
            disabled={loading || messages.length >= maxMessages || !input.trim()}
            className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl border border-purple-500/30 group"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            )}
          </button>
        </div>
      
        {messages.length >= maxMessages && (
          <div className="mt-4">
            {!isPremium ? (
              <div className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 rounded-xl p-4 border border-slate-600/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-full flex items-center justify-center border border-amber-500/30">
                    <span className="text-amber-400 text-sm">💎</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      Chat limit reached (5 exchanges)
                    </p>
                    <p className="text-xs text-slate-400">
                      Upgrade to Premium for 40 exchanges per receipt!
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
      </div>
    </div>
  );
}
