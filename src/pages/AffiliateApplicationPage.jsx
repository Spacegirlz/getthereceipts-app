import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Gift, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet';

const AffiliateApplicationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Apply to Receipts & Riches Program - Get The Receipts</title>
        <meta name="description" content="Join our affiliate program and earn 30% commission promoting Get The Receipts. Turn toxic text reactions into steady income." />
      </Helmet>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/refer')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Referral Program
          </Button>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <Gift className="h-24 w-24 text-yellow-400 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-blue-500 bg-clip-text text-transparent">
              Receipts & Riches Program
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-2xl mx-auto">
            Turn confusing text messages into steady income
          </p>
          <p className="text-lg font-semibold text-yellow-400 mb-6">
            30% commission • Monthly payments • 🎁 $1000+ potential
          </p>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-8 max-w-2xl mx-auto">
            <p className="text-blue-300 text-sm">
              <strong>Ready to apply?</strong> Click the button below to access our secure application portal and complete your submission.
            </p>
          </div>
        </motion.div>

        {/* Program Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-gray-800/30 p-6 rounded-xl text-center">
            <Gift className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">30% Commission</h3>
            <p className="text-gray-300 text-sm">Earn 30% on every subscription you refer. No caps, no limits.</p>
          </div>
          <div className="bg-gray-800/30 p-6 rounded-xl text-center">
            <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Monthly Payments</h3>
            <p className="text-gray-300 text-sm">Get paid monthly via PayPal or bank transfer. Reliable income.</p>
          </div>
          <div className="bg-gray-800/30 p-6 rounded-xl text-center">
            <TrendingUp className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">High Converting</h3>
            <p className="text-gray-300 text-sm">Our product sells itself. Your audience will love the insights.</p>
          </div>
        </motion.div>

        {/* Application CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="bg-gray-800/30 p-8 rounded-2xl max-w-2xl mx-auto text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Apply?</h2>
          <p className="text-gray-300 mb-6">
            Click the button below to access our secure application portal and complete your affiliate application.
          </p>
          <Button
            onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSfA0MUe-4ETNT019CmER3KHH7usL2H6qmWtOub9oLeQtODIYg/viewform?usp=header', '_blank')}
            className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white font-bold px-8 py-4 rounded-xl"
          >
            Apply Now
          </Button>
        </motion.div>

        {/* Requirements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-12 max-w-2xl mx-auto"
        >
          <h3 className="text-xl font-bold text-white mb-6 text-center">Program Requirements</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
              <p className="text-gray-300">Active social media presence with engaged audience</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
              <p className="text-gray-300">Content that aligns with our brand values</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
              <p className="text-gray-300">Commitment to authentic promotion (no spam)</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
              <p className="text-gray-300">Minimum 1K followers across platforms</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AffiliateApplicationPage;
