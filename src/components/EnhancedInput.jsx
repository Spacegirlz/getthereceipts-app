import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import SmartCharacterCounter from './SmartCharacterCounter';

const EnhancedInput = ({ 
  value, 
  onChange, 
  placeholder = "Paste your conversation here...",
  onContextChange,
  onQuestionChange,
  contextValue = '',
  questionValue = ''
}) => {
  const [context, setContext] = useState(contextValue);
  const [question, setQuestion] = useState(questionValue);

  return (
    <div>
      {/* Core Input - Always Visible */}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-48 p-4 text-sm bg-white/5 border border-white/10 rounded-xl 
                   focus:border-yellow-400/50 transition-all duration-300 resize-none
                   backdrop-blur-md text-white placeholder-white/40
                   focus:outline-none focus:ring-0 focus:bg-white/8"
      />
      <SmartCharacterCounter count={value.length} limit={5000} />
      
      {/* Optional Enhancements - Hidden by Default */}
      <details className="group mt-4">
        <summary className="text-sm text-white/70 cursor-pointer hover:text-white transition-colors duration-300 body-luxe flex items-center gap-2">
          <span>💡</span>
          Add context or specific question (optional)
          <ChevronDown className="h-4 w-4 opacity-60 group-open:rotate-180 transition-transform duration-200" />
        </summary>
      
        <div className="mt-4 space-y-4 p-4 bg-white/5 rounded-lg border border-white/10">
          {/* Quick Context */}
          <div>
            <label className="text-xs text-white/60 mb-2 block body-luxe">
              Quick context (optional)
            </label>
              <input 
                value={context}
                onChange={(e) => {
                  setContext(e.target.value);
                  onContextChange?.(e.target.value);
                }}
                placeholder="e.g., 'We've been dating 3 months' or 'My ex from last year'"
                className="w-full px-3 py-2 bg-white/5 rounded-lg text-sm text-white placeholder-white/40 border border-white/10 focus:border-yellow-400/50 focus:outline-none transition-all duration-300"
              />
          </div>
          
          {/* Specific Question */}
          <div>
            <label className="text-xs text-white/60 mb-2 block body-luxe">
              Specific question for Sage (optional)
            </label>
              <input 
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                  onQuestionChange?.(e.target.value);
                }}
                placeholder="e.g., 'Are they into me?' or 'Should I respond?'"
                className="w-full px-3 py-2 bg-white/5 rounded-lg text-sm text-white placeholder-white/40 border border-white/10 focus:border-yellow-400/50 focus:outline-none transition-all duration-300"
              />
          </div>
        </div>
      </details>
    </div>
  );
};

export default EnhancedInput;
