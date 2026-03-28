import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Brain, 
  Target, 
  TrendingUp, 
  CheckCircle,
  X,
  Loader2,
  Zap,
  Award,
  Star
} from 'lucide-react'
import { useAIStore } from '@store/aiStore'

const AIMatchingCard = ({ project, onMatchSelect, className = '' }) => {
  const { 
    topMatches, 
    isMatching, 
    generateTopMatches, 
    calculateMatchScore 
  } = useAIStore()
  
  const [showMatches, setShowMatches] = useState(false)
  const [localMatches, setLocalMatches] = useState([])

  useEffect(() => {
    if (project && project.skills) {
      // Generate mock matches for demo
      const mockEditors = [
        {
          id: 1,
          name: 'Sarah Chen',
          role: 'Video Editor',
          avatar: '/avatars/sarah.jpg',
          rating: 4.9,
          reviews: 127,
          hourlyRate: 75,
          skills: ['Adobe Premiere Pro', 'After Effects', 'Color Grading'],
          completedProjects: 89,
          availability: 'Available now',
          badge: 'Top Rated'
        },
        {
          id: 2,
          name: 'Marcus Johnson',
          role: 'Motion Designer',
          avatar: '/avatars/marcus.jpg',
          rating: 4.8,
          reviews: 94,
          hourlyRate: 85,
          skills: ['After Effects', 'Cinema 4D', 'Blender', 'Motion Graphics'],
          completedProjects: 67,
          availability: 'Available in 2 days',
          badge: 'Expert'
        },
        {
          id: 3,
          name: 'Elena Rodriguez',
          role: 'Video Producer',
          avatar: '/avatars/elena.jpg',
          rating: 5.0,
          reviews: 156,
          hourlyRate: 95,
          skills: ['Final Cut Pro', 'DaVinci Resolve', 'Storytelling'],
          completedProjects: 124,
          availability: 'Available now',
          badge: 'Premium'
        }
      ]

      const matchesWithScores = mockEditors.map(editor => {
        const score = calculateMatchScore(project, editor)
        return {
          ...editor,
          matchScore: score.total,
          matchFactors: score.factors,
          matchBreakdown: score.breakdown,
          matchedSkills: score.matchedSkills
        }
      }).sort((a, b) => b.matchScore - a.matchScore)

      setLocalMatches(matchesWithScores)
    }
  }, [project, calculateMatchScore])

  const handleGenerateMatches = async () => {
    try {
      await generateTopMatches(project.id)
      setShowMatches(true)
    } catch (error) {
      console.error('Error generating matches:', error)
      // Show local matches as fallback
      setShowMatches(true)
    }
  }

  const getMatchColor = (score) => {
    if (score >= 85) return 'text-success'
    if (score >= 70) return 'text-primary-400'
    if (score >= 50) return 'text-warning'
    return 'text-gray-400'
  }

  const getMatchGradient = (score) => {
    if (score >= 85) return 'from-success to-green-500'
    if (score >= 70) return 'from-primary-500 to-accent-400'
    if (score >= 50) return 'from-warning to-yellow-500'
    return 'from-gray-500 to-gray-600'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-morphism rounded-2xl p-6 border border-white/10 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl flex items-center justify-center mr-3">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">AI Smart Matching</h3>
            <p className="text-sm text-gray-400">Find the perfect editor for your project</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="badge badge-primary text-xs">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Powered
          </span>
        </div>
      </div>

      {/* Generate Button */}
      {!showMatches && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerateMatches}
          disabled={isMatching}
          className="w-full btn btn-primary relative overflow-hidden group"
        >
          <AnimatePresence mode="wait">
            {isMatching ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center"
              >
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Analyzing project...
              </motion.div>
            ) : (
              <motion.div
                key="generate"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center"
              >
                <Target className="w-5 h-5 mr-2" />
                Find Top Matches
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ x: '-100%' }}
            whileHover={{ x: '0%' }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
      )}

      {/* Matches Display */}
      <AnimatePresence>
        {showMatches && (topMatches.length > 0 || localMatches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-success" />
                Top Matches for You
              </h4>
              <button
                onClick={() => setShowMatches(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {(topMatches.length > 0 ? topMatches : localMatches).map((editor, index) => (
              <motion.div
                key={editor.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-dark-800/50 rounded-xl p-4 border border-white/10 hover:border-primary-500/30 transition-all cursor-pointer"
                onClick={() => onMatchSelect?.(editor)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-semibold">
                        {editor.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h5 className="font-semibold">{editor.name}</h5>
                      <p className="text-sm text-gray-400">{editor.role}</p>
                    </div>
                  </div>
                  
                  {/* Match Score */}
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getMatchColor(editor.matchScore)}`}>
                      {editor.matchScore}%
                    </div>
                    <div className="text-xs text-gray-400">Match Score</div>
                  </div>
                </div>

                {/* Match Breakdown */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {Object.entries(editor.matchBreakdown).map(([key, value]) => (
                    <div key={key} className="flex items-center text-xs text-gray-400">
                      <CheckCircle className="w-3 h-3 mr-1 text-success" />
                      {value}
                    </div>
                  ))}
                </div>

                {/* Matched Skills */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {editor.matchedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Match Progress Bar */}
                <div className="relative">
                  <div className="h-2 bg-dark-900 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${getMatchGradient(editor.matchScore)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${editor.matchScore}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                </div>

                {/* Editor Stats */}
                <div className="flex items-center justify-between mt-3 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    {editor.rating} ({editor.reviews} reviews)
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold text-primary-400">${editor.hourlyRate}/hr</span>
                  </div>
                </div>

                {/* Badge */}
                {editor.badge && (
                  <div className="mt-2">
                    <span className={`badge ${
                      editor.badge === 'Top Rated' ? 'badge-primary' :
                      editor.badge === 'Premium' ? 'badge-accent' : 'badge-success'
                    } text-xs`}>
                      <Award className="w-3 h-3 mr-1" />
                      {editor.badge}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}

            {/* CTA */}
            <div className="text-center pt-4 border-t border-white/10">
              <p className="text-sm text-gray-400 mb-3">
                <Zap className="w-4 h-4 inline mr-1 text-yellow-400" />
                AI found {topMatches.length || localMatches.length} perfect matches
              </p>
              <button className="btn btn-primary btn-sm">
                Contact Top Match
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default AIMatchingCard
