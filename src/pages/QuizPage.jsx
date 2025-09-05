import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet';

const questions = [
  {
    question: "What's the context?",
    key: "context",
    options: [
      { text: "Dating", emoji: "❤️" },
      { text: "Don't know yet", emoji: "🤔" },
      { text: "Situationship", emoji: "🤷‍♀️" },
      { text: "Friends", emoji: "👯" },
      { text: "Family", emoji: "👨‍👩‍👧‍👦" },
      { text: "Work", emoji: "💼" },
    ],
  },
  {
    question: "How long has this been going on?",
    key: "duration",
    options: [
      { text: "A few days", emoji: "⏳" },
      { text: "A few weeks", emoji: "🗓️" },
      { text: "Months", emoji: "📅" },
      { text: "Ugh.. forever", emoji: "🫠" },
    ],
  },
  {
    question: "What's their usual texting style?",
    key: "style",
    options: [
      { text: "Quick & frequent", emoji: "⚡️" },
      { text: "Slow & thoughtful", emoji: "🤔" },
      { text: "Random & inconsistent", emoji: "❓" },
      { text: "Only when they need something", emoji: "👀" },
    ],
  },
];

const QuizPage = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    localStorage.removeItem('quizAnswers');
  }, []);

  const handleAnswer = (option) => {
    setAnswers({ ...answers, [questions[currentQuestionIndex].key]: option.text });
    if (showError) setShowError(false);
  };

  const nextQuestion = () => {
    if (!answers[questions[currentQuestionIndex].key]) {
      setShowError(true);
      setTimeout(() => setShowError(false), 500);
      return;
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      navigate('/chat-input', { state: { quizAnswers: answers } });
    }
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      <Helmet>
        <title>Quiz - Tell Us More | Get The Receipts</title>
        <meta name="description" content="Answer a few quick questions to give us the context behind the text message. Your gut feeling matters!" />
      </Helmet>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2 text-sm text-gray-400">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <motion.div
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
              className={`w-full ${showError ? 'shake' : ''}`}
            >
              <h1 className="text-3xl font-bold text-center mb-8">{currentQuestion.question}</h1>
              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options.map((option) => (
                  <motion.button
                    key={option.text}
                    onClick={() => handleAnswer(option)}
                    className={`p-4 rounded-xl text-left text-lg transition-all duration-300 meme-card ${
                      answers[currentQuestion.key] === option.text
                        ? 'ring-2 ring-pink-500 scale-105'
                        : 'ring-1 ring-white/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-3xl mb-2 block floating-emoji">{option.emoji}</span>
                    {option.text}
                    {answers[currentQuestion.key] === option.text && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 bg-pink-500 rounded-full p-1"
                      >
                        <Check size={16} />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-12 flex flex-col items-center gap-4"
          >
            <Button
              onClick={nextQuestion}
              size="lg"
              className="w-full max-w-xs viral-button text-xl font-bold py-8 rounded-full"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish Quiz'}
              <ArrowRight className="ml-2" />
            </Button>
            <button
              onClick={() => navigate('/chat-input')}
              className="text-gray-400 hover:text-white transition-colors underline text-sm"
            >
              Skip quiz - I don't have time
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default QuizPage;