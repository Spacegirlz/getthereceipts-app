import React from 'react';
import { motion } from 'framer-motion';
import sageCharacter from '@/assets/sage-receipt-page.png';

const AgeVerificationModal = ({ isOpen, onConfirm, onDecline }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <motion.div
        className="relative w-full max-w-md rounded-2xl p-8 text-center"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', duration: 0.5 }}
        style={{
          background: 'rgba(17, 22, 43, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(212, 175, 55, 0.3)',
          boxShadow: '0 0 30px rgba(212, 175, 55, 0.2), 0 8px 32px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Sage Character */}
        <div className="mb-4">
          <img 
            src={sageCharacter} 
            alt="Sage" 
            className="w-20 h-20 rounded-full mx-auto mb-3"
            style={{
              filter: 'brightness(1.1) contrast(1.1)'
            }}
          />
        </div>

        {/* Simple Buttons */}
        <div className="space-y-4 text-center">
          <motion.button
            onClick={onConfirm}
            className="w-full py-3 px-6 rounded-xl text-base font-medium text-black"
            style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)'
            }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            I'm 18+ and ready to get my Sage Tea 🫖
          </motion.button>

          <motion.button
            onClick={onDecline}
            className="text-sm text-stone-100/60 hover:text-stone-100/80 underline decoration-1 underline-offset-2"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            I'll come back later
          </motion.button>
        </div>

      </motion.div>
    </motion.div>
  );
};

export default AgeVerificationModal;