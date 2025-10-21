import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Clock, CheckCircle, AlertCircle, Mail } from 'lucide-react';
import { Helmet } from 'react-helmet';

const RefundPolicyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Refund Policy - Get The Receipts</title>
        <meta name="description" content="Get The Receipts refund policy. Learn about our satisfaction guarantee, refund conditions, and how to request a refund for our AI text analysis services." />
      </Helmet>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <Shield className="h-24 w-24 text-blue-400 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 px-2">
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-blue-500 bg-clip-text text-transparent">
              Refund Policy
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-3xl mx-auto px-2">
            Thank you for choosing Get The Receipts! We are committed to providing you with high-quality AI text analysis and an excellent user experience.
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto px-2">
            If you are not completely satisfied with our services, here are the details of our refund policy.
          </p>
        </motion.div>

        {/* Refund Application Conditions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="bg-gray-800/30 p-8 rounded-2xl mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-400" />
            Refund Application Conditions
          </h2>
          <p className="text-gray-300 mb-6 text-lg">
            We understand that user needs may change, therefore Get The Receipts provides the following refund support:
          </p>
          
          <div className="space-y-6">
            <div className="bg-gray-700/30 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-400" />
                Satisfaction Guarantee
              </h3>
              <p className="text-gray-300">
                If you are not completely satisfied with our AI text analysis services, you can apply for a refund within <span className="text-yellow-400 font-semibold">7 days after purchase</span>. We will review your application based on specific circumstances and provide appropriate refunds to eligible users.
              </p>
            </div>

            <div className="bg-gray-700/30 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-400" />
                Technical Issues
              </h3>
              <p className="text-gray-300">
                If you are unable to use our AI analysis tools or services due to technical problems, please contact our technical support team first at <span className="text-blue-400">support@getthereceipts.com</span>. We will do our best to resolve the issue. If the problem cannot be resolved within a reasonable time, you may apply for a full refund.
              </p>
            </div>

            <div className="bg-gray-700/30 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-purple-400" />
                Duplicate Payments
              </h3>
              <p className="text-gray-300">
                If system errors result in duplicate payments, please provide relevant supporting documentation (screenshots, bank statements, or payment confirmations), and we will refund the excess payment immediately.
              </p>
            </div>

            <div className="bg-gray-700/30 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-400" />
                Subscription Cancellations
              </h3>
              <p className="text-gray-300">
                For monthly or annual subscriptions, you can cancel anytime and continue using the service until the end of your current billing period. No refunds for partial periods, but you won't be charged for future periods.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Refund Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="bg-gray-800/30 p-8 rounded-2xl mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Clock className="h-8 w-8 text-blue-400" />
            Refund Process
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Submit Refund Request</h3>
                <p className="text-gray-300 mb-2">
                  Please send your refund request to <span className="text-blue-400 font-semibold">support@getthereceipts.com</span> with "Refund Request" in the subject line.
                </p>
                <p className="text-gray-400 text-sm">
                  The email should include your purchase receipt, order number, and reason for refund.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Review and Feedback</h3>
                <p className="text-gray-300">
                  We will review your refund request within <span className="text-yellow-400 font-semibold">5-10 business days</span> and notify you of the review results via email.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Refund Processing</h3>
                <p className="text-gray-300">
                  Once the refund request is approved, the refund amount will be returned to your payment account through the original payment method. Please note that the time for the refund to reach your account may vary depending on the payment method (typically 5-10 business days).
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-500/30 p-8 rounded-2xl mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-amber-400" />
            Important Notes
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-300">
                <span className="text-amber-400 font-semibold">Time Limit:</span> Refund requests must be submitted within 7 days of purchase; requests beyond this time limit will not be accepted.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-300">
                <span className="text-amber-400 font-semibold">Usage Policy:</span> Refunds are only available for unused portions or services that cannot be used due to technical issues; used or completed AI analyses are not eligible for refunds.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-300">
                <span className="text-amber-400 font-semibold">User Responsibility:</span> Get The Receipts is not responsible for issues caused by user error; please carefully verify order information before payment.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-gray-300">
                <span className="text-amber-400 font-semibold">Free Services:</span> Our free tier services (including free receipts and anonymous usage) are provided as-is and are not eligible for refunds.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="bg-gray-800/30 p-8 rounded-2xl text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center justify-center gap-3">
            <Mail className="h-8 w-8 text-blue-400" />
            Contact Us
          </h2>
          <p className="text-gray-300 mb-6 text-lg">
            If you have any questions or need further assistance, please feel free to contact our customer support team.
          </p>
          
          <div className="bg-gray-700/30 p-6 rounded-xl max-w-md mx-auto">
            <p className="text-gray-400 mb-2">Support Email</p>
            <a 
              href="mailto:support@getthereceipts.com"
              className="text-blue-400 text-xl font-semibold hover:text-blue-300 transition-colors"
            >
              support@getthereceipts.com
            </a>
            <p className="text-gray-400 text-sm mt-2">
              We typically respond within 48 hours
            </p>
          </div>
        </motion.div>

      </div>

      {/* Simple Clean Footer */}
      <footer className="px-6 py-8 bg-black border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About</Link>
            <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</Link>
            <Link to="/refer" className="text-gray-400 hover:text-white transition-colors text-sm">Earn & Refer</Link>
            <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</Link>
          </div>
          
          {/* Disclaimer */}
          <p className="text-gray-500 text-xs mb-2">For Entertainment Purposes Only</p>
          
          {/* Copyright */}
          <p className="text-gray-500 text-xs mb-2">© 2025 Get The Receipts. All rights reserved.</p>
          
          {/* Support */}
          <p className="text-gray-500 text-xs">
            Support: <a href="mailto:support@getthereceipts.com" className="text-gray-400 hover:text-white transition-colors">support@getthereceipts.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RefundPolicyPage;
