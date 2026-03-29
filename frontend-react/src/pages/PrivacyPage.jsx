import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Shield, 
  Lock, 
  Eye, 
  Database,
  Share2,
  Cookie,
  Globe,
  UserCheck,
  Mail,
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const PrivacyPage = () => {
  const sections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: `We collect information you provide directly:
• Account information (name, email, profile details)
• Payment information (processed securely by our payment providers)
• Project details and communications
• Portfolio content and work samples

Automatically collected information:
• Device and browser information
• IP address and location data
• Usage patterns and platform interactions
• Cookies and similar technologies`
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: `We use your information to:
• Provide and improve our platform services
• Match editors with appropriate projects
• Process payments and transactions
• Send notifications and updates
• Analyze usage patterns to enhance user experience
• Prevent fraud and ensure platform security
• Comply with legal obligations

We never sell your personal information to third parties.`
    },
    {
      icon: Share2,
      title: 'Information Sharing',
      content: `We may share information with:
• Other users (as necessary for project collaboration)
• Service providers (payment processing, hosting, analytics)
• Legal authorities (when required by law)
• Business partners (with your consent)

All third parties are bound by confidentiality agreements and data protection requirements.`
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: `We implement robust security measures:
• Bank-level 256-bit SSL encryption
• Secure data centers with 24/7 monitoring
• Regular security audits and penetration testing
• Access controls and authentication protocols
• Automated threat detection systems

Despite our efforts, no internet transmission is 100% secure. We continuously improve our security measures.`
    },
    {
      icon: UserCheck,
      title: 'Your Rights',
      content: `You have the right to:
• Access your personal information
• Correct inaccurate or incomplete data
• Request deletion of your data
• Object to certain data processing
• Data portability
• Withdraw consent at any time
• Lodge complaints with data protection authorities

To exercise these rights, contact us at privacy@clipconnect.com`
    },
    {
      icon: Globe,
      title: 'International Data Transfers',
      content: `ClipConnect operates globally. Your data may be transferred to and processed in countries outside your residence, including the United States.

We ensure appropriate safeguards are in place for international transfers, including Standard Contractual Clauses approved by the European Commission.`
    }
  ]

  const rights = [
    'Right to access your data',
    'Right to correct your data',
    'Right to delete your data',
    'Right to restrict processing',
    'Right to data portability',
    'Right to object to processing'
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
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Privacy <span className="text-primary-400">Policy</span>
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
            <p className="text-gray-300 text-lg leading-relaxed">
              At ClipConnect, we take your privacy seriously. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our platform. By using ClipConnect, you agree to the practices described in this policy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Your Rights */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass-morphism rounded-2xl p-8 border border-white/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Your Privacy Rights</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {rights.map((right, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <UserCheck className="w-5 h-5 text-primary-400 flex-shrink-0" />
                  <span className="text-gray-300">{right}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Privacy Sections */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                className="glass-morphism rounded-2xl p-8 border border-white/10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                </div>
                <div className="text-gray-300 whitespace-pre-line leading-relaxed">
                  {section.content}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Retention & Cookies */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-800/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              className="glass-morphism rounded-2xl p-8 border border-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl flex items-center justify-center">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Data Retention</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                We retain your information as long as your account is active or as needed to provide services. After account deletion, we retain certain data for legal compliance, fraud prevention, and business purposes for up to 7 years, then securely delete it.
              </p>
            </motion.div>

            <motion.div
              className="glass-morphism rounded-2xl p-8 border border-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Cookies</h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your experience, analyze usage, and assist in marketing efforts. You can control cookies through your browser settings.
              </p>
              <Link to="/cookies" className="text-primary-400 hover:text-primary-300 flex items-center">
                Read Cookie Policy
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* GDPR & CCPA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass-morphism rounded-2xl p-8 border border-white/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">GDPR & CCPA Compliance</h2>
            <div className="space-y-6 text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">For EU Users (GDPR)</h3>
                <p>We comply with the General Data Protection Regulation. EU users have specific rights regarding their personal data, including the right to be forgotten and data portability.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">For California Users (CCPA)</h3>
                <p>California residents have rights under the California Consumer Privacy Act, including the right to know what personal information is collected and the right to deletion.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Data Protection Officer</h3>
                <p>Our Data Protection Officer can be reached at dpo@clipconnect.com for privacy-related inquiries.</p>
              </div>
            </div>
            
            <div className="mt-6">
              <Link to="/gdpr" className="text-primary-400 hover:text-primary-300 flex items-center">
                Read GDPR Compliance Details
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Updates & Contact */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-800/30">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              className="glass-morphism rounded-2xl p-8 border border-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Policy Updates</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                We may update this Privacy Policy periodically. Changes will be posted on this page with an updated revision date. Significant changes will be notified via email.
              </p>
            </motion.div>

            <motion.div
              className="glass-morphism rounded-2xl p-8 border border-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Contact Us</h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                Questions about privacy? Contact our team:
              </p>
              <a href="mailto:privacy@clipconnect.com" className="text-primary-400 hover:text-primary-300">
                privacy@clipconnect.com
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="glass-morphism-strong rounded-3xl p-12 border border-primary-500/30 bg-gradient-to-r from-primary-500/10 to-accent-400/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Your Privacy Matters
            </h2>
            <p className="text-gray-300 mb-8">
              We're committed to protecting your personal information and being transparent about our practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-400 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all"
              >
                Contact Privacy Team
              </Link>
              <Link
                to="/gdpr"
                className="px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                GDPR Details
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default PrivacyPage
