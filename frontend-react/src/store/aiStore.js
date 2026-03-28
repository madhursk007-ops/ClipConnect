import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@services/api'

const useAIStore = create(
  persist(
    (set, get) => ({
      // AI Matching State
      topMatches: [],
      isMatching: false,
      matchScores: {},
      
      // AI Project Generator State
      isGenerating: false,
      generatedDescription: '',
      originalDescription: '',
      
      // AI Portfolio Analyzer State
      portfolioAnalysis: null,
      isAnalyzing: false,
      
      // AI Actions
      generateTopMatches: async (projectId) => {
        set({ isMatching: true })
        try {
          const response = await api.post('/ai/match-editors', { projectId })
          const { matches, scores } = response.data.data
          
          set({
            topMatches: matches,
            matchScores: scores,
            isMatching: false
          })
          
          return { matches, scores }
        } catch (error) {
          set({ isMatching: false })
          throw error
        }
      },
      
      improveProjectDescription: async (description, projectType = 'general') => {
        set({ isGenerating: true, originalDescription: description })
        try {
          const response = await api.post('/ai/improve-description', {
            description,
            projectType
          })
          
          const improved = response.data.data.improvedDescription
          set({
            generatedDescription: improved,
            isGenerating: false
          })
          
          return improved
        } catch (error) {
          set({ isGenerating: false })
          throw error
        }
      },
      
      analyzePortfolio: async (portfolioItems) => {
        set({ isAnalyzing: true })
        try {
          const response = await api.post('/ai/analyze-portfolio', {
            portfolioItems
          })
          
          const analysis = response.data.data
          set({
            portfolioAnalysis: analysis,
            isAnalyzing: false
          })
          
          return analysis
        } catch (error) {
          set({ isAnalyzing: false })
          throw error
        }
      },
      
      // AI Scoring Algorithm (Client-side fallback)
      calculateMatchScore: (project, editor) => {
        let score = 0
        let factors = {}
        
        // Skills Matching (40% weight)
        const requiredSkills = project.skills || []
        const editorSkills = editor.skills || []
        const matchedSkills = requiredSkills.filter(skill => 
          editorSkills.some(editorSkill => 
            editorSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
        const skillScore = requiredSkills.length > 0 
          ? (matchedSkills.length / requiredSkills.length) * 40
          : 20
        factors.skills = skillScore
        score += skillScore
        
        // Budget Compatibility (25% weight)
        const projectBudget = project.budgetRange || project.budget
        const editorRate = editor.hourlyRate
        let budgetScore = 0
        
        if (projectBudget && editorRate) {
          if (projectBudget.includes('-')) {
            const [min, max] = projectBudget.replace(/[^0-9-]/g, '').split('-').map(Number)
            if (editorRate >= min && editorRate <= max) {
              budgetScore = 25
            } else if (editorRate < min) {
              budgetScore = 15
            } else {
              budgetScore = 5
            }
          }
        }
        factors.budget = budgetScore
        score += budgetScore
        
        // Rating (20% weight)
        const ratingScore = (editor.rating || 0) * 4
        factors.rating = ratingScore
        score += ratingScore
        
        // Experience (10% weight)
        const experienceScore = Math.min(editor.completedProjects / 10, 1) * 10
        factors.experience = experienceScore
        score += experienceScore
        
        // Availability (5% weight)
        const availabilityScore = editor.availability === 'Available now' ? 5 : 2
        factors.availability = availabilityScore
        score += availabilityScore
        
        return {
          total: Math.round(score),
          factors,
          matchedSkills,
          breakdown: {
            skills: `${matchedSkills.length}/${requiredSkills.length} skills match`,
            budget: budgetScore >= 20 ? 'Within budget' : 'Above budget',
            rating: `${editor.rating || 0}/5.0 rating`,
            experience: `${editor.completedProjects} projects`,
            availability: editor.availability
          }
        }
      },
      
      // Clear AI data
      clearMatches: () => set({ topMatches: [], matchScores: {} }),
      clearGeneratedDescription: () => set({ generatedDescription: '', originalDescription: '' }),
      clearPortfolioAnalysis: () => set({ portfolioAnalysis: null }),
    }),
    {
      name: 'ai-storage',
      partialize: (state) => ({
        topMatches: state.topMatches,
        matchScores: state.matchScores,
        portfolioAnalysis: state.portfolioAnalysis
      })
    }
  )
)

export { useAIStore }
