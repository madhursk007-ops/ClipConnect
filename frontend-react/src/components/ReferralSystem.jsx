import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Gift, 
  Users, 
  TrendingUp, 
  Copy, 
  CheckCircle,
  Share2,
  Trophy,
  Zap,
  Crown,
  Star,
  Target,
  Award
} from 'lucide-react'
import { useGrowthStore } from '@store/growthStore'
import { useAuthStore } from '@store/authStore'
import toast from 'react-hot-toast'

const ReferralSystem = ({ className = '' }) => {
  const { 
    referralCode, 
    referralStats, 
    generateReferralCode, 
    fetchReferralStats,
    shareReferral,
    calculateBadges,
    calculateRanking
  } = useGrowthStore()
  
  const { user } = useAuthStore()
  const [showSuccess, setShowSuccess] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  useEffect(() => {
    if (!referralCode) {
      generateReferralCode()
    }
    fetchReferralStats()
  }, [referralCode, generateReferralCode, fetchReferralStats])

  const handleCopyCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode)
      setCopiedCode(true)
      toast.success('Referral code copied!')
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  const handleCopyLink = () => {
    const referralUrl = `https://clipconnect.com/signup?ref=${referralCode}`
    navigator.clipboard.writeText(referralUrl)
    toast.success('Referral link copied!')
  }

  const handleShare = (platform) => {
    shareReferral(platform)
  }

  const rewards = [
    { referrals: 1, reward: '$10 Credit', icon: Gift },
    { referrals: 3, reward: '$30 Credit + Pro Badge', icon: Trophy },
    { referrals: 5, reward: '$50 Credit + Featured Profile', icon: Crown },
    { referrals: 10, reward: '$100 Credit + Premium Features', icon: Zap },
    { referrals: 25, reward: '$250 Credit + Elite Status', icon: Award }
  ]

  const currentReward = rewards.find(r => r.referrals <= (referralStats?.totalReferrals || 0)) || rewards[0]

  const nextReward = rewards.find(r => r.referrals > (referralStats?.totalReferrals || 0))

  const progressToNext = nextReward 
    ? ((referralStats?.totalReferrals || 0) / nextReward.referrals) * 100
    : 100

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Referral Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-morphism rounded-2xl p-6 border border-white/10 bg-gradient-to-r from-primary-500/10 to-accent-400/10"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl flex items-center justify-center mr-4">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Referral Program</h3>
              <p className="text-sm text-gray-400">Invite friends and earn rewards</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-400">
              {referralStats?.totalReferrals || 0}
            </div>
            <div className="text-sm text-gray-400">Total Referrals</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-dark-800/50 rounded-lg p-3 text-center">
            <Users className="w-6 h-6 text-primary-400 mx-auto mb-2" />
            <div className="text-xl font-bold">{referralStats?.activeReferrals || 0}</div>
            <div className="text-xs text-gray-400">Active</div>
          </div>
          <div className="bg-dark-800/50 rounded-lg p-3 text-center">
            <TrendingUp className="w-6 h-6 text-success mx-auto mb-2" />
            <div className="text-xl font-bold">${referralStats?.creditsEarned || 0}</div>
            <div className="text-xs text-gray-400">Credits Earned</div>
          </div>
          <div className="bg-dark-800/50 rounded-lg p-3 text-center">
            <Target className="w-6 h-6 text-warning mx-auto mb-2" />
            <div className="text-xl font-bold">{referralStats?.pendingRewards || 0}</div>
            <div className="text-xs text-gray-400">Pending</div>
          </div>
          <div className="bg-dark-800/50 rounded-lg p-3 text-center">
            <Award className="w-6 h-6 text-accent-400 mx-auto mb-2" />
            <div className="text-xl font-bold">{currentReward.reward.split(' ')[0]}</div>
            <div className="text-xs text-gray-400">Current Reward</div>
          </div>
        </div>

        {/* Progress to Next Reward */}
        {nextReward && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Progress to next reward</span>
              <span className="text-sm text-primary-400">
                {nextReward.referrals - (referralStats?.totalReferrals || 0)} more referrals
              </span>
            </div>
            <div className="h-3 bg-dark-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-accent-400"
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-400">Current: {currentReward.reward}</span>
              <span className="text-xs text-primary-400">Next: {nextReward.reward}</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Referral Code & Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-morphism rounded-2xl p-6 border border-white/10"
      >
        <h4 className="text-lg font-semibold mb-4">Your Referral Code</h4>
        
        {/* Code Display */}
        <div className="bg-dark-800/50 rounded-xl p-4 mb-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl font-mono font-bold text-primary-400">
                {referralCode || 'LOADING...'}
              </span>
              <span className="badge badge-success text-xs ml-3">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </span>
            </div>
            <button
              onClick={handleCopyCode}
              className="btn btn-outline btn-sm"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copiedCode ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
        </div>

        {/* Referral Link */}
        <div className="bg-dark-800/50 rounded-xl p-4 mb-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <span className="text-sm text-gray-400 block mb-1">Referral Link</span>
              <span className="text-sm font-mono truncate">
                https://clipconnect.com/signup?ref={referralCode || '...'}
              </span>
            </div>
            <button
              onClick={handleCopyLink}
              className="btn btn-outline btn-sm"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </button>
          </div>
        </div>

        {/* Share Buttons */}
        <div>
          <p className="text-sm text-gray-400 mb-3">Share via:</p>
          <div className="flex gap-3">
            <button
              onClick={() => handleShare('twitter')}
              className="flex-1 btn btn-secondary btn-sm"
            >
              Twitter
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              className="flex-1 btn btn-secondary btn-sm"
            >
              LinkedIn
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="flex-1 btn btn-secondary btn-sm"
            >
              Facebook
            </button>
            <button
              onClick={() => handleShare('email')}
              className="flex-1 btn btn-secondary btn-sm"
            >
              Email
            </button>
          </div>
        </div>
      </motion.div>

      {/* Rewards Tiers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-morphism rounded-2xl p-6 border border-white/10"
      >
        <h4 className="text-lg font-semibold mb-4">Rewards Tiers</h4>
        <div className="space-y-3">
          {rewards.map((reward, index) => {
            const Icon = reward.icon
            const isCurrent = index === rewards.indexOf(currentReward)
            const isCompleted = reward.referrals <= (referralStats?.totalReferrals || 0)
            const isNext = index === rewards.indexOf(nextReward)

            return (
              <motion.div
                key={reward.referrals}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`p-4 rounded-xl border ${
                  isCurrent
                    ? 'border-primary-500/50 bg-primary-500/10'
                    : isCompleted
                    ? 'border-success/50 bg-success/10'
                    : isNext
                    ? 'border-warning/50 bg-warning/10'
                    : 'border-white/10 bg-dark-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                      isCompleted ? 'bg-success/20' : 'bg-dark-700'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        isCompleted ? 'text-success' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="font-semibold">{reward.reward}</span>
                        {isCurrent && (
                          <span className="badge badge-primary text-xs ml-2">Current</span>
                        )}
                        {isNext && (
                          <span className="badge badge-warning text-xs ml-2">Next</span>
                        )}
                      </div>
                      <span className="text-sm text-gray-400">
                        {reward.referrals} referral{reward.referrals !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : isNext ? (
                      <div className="text-sm text-primary-400 font-medium">
                        {reward.referrals - (referralStats?.totalReferrals || 0)} to go
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        +{reward.referrals - (referralStats?.totalReferrals || 0)} more
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-morphism rounded-2xl p-6 border border-white/10"
      >
        <h4 className="text-lg font-semibold mb-4">How It Works</h4>
        <div className="space-y-4">
          {[
            {
              step: '1',
              title: 'Share Your Code',
              description: 'Share your unique referral code with friends and colleagues'
            },
            {
              step: '2',
              title: 'They Sign Up',
              description: 'Your friends use your code when creating their account'
            },
            {
              step: '3',
              title: 'Earn Rewards',
              description: 'Get credits and exclusive features as they join and use ClipConnect'
            }
          ].map((item, index) => (
            <div key={index} className="flex items-start">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                {item.step}
              </div>
              <div>
                <h5 className="font-semibold mb-1">{item.title}</h5>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Success Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowSuccess(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="glass-morphism-strong rounded-2xl p-8 max-w-md mx-4 border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-success to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Referral Successful!</h3>
                <p className="text-gray-400 mb-6">
                  Your friend has successfully joined ClipConnect using your referral code.
                </p>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="btn btn-primary w-full"
                >
                  Awesome!
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ReferralSystem
