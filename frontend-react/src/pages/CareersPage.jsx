import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign,
  Heart,
  Zap,
  Users,
  Globe,
  Coffee,
  Laptop,
  ArrowRight,
  Star,
  CheckCircle
} from 'lucide-react'

const CareersPage = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  const benefits = [
    {
      icon: DollarSign,
      title: 'Competitive Salary',
      description: 'Top-tier compensation packages with regular reviews'
    },
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive health, dental, and vision coverage'
    },
    {
      icon: Laptop,
      title: 'Remote First',
      description: 'Work from anywhere with flexible schedules'
    },
    {
      icon: Zap,
      title: 'Learning Budget',
      description: '$2,000 annual budget for courses and conferences'
    },
    {
      icon: Coffee,
      title: 'Unlimited PTO',
      description: 'Take time off when you need it, no questions asked'
    },
    {
      icon: Users,
      title: 'Team Events',
      description: 'Regular retreats, team lunches, and fun activities'
    }
  ]

  const departments = ['all', 'Engineering', 'Design', 'Marketing', 'Operations', 'Support']

  const jobs = [
    {
      title: 'Senior Full Stack Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      salary: '$140k - $180k',
      description: 'Build scalable systems that power our AI matching platform.'
    },
    {
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      salary: '$100k - $140k',
      description: 'Create beautiful, intuitive experiences for our users.'
    },
    {
      title: 'Product Marketing Manager',
      department: 'Marketing',
      location: 'San Francisco / Remote',
      type: 'Full-time',
      salary: '$110k - $150k',
      description: 'Drive growth and tell our story to the world.'
    },
    {
      title: 'Customer Success Manager',
      department: 'Support',
      location: 'Remote',
      type: 'Full-time',
      salary: '$70k - $95k',
      description: 'Help our users succeed and love our platform.'
    },
    {
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      salary: '$130k - $170k',
      description: 'Build and maintain our cloud infrastructure.'
    },
    {
      title: 'Operations Coordinator',
      department: 'Operations',
      location: 'New York / Remote',
      type: 'Full-time',
      salary: '$60k - $80k',
      description: 'Keep our team organized and running smoothly.'
    }
  ]

  const filteredJobs = selectedDepartment === 'all' 
    ? jobs 
    : jobs.filter(job => job.department === selectedDepartment)

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
              Join Our <span className="text-primary-400">Team</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Help us build the future of video production. We're always looking for passionate people to join our mission.
            </p>
            <Link
              to="#open-positions"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-400 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all"
            >
              View Open Positions
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-800/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Why Join ClipConnect?</h2>
            <p className="text-gray-300 text-xl">Great benefits for great people</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
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
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Our Culture</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Collaborative</h3>
                    <p className="text-gray-300">We believe the best ideas come from working together. Everyone's voice matters.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-accent-400/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-accent-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Innovation-Driven</h3>
                    <p className="text-gray-300">We're constantly pushing boundaries and exploring new technologies.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Global & Inclusive</h3>
                    <p className="text-gray-300">Our team spans 15+ countries. Diversity makes us stronger.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="glass-morphism-strong rounded-3xl p-8 border border-primary-500/30"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-400 mb-2">40+</div>
                  <div className="text-gray-300">Team Members</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent-400 mb-2">15+</div>
                  <div className="text-gray-300">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary-400 mb-2">4.9</div>
                  <div className="text-gray-300">Glassdoor Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent-400 mb-2">92%</div>
                  <div className="text-gray-300">Retention Rate</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="open-positions" className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-800/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Open Positions</h2>
            <p className="text-gray-300 text-xl">Find your perfect role</p>
          </motion.div>

          {/* Department Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  selectedDepartment === dept
                    ? 'bg-gradient-to-r from-primary-500 to-accent-400 text-white'
                    : 'bg-dark-800 text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                {dept === 'all' ? 'All Departments' : dept}
              </button>
            ))}
          </div>

          {/* Job Listings */}
          <div className="space-y-4">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={index}
                className="glass-morphism rounded-2xl p-6 border border-white/10 hover:border-primary-500/30 transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{job.title}</h3>
                    <p className="text-gray-300 mb-3">{job.description}</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="flex items-center text-gray-400">
                        <Briefcase className="w-4 h-4 mr-1" />
                        {job.department}
                      </span>
                      <span className="flex items-center text-gray-400">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </span>
                      <span className="flex items-center text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        {job.type}
                      </span>
                      <span className="flex items-center text-primary-400">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {job.salary}
                      </span>
                    </div>
                  </div>
                  <Link
                    to="/contact"
                    className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-400 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all text-center whitespace-nowrap"
                  >
                    Apply Now
                  </Link>
                </div>
              </motion.div>
            ))}
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
              Don't See Your Perfect Role?
            </h2>
            <p className="text-gray-300 mb-8">
              We're always interested in meeting talented people. Send us your resume and tell us why you'd be a great fit.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-400 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all"
            >
              Send General Application
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default CareersPage
