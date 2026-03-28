import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@services/api'

const useGrowthStore = create(
  persist(
    (set, get) => ({
      // Referral system
      referralCode: null,
      referralStats: {
        totalReferrals: 0,
        activeReferrals: 0,
        creditsEarned: 0,
        pendingRewards: 0
      },
      
      // Leaderboard
      leaderboard: {
        editors: [],
        clients: [],
        weekly: [],
        monthly: []
      },
      
      // Badges and achievements
      badges: [],
      achievements: [],
      
      // Trending data
      trendingEditors: [],
      trendingProjects: [],
      
      // Actions
      generateReferralCode: async () => {
        try {
          const response = await api.post('/referral/generate')
          const { referralCode } = response.data.data
          
          set({ referralCode })
          return referralCode
        } catch (error) {
          throw error
        }
      },
      
      fetchReferralStats: async () => {
        try {
          const response = await api.get('/referral/stats')
          const { stats } = response.data.data
          
          set({ referralStats: stats })
          return stats
        } catch (error) {
          throw error
        }
      },
      
      applyReferral: async (code) => {
        try {
          const response = await api.post('/referral/apply', { code })
          const { success, reward } = response.data.data
          
          if (success) {
            // Update user stats
            get().fetchReferralStats()
          }
          
          return { success, reward }
        } catch (error) {
          throw error
        }
      },
      
      fetchLeaderboard: async (type = 'weekly', category = 'editors') => {
        try {
          const response = await api.get(`/leaderboard/${type}/${category}`)
          const { leaderboard } = response.data.data
          
          set(state => ({
            leaderboard: {
              ...state.leaderboard,
              [`${type}_${category}`]: leaderboard
            }
          }))
          
          return leaderboard
        } catch (error) {
          throw error
        }
      },
      
      fetchBadges: async () => {
        try {
          const response = await api.get('/badges')
          const { badges, achievements } = response.data.data
          
          set({ badges, achievements })
          return { badges, achievements }
        } catch (error) {
          throw error
        }
      },
      
      unlockBadge: async (badgeId) => {
        try {
          const response = await api.post(`/badges/${badgeId}/unlock`)
          const { badge } = response.data.data
          
          set(state => ({
            badges: [...state.badges, badge]
          }))
          
          return badge
        } catch (error) {
          throw error
        }
      },
      
      fetchTrending: async () => {
        try {
          const response = await api.get('/trending')
          const { editors, projects } = response.data.data
          
          set({
            trendingEditors: editors,
            trendingProjects: projects
          })
          
          return { editors, projects }
        } catch (error) {
          throw error
        }
      },
      
      // Share referral link
      shareReferral: async (platform) => {
        const { referralCode } = get()
        const referralUrl = `https://clipconnect.com/signup?ref=${referralCode}`
        
        const shareUrls = {
          twitter: `https://twitter.com/intent/tweet?text=Join%20ClipConnect%20-%20the%20best%20video%20editor%20marketplace!&url=${encodeURIComponent(referralUrl)}`,
          linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}`,
          facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`
        }
        
        if (shareUrls[platform]) {
          window.open(shareUrls[platform], '_blank', 'width=600,height=400')
        }
      },
      
      // Badge calculation logic
      calculateBadges: (user) => {
        const badges = []
        
        // Rating badges
        if (user.rating >= 4.9) {
          badges.push({ id: 'elite', name: 'Elite Editor', icon: '🌟', color: 'gold' })
        } else if (user.rating >= 4.7) {
          badges.push({ id: 'top-rated', name: 'Top Rated', icon: '⭐', color: 'purple' })
        }
        
        // Project completion badges
        if (user.completedProjects >= 100) {
          badges.push({ id: 'centurion', name: 'Centurion', icon: '💯', color: 'blue' })
        } else if (user.completedProjects >= 50) {
          badges.push({ id: 'veteran', name: 'Veteran', icon: '🎖️', color: 'green' })
        }
        
        // Speed badges
        if (user.averageDeliveryTime && user.averageDeliveryTime <= 2) {
          badges.push({ id: 'speed-demon', name: 'Speed Demon', icon: '⚡', color: 'yellow' })
        }
        
        // Client satisfaction badges
        if (user.clientSatisfaction >= 95) {
          badges.push({ id: 'client-favorite', name: 'Client Favorite', icon: '❤️', color: 'red' })
        }
        
        return badges
      },
      
      // Leaderboard ranking calculation
      calculateRanking: (user, category = 'editors') => {
        let score = 0
        
        if (category === 'editors') {
          // Editor scoring
          score += (user.rating || 0) * 20
          score += Math.min(user.completedProjects || 0, 100)
          score += user.reviews || 0
          score += user.onTimeDeliveryRate ? user.onTimeDeliveryRate * 10 : 0
          score += user.clientSatisfaction ? user.clientSatisfaction * 5 : 0
        } else {
          // Client scoring
          score += (user.rating || 0) * 20
          score += Math.min(user.projectsPosted || 0, 50) * 2
          score += user.hires || 0
          score += user.repeatClientRate ? user.repeatClientRate * 10 : 0
        }
        
        return Math.round(score)
      },
      
      // Trending calculation
      calculateTrendingScore: (user, timeframe = 'week') => {
        let score = 0
        
        // Recent activity
        score += (user.recentProjects || 0) * 10
        score += (user.recentReviews || 0) * 5
        score += (user.profileViews || 0) * 2
        
        // Growth rate
        score += (user.growthRate || 0) * 15
        
        // Engagement
        score += (user.responseRate || 0) * 8
        score += (user.acceptanceRate || 0) * 7
        
        return Math.round(score)
      },
      
      // Clear growth data
      clearGrowthData: () => set({
        referralCode: null,
        referralStats: {
          totalReferrals: 0,
          activeReferrals: 0,
          creditsEarned: 0,
          pendingRewards: 0
        },
        leaderboard: {
          editors: [],
          clients: [],
          weekly: [],
          monthly: []
        },
        badges: [],
        achievements: [],
        trendingEditors: [],
        trendingProjects: []
      })
    }),
    {
      name: 'growth-storage',
      partialize: (state) => ({
        referralCode: state.referralCode,
        referralStats: state.referralStats,
        badges: state.badges
      })
    }
  )
)

export { useGrowthStore }
