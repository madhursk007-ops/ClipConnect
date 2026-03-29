import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Award, 
  Globe,
  Zap,
  Shield,
  TrendingUp,
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

const AboutPage = () => {
  const stats = [
    { value: '10K+', label: 'Active Users', icon: Users },
    { value: '50K+', label: 'Projects Completed', icon: Award },
    { value: '95%', label: 'Success Rate', icon: Star },
    { value: '150+', label: 'Countries', icon: Globe }
  ]

  const values = [
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for the highest quality in everything we do, from matching algorithms to user experience.'
    },
    {
      icon: Eye,
      title: 'Transparency',
      description: 'Clear communication, fair pricing, and honest relationships with our community.'
    },
    {
      icon: Heart,
      title: 'Community First',
      description: 'We prioritize the success and well-being of our editors and clients above all else.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Constantly pushing boundaries with AI-powered matching and cutting-edge features.'
    }
  ]

  const team = [
    {
      name: 'Alex Rivera',
      role: 'CEO & Co-founder',
      bio: 'Former video producer with 10+ years in the industry. Passionate about connecting creators with opportunities.',
      initials: 'AR'
    },
    {
      name: 'Sarah Chen',
      role: 'CTO & Co-founder',
      bio: 'AI researcher and full-stack developer. Built the matching algorithm that powers ClipConnect.',
      initials: 'SC'
    },
    {
      name: 'Marcus Johnson',
      role: 'Head of Design',
      bio: 'Award-winning UX designer. Previously led design teams at top tech companies.',
      initials: 'MJ'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Head of Operations',
      bio: 'Operations expert with experience scaling startups from 0 to millions of users.',
      initials: 'ER'
    }
  ]

  const milestones = [
    { year: '2021', event: 'ClipConnect founded' },
    { year: '2022', event: 'Reached 1,000 active users' },
    { year: '2023', event: 'Launched AI-powered matching' },
    { year: '2024', event: 'Expanded to 150+ countries' }
  ]

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              About <span className="text-primary-400">ClipConnect</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              We're on a mission to revolutionize the video editing industry by connecting exceptional talent with ambitious brands through the power of AI.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="glass-morphism rounded-2xl p-6 border border-white/10">
                <stat.icon className="w-8 h-8 text-primary-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-300 mb-6 text-lg">
                ClipConnect was born from a simple observation: talented video editors were struggling to find quality clients, while businesses were wasting time and money searching for the right creative talent.
              </p>
              <p className="text-gray-300 mb-6 text-lg">
                Founded in 2021 by two industry veterans, we set out to solve this problem with technology. Our AI-powered platform now matches projects with the perfect editor in minutes, not days.
              </p>
              <p className="text-gray-300 text-lg">
                Today, we're the world's leading marketplace for professional video editing, with thousands of successful projects completed and a community that spans the globe.
              </p>
            </motion.div>

            <motion.div
              className="glass-morphism-strong rounded-3xl p-8 border border-primary-500/30"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 text-center">Our Journey</h3>
              <div className="space-y-6">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">{milestone.year}</span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{milestone.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-800/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-gray-300 text-xl">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
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
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-gray-300 text-xl">The people behind the platform</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                  <span className="text-white text-2xl font-bold">{member.initials}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-primary-400 mb-3">{member.role}</p>
                <p className="text-gray-300 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Why Choose ClipConnect?</h2>
              <div className="space-y-4">
                {[
                  'AI-powered matching with 95% accuracy',
                  'Verified professionals with proven track records',
                  'Secure escrow payments and dispute resolution',
                  '24/7 dedicated support team',
                  'Advanced project management tools',
                  'Global talent pool with local expertise'
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="glass-morphism-strong rounded-3xl p-8 border border-primary-500/30 bg-gradient-to-r from-primary-500/10 to-accent-400/10"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6">Join Our Community</h3>
              <p className="text-gray-300 mb-6">
                Whether you're a talented editor looking for your next big project or a brand seeking exceptional video content, ClipConnect is your gateway to success.
              </p>
              <Link
                to="/auth/world-class"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-400 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
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
              Ready to Transform Your Video Production?
            </h2>
            <p className="text-gray-300 mb-8">
              Join thousands of professionals already using ClipConnect
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth/world-class"
                className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-400 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all"
              >
                Start Free Trial
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                Contact Sales
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
