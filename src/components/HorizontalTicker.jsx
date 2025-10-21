import React from 'react';
import { motion } from 'framer-motion';

const HorizontalTicker = () => {
  const tickerMessages = [
    "Sarah's mom is indeed guilt tripping.",
    "Alex confirmed it was, in fact, 'just a joke'.",
    "Megan's Hinge date is love-bombing.",
    "Jake's ex is breadcrumbing again.",
    "Emma spotted a gaslighter from miles away.",
    "Tyler's situationship is giving mixed signals.",
    "Zoe decoded the 'k.' text perfectly.",
    "Marcus identified the future faker.",
    "Ashley's gut was right about the ghoster.",
    "Logan's midnight 'hey u' got exposed.",
    "Priya's coworker is definitely flirting.",
    "Sam's bestie is being passive aggressive.",
    "Chris's date is love-bombing hard.",
    "Maya's ex is trying to hoover back.",
    "Jordan's situationship is breadcrumbing.",
    "Taylor's 'busy' excuse got called out.",
    "Riley's text patterns revealed everything.",
    "Casey's gut feeling was validated.",
    "Morgan's mixed signals got decoded.",
    "Avery's ghosting attempt was spotted."
  ];

  // Duplicate messages for seamless loop
  const duplicatedMessages = [...tickerMessages, ...tickerMessages];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full bg-slate-800/60 border-y border-slate-600/40 py-4 backdrop-blur-sm overflow-hidden"
    >
      <div className="flex items-center w-full">
        <div className="flex-shrink-0 ml-4 mr-8">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-cyan-400 text-sm font-semibold">LIVE</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="flex space-x-8 whitespace-nowrap">
            <motion.div
              className="flex space-x-8 whitespace-nowrap"
              animate={{
                x: [`0%`, `-50%`]
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 60, // 1 minute for full cycle - proper news ticker speed
                  ease: "linear",
                }
              }}
            >
              {duplicatedMessages.map((message, index) => (
                <span
                  key={index}
                  className="text-gray-200 text-base font-medium flex-shrink-0"
                >
                  {message} •
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HorizontalTicker;
