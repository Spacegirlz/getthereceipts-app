import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Send, Eye, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analyzeWithGPT } from '@/lib/analysis/advancedAnalysis';
import { useAuth } from '@/contexts/SupabaseAuthContext';

// Import receipt components
import ReceiptCardViral from '@/components/ReceiptCardViral';
import DeepDive from '@/components/DeepDive';
import ImmunityTraining from '@/components/ImmunityTraining';

const TestReceiptPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [testMessage, setTestMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showComponents, setShowComponents] = useState({
    receipt: false,
    deepDive: false,
    immunity: false
  });

  // Sample test messages for quick testing
  const sampleMessages = [
    {
      name: "Mixed Signals Test",
      message: `Hey, so Jake has been texting me for like 3 weeks now. Sometimes he's super flirty and asks me out, but then when I suggest specific plans he's like "oh I'm super busy this week maybe next week?" But then he'll text me at like 11pm asking what I'm up to. Last night he sent me this long message about how he thinks I'm amazing and he's just "figuring some stuff out right now" but he "definitely wants to see where this goes." Then today he liked my Instagram story but didn't text me back when I asked how his day was going. I'm so confused - is he actually interested or just keeping me around as an option?`
    },
    {
      name: "Healthy Connection Test", 
      message: `So I've been dating Sarah for about a month and honestly it's been really great. She always responds to my texts within a few hours, and when she can't she lets me know she'll be busy. We've made concrete plans for this weekend - dinner and a movie we both wanted to see. She remembers little things I mention, like how I was nervous about my presentation at work, and she checked in to see how it went. We have really good conversations about everything from our families to our career goals. I just wanted to run this by someone because my last relationship was kind of a mess and I want to make sure I'm not missing any red flags. But honestly, this feels really different and healthy?`
    },
    {
      name: "Breadcrumbing Test",
      message: `I matched with this guy Alex on Hinge like 2 months ago. We had great conversations for like a week, then he went kind of quiet. But every few days he'll send me like a meme or respond to my story with a fire emoji. When I try to make actual plans he's always "swamped with work" but "definitely wants to meet up soon." This has been going on for MONTHS. My friends keep telling me to unmatch but like... he keeps reaching out so clearly he's still interested right? Maybe he's just really busy? But then I see him posting stories of him out at bars with friends so like... he has time for that but not for a coffee date? I don't know what to think.`
    }
  ];

  const handleGenerateReceipt = async () => {
    if (!testMessage.trim()) {
      toast({
        variant: "destructive",
        title: "Message Required",
        description: "Please enter a message to analyze or use one of the sample messages."
      });
      return;
    }

    setIsGenerating(true);
    setAnalysisResult(null);
    setShowComponents({ receipt: false, deepDive: false, immunity: false });

    try {
      // 🔐 CREDIT CHECK: Verify user can perform analysis (same as other pages)
      const { AnonymousUserService } = await import('@/lib/services/anonymousUserService');
      const { getUserCredits, deductCredits } = await import('@/lib/services/creditsSystem');
      
      let canProceed = false;
      let creditMessage = '';
      
      if (user) {
        // Logged-in user: Check their credits
        const userCredits = await getUserCredits(user.id);
        console.log('🔐 TestReceiptPage - User credits check:', userCredits);
        
        if (userCredits.subscription === 'premium' || 
            userCredits.subscription === 'yearly' || 
            userCredits.subscription === 'founder') {
          canProceed = true;
          creditMessage = 'Premium user - unlimited analysis';
        } else if (userCredits.credits > 0) {
          canProceed = true;
          creditMessage = `Free user - ${userCredits.credits} credits remaining`;
        } else {
          canProceed = false;
          creditMessage = 'No credits remaining. Please upgrade or wait for daily reset.';
        }
      } else {
        // Anonymous user: Use atomic operation to prevent race conditions
        const creditCheckResult = AnonymousUserService.checkAndIncrementAnalysis();
        console.log('🔐 TestReceiptPage - Anonymous user atomic check:', creditCheckResult);
        
        if (creditCheckResult.success) {
          canProceed = true;
          creditMessage = `Anonymous user - ${creditCheckResult.remainingAnalyses} free analysis remaining`;
        } else {
          canProceed = false;
          if (creditCheckResult.reason === 'limit_reached') {
            creditMessage = 'Free analysis limit reached. Please sign up for more credits.';
          } else {
            creditMessage = 'Unable to verify analysis limit. Please try again.';
          }
        }
      }
      
      if (!canProceed) {
        setIsGenerating(false);
        toast({
          variant: 'destructive',
          title: 'Analysis Limit Reached',
          description: creditMessage
        });
        return;
      }
      
      console.log('✅ TestReceiptPage - Credit check passed:', creditMessage);
      
      const result = await analyzeWithGPT(testMessage, '', '', 'situationship');
      
      if (result.success) {
        setAnalysisResult(result.data);
        
        // 🔐 DEDUCT CREDITS: After successful analysis
        if (user) {
          // Logged-in user: Deduct credit
          const deductResult = await deductCredits(user.id, 1);
          if (deductResult.success) {
            console.log('✅ TestReceiptPage - Credit deducted for logged-in user');
          } else {
            console.warn('⚠️ TestReceiptPage - Failed to deduct credit for logged-in user:', deductResult.error);
          }
        } else {
          // Anonymous user: Credit already deducted in atomic operation
          console.log('✅ TestReceiptPage - Anonymous analysis count already updated in atomic operation');
        }
        
        // Show receipt first
        setTimeout(() => setShowComponents(prev => ({ ...prev, receipt: true })), 500);
        
        toast({
          title: "Analysis Complete! 🎉",
          description: "Your truth receipt has been generated. Check out all three components below."
        });
      } else {
        throw new Error(result.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "Something went wrong generating your receipt."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const showDeepDive = () => {
    setShowComponents(prev => ({ ...prev, deepDive: true }));
  };

  const showImmunity = () => {
    setShowComponents(prev => ({ ...prev, immunity: true }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/10 mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back Home
          </Button>
          <h1 className="text-3xl font-bold text-yellow-400">Receipt Generation Test Lab</h1>
        </div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-2xl p-8 mb-8"
        >
          <h2 className="text-xl font-bold mb-4">Test Message Input</h2>
          
          {/* Sample Messages */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Quick Test Scenarios:</h3>
            <div className="grid gap-3">
              {sampleMessages.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => setTestMessage(sample.message)}
                  className="text-left p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <div className="font-medium text-blue-400">{sample.name}</div>
                  <div className="text-sm text-gray-300 mt-1">
                    {sample.message.substring(0, 100)}...
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Message to Analyze (2500 char limit):
            </label>
            <textarea
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value.slice(0, 2500))}
              placeholder="Paste or type a message/conversation to analyze..."
              className="w-full h-40 p-4 bg-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="text-right text-sm text-gray-400 mt-1">
              {testMessage.length}/2500 characters
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateReceipt}
            disabled={isGenerating || !testMessage.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-bold py-4"
          >
            {isGenerating ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Generating Truth Receipt...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Send className="h-5 w-5 mr-2" />
                Generate Truth Receipt
              </div>
            )}
          </Button>
        </motion.div>

        {/* Results Section */}
        {analysisResult && (
          <div className="space-y-8">
            {/* Receipt Component */}
            {showComponents.receipt && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-yellow-400">Truth Receipt</h3>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={showDeepDive}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Show Deep Dive
                    </Button>
                    <Button
                      size="sm"
                      onClick={showImmunity}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Show Immunity
                    </Button>
                  </div>
                </div>
                <ReceiptCardViral
                  results={analysisResult}
                />
              </motion.div>
            )}

            {/* Deep Dive Component */}
            {showComponents.deepDive && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-teal-400 mb-4">Deep Dive Analysis</h3>
                <DeepDive
                  deepDive={analysisResult?.deepDive}
                  analysisData={analysisResult}
                  originalMessage={testMessage}
                  context={{}}
                />
              </motion.div>
            )}

            {/* Immunity Training Component */}
            {showComponents.immunity && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-purple-400 mb-4">Immunity Training</h3>
                <ImmunityTraining
                  immunityData={analysisResult?.immunityTraining}
                  archetypeName={analysisResult?.archetype}
                  originalMessage={testMessage}
                  context={{}}
                />
              </motion.div>
            )}

            {/* Debug Info */}
            {analysisResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-2xl p-6"
              >
                <details className="cursor-pointer group">
                  <summary className="text-lg font-bold text-gray-400 mb-2 flex items-center gap-2">
                    Debug: Raw Analysis Data
                    <ChevronDown className="h-4 w-4 opacity-60 group-open:rotate-180 transition-transform duration-200" />
                  </summary>
                  <pre className="text-xs bg-gray-900 p-4 rounded overflow-auto text-gray-300">
                    {JSON.stringify(analysisResult, null, 2)}
                  </pre>
                </details>
              </motion.div>
            )}
          </div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-2xl p-6 mt-8"
        >
          <h3 className="text-lg font-bold mb-3">Testing Instructions:</h3>
          <div className="text-gray-300 space-y-2">
            <p>• Use sample scenarios above or paste your own test messages</p>
            <p>• Click "Generate Truth Receipt" to run the complete analysis</p>
            <p>• Test all three components: Truth Receipt → Deep Dive → Immunity Training</p>
            <p>• Check the debug data to verify all analysis fields are populated</p>
            <p>• Verify green flags show for healthy relationships, red flags for toxic ones</p>
            <p>• Test with different message lengths and relationship types</p>
            <p>• Ensure all animations, styling, and functionality work correctly</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TestReceiptPage;