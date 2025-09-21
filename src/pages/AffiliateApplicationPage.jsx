import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, DollarSign, Users, TrendingUp, CheckCircle, Star } from 'lucide-react';
import { Helmet } from 'react-helmet';

const AffiliateApplicationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    socialMedia: '',
    audienceSize: '',
    contentType: '',
    experience: '',
    whyJoin: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      // In a real app, you'd submit to your backend
      alert('Application submitted! We\'ll review and get back to you within 48 hours.');
      navigate('/refer');
    }, 2000);
  };

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
          <DollarSign className="h-24 w-24 text-green-400 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-blue-500 bg-clip-text text-transparent">
              Receipts & Riches Program
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-2xl mx-auto">
            Turn toxic text reactions into steady income
          </p>
          <p className="text-lg font-semibold text-yellow-400 mb-8">
            30% commission • Monthly payments • 🎁1000+ potential
          </p>
        </motion.div>

        {/* Program Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-gray-800/30 p-6 rounded-xl text-center">
            <DollarSign className="h-12 w-12 text-green-400 mx-auto mb-4" />
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

        {/* Application Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="bg-gray-800/30 p-8 rounded-2xl max-w-2xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Apply to Join</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name *
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address *
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Social Media Handles
              </label>
              <Input
                type="text"
                name="socialMedia"
                value={formData.socialMedia}
                onChange={handleInputChange}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="@yourhandle (Instagram, TikTok, YouTube, etc.)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Audience Size
              </label>
              <select
                name="audienceSize"
                value={formData.audienceSize}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              >
                <option value="">Select your audience size</option>
                <option value="1k-10k">1K - 10K followers</option>
                <option value="10k-50k">10K - 50K followers</option>
                <option value="50k-100k">50K - 100K followers</option>
                <option value="100k-500k">100K - 500K followers</option>
                <option value="500k+">500K+ followers</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Content Type
              </label>
              <select
                name="contentType"
                value={formData.contentType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              >
                <option value="">What type of content do you create?</option>
                <option value="dating">Dating & Relationships</option>
                <option value="lifestyle">Lifestyle & Wellness</option>
                <option value="comedy">Comedy & Entertainment</option>
                <option value="advice">Advice & Self-Help</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Affiliate Experience
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
              >
                <option value="">Your affiliate marketing experience</option>
                <option value="none">No experience</option>
                <option value="beginner">Beginner (1-6 months)</option>
                <option value="intermediate">Intermediate (6 months - 2 years)</option>
                <option value="advanced">Advanced (2+ years)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Why do you want to join our program? *
              </label>
              <Textarea
                name="whyJoin"
                value={formData.whyJoin}
                onChange={handleInputChange}
                required
                rows={4}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Tell us why you'd be a great fit for our affiliate program..."
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white font-bold py-3 rounded-xl"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </form>
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
