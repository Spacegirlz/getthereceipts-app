import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import QuizPage from '@/pages/QuizPage';
import ChatInputPage from '@/pages/ChatInputPage';
import ReceiptsCardPage from '@/pages/ReceiptsCardPage';
import PricingPage from '@/pages/PricingPage';
import AboutPage from '@/pages/AboutPage';
import ReferralPage from '@/pages/ReferralPage';
import DashboardPage from '@/pages/DashboardPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import SettingsPage from '@/pages/SettingsPage';
import AuthCallback from '@/pages/AuthCallback';
import TestMetrics from '@/components/TestMetrics';
import TestAnalysis from '@/components/TestAnalysis';
import TestReceipt from '@/pages/TestReceipt';
import TestReceiptPage from '@/pages/TestReceiptPage';
import { Helmet } from 'react-helmet';
import AuthModal from '@/components/AuthModal';
import PrivateRoute from '@/components/PrivateRoute';
import MainHeader from '@/components/MainHeader';
import { AnimatePresence } from 'framer-motion';

function App() {
  const location = useLocation();
  return (
    <>
      <Helmet>
        <title>Get The Receipts - Decode Any Text Message Instantly</title>
        <meta name="description" content="Got a confusing text? Get the receipts! Answer quick questions, paste their message, and discover what they really meant with our viral text decoder." />
        <meta property="og:title" content="Get The Receipts - Decode Any Text Message Instantly" />
        <meta property="og:description" content="Got a confusing text? Get the receipts! Answer quick questions, paste their message, and discover what they really meant with our viral text decoder." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Get The Receipts - Decode Any Text Message Instantly" />
        <meta name="twitter:description" content="Got a confusing text? Get the receipts! Answer quick questions, paste their message, and discover what they really meant with our viral text decoder." />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <MainHeader />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/chat-input" element={<ChatInputPage />} />
              <Route path="/receipts" element={<ReceiptsCardPage />} />
              <Route path="/receipts/:id" element={<ReceiptsCardPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/refer" element={<ReferralPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/test-metrics" element={<TestMetrics />} />
              <Route path="/test-analysis" element={<TestAnalysis />} />
              <Route path="/test-receipt" element={<TestReceipt />} />
              <Route path="/test-receipt-flow" element={<TestReceiptPage />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              } />
              <Route path="/settings" element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              } />
            </Routes>
          </AnimatePresence>
        </main>
        <AuthModal />
      </div>
    </>
  );
}

export default App;// Force deployment trigger Sat Sep  6 15:30:53 AEST 2025
