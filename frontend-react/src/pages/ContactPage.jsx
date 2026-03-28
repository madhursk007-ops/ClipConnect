import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  CheckCircle,
  Clock,
  Users,
  Star
} from 'lucide-react'

const ContactPage = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      content: 'support@clipconnect.com',
      description: 'Get help within 24 hours'
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: '+1 (555) 123-4567',
      description: 'Mon-Fri, 9am-6pm PST'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      content: 'San Francisco, CA',
      description: 'Come say hello!'
    }
  ]

  const team = [
    {
      name: 'Sarah Chen',
      role: 'Head of Support',
      avatar: '/avatars/sarah.jpg',
      bio: 'Leading our customer support team with 5+ years of experience.'
    },
    {
      name: 'Marcus Johnson',
      role: 'Community Manager',
      avatar: '/avatars/marcus.jpg',
      bio: 'Building strong relationships with our amazing community.'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Technical Support',
      avatar: '/avatars/elena.jpg',
      bio: 'Helping you solve any technical issues you might encounter.'
    }
  ]

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            className="text-5xl lg:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Get in Touch
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            We're here to help! Whether you have questions, feedback, or need support, our team is ready to assist you.
          </motion.p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                className="glass-morphism rounded-2xl p-8 border border-white/10 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <info.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{info.title}</h3>
                <p className="text-primary-400 font-medium mb-2">{info.content}</p>
                <p className="text-gray-400">{info.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="glass-morphism-strong rounded-3xl p-8 lg:p-12 border border-primary-500/30 bg-gradient-to-r from-primary-500/10 to-accent-400/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Send us a Message
            </h2>
            
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-500/50 transition-colors"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-500/50 transition-colors"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-500/50 transition-colors"
                  placeholder="How can we help?"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-500/50 transition-colors resize-none"
                  placeholder="Tell us more about your inquiry..."
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-primary-500 to-accent-400 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all flex items-center justify-center"
              >
                Send Message
                <Send className="w-5 h-5 ml-2" />
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="glass-morphism rounded-2xl p-6 border border-white/10 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                <p className="text-primary-400 mb-3">{member.role}</p>
                <p className="text-gray-300">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <motion.div
              className="glass-morphism rounded-xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-white mb-3">
                How quickly do you respond to support requests?
              </h3>
              <p className="text-gray-300">
                We typically respond to all support inquiries within 24 hours during business days. Premium users get priority support with response times under 4 hours.
              </p>
            </motion.div>
            
            <motion.div
              className="glass-morphism rounded-xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold text-white mb-3">
                Do you offer phone support?
              </h3>
              <p className="text-gray-300">
                Yes, we offer phone support for Premium and Enterprise customers during business hours (9am-6pm PST, Monday-Friday).
              </p>
            </motion.div>
            
            <motion.div
              className="glass-morphism rounded-xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-white mb-3">
                Can I schedule a demo?
              </h3>
              <p className="text-gray-300">
                Absolutely! We'd love to show you around. Contact us and we'll set up a personalized demo of the platform.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
