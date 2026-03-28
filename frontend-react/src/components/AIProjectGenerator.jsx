import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Wand2, 
  RefreshCw, 
  CheckCircle,
  Copy,
  Lightbulb,
  Target,
  Clock,
  DollarSign,
  Zap,
  FileText
} from 'lucide-react'
import { useAIStore } from '@store/aiStore'
import toast from 'react-hot-toast'

const AIProjectGenerator = ({ 
  initialDescription = '', 
  projectType = 'general', 
  onDescriptionGenerated,
  className = '' 
}) => {
  const { 
    isGenerating, 
    generatedDescription, 
    originalDescription, 
    improveProjectDescription,
    clearGeneratedDescription 
  } = useAIStore()
  
  const [description, setDescription] = useState(initialDescription)
  const [showGenerated, setShowGenerated] = useState(false)
  const [selectedType, setSelectedType] = useState(projectType)

  const projectTypes = [
    { id: 'general', name: 'General', icon: FileText },
    { id: 'corporate', name: 'Corporate', icon: Target },
    { id: 'social', name: 'Social Media', icon: Zap },
    { id: 'documentary', name: 'Documentary', icon: FileText },
    { id: 'music', name: 'Music Video', icon: Zap },
    { id: 'commercial', name: 'Commercial', icon: Target }
  ]

  const handleGenerate = async () => {
    if (!description.trim()) {
      toast.error('Please enter a project description first')
      return
    }

    try {
      const improved = await improveProjectDescription(description, selectedType)
      setShowGenerated(true)
      onDescriptionGenerated?.(improved)
      toast.success('AI enhanced your project description!')
    } catch (error) {
      toast.error('Failed to generate description. Please try again.')
    }
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Description copied to clipboard!')
  }

  const handleAccept = () => {
    setDescription(generatedDescription)
    setShowGenerated(false)
    onDescriptionGenerated?.(generatedDescription)
    toast.success('AI description applied!')
  }

  const handleReject = () => {
    setShowGenerated(false)
    clearGeneratedDescription()
  }

  const getWordCount = (text) => text.split(/\s+/).filter(word => word.length > 0).length

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-morphism rounded-2xl p-6 border border-white/10"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl flex items-center justify-center mr-3">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">AI Project Description Generator</h3>
              <p className="text-sm text-gray-400">Transform your idea into a professional project brief</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="badge badge-primary text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              AI Powered
            </span>
          </div>
        </div>

        {/* Project Type Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {projectTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`p-3 rounded-xl border transition-all text-left ${
                  selectedType === type.id
                    ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                    : 'border-white/20 hover:border-white/40 text-gray-400'
                }`}
              >
                <type.icon className="w-4 h-4 mb-1" />
                <div className="text-sm font-medium">{type.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Description Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Your Project Idea
          </label>
          <div className="relative">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project idea in a few sentences..."
              className="input min-h-[120px] resize-none"
              maxLength={500}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              {getWordCount(description)}/500 words
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={isGenerating || !description.trim()}
          className="w-full btn btn-primary relative overflow-hidden group"
        >
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center"
              >
                <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                Generating professional description...
              </motion.div>
            ) : (
              <motion.div
                key="generate"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                ✨ Improve with AI
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
      </motion.div>

      {/* Generated Description */}
      <AnimatePresence>
        {showGenerated && generatedDescription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-morphism rounded-2xl border border-primary-500/30 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-primary-500/10 to-accent-400/10 border-b border-primary-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-success mr-2" />
                  <h4 className="font-semibold">AI-Enhanced Description</h4>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopy(generatedDescription)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Generated Description</span>
                  <span className="text-xs text-primary-400">
                    {getWordCount(generatedDescription)} words
                  </span>
                </div>
                <div className="bg-dark-800/50 rounded-xl p-4 border border-white/10">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {generatedDescription}
                  </p>
                </div>
              </div>

              {/* AI Insights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-dark-800/50 rounded-lg p-3 border border-white/10">
                  <Target className="w-4 h-4 text-primary-400 mb-2" />
                  <div className="text-sm font-medium mb-1">Clear Objectives</div>
                  <div className="text-xs text-gray-400">Well-defined project goals</div>
                </div>
                <div className="bg-dark-800/50 rounded-lg p-3 border border-white/10">
                  <Clock className="w-4 h-4 text-accent-400 mb-2" />
                  <div className="text-sm font-medium mb-1">Timeline</div>
                  <div className="text-xs text-gray-400">Realistic delivery expectations</div>
                </div>
                <div className="bg-dark-800/50 rounded-lg p-3 border border-white/10">
                  <DollarSign className="w-4 h-4 text-success mb-2" />
                  <div className="text-sm font-medium mb-1">Budget Range</div>
                  <div className="text-xs text-gray-400">Market-aligned pricing</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAccept}
                  className="flex-1 btn btn-primary"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept AI Description
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 btn btn-outline"
                >
                  Keep Original
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-primary-500/10 rounded-xl p-4 border border-primary-500/20"
      >
        <div className="flex items-start">
          <Lightbulb className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm mb-2">Pro Tips</h4>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Be specific about your project goals and requirements</li>
              <li>• Mention your target audience and desired style</li>
              <li>• Include budget range and timeline expectations</li>
              <li>• The AI will enhance clarity, professionalism, and detail</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AIProjectGenerator
