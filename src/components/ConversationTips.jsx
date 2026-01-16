import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Info } from 'lucide-react';
import ghostingChampionTruth from '@/assets/GTR Demo Assets/Truth Receipts/ghosting-champion-sage-receipt-1761066312906.png';

const ConversationTips = () => {
  const [showTips, setShowTips] = useState(false);
  
  const platformTips = [
    {
      platform: "iMessage",
      icon: "💬",
      method: "Press & hold a message → More → Select messages → Share → Copy",
      tip: "Or take screenshots and use our Screenshot tab"
    },
    {
      platform: "WhatsApp", 
      icon: "💚",
      method: "Chat → ⋮ Menu → More → Export Chat → Without Media → Copy",
      tip: "Easiest export! Includes timestamps automatically"
    },
    {
      platform: "Instagram DMs",
      icon: "📸",
      method: "Can't copy directly - use Screenshot tab instead",
      tip: "IG doesn't allow text copying, screenshots work best"
    },
    {
      platform: "Snapchat",
      icon: "👻",
      method: "Press & hold message → Copy or take screenshots",
      tip: "Messages disappear, so screenshot quickly!"
    },
    {
      platform: "Discord",
      icon: "🎮",
      method: "Select messages with Shift+Click → Right click → Copy",
      tip: "On mobile: Long press → Copy Text"
    },
    {
      platform: "Facebook Messenger",
      icon: "💙",
      method: "Web: Select text → Copy | Mobile: Long press → Copy",
      tip: "Or use Download Your Information for full export"
    },
    {
      platform: "Tinder/Hinge/Bumble",
      icon: "🔥",
      method: "Screenshots only - can't copy text directly",
      tip: "Use our Screenshot tab for dating app convos"
    },
    {
      platform: "TikTok DMs",
      icon: "🎵",
      method: "Long press message → Copy or screenshot",
      tip: "Limited copy options, screenshots often easier"
    },
    {
      platform: "Telegram",
      icon: "✈️",
      method: "Select messages → Copy or Export Chat History",
      tip: "Desktop: Click & drag to select multiple messages"
    },
    {
      platform: "SMS/Text",
      icon: "📱",
      method: "Long press → Select → Copy (Android/iPhone)",
      tip: "Or forward to email then copy from there"
    }
  ];

  return (
    <div className="mb-4">
      {/* Clickable Tips Button */}
      <button
        onClick={() => setShowTips(!showTips)}
        className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2 mb-2"
      >
        <Info className="w-4 h-4" />
        <span>Tips: Paste chat or tell your story</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${showTips ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Popup with Tips */}
      <AnimatePresence>
        {showTips && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-gray-900/95 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 relative mb-4"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowTips(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Tips Content */}
            <div className="pr-8">
              {/* Paste This → Get This Example */}
              <div className="mb-6 p-3 sm:p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl border border-cyan-400/30">
                <h3 className="text-xs sm:text-sm font-bold text-cyan-400 mb-3">📱 See Example: Paste This → Get This</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
                  {/* Input Example */}
                  <div>
                    <p className="text-xs font-semibold text-cyan-300 mb-2">Input:</p>
                    <div className="bg-black/40 rounded-lg p-2 sm:p-3 text-[10px] sm:text-xs text-gray-300 font-mono leading-relaxed border border-cyan-400/20 overflow-x-auto">
                      <pre className="whitespace-pre-wrap font-sans break-words">Tyler: just thinking about you
You: That's sweet! Want to grab coffee this week?
Tyler: yeah that sounds nice
You: How about Thursday?
Tyler: maybe, I'll let you know
[3 days later]
You: Hey, still up for coffee?
Tyler: sorry been so busy
You: No worries, when works for you?
Tyler: I'll check my schedule and get back to you</pre>
                    </div>
                  </div>
                  {/* Output List */}
                  <div>
                    <p className="text-xs font-semibold text-cyan-300 mb-2">Output:</p>
                    <div className="bg-black/40 rounded-lg p-2 sm:p-3 space-y-1.5 sm:space-y-2 border border-cyan-400/20">
                      <div className="flex items-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-300">
                        <span className="text-cyan-400 flex-shrink-0">✓</span>
                        <span className="break-words">Sage's Receipt</span>
                      </div>
                      <div className="flex items-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-300">
                        <span className="text-cyan-400 flex-shrink-0">✓</span>
                        <span className="break-words">Sage's Playbook</span>
                      </div>
                      <div className="flex items-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-300">
                        <span className="text-cyan-400 flex-shrink-0">✓</span>
                        <span className="break-words">Immunity Training</span>
                      </div>
                      <div className="flex items-start gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-cyan-300 pt-1 border-t border-cyan-400/20">
                        <span className="text-purple-400 flex-shrink-0">+</span>
                        <span className="font-semibold break-words">Plus Beta Access to Sage Chatbot</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Receipt Preview */}
                <div className="relative">
                  <img
                    src={ghostingChampionTruth}
                    alt="Example Receipt - Ghosting Champion"
                    className="w-full rounded-lg border border-white/20"
                  />
                  <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-gradient-to-r from-cyan-400 to-purple-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-semibold">
                    Truth Receipt
                  </div>
                </div>
                <p className="text-[10px] sm:text-xs text-cyan-400 font-semibold mt-2 text-center">Ghosting Champion - Sugar-coated ghosting detected</p>
              </div>

              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <span className="text-lg">💡</span>
                Quick start
              </h3>
              
              {/* Two main options - visual cards */}
              <div className="grid grid-cols-1 gap-3 mb-4">
                <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <p className="text-xs font-semibold text-purple-300 mb-1 flex items-center gap-1">
                    <span>📋</span> Paste Chat
                  </p>
                  <p className="text-xs text-gray-300">Copy formatted messages (Name: message) from any app</p>
                </div>
                
                <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  <p className="text-xs font-semibold text-cyan-300 mb-1 flex items-center gap-1">
                    <span>✨</span> Tell Your Story
                  </p>
                  <p className="text-xs text-gray-300">Write naturally using "I" for yourself and their name</p>
                  <p className="text-xs text-cyan-400/80 italic mt-1">💡 Often gives better results!</p>
                </div>
              </div>
              
              <div className="text-xs text-gray-400 mb-4 p-2 bg-gray-800/30 rounded-lg">
                <p><span className="text-purple-400">Screenshots:</span> Use the Screenshot tab for up to 5 images</p>
              </div>
              
              <h4 className="text-xs font-semibold text-white/90 mb-2 mt-4">How to copy chats from your app:</h4>
              
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {platformTips.map((platform) => (
                  <div key={platform.platform} className="text-xs">
                    <div className="flex items-start gap-2">
                      <span className="text-lg mt-1 flex-shrink-0">{platform.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white/90 mb-1">
                          {platform.platform}
                        </p>
                        <p className="text-white/60 mb-1 break-words">
                          {platform.method}
                        </p>
                        <p className="text-purple-400 italic">
                          💡 {platform.tip}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pro Tip */}
              <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                <p className="text-xs text-purple-300">
                        <span className="font-bold">Pro Tip from Sage:</span> I work best with 2-person chats. 
                        Add more people and you may get alphabet soup. Keep it simple, bestie! Group chats are coming soon!🔮
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConversationTips;
