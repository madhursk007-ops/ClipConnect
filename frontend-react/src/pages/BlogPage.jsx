import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Newspaper, 
  Calendar, 
  Clock, 
  User,
  ArrowRight,
  Tag,
  TrendingUp,
  Sparkles,
  Zap,
  Users
} from 'lucide-react'

const BlogPage = () => {
  const featuredPost = {
    title: 'How AI is Revolutionizing Video Production in 2026',
    excerpt: 'Discover how artificial intelligence is transforming the way brands create video content, from automated editing to intelligent content recommendations.',
    author: 'Sarah Chen',
    date: 'March 25, 2026',
    readTime: '8 min read',
    category: 'Industry Trends',
    image: '/blog/ai-video-production.jpg',
    featured: true
  }

  const posts = [
    {
      title: '10 Tips for Building a Standout Video Editor Portfolio',
      excerpt: 'Learn how to showcase your skills and attract high-paying clients with a compelling portfolio.',
      author: 'Marcus Johnson',
      date: 'March 22, 2026',
      readTime: '6 min read',
      category: 'Career Tips',
      image: '/blog/portfolio-tips.jpg'
    },
    {
      title: 'The Future of Remote Video Production Teams',
      excerpt: 'How distributed teams are changing the video production landscape and what it means for editors.',
      author: 'Elena Rodriguez',
      date: 'March 18, 2026',
      readTime: '5 min read',
      category: 'Remote Work',
      image: '/blog/remote-teams.jpg'
    },
    {
      title: 'Understanding the ClipConnect Matching Algorithm',
      excerpt: 'A deep dive into how our AI matches the perfect editor with each project.',
      author: 'Alex Rivera',
      date: 'March 15, 2026',
      readTime: '7 min read',
      category: 'Technology',
      image: '/blog/algorithm.jpg'
    },
    {
      title: 'Pricing Strategies for Video Editors in 2026',
      excerpt: 'How to set competitive rates that reflect your skills and market demand.',
      author: 'Sarah Chen',
      date: 'March 12, 2026',
      readTime: '6 min read',
      category: 'Business',
      image: '/blog/pricing.jpg'
    },
    {
      title: 'Success Story: From Freelancer to Agency Owner',
      excerpt: 'How one editor used ClipConnect to build a thriving video production agency.',
      author: 'Marcus Johnson',
      date: 'March 8, 2026',
      readTime: '10 min read',
      category: 'Success Stories',
      image: '/blog/success-story.jpg'
    },
    {
      title: 'Color Grading Trends Every Editor Should Know',
      excerpt: 'Stay ahead of the curve with these emerging color grading techniques and styles.',
      author: 'Elena Rodriguez',
      date: 'March 5, 2026',
      readTime: '5 min read',
      category: 'Editing Tips',
      image: '/blog/color-grading.jpg'
    }
  ]

  const categories = [
    { name: 'All', count: 45 },
    { name: 'Industry Trends', count: 12 },
    { name: 'Career Tips', count: 8 },
    { name: 'Technology', count: 10 },
    { name: 'Business', count: 7 },
    { name: 'Editing Tips', count: 8 }
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
              <span className="text-primary-400 font-medium">Latest Updates</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              ClipConnect <span className="text-primary-400">Blog</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Insights, tips, and stories from the world of video production and the creator economy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <motion.button
                key={index}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  index === 0
                    ? 'bg-gradient-to-r from-primary-500 to-accent-400 text-white'
                    : 'glass-morphism text-gray-400 hover:text-white border border-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.name}
                <span className="ml-2 text-sm opacity-70">({category.count})</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="glass-morphism-strong rounded-3xl overflow-hidden border border-primary-500/30"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid lg:grid-cols-2">
              <div className="h-64 lg:h-auto bg-gradient-to-br from-primary-500/30 to-accent-400/30 flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-r from-primary-500 to-accent-400 rounded-3xl flex items-center justify-center">
                  <Sparkles className="w-16 h-16 text-white" />
                </div>
              </div>
              <div className="p-8 lg:p-12">
                <div className="inline-flex items-center px-3 py-1 bg-primary-500/20 rounded-full border border-primary-500/30 mb-4">
                  <TrendingUp className="w-4 h-4 text-primary-400 mr-2" />
                  <span className="text-primary-400 text-sm font-medium">Featured</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-300 text-lg mb-6">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-6">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {featuredPost.author}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {featuredPost.date}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {featuredPost.readTime}
                  </span>
                </div>
                <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-400 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all">
                  Read Article
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl font-bold mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Latest Articles
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={index}
                className="glass-morphism rounded-2xl overflow-hidden border border-white/10 hover:border-primary-500/30 transition-all"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="h-48 bg-gradient-to-br from-primary-500/20 to-accent-400/20 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-400 rounded-2xl flex items-center justify-center">
                    <Newspaper className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="inline-flex items-center px-2 py-1 bg-primary-500/20 rounded-lg mb-3">
                    <Tag className="w-3 h-3 text-primary-400 mr-1" />
                    <span className="text-primary-400 text-xs font-medium">{post.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-800/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass-morphism-strong rounded-3xl p-12 border border-primary-500/30 bg-gradient-to-r from-primary-500/10 to-accent-400/10 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Get the latest articles, industry insights, and exclusive tips delivered straight to your inbox every week.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-500/50"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-400 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '50+', label: 'Articles Published', icon: Newspaper },
              { value: '10K+', label: 'Monthly Readers', icon: Users },
              { value: '25+', label: 'Expert Contributors', icon: User },
              { value: '98%', label: 'Satisfaction Rate', icon: TrendingUp }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="glass-morphism rounded-2xl p-6 border border-white/10 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <stat.icon className="w-8 h-8 text-primary-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default BlogPage
