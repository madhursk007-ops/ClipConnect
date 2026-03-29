import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Cookie, 
  Settings, 
  Shield, 
  Clock,
  ArrowRight,
  CheckCircle,
  XCircle,
  HelpCircle,
  Mail
} from 'lucide-react'

const CookiePage = () => {
  const cookieTypes = [
    {
      name: 'Essential Cookies',
      required: true,
      description: 'Necessary for the website to function properly. These cannot be disabled.',
      examples: ['Session cookies', 'Authentication cookies', 'Security cookies']
    },
    {
      name: 'Functional Cookies',
      required: false,
      description: 'Enable enhanced functionality and personalization.',
      examples: ['Language preferences', 'User settings', 'Theme preferences']
    },
    {
      name: 'Analytics Cookies',
      required: false,
      description: 'Help us understand how visitors interact with our website.',
      examples: ['Google Analytics', 'Mixpanel', 'Page view tracking']
    },
    {
      name: 'Marketing Cookies',
      required: false,
      description: 'Used to deliver relevant advertisements and track campaign performance.',
      examples: ['Facebook Pixel', 'Google Ads', 'Retargeting cookies']
    }
  ]

  const thirdParties = [
    { name: 'Google Analytics', purpose: 'Usage analytics', url: 'https://policies.google.com/privacy' },
    { name: 'Stripe', purpose: 'Payment processing', url: 'https://stripe.com/privacy' },
    { name: 'Cloudflare', purpose: 'Security & performance', url: 'https://www.cloudflare.com/privacypolicy/' },
    { name: 'SendGrid', purpose: 'Email delivery', url: 'https://sendgrid.com/policies/privacy/' }
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
              <Cookie className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Cookie <span className="text-primary-400">Policy</span>
            </h1>
            <p className="text-xl text-gray-300">
              Last updated: March 28, 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-dark-800/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass-morphism rounded-2xl p-8 border border-white/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">What Are Cookies?</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              Cookies are small text files stored on your device when you visit websites. They help websites remember your preferences, understand how you use the site, and provide personalized experiences.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              ClipConnect uses cookies to enhance your experience, analyze traffic, and for marketing purposes. By using our platform, you consent to our use of cookies in accordance with this policy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cookie Types */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Types of Cookies We Use</h2>
            <p className="text-gray-300">You can manage your cookie preferences below</p>
          </motion.div>

          <div className="space-y-6">
            {cookieTypes.map((type, index) => (
              <motion.div
                key={index}
                className="glass-morphism rounded-2xl p-8 border border-white/10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      type.required 
                        ? 'bg-gradient-to-r from-primary-500 to-accent-400' 
                        : 'bg-dark-800'
                    }`}>
                      <Cookie className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{type.name}</h3>
                      {type.required && (
                        <span className="text-sm text-primary-400">Required</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {type.required ? (
                      <div className="flex items-center text-gray-400">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Always On
                      </div>
                    ) : (
                      <button className="px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-400 text-white rounded-lg text-sm font-medium">
                        Enabled
                      </button>
                    )}
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4">{type.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {type.examples.map((example, i) => (
                    <span key={i} className="px-3 py-1 bg-dark-800 rounded-full text-sm text-gray-400">
                      {example}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Third Party Cookies */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-800/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass-morphism rounded-2xl p-8 border border-white/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Third-Party Cookies</h2>
            <p className="text-gray-300 mb-6">
              We work with trusted third parties who may also set cookies on your device:
            </p>
            
            <div className="space-y-4">
              {thirdParties.map((party, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                  <div>
                    <div className="font-semibold text-white">{party.name}</div>
                    <div className="text-sm text-gray-400">{party.purpose}</div>
                  </div>
                  <a 
                    href={party.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-400 hover:text-primary-300 flex items-center text-sm"
                  >
                    Privacy Policy
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Managing Cookies */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass-morphism rounded-2xl p-8 border border-white/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Managing Your Cookies</h2>
            </div>
            
            <div className="space-y-6 text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Browser Settings</h3>
                <p>Most web browsers allow you to control cookies through their settings. You can usually find these in the "Options" or "Preferences" menu. You can delete existing cookies and set your browser to refuse new cookies.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Our Cookie Banner</h3>
                <p>When you first visit ClipConnect, you'll see a cookie consent banner. You can use this to accept or reject non-essential cookies. You can change your preferences anytime by clicking the "Cookie Settings" link in our footer.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Impact of Disabling Cookies</h3>
                <p>Please note that disabling certain cookies may affect your experience on our platform. Essential cookies are always required for basic functionality like logging in and security features.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cookie Duration */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-dark-800/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass-morphism rounded-2xl p-8 border border-white/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Cookie Duration</h2>
            </div>
            
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-white">Session Cookies:</span> Temporary cookies that expire when you close your browser
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-white">Persistent Cookies:</span> Remain on your device for a set period (up to 2 years) or until manually deleted
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Updates & Contact */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              className="glass-morphism rounded-2xl p-8 border border-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl font-bold text-white mb-4">Policy Updates</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this Cookie Policy to reflect changes in technology, legislation, or our data practices. Changes will be posted on this page with an updated revision date.
              </p>
            </motion.div>

            <motion.div
              className="glass-morphism rounded-2xl p-8 border border-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl font-bold text-white mb-4">Questions?</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have questions about our cookie practices:
              </p>
              <a href="mailto:privacy@clipconnect.com" className="text-primary-400 hover:text-primary-300">
                privacy@clipconnect.com
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-dark-800/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/privacy"
              className="px-6 py-3 glass-morphism rounded-xl text-white hover:border-primary-500/30 transition-all"
            >
              Privacy Policy
            </Link>
            <Link
              to="/gdpr"
              className="px-6 py-3 glass-morphism rounded-xl text-white hover:border-primary-500/30 transition-all"
            >
              GDPR Compliance
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 glass-morphism rounded-xl text-white hover:border-primary-500/30 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CookiePage
