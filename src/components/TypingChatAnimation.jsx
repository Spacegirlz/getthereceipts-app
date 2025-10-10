import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import sageDarkCircle from '@/assets/sage-dark-circle.png';

const TypingChatAnimation = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [revealPercent, setRevealPercent] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isClearing, setIsClearing] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const [cursorBlinks, setCursorBlinks] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showStartCursor, setShowStartCursor] = useState(true);

  const conversations = [
    {
      id: '2am-breadcrumb',
      emoji: '🌙💔',
      label: 'The 2AM Breadcrumber',
      messages: [
        { text: '"Hey you up?"', color: 'text-pink-400', time: '2:47 AM' },
        { text: '"Was thinking about you"', color: 'text-pink-300', time: '2:51 AM' }
      ]
    },
    {
      id: 'schedule-phantom',
      emoji: '📅👻',
      label: 'The Schedule Phantom',
      messages: [
        { text: '"Still on for Saturday?"', color: 'text-blue-400' },
        { text: '"Omg so busy, rain check?"', color: 'text-blue-300' }
      ]
    },
    {
      id: 'green-flag',
      emoji: '💚✨',
      label: 'The Actual Adult™',
      messages: [
        { text: '"Running 5 min late!"', color: 'text-green-400' },
        { text: '"Got us a table, take your time"', color: 'text-green-300' }
      ]
    }
  ];

  // Select random conversation on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * conversations.length);
    setSelectedConversation(conversations[randomIndex]);
  }, []);

  const messages = selectedConversation?.messages || [];

  // Smooth character reveal with proper text display
  useEffect(() => {
    if (!messages.length) return;

    if (currentMessageIndex >= messages.length) {
      setIsComplete(true);
      // Final cursor before archetype
      setShowCursor(true);
      
      setTimeout(() => {
        setShowCursor(false);
        // Quick transition to archetype
        setTimeout(() => setIsClearing(true), 300);
      }, 1500); // Cursor shows for 1.5s
      
      return;
    }

    const currentMessage = messages[currentMessageIndex];
    setRevealPercent(0);
    setShowCursor(false);
    setIsTyping(true);
    setShowStartCursor(false);
    
    // Smooth character reveal over 2 seconds
    const duration = 2000;
    const startTime = Date.now();
    const totalChars = currentMessage.text.length;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out for natural feel
      const eased = 1 - Math.pow(1 - progress, 3);
      const charsToShow = Math.floor(eased * totalChars);
      setRevealPercent(charsToShow);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Typing complete
        setIsTyping(false);
        setShowCursor(true);
        setTimeout(() => {
          setShowCursor(false);
          setTimeout(() => {
            setCurrentMessageIndex(prev => prev + 1);
          }, 300);
        }, 1500);
      }
    };
    
    requestAnimationFrame(animate);
  }, [currentMessageIndex, messages]);

  // Clear dissolve between conversations, showing archetype label
  useEffect(() => {
    if (!isClearing) return;
    const resetTimer = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * conversations.length);
      setSelectedConversation(conversations[randomIndex]);
      setCurrentMessageIndex(0);
      setRevealPercent(0);
      setIsComplete(false);
      setIsClearing(false);
    }, 2000); // Longer archetype display - let users absorb it
    return () => clearTimeout(resetTimer);
  }, [isClearing]);

  if (!selectedConversation) return null;

  const prevMessage = currentMessageIndex > 0 && currentMessageIndex <= messages.length
    ? messages[currentMessageIndex - 1]
    : null;
  const currMessage = currentMessageIndex < messages.length ? messages[currentMessageIndex] : null;

  return (
    <div className="flex flex-col items-center justify-center mb-8 px-4 h-[140px] md:h-[160px]">
      <div className="p-4 md:p-6 max-w-lg md:max-w-xl w-full h-full flex flex-col justify-center">
        {/* Archetype label with fade in + dissolve - CENTERED */}
        {isClearing ? (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex items-center justify-center space-x-3"
          >
            <motion.img
              initial={{ opacity: 0, scale: 0.7, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "backOut" }}
              src={sageDarkCircle}
              alt="Sage"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full"
            />
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="text-sm md:text-base text-teal-300 font-bold"
            >
              {selectedConversation.label} {selectedConversation.emoji}
            </motion.span>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-3">
            {/* Previous message - STAYS VISIBLE but dimmed */}
            {prevMessage && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0.3 }}
                className="flex items-center space-x-3"
              >
                <span className={`${prevMessage.color} text-base md:text-lg`}>
                  💬 {prevMessage.text}
                </span>
              </motion.div>
            )}
            
            {/* Current message - TYPING */}
            {currMessage && (
              <motion.div
                key={currentMessageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center space-x-3"
              >
                <span className={`${currMessage.color} text-base md:text-lg tracking-wide`}>
                  💬 {currMessage.text.slice(0, revealPercent)}
                  {/* Fixed width cursor container to prevent backspace effect */}
                  <span className="inline-block w-1">
                    {/* Cursor appears ONLY after typing completes */}
                    {showCursor && !isTyping && (
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        |
                      </motion.span>
                    )}
                  </span>
                </span>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingChatAnimation;
