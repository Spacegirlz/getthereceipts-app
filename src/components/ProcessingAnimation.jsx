import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Cute 10-second loop animation for processing
 * Features a randomly selected bouncing character (panda, dog, teacup, or hippo)
 * Different character each time for variety and fun!
 */
const ProcessingAnimation = () => {
  // Random character selection - different each time component mounts
  const [character, setCharacter] = useState(() => {
    const characters = [
      { emoji: '🐼', name: 'panda', size: 'text-7xl md:text-8xl' },
      { emoji: '🐕', name: 'dog', size: 'text-7xl md:text-8xl' },
      { emoji: '☕', name: 'teacup', size: 'text-6xl md:text-7xl' },
      { emoji: '🦛', name: 'hippo', size: 'text-7xl md:text-8xl' },
      { emoji: '🦄', name: 'unicorn', size: 'text-7xl md:text-8xl' },
      { emoji: '🐸', name: 'frog', size: 'text-7xl md:text-8xl' },
    ];
    return characters[Math.floor(Math.random() * characters.length)];
  });

  return (
    <div className="relative w-full h-64 flex items-center justify-center overflow-hidden">
      {/* Background sparkles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => {
          // Generate random positions once per sparkle
          const initialX = Math.random() * 100;
          const initialY = Math.random() * 100;
          const animateX = (Math.random() - 0.5) * 80;
          const animateY = (Math.random() - 0.5) * 80;
          
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full"
              style={{
                left: `${initialX}%`,
                top: `${initialY}%`,
              }}
              initial={{
                opacity: 0,
                scale: 0,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0, 1.2, 0],
                x: [0, animateX, 0],
                y: [0, animateY, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>

      {/* Main bouncing character - randomly selected, transforms through different fun states */}
      <motion.div
        className="relative"
        animate={{
          y: [0, -60, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeOut",
        }}
      >
        {/* Character emoji with scale bounce - different bounce intensity based on character */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotate: character.name === 'teacup' 
              ? [0, -15, 15, 0] // Teacup spins more
              : character.name === 'unicorn'
              ? [0, -20, 20, 0] // Unicorn is more magical
              : [0, -10, 10, 0], // Others gentle wiggle
          }}
          transition={{
            duration: character.name === 'teacup' ? 1.5 : 1.2,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className={character.size}
        >
          {character.emoji}
        </motion.div>

        {/* Sparkle trail that follows */}
        <motion.div
          className="absolute -top-2 -right-2 text-2xl"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.3, 1],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ✨
        </motion.div>
      </motion.div>

      {/* Floating bubbles that pop up sporadically - removed crystal ball and receipt */}
      {[...Array(2)].map((_, i) => {
        const emojis = ['💭', '✨'];
        // Calculate positions as numbers (relative to center)
        const centerX = 0;
        const centerY = 0;
        const animateX = (i - 1) * 30; // -30 or 30
        const animateY = -30 + (i % 2) * 20; // -30 or -10
        
        return (
          <motion.div
            key={`float-${i}`}
            className="absolute text-3xl"
            style={{
              left: '50%',
              top: '50%',
            }}
            initial={{
              x: 0,
              y: 0,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              x: [0, animateX, 0],
              y: [0, animateY, 0],
              opacity: [0, 0.7, 0],
              scale: [0, 1.2, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              delay: i * 1.2, // More sporadic timing
              ease: "easeInOut",
            }}
          >
            {emojis[i]}
          </motion.div>
        );
      })}

      {/* Bouncing dots at bottom - progress indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-cyan-400 rounded-full"
            animate={{
              scale: [1, 1.6, 1],
              opacity: [0.4, 1, 0.4],
              y: [0, -8, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.25,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

    </div>
  );
};

export default ProcessingAnimation;

