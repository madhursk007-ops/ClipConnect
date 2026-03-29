import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  FileText, 
  Shield, 
  Users, 
  CreditCard,
  AlertTriangle,
  Scale,
  ArrowRight,
  CheckCircle,
  Mail
} from 'lucide-react'

const TermsPage = () => {
  const sections = [
    {
      icon: FileText,
      title: 'Acceptance of Terms',
      content: `By accessing or using ClipConnect, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.

ClipConnect reserves the right to modify these terms at any time. We will notify users of significant changes via email or platform notifications. Continued use after changes constitutes acceptance.`
    },
    {
      icon: Users,
      title: 'User Accounts',
      content: `You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.

You agree to provide accurate, current, and complete information during registration. ClipConnect reserves the right to suspend or terminate accounts that provide false information or violate these terms.

You may not share your account credentials with third parties or allow others to access your account.`
    },
    {
      icon: CreditCard,
      title: 'Payments and Fees',
      content: `ClipConnect operates on a fee-based model. Platform fees range from 5-10% depending on your subscription plan. All fees are clearly displayed before transaction confirmation.

Payments are processed through secure third-party payment processors. ClipConnect does not store complete payment card information.

Refunds are handled on a case-by-case basis. Disputes must be filed within 14 days of project completion.`
    },
    {
      icon: Shield,
      title: 'Prohibited Activities',
      content: `Users may not engage in:
• Fraudulent, deceptive, or illegal activities
• Harassment, discrimination, or abusive behavior
• Spam, phishing, or unauthorized marketing
• Intellectual property violations
• Circumventing platform fees or security measures
• Creating multiple accounts to abuse platform features

Violation may result in immediate account termination and legal action.`
    },
    {
      icon: Scale,
      title: 'Dispute Resolution',
      content: `ClipConnect provides mediation services for disputes between users. Our team will review evidence from both parties and make a fair determination.

Users agree to attempt good-faith resolution before escalating to formal disputes. ClipConnect's decisions on disputes are final and binding.

For disputes exceeding $5,000, either party may request arbitration under the American Arbitration Association rules.`
    },
    {
      icon: AlertTriangle,
      title: 'Limitation of Liability',
      content: `ClipConnect is a marketplace platform and not a party to contracts between users. We do not guarantee the quality of work or the ability of users to complete projects.

ClipConnect's liability is limited to the amount of fees paid to us in connection with the disputed transaction. We are not liable for indirect, incidental, or consequential damages.

Users assume all risks associated with using the platform and working with other users.`
    }
  ]

  const keyPoints = [
    'Users must be 18+ years old',
    'Accurate profile information required',
    'Platform fees: 5-10% per transaction',
    'Disputes must be filed within 14 days',
    'No circumvention of platform fees',
    'Respectful behavior is mandatory'
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
              <Scale className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Terms of <span className="text-primary-400">Service</span>
            </h1>
            <p className="text-xl text-gray-300">
              Last updated: March 28, 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Points */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-dark-800/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass-morphism rounded-2xl p-8 border border-white/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Key Points at a Glance</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {keyPoints.map((point, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  <span className="text-gray-300">{point}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Terms Sections */}
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

      {/* Additional Provisions */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-800/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass-morphism rounded-2xl p-8 border border-white/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Additional Provisions</h2>
            
            <div className="space-y-6 text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Intellectual Property</h3>
                <p>ClipConnect retains all rights to our platform, trademarks, and proprietary technology. Users retain ownership of their content but grant us a license to display it on our platform.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Indemnification</h3>
                <p>You agree to indemnify and hold harmless ClipConnect and its affiliates from any claims arising from your use of the platform or violation of these terms.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Governing Law</h3>
                <p>These terms are governed by the laws of California, USA. Any disputes will be resolved in the courts of San Francisco County.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Severability</h3>
                <p>If any provision of these terms is found invalid, the remaining provisions will continue in full effect.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Entire Agreement</h3>
                <p>These terms constitute the entire agreement between you and ClipConnect regarding platform use, superseding any prior agreements.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="glass-morphism-strong rounded-3xl p-12 border border-primary-500/30 bg-gradient-to-r from-primary-500/10 to-accent-400/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Questions About Our Terms?
            </h2>
            <p className="text-gray-300 mb-8">
              Contact our legal team for clarifications or concerns about our Terms of Service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:legal@clipconnect.com"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-400 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all"
              >
                <Mail className="w-5 h-5 mr-2" />
                Email Legal Team
              </a>
              <Link
                to="/contact"
                className="px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                General Contact
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default TermsPage
