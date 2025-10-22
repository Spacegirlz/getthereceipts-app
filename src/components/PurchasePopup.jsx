import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const PurchasePopup = () => {
  const location = useLocation();
  const [currentPopup, setCurrentPopup] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // Only show popup on landing page and pricing page
  const shouldShowPopup = location.pathname === '/' || location.pathname === '/pricing';

  const purchaseMessages = [
    // Premium Monthly (most frequent)
    { emoji: '⚡', name: 'Sarah', city: 'Brooklyn', action: 'just went Premium Monthly', time: '2 minutes ago' },
    { emoji: '✨', name: 'Mike', city: 'Dallas', action: 'just upgraded to Premium', time: 'Just now' },
    { emoji: '🎯', name: 'Ashley', city: 'Phoenix', action: 'just got unlimited receipts', time: '5 minutes ago' },
    { emoji: '⚡', name: 'Mia', city: 'LA', action: 'just went Premium Monthly', time: '1 minute ago' },
    { emoji: '✨', name: 'Tyler', city: 'Austin', action: 'just upgraded to Premium', time: '3 minutes ago' },
    { emoji: '🎯', name: 'Logan', city: 'Miami', action: 'just got unlimited receipts', time: 'Just now' },
    { emoji: '⚡', name: 'Emma', city: 'Seattle', action: 'just went Premium Monthly', time: '1 minute ago' },
    { emoji: '✨', name: 'Carlos', city: 'Miami', action: 'just upgraded to Premium', time: '3 minutes ago' },
    { emoji: '🎯', name: 'Priya', city: 'Chicago', action: 'just got unlimited receipts', time: 'Just now' },
    { emoji: '⚡', name: 'Maya', city: 'Denver', action: 'just went Premium Monthly', time: '2 minutes ago' },
    
    // OG Founder's Club (less frequent, high impact)
    { emoji: '👑', name: 'Alex', city: 'Portland', action: 'locked in OG Founder pricing', time: 'Just now' },
    { emoji: '🏆', name: 'Jordan', city: 'Austin', action: 'joined OG Founder\'s Club', time: '2 minutes ago' },
    { emoji: '⭐', name: 'Sam', city: 'Denver', action: 'joined OG Founder\'s Club', time: '4 minutes ago' },
    { emoji: '👑', name: 'Chris', city: 'Boston', action: 'locked in OG Founder pricing', time: '1 minute ago' },
    { emoji: '⭐', name: 'Jamie', city: 'Brooklyn', action: 'joined OG Founder\'s Club', time: '3 minutes ago' }
  ];

  useEffect(() => {
    // Only show popups on landing page and pricing page
    if (!shouldShowPopup) {
      return;
    }

    // Don't show popups during checkout or success pages
    if (window.location.pathname.includes('checkout') || window.location.pathname.includes('success')) {
      return;
    }

    const showRandomPopup = () => {
      const randomMessage = purchaseMessages[Math.floor(Math.random() * purchaseMessages.length)];
      setCurrentPopup(randomMessage);
      setIsVisible(true);
      
      // Hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setCurrentPopup(null), 300); // Wait for fade out
      }, 5000);
    };

    // Initial delay before first popup (30-60 seconds)
    const initialDelay = Math.random() * 30000 + 30000;
    const initialTimeout = setTimeout(showRandomPopup, initialDelay);

    // Set up recurring popups every 60-120 seconds
    const interval = setInterval(() => {
      const delay = Math.random() * 60000 + 60000; // 60-120 seconds
      setTimeout(showRandomPopup, delay);
    }, 90000); // Check every 90 seconds

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [shouldShowPopup]);

  if (!currentPopup) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-5 right-5 z-50"
          initial={{ opacity: 0, x: 300, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 300, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            background: 'rgba(26, 16, 40, 0.95)',
            borderTop: '2px solid #4de0d3',
            padding: '14px 18px',
            borderRadius: '8px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            maxWidth: '280px',
            minWidth: '260px'
          }}
        >
          <div className="text-white">
            <div className="flex items-start gap-2 mb-1">
              <span className="text-lg flex-shrink-0">{currentPopup.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm leading-tight">
                  {currentPopup.name} from {currentPopup.city}
                </div>
                <div className="text-gray-200 text-sm leading-tight">
                  {currentPopup.action}
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-400 text-right">
              {currentPopup.time}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PurchasePopup;