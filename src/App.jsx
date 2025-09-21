import React, { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import { lazy } from 'react';

// Lazy load heavy components
const QuizPage = lazy(() => import('@/pages/QuizPage'));
const ChatInputPage = lazy(() => import('@/pages/ChatInputPage'));
const ReceiptsCardPage = lazy(() => import('@/pages/ReceiptsCardPage'));
const PricingPage = lazy(() => import('@/pages/PricingPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ReferralPage = lazy(() => import('@/pages/ReferralPage'));
const EnhancedReferralPage = lazy(() => import('@/pages/EnhancedReferralPage'));
const AffiliateApplicationPage = lazy(() => import('@/pages/AffiliateApplicationPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('@/pages/TermsOfServicePage'));
const RefundPolicyPage = lazy(() => import('@/pages/RefundPolicyPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const AuthCallback = lazy(() => import('@/pages/AuthCallback'));
const TestMetrics = lazy(() => import('@/components/TestMetrics'));
const TestAnalysis = lazy(() => import('@/components/TestAnalysis'));
const TestReceipt = lazy(() => import('@/pages/TestReceipt'));
const TestReceiptPage = lazy(() => import('@/pages/TestReceiptPage'));
const Success = lazy(() => import('@/pages/Success'));
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
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div></div>}>
              <Routes location={location} key={location.pathname}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/chat-input" element={<ChatInputPage />} />
              <Route path="/receipts" element={<ReceiptsCardPage />} />
              <Route path="/receipts/:id" element={<ReceiptsCardPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/refer" element={<EnhancedReferralPage />} />
              <Route path="/refer/apply" element={<AffiliateApplicationPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
              <Route path="/refund-policy" element={<RefundPolicyPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/success" element={<Success />} />
              <Route path="/test-metrics" element={<TestMetrics />} />
              <Route path="/test-analysis" element={<TestAnalysis />} />
              <Route path="/test-receipt" element={<TestReceipt />} />
              <Route path="/test-receipt-flow" element={<TestReceiptPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/settings" element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              } />
            </Routes>
            </Suspense>
          </AnimatePresence>
        </main>
        <AuthModal />
      </div>
    </>
  );
}

export default App;// Force deployment trigger Sat Sep  6 15:30:53 AEST 2025
