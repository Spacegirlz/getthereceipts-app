import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Award, 
  Target, 
  Crown, 
  Gift, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Share2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  getEnhancedReferralStats, 
  getMilestoneProgress, 
  formatReferralStats 
} from '@/lib/services/enhancedReferralService';
import { useToast } from '@/components/ui/use-toast';

const ReferralProgressCard = ({ userId, userCredits }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalReferrals: 0,
    totalRewards: 0,
    milestone10Reached: false,
    milestone50Reached: false,
    referralsTo10: 10,
    referralsTo50: 50
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (userId) {
        try {
          const result = await getEnhancedReferralStats(userId);
          if (result.success) {
            setStats(result.stats);
          }
        } catch (error) {
          console.error('Error loading referral stats:', error);
        }
      }
      setLoading(false);
    };

    loadStats();
  }, [userId]);

  const milestoneProgress = getMilestoneProgress(stats.totalReferrals);
  const formattedStats = formatReferralStats(stats);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl p-6 border border-purple-500/20">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl p-6 border border-purple-500/20"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Users className="h-6 w-6 text-purple-400 mr-3" />
          <h3 className="text-xl font-bold text-white">Referral Progress</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/refer')}
          className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Manage
        </Button>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div 
          className="text-center p-4 bg-gray-800/30 rounded-xl"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
          <h4 className="text-2xl font-bold text-white">{stats.totalReferrals}</h4>
          <p className="text-sm text-gray-400">Friends Referred</p>
        </motion.div>
        <motion.div 
          className="text-center p-4 bg-gray-800/30 rounded-xl"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Award className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
          <h4 className="text-2xl font-bold text-white">{stats.totalRewards * 3}</h4>
          <p className="text-sm text-gray-400">Credits Earned</p>
        </motion.div>
      </div>

      {/* Milestone Progress */}
      <div className="space-y-3 mb-6">
        <h4 className="text-lg font-semibold text-white flex items-center">
          <Target className="h-5 w-5 mr-2 text-purple-400" />
          Next Milestones
        </h4>
        
        {milestoneProgress.map((milestone, index) => (
          <motion.div
            key={milestone.target}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-3 rounded-lg border ${
              milestone.completed 
                ? 'bg-green-900/20 border-green-500/30' 
                : 'bg-gray-800/30 border-gray-600/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{milestone.icon}</span>
                <div>
                  <p className={`font-semibold ${milestone.completed ? 'text-green-400' : 'text-white'}`}>
                    {milestone.reward}
                  </p>
                  <p className="text-sm text-gray-400">
                    {milestone.completed 
                      ? 'Completed! 🎉' 
                      : `${milestone.remaining} more referrals needed`
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                {milestone.completed ? (
                  <CheckCircle className="h-6 w-6 text-green-400" />
                ) : (
                  <div className="w-16 h-2 bg-gray-600 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${milestone.progress}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <Button
          onClick={() => navigate('/refer')}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share Your Link
        </Button>
        
        {stats.totalReferrals > 0 && (
          <Button
            variant="outline"
            onClick={() => navigate('/refer')}
            className="w-full border-purple-400 text-purple-400 hover:bg-purple-500/10"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            View Full Progress
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Achievement Badges */}
      {(stats.milestone10Reached || stats.milestone50Reached) && (
        <div className="mt-6 pt-4 border-t border-gray-700/50">
          <h4 className="text-sm font-semibold text-gray-300 mb-3">Achievements</h4>
          <div className="flex space-x-2">
            {stats.milestone10Reached && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex items-center px-3 py-1 bg-yellow-900/30 border border-yellow-500/30 rounded-full"
              >
                <Gift className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-xs text-yellow-400 font-medium">Free Month</span>
              </motion.div>
            )}
            {stats.milestone50Reached && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                className="flex items-center px-3 py-1 bg-purple-900/30 border border-purple-500/30 rounded-full"
              >
                <Crown className="h-4 w-4 text-purple-400 mr-1" />
                <span className="text-xs text-purple-400 font-medium">OG Founder</span>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ReferralProgressCard;
