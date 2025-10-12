import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Info } from 'lucide-react';

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
        <span>Tips: How to best upload conversations</span>
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
              <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                <span className="text-lg">💡</span>
                How to copy chats from your app
              </h3>
              
              <div className="text-xs text-gray-400 mb-3 p-2 bg-gray-800/30 rounded-lg">
                <p><span className="text-purple-400">Text input:</span> up to 5k characters (about 10-15 Instagram captions) long</p>
                <p><span className="text-purple-400">Screenshots:</span> up to 5 images, 5MB total</p>
              </div>
              
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
                  <span className="font-bold">Pro Tip from Sage:</span> I work best with 2-person chats back and forth. 
                  Add more people and you may get alphabet soup. Keep it simple, bestie! 🔮
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
