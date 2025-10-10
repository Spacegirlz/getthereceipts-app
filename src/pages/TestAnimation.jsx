import React from 'react';
import TypingChatAnimation from '@/components/TypingChatAnimation';

const TestAnimation = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-8">
          Typing Animation Test
        </h1>
        <TypingChatAnimation />
        <p className="text-gray-300 mt-8">
          This shows the typing animation component working independently.
        </p>
      </div>
    </div>
  );
};

export default TestAnimation;
