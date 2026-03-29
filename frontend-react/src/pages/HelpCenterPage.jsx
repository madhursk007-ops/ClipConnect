import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Search, 
  BookOpen, 
  MessageCircle, 
  Shield, 
  CreditCard,
  Users,
  FileText,
  Zap,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  HelpCircle,
  Mail
} from 'lucide-react'

const HelpCenterPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('getting-started')

  const categories = [
    { id: 'getting-started', name: 'Getting Started', icon: Zap },
    { id: 'account', name: 'Account & Profile', icon: Users },
    { id: 'payments', name: 'Payments & Billing', icon: CreditCard },
    { id: 'projects', name: 'Projects & Workflow', icon: FileText },
    { id: 'safety', name: 'Safety & Security', icon: Shield },
    { id: 'contact', name: 'Contact Support', icon: MessageCircle }
  ]

  const faqs = {
    'getting-started': [
      {
        question: 'How do I create an account?',
        answer: 'Creating an account is easy! Click the "Get Started" button, choose whether you\'re an editor or client, and fill in your details. You\'ll be ready to go in under 2 minutes.'
      },
      {
        question: 'What is the difference between Editor and Client accounts?',
        answer: 'Editors can apply to projects, showcase their portfolio, and get hired. Clients can post projects, browse editors, and manage their video production needs.'
      },
      {
        question: 'How does AI matching work?',
        answer: 'Our AI analyzes your requirements, skills, portfolio, and past work to match you with the perfect fit. The more complete your profile, the better the matches.'
      },
      {
        question: 'Is ClipConnect free to use?',
        answer: 'Yes! Basic accounts are free. You can upgrade to Pro or Premium for advanced features like unlimited projects, priority support, and AI tools.'
      }
    ],
    'account': [
      {
        question: 'How do I update my profile?',
        answer: 'Go to Settings > Profile. You can update your photo, bio, skills, portfolio, and other details. A complete profile gets better matches!'
      },
      {
        question: 'Can I change my account type?',
        answer: 'Yes, contact our support team and we can help you switch between Editor and Client accounts.'
      },
      {
        question: 'How do I reset my password?',
        answer: 'Click "Forgot password" on the login page, enter your email, and we\'ll send you a reset link. The link expires in 1 hour for security.'
      },
      {
        question: 'Can I have multiple accounts?',
        answer: 'We recommend one account per person. If you need both Editor and Client features, contact us about account options.'
      }
    ],
    'payments': [
      {
        question: 'How do payments work?',
        answer: 'Clients fund projects via secure escrow. Funds are released to editors upon project completion and client approval.'
      },
      {
        question: 'What payment methods are accepted?',
        answer: 'We accept all major credit cards, debit cards, PayPal, and bank transfers for Enterprise clients.'
      },
      {
        question: 'When do editors get paid?',
        answer: 'Editors receive payment within 3-5 business days after project completion and client approval.'
      },
      {
        question: 'Are there any fees?',
        answer: 'ClipConnect charges a small platform fee (5-10% depending on your plan). No hidden fees - what you see is what you get.'
      }
    ],
    'projects': [
      {
        question: 'How do I post a project?',
        answer: 'Click "Post Project" in your dashboard. Fill in details like budget, timeline, and requirements. Our AI will help match you with editors.'
      },
      {
        question: 'How do project applications work?',
        answer: 'Editors can apply to your project with a proposal and portfolio. You review applications and choose the best fit.'
      },
      {
        question: 'Can I cancel a project?',
        answer: 'Yes, you can cancel before work begins. If work has started, our dispute resolution team can help find a fair solution.'
      },
      {
        question: 'How do I communicate with my editor/client?',
        answer: 'Use our built-in messaging system for secure, documented communication. All messages are saved for your protection.'
      }
    ],
    'safety': [
      {
        question: 'How does ClipConnect ensure safety?',
        answer: 'We verify all users, use secure escrow payments, encrypt all communications, and have a dedicated safety team.'
      },
      {
        question: 'What if something goes wrong?',
        answer: 'Our 24/7 support team and dispute resolution process are here to help. We mediate and find fair solutions for both parties.'
      },
      {
        question: 'How is my data protected?',
        answer: 'We use bank-level encryption, secure servers, and follow GDPR compliance. Your data is never sold to third parties.'
      },
      {
        question: 'What are the community guidelines?',
        answer: 'We expect professionalism, respect, and honesty. Harassment, spam, or fraudulent behavior results in account suspension.'
      }
    ]
  }

  const quickLinks = [
    { name: 'Getting Started Guide', href: '/how-it-works', icon: BookOpen },
    { name: 'Pricing Information', href: '/pricing', icon: CreditCard },
    { name: 'Contact Support', href: '/contact', icon: MessageCircle },
    { name: 'Safety Center', href: '/safety', icon: Shield }
  ]

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Help <span className="text-primary-400">Center</span>
            </h1>
            <p className="text-xl text-gray-300 mb-12">
              Find answers to common questions or get in touch with our support team
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-4 py-4 bg-dark-800/50 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-500/50 transition-colors text-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={link.href}
                  className="glass-morphism rounded-2xl p-6 border border-white/10 hover:border-primary-500/30 transition-all flex items-center space-x-4"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500/20 to-accent-400/20 rounded-xl flex items-center justify-center">
                    <link.icon className="w-6 h-6 text-primary-400" />
                  </div>
                  <span className="font-semibold text-white">{link.name}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Category Sidebar */}
            <div className="lg:col-span-1">
              <h3 className="text-xl font-bold text-white mb-6">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-left ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-primary-500 to-accent-400 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <category.icon className="w-5 h-5" />
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ Content */}
            <div className="lg:col-span-3">
              <h3 className="text-2xl font-bold text-white mb-6">
                {categories.find(c => c.id === selectedCategory)?.name}
              </h3>
              
              {selectedCategory === 'contact' ? (
                <motion.div
                  className="glass-morphism rounded-2xl p-8 border border-white/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-center">
                    <Mail className="w-16 h-16 text-primary-400 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-4">Contact Support</h4>
                    <p className="text-gray-300 mb-6">
                      Can't find what you're looking for? Our support team is here to help 24/7.
                    </p>
                    <Link
                      to="/contact"
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-400 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all"
                    >
                      Get in Touch
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {faqs[selectedCategory]?.map((faq, index) => (
                    <motion.div
                      key={index}
                      className="glass-morphism rounded-2xl border border-white/10 overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="w-full flex items-center justify-between p-6 text-left"
                      >
                        <span className="font-semibold text-white">{faq.question}</span>
                        <motion.div
                          animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {expandedFaq === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-6 pb-6 text-gray-300">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="glass-morphism-strong rounded-3xl p-12 border border-primary-500/30 bg-gradient-to-r from-primary-500/10 to-accent-400/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Still Need Help?
            </h2>
            <p className="text-gray-300 mb-8">
              Our support team is available 24/7 to assist you with any questions or issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-400 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all"
              >
                Contact Support
              </Link>
              <a
                href="mailto:support@clipconnect.com"
                className="px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                Email Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HelpCenterPage
