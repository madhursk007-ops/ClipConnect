import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Download, 
  Image, 
  FileText, 
  Video,
  Mail,
  ExternalLink,
  Users,
  TrendingUp,
  Globe,
  Award,
  ArrowRight,
  CheckCircle,
  Camera,
  Mic,
  Newspaper
} from 'lucide-react'

const PressPage = () => {
  const brandAssets = [
    {
      title: 'Logo Package',
      description: 'PNG, SVG, and EPS formats in all color variants',
      size: '2.4 MB',
      icon: Image
    },
    {
      title: 'Brand Guidelines',
      description: 'Complete brand book with colors, typography, and usage rules',
      size: '5.1 MB',
      icon: FileText
    },
    {
      title: 'Product Screenshots',
      description: 'High-resolution screenshots of the platform interface',
      size: '12.8 MB',
      icon: Camera
    },
    {
      title: 'Executive Photos',
      description: 'Professional headshots of leadership team',
      size: '8.3 MB',
      icon: Users
    },
    {
      title: 'B-Roll Footage',
      description: 'Platform demo videos and office footage',
      size: '156 MB',
      icon: Video
    },
    {
      title: 'Media Kit PDF',
      description: 'One-page overview with key facts and figures',
      size: '1.2 MB',
      icon: Newspaper
    }
  ]

  const stats = [
    { value: '10,000+', label: 'Active Users' },
    { value: '$2.4M', label: 'Total Earnings' },
    { value: '150+', label: 'Countries' },
    { value: '95%', label: 'Match Accuracy' }
  ]

  const recentNews = [
    {
      date: 'March 15, 2026',
      title: 'ClipConnect Raises Series B Funding',
      source: 'TechCrunch',
      excerpt: 'Video editor marketplace ClipConnect announces $25M Series B led by Andreessen Horowitz.'
    },
    {
      date: 'February 28, 2026',
      title: 'AI Matching Algorithm Reaches 95% Accuracy',
      source: 'VentureBeat',
      excerpt: 'Company reports breakthrough in AI-powered editor-client matching technology.'
    },
    {
      date: 'January 10, 2026',
      title: 'ClipConnect Expands to 150 Countries',
      source: 'Forbes',
      excerpt: 'Global expansion brings professional video editing to emerging markets.'
    }
  ]

  const mediaCoverage = [
    { name: 'TechCrunch', logo: '/press/techcrunch.png' },
    { name: 'Forbes', logo: '/press/forbes.png' },
    { name: 'VentureBeat', logo: '/press/venturebeat.png' },
    { name: 'The Verge', logo: '/press/theverge.png' },
    { name: 'Wired', logo: '/press/wired.png' },
    { name: 'Fast Company', logo: '/press/fastcompany.png' }
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
            <div className="inline-flex items-center px-4 py-2 bg-primary-500/20 rounded-full border border-primary-500/30 mb-6">
              <Newspaper className="w-5 h-5 text-primary-400 mr-2" />
              <span className="text-primary-400 font-medium">Media Resources</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Press <span className="text-primary-400">Kit</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Everything you need to write about ClipConnect. Download logos, brand assets, and access company information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/press/clipconnect-press-kit.zip"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-400 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Complete Kit
              </a>
              <a
                href="mailto:press@clipconnect.com"
                className="inline-flex items-center px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact Press Team
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-dark-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl lg:text-5xl font-bold text-primary-400 mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass-morphism rounded-2xl p-8 border border-white/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">About ClipConnect</h2>
            <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
              <p>
                <strong className="text-white">ClipConnect</strong> is the world's leading AI-powered marketplace connecting professional video editors with brands and businesses. Founded in 2021, we've revolutionized how video content is produced by matching the right talent with the right projects using advanced machine learning algorithms.
              </p>
              <p>
                Our platform serves over 10,000 active users across 150+ countries, facilitating seamless collaboration between editors and clients. With a 95% match accuracy rate and $2.4M in total earnings distributed to creators, ClipConnect is transforming the video production industry.
              </p>
              <p>
                Headquartered in San Francisco with a globally distributed team, ClipConnect has raised $35M in funding from leading investors including Andreessen Horowitz, Sequoia Capital, and Y Combinator.
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">Quick Facts</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Founded:</span>
                    <span className="text-gray-300"> 2021 in San Francisco, CA</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Founders:</span>
                    <span className="text-gray-300"> Alex Rivera & Sarah Chen</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Employees:</span>
                    <span className="text-gray-300"> 40+ across 15 countries</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-white">Funding:</span>
                    <span className="text-gray-300"> $35M Series A & B</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brand Assets */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-800/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Brand Assets</h2>
            <p className="text-gray-300 text-xl">Download official logos, images, and guidelines</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brandAssets.map((asset, index) => (
              <motion.div
                key={index}
                className="glass-morphism rounded-2xl p-6 border border-white/10 hover:border-primary-500/30 transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl flex items-center justify-center">
                    <asset.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm text-gray-400">{asset.size}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{asset.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{asset.description}</p>
                <button className="flex items-center text-primary-400 hover:text-primary-300 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent News */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Recent News</h2>
            <p className="text-gray-300 text-xl">Latest updates from ClipConnect</p>
          </motion.div>

          <div className="space-y-6">
            {recentNews.map((news, index) => (
              <motion.div
                key={index}
                className="glass-morphism rounded-2xl p-6 border border-white/10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-4 mb-3">
                  <span className="text-sm text-primary-400">{news.date}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-sm text-gray-400">{news.source}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{news.title}</h3>
                <p className="text-gray-300 mb-4">{news.excerpt}</p>
                <button className="flex items-center text-primary-400 hover:text-primary-300 transition-colors">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-800/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">As Seen In</h2>
            <p className="text-gray-300 text-xl">Featured in leading publications</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {mediaCoverage.map((media, index) => (
              <motion.div
                key={index}
                className="glass-morphism rounded-xl p-6 border border-white/10 flex items-center justify-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-24 h-12 bg-gradient-to-r from-primary-500/20 to-accent-400/20 rounded-lg flex items-center justify-center">
                  <span className="text-gray-300 font-semibold">{media.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="glass-morphism-strong rounded-3xl p-12 border border-primary-500/30 bg-gradient-to-r from-primary-500/10 to-accent-400/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Media Inquiries
            </h2>
            <p className="text-gray-300 mb-8">
              For press requests, interviews, or additional information, please contact our communications team.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-dark-800/50 rounded-xl">
                <h3 className="font-semibold text-white mb-2">Press Contact</h3>
                <a href="mailto:press@clipconnect.com" className="text-primary-400 hover:text-primary-300">
                  press@clipconnect.com
                </a>
              </div>
              <div className="p-4 bg-dark-800/50 rounded-xl">
                <h3 className="font-semibold text-white mb-2">Response Time</h3>
                <p className="text-gray-300">Within 24 hours</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default PressPage
