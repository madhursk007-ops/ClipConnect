import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Shield, 
  UserCheck, 
  Globe, 
  Mail,
  FileText,
  Clock,
  Database,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

const GDPRPage = () => {
  const rights = [
    {
      icon: UserCheck,
      title: 'Right to Access',
      description: 'You can request a copy of all personal data we hold about you. We will provide this within 30 days free of charge.'
    },
    {
      icon: FileText,
      title: 'Right to Rectification',
      description: 'If your data is inaccurate or incomplete, you have the right to request corrections at any time.'
    },
    {
      icon: Shield,
      title: 'Right to Erasure',
      description: 'Also known as the "Right to be Forgotten". You can request deletion of your personal data in certain circumstances.'
    },
    {
      icon: Clock,
      title: 'Right to Restrict Processing',
      description: 'You can request that we limit how we use your data while we resolve any disputes or concerns.'
    },
    {
      icon: Database,
      title: 'Right to Data Portability',
      description: 'You can receive your data in a structured, machine-readable format and transfer it to another service.'
    },
    {
      icon: Globe,
      title: 'Right to Object',
      description: 'You can object to certain types of processing, including direct marketing and profiling.'
    }
  ]

  const dataPractices = [
    {
      title: 'Data Minimization',
      description: 'We only collect data that is necessary for providing our services. We don\'t collect excessive information.'
    },
    {
      title: 'Purpose Limitation',
      description: 'We only use your data for the purposes we specified when collecting it, or for compatible purposes.'
    },
    {
      title: 'Storage Limitation',
      description: 'We keep your data only as long as necessary. When no longer needed, we securely delete it.'
    },
    {
      title: 'Data Security',
      description: 'We implement appropriate technical and organizational measures to protect your data.'
    },
    {
      title: 'Accountability',
      description: 'We maintain records of our processing activities and can demonstrate compliance with GDPR.'
    },
    {
      title: 'Privacy by Design',
      description: 'We consider privacy at every stage of product development and business operations.'
    }
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
            <div className="inline-flex items-center px-4 py-2 bg-primary-500/20 rounded-full border border-primary-500/30 mb-6">
              <Globe className="w-5 h-5 text-primary-400 mr-2" />
              <span className="text-primary-400 font-medium">EU Regulation 2016/679</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              GDPR <span className="text-primary-400">Compliance</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              ClipConnect is fully committed to protecting the privacy rights of our EU users under the General Data Protection Regulation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What is GDPR */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-dark-800/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass-morphism rounded-2xl p-8 border border-white/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">What is GDPR?</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              The General Data Protection Regulation (GDPR) is a comprehensive data protection law that came into effect on May 25, 2018. It applies to all organizations processing personal data of EU residents, regardless of where the organization is located.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              GDPR gives individuals greater control over their personal data and imposes strict requirements on how organizations collect, process, and protect this data.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Your Rights */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Your GDPR Rights</h2>
            <p className="text-gray-300 text-xl">As an EU resident, you have the following rights:</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rights.map((right, index) => (
              <motion.div
                key={index}
                className="glass-morphism rounded-2xl p-8 border border-white/10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-14 h-14 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl flex items-center justify-center mb-4">
                  <right.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{right.title}</h3>
                <p className="text-gray-300">{right.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Exercise Rights */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-800/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass-morphism-strong rounded-3xl p-12 border border-primary-500/30 bg-gradient-to-r from-primary-500/10 to-accent-400/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              How to Exercise Your Rights
            </h2>
            
            <div className="space-y-6 text-gray-300">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Contact Our DPO</h3>
                  <p>Email our Data Protection Officer at <a href="mailto:dpo@clipconnect.com" className="text-primary-400">dpo@clipconnect.com</a> with your request.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Verify Your Identity</h3>
                  <p>For security, we may need to verify your identity before processing your request. We'll ask for information only you would know.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Receive Response</h3>
                  <p>We'll respond within 30 days. Complex requests may take up to 60 days, in which case we'll notify you of the extension.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Data Practices */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Our Data Protection Practices</h2>
            <p className="text-gray-300 text-xl">How we ensure GDPR compliance</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dataPractices.map((practice, index) => (
              <motion.div
                key={index}
                className="glass-morphism rounded-2xl p-8 border border-white/10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-success" />
                  <h3 className="text-xl font-bold text-white">{practice.title}</h3>
                </div>
                <p className="text-gray-300">{practice.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Basis */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-800/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass-morphism rounded-2xl p-8 border border-white/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Legal Basis for Processing</h2>
            <p className="text-gray-300 mb-6">
              Under GDPR, we must have a legal basis to process your personal data. We rely on the following bases:
            </p>
            
            <div className="space-y-4 text-gray-300">
              <div className="p-4 bg-dark-800/50 rounded-xl">
                <h3 className="font-semibold text-white mb-2">Contract Performance</h3>
                <p>Processing necessary to provide our services under our Terms of Service.</p>
              </div>
              
              <div className="p-4 bg-dark-800/50 rounded-xl">
                <h3 className="font-semibold text-white mb-2">Consent</h3>
                <p>Where you have given explicit consent, such as for marketing communications.</p>
              </div>
              
              <div className="p-4 bg-dark-800/50 rounded-xl">
                <h3 className="font-semibold text-white mb-2">Legitimate Interests</h3>
                <p>For security, fraud prevention, and improving our services.</p>
              </div>
              
              <div className="p-4 bg-dark-800/50 rounded-xl">
                <h3 className="font-semibold text-white mb-2">Legal Obligation</h3>
                <p>When required by law, such as tax reporting or court orders.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* International Transfers */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass-morphism rounded-2xl p-8 border border-white/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">International Data Transfers</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              ClipConnect operates globally. When we transfer your data outside the European Economic Area (EEA), we ensure appropriate safeguards are in place:
            </p>
            
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                <span>Standard Contractual Clauses approved by the European Commission</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                <span>Adequacy decisions for countries with equivalent data protection</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                <span>Binding corporate rules for intra-company transfers</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Complaints */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-800/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass-morphism rounded-2xl p-8 border border-white/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Right to Lodge a Complaint</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              If you believe we have violated your GDPR rights, you have the right to lodge a complaint with your local data protection authority:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 text-gray-300">
              <div className="p-4 bg-dark-800/50 rounded-xl">
                <h3 className="font-semibold text-white mb-2">UK Users</h3>
                <p>Information Commissioner's Office (ICO)</p>
                <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">ico.org.uk</a>
              </div>
              
              <div className="p-4 bg-dark-800/50 rounded-xl">
                <h3 className="font-semibold text-white mb-2">EU Users</h3>
                <p>Your local Data Protection Authority</p>
                <a href="https://edpb.europa.eu" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">edpb.europa.eu</a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact DPO */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="glass-morphism-strong rounded-3xl p-12 border border-primary-500/30 bg-gradient-to-r from-primary-500/10 to-accent-400/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Contact Our Data Protection Officer
            </h2>
            <p className="text-gray-300 mb-8">
              For any GDPR-related inquiries or to exercise your rights, contact our DPO:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:dpo@clipconnect.com"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-400 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all"
              >
                <Mail className="w-5 h-5 mr-2" />
                dpo@clipconnect.com
              </a>
              <Link
                to="/privacy"
                className="px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                Full Privacy Policy
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default GDPRPage
