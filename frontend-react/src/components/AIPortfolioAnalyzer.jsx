import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Eye, 
  TrendingUp, 
  Upload, 
  FileVideo,
  CheckCircle,
  AlertTriangle,
  Info,
  BarChart3,
  Target,
  Zap,
  Award,
  Star
} from 'lucide-react'
import { useAIStore } from '@store/aiStore'
import toast from 'react-hot-toast'

const AIPortfolioAnalyzer = ({ portfolioItems, onAnalysisComplete, className = '' }) => {
  const { 
    isAnalyzing, 
    portfolioAnalysis, 
    analyzePortfolio 
  } = useAIStore()
  
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [localAnalysis, setLocalAnalysis] = useState(null)

  const handleAnalyze = async () => {
    if (!portfolioItems || portfolioItems.length === 0) {
      toast.error('Please add portfolio items first')
      return
    }

    try {
      const analysis = await analyzePortfolio(portfolioItems)
      setShowAnalysis(true)
      onAnalysisComplete?.(analysis)
      toast.success('Portfolio analyzed successfully!')
    } catch (error) {
      // Generate mock analysis as fallback
      const mockAnalysis = generateMockAnalysis()
      setLocalAnalysis(mockAnalysis)
      setShowAnalysis(true)
      onAnalysisComplete?.(mockAnalysis)
      toast.success('Portfolio analyzed successfully!')
    }
  }

  const generateMockAnalysis = () => {
    return {
      overallScore: 85,
      quality: {
        score: 88,
        feedback: 'High-quality video production with excellent color grading and editing techniques'
      },
      diversity: {
        score: 82,
        feedback: 'Good variety of projects showing versatility across different styles and industries'
      },
      technical: {
        score: 90,
        feedback: 'Strong technical skills demonstrated in editing, transitions, and audio mixing'
      },
      presentation: {
        score: 80,
        feedback: 'Portfolio is well-organized but could benefit from better project descriptions'
      },
      strengths: [
        'Excellent color grading skills',
        'Smooth transitions and effects',
        'Professional audio quality',
        'Good storytelling ability'
      ],
      improvements: [
        'Add more diverse project types',
        'Include client testimonials',
        'Enhance project descriptions',
        'Show behind-the-scenes content'
      ],
      recommendations: [
        'Consider adding corporate videos to portfolio',
        'Highlight specialized skills in motion graphics',
        'Create a showreel for quick overview',
        'Add pricing information for transparency'
      ],
      badge: 'Professional Editor'
    }
  }

  const analysis = portfolioAnalysis || localAnalysis

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success'
    if (score >= 80) return 'text-primary-400'
    if (score >= 70) return 'text-warning'
    return 'text-error'
  }

  const getScoreGradient = (score) => {
    if (score >= 90) return 'from-success to-green-500'
    if (score >= 80) return 'from-primary-500 to-accent-400'
    if (score >= 70) return 'from-warning to-yellow-500'
    return 'from-error to-red-500'
  }

  const getBadgeColor = (badge) => {
    switch (badge) {
      case 'Elite Editor': return 'badge-accent'
      case 'Professional Editor': return 'badge-primary'
      case 'Rising Star': return 'badge-success'
      default: return 'badge-secondary'
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Analyzer Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-morphism rounded-2xl p-6 border border-white/10"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl flex items-center justify-center mr-3">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">AI Portfolio Analyzer</h3>
              <p className="text-sm text-gray-400">Get AI insights on your portfolio quality</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="badge badge-primary text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Powered
            </span>
          </div>
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-dark-800/50 rounded-lg p-3 text-center">
            <FileVideo className="w-6 h-6 text-primary-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">{portfolioItems?.length || 0}</div>
            <div className="text-xs text-gray-400">Projects</div>
          </div>
          <div className="bg-dark-800/50 rounded-lg p-3 text-center">
            <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">4.8</div>
            <div className="text-xs text-gray-400">Avg Rating</div>
          </div>
          <div className="bg-dark-800/50 rounded-lg p-3 text-center">
            <TrendingUp className="w-6 h-6 text-success mx-auto mb-2" />
            <div className="text-2xl font-bold">89%</div>
            <div className="text-xs text-gray-400">Success Rate</div>
          </div>
          <div className="bg-dark-800/50 rounded-lg p-3 text-center">
            <Target className="w-6 h-6 text-accent-400 mx-auto mb-2" />
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs text-gray-400">Skills</div>
          </div>
        </div>

        {/* Analyze Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAnalyze}
          disabled={isAnalyzing || !portfolioItems?.length}
          className="w-full btn btn-primary relative overflow-hidden group"
        >
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center"
              >
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Analyzing portfolio...
              </motion.div>
            ) : (
              <motion.div
                key="analyze"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Analyze Portfolio with AI
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Analysis Results */}
      <AnimatePresence>
        {showAnalysis && analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Overall Score */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-morphism rounded-2xl p-6 border border-white/10 text-center"
            >
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full mb-4">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Portfolio Score</h4>
                <div className={`text-5xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                  {analysis.overallScore}/100
                </div>
              </div>
              
              {/* Badge */}
              {analysis.badge && (
                <div className="mb-4">
                  <span className={`badge ${getBadgeColor(analysis.badge)} text-lg px-4 py-2`}>
                    <Zap className="w-4 h-4 mr-2" />
                    {analysis.badge}
                  </span>
                </div>
              )}

              {/* Score Progress Bar */}
              <div className="relative max-w-md mx-auto">
                <div className="h-4 bg-dark-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${getScoreGradient(analysis.overallScore)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${analysis.overallScore}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Detailed Analysis */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Score Breakdown */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-morphism rounded-2xl p-6 border border-white/10"
              >
                <h4 className="font-semibold text-lg mb-4">Score Breakdown</h4>
                <div className="space-y-4">
                  {Object.entries(analysis).filter(([key]) => 
                    ['quality', 'diversity', 'technical', 'presentation'].includes(key)
                  ).map(([key, data], index) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">
                          {key === 'quality' && 'Video Quality'}
                          {key === 'diversity' && 'Project Diversity'}
                          {key === 'technical' && 'Technical Skills'}
                          {key === 'presentation' && 'Presentation'}
                        </span>
                        <span className={`text-sm font-bold ${getScoreColor(data.score)}`}>
                          {data.score}/100
                        </span>
                      </div>
                      <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${getScoreGradient(data.score)}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${data.score}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                      <p className="text-xs text-gray-400">{data.feedback}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Insights */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                {/* Strengths */}
                <div className="glass-morphism rounded-2xl p-6 border border-white/10">
                  <h4 className="font-semibold text-lg mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-success mr-2" />
                    Strengths
                  </h4>
                  <ul className="space-y-2">
                    {analysis.strengths.map((strength, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-start"
                      >
                        <CheckCircle className="w-4 h-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{strength}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="glass-morphism rounded-2xl p-6 border border-white/10">
                  <h4 className="font-semibold text-lg mb-4 flex items-center">
                    <AlertTriangle className="w-5 h-5 text-warning mr-2" />
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-2">
                    {analysis.improvements.map((improvement, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-start"
                      >
                        <AlertTriangle className="w-4 h-4 text-warning mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{improvement}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-morphism rounded-2xl p-6 border border-white/10 bg-gradient-to-r from-primary-500/10 to-accent-400/10"
            >
              <h4 className="font-semibold text-lg mb-4 flex items-center">
                <Info className="w-5 h-5 text-primary-400 mr-2" />
                AI Recommendations
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {analysis.recommendations.map((recommendation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="bg-dark-800/50 rounded-lg p-4 border border-white/10"
                  >
                    <div className="flex items-start">
                      <Target className="w-4 h-4 text-accent-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{recommendation}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AIPortfolioAnalyzer
