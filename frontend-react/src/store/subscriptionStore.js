import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@services/api'

const useSubscriptionStore = create(
  persist(
    (set, get) => ({
      // Subscription state
      currentPlan: null,
      subscriptionStatus: null,
      isPro: false,
      features: {},
      
      // Billing state
      billingInfo: null,
      paymentMethods: [],
      transactions: [],
      
      // Usage tracking
      usage: {
        projectsPosted: 0,
        applicationsSubmitted: 0,
        messagesSent: 0,
        storageUsed: 0
      },
      
      // Actions
      fetchSubscription: async () => {
        try {
          const response = await api.get('/subscription/current')
          const { plan, status, features, usage } = response.data.data
          
          set({
            currentPlan: plan,
            subscriptionStatus: status,
            isPro: plan?.type !== 'free',
            features: features || {},
            usage: usage || {}
          })
          
          return { plan, status }
        } catch (error) {
          console.error('Error fetching subscription:', error)
        }
      },
      
      upgradePlan: async (planType) => {
        try {
          const response = await api.post('/subscription/upgrade', { planType })
          const { subscriptionUrl } = response.data.data
          
          // Redirect to Stripe checkout
          window.location.href = subscriptionUrl
          
          return subscriptionUrl
        } catch (error) {
          throw error
        }
      },
      
      cancelSubscription: async () => {
        try {
          await api.post('/subscription/cancel')
          
          // Update local state
          set({
            currentPlan: null,
            subscriptionStatus: 'canceled',
            isPro: false,
            features: {}
          })
          
          return true
        } catch (error) {
          throw error
        }
      },
      
      fetchBillingInfo: async () => {
        try {
          const response = await api.get('/billing/info')
          const { billingInfo, paymentMethods, transactions } = response.data.data
          
          set({
            billingInfo,
            paymentMethods,
            transactions
          })
          
          return { billingInfo, paymentMethods, transactions }
        } catch (error) {
          console.error('Error fetching billing info:', error)
        }
      },
      
      addPaymentMethod: async (paymentMethodId) => {
        try {
          const response = await api.post('/billing/payment-methods', { paymentMethodId })
          const { paymentMethod } = response.data.data
          
          set(state => ({
            paymentMethods: [...state.paymentMethods, paymentMethod]
          }))
          
          return paymentMethod
        } catch (error) {
          throw error
        }
      },
      
      removePaymentMethod: async (paymentMethodId) => {
        try {
          await api.delete(`/billing/payment-methods/${paymentMethodId}`)
          
          set(state => ({
            paymentMethods: state.paymentMethods.filter(pm => pm.id !== paymentMethodId)
          }))
          
          return true
        } catch (error) {
          throw error
        }
      },
      
      // Feature access checks
      canPostProject: () => {
        const { currentPlan, usage } = get()
        if (!currentPlan) return false
        
        const limits = {
          free: 3,
          pro: Infinity,
          premium: Infinity
        }
        
        return usage.projectsPosted < (limits[currentPlan.type] || 0)
      },
      
      canSubmitApplication: () => {
        const { currentPlan, usage } = get()
        if (!currentPlan) return false
        
        const limits = {
          free: 5,
          pro: Infinity,
          premium: Infinity
        }
        
        return usage.applicationsSubmitted < (limits[currentPlan.type] || 0)
      },
      
      canUseFeature: (feature) => {
        const { features } = get()
        return features[feature] || false
      },
      
      // Usage tracking
      trackUsage: (type, amount = 1) => {
        set(state => ({
          usage: {
            ...state.usage,
            [type]: (state.usage[type] || 0) + amount
          }
        }))
      },
      
      // Commission calculation
      calculateCommission: (amount) => {
        const { currentPlan } = get()
        
        const commissionRates = {
          free: 0.20,      // 20%
          pro: 0.10,       // 10%
          premium: 0.05    // 5%
        }
        
        const rate = commissionRates[currentPlan?.type] || 0.20
        return amount * rate
      },
      
      // Plan pricing
      getPlanPricing: () => ({
        free: {
          name: 'Free',
          price: 0,
          features: [
            '3 projects per month',
            '5 applications per month',
            'Basic profile',
            'Standard support'
          ],
          limitations: [
            'Limited visibility',
            'No analytics',
            'Standard commission (20%)'
          ]
        },
        pro: {
          name: 'Pro',
          price: 29,
          billing: 'monthly',
          features: [
            'Unlimited projects',
            'Unlimited applications',
            'Enhanced profile',
            'Priority support',
            'Analytics dashboard',
            'Featured listings',
            'Reduced commission (10%)'
          ],
          popular: true
        },
        premium: {
          name: 'Premium',
          price: 99,
          billing: 'monthly',
          features: [
            'Everything in Pro',
            'AI-powered matching',
            'Advanced analytics',
            'White-label options',
            'Dedicated account manager',
            'Lowest commission (5%)',
            'Priority customer support'
          ]
        }
      }),
      
      // Clear subscription data
      clearSubscription: () => set({
        currentPlan: null,
        subscriptionStatus: null,
        isPro: false,
        features: {},
        billingInfo: null,
        paymentMethods: [],
        transactions: []
      })
    }),
    {
      name: 'subscription-storage',
      partialize: (state) => ({
        currentPlan: state.currentPlan,
        subscriptionStatus: state.subscriptionStatus,
        isPro: state.isPro,
        features: state.features
      })
    }
  )
)

export { useSubscriptionStore }
