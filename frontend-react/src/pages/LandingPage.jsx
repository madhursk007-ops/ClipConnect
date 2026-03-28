import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useInView } from 'react-intersection-observer'
import { 
  Play, 
  Users, 
  Star, 
  Shield, 
  Zap, 
  ArrowRight, 
  CheckCircle,
  TrendingUp,
  Clock,
  Award,
  MessageSquare,
  ChevronRight,
  Menu,
  X,
  Video,
  Palette,
  Music,
  Camera
} from 'lucide-react'

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  // Intersection observers for animations
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [testimonialsRef, testimonialsInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const featuredEditors = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Video Editor',
      avatar: '/avatars/sarah.jpg',
      rating: 4.9,
      projects: 127,
      hourlyRate: 75,
      skills: ['Premiere Pro', 'After Effects', 'Color Grading'],
      badge: 'Top Rated'
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      role: 'Motion Designer',
      avatar: '/avatars/marcus.jpg',
      rating: 4.8,
      projects: 89,
      hourlyRate: 85,
      skills: ['After Effects', 'Cinema 4D', 'Blender'],
      badge: 'Expert'
    },
    {
      id: 3,
      name: 'Elena Rodriguez',
      role: 'Video Producer',
      avatar: '/avatars/elena.jpg',
      rating: 5.0,
      projects: 156,
      hourlyRate: 95,
      skills: ['Final Cut Pro', 'DaVinci', 'Storytelling'],
      badge: 'Premium'
    }
  ]

  const testimonials = [
    {
      id: 1,
      name: 'Alex Thompson',
      role: 'Content Creator',
      avatar: '/avatars/alex.jpg',
      content: 'ClipConnect transformed my YouTube channel. The editors are professional and deliver amazing results every time.',
      rating: 5
    },
    {
      id: 2,
      name: 'Jessica Lee',
      role: 'Marketing Director',
      avatar: '/avatars/jessica.jpg',
      content: 'Finding talented video editors was never easier. The platform is intuitive and the quality of work is outstanding.',
      rating: 5
    },
    {
      id: 3,
      name: 'David Kim',
      role: 'Startup Founder',
      avatar: '/avatars/david.jpg',
      content: 'As a startup, we needed high-quality videos on a budget. ClipConnect delivered beyond our expectations.',
      rating: 5
    }
  ]

  const stats = [
    { number: '2000+', label: 'Projects Completed', icon: CheckCircle },
    { number: '500+', label: 'Expert Editors', icon: Users },
    { number: '98%', label: 'Client Satisfaction', icon: Star },
    { number: '24/7', label: 'Support Available', icon: Shield }
  ]

  const features = [
    {
      icon: Video,
      title: 'Professional Editing',
      description: 'Connect with expert video editors who bring your vision to life with stunning visuals and compelling storytelling.'
    },
    {
      icon: Users,
      title: 'Vetted Talent',
      description: 'Every editor on our platform is carefully vetted for skills, experience, and professionalism.'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Escrow protection ensures your payment is only released when you\'re completely satisfied.'
    },
    {
      icon: Zap,
      title: 'Fast Turnaround',
      description: 'Quick project completion without compromising on quality. Get your videos edited in record time.'
    },
    {
      icon: MessageSquare,
      title: 'Real-time Chat',
      description: 'Communicate directly with editors through our built-in messaging system.'
    },
    {
      icon: Award,
      title: 'Quality Guarantee',
      description: 'We stand behind the quality of work. If you\'re not satisfied, we\'ll make it right.'
    }
  ]

  const categories = [
    { name: 'Video Editing', icon: Video, color: 'from-purple-500 to-pink-500' },
    { name: 'Motion Graphics', icon: Palette, color: 'from-blue-500 to-cyan-500' },
    { name: 'Audio Production', icon: Music, color: 'from-green-500 to-emerald-500' },
    { name: 'Color Grading', icon: Camera, color: 'from-orange-500 to-red-500' }
  ]

  return (
    <div className="min-h-screen bg-dark-900 text-white overflow-hidden">
      {/* Background Animation */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-primary-500/10 to-accent-400/10 blur-3xl"
              style={{
                width: `${Math.random() * 400 + 200}px`,
                height: `${Math.random() * 400 + 200}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${20 + i * 5}s ease-in-out infinite`,
                animationDelay: `${i * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-50 glass-morphism-strong sticky top-0 backdrop-blur-xl"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold font-heading">ClipConnect</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#editors" className="text-gray-300 hover:text-white transition-colors">Editors</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <Link to="/auth/login" className="btn btn-ghost">Sign In</Link>
              <Link to="/auth/register" className="btn btn-primary">Get Started</Link>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden mt-4 space-y-4"
              >
                <a href="#features" className="block text-gray-300 hover:text-white transition-colors">Features</a>
                <a href="#editors" className="block text-gray-300 hover:text-white transition-colors">Editors</a>
                <a href="#pricing" className="block text-gray-300 hover:text-white transition-colors">Pricing</a>
                <div className="pt-4 space-y-2">
                  <Link to="/auth/login" className="block btn btn-ghost w-full">Sign In</Link>
                  <Link to="/auth/register" className="block btn btn-primary w-full">Get Started</Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        initial={{ opacity: 0 }}
        animate={heroInView ? { opacity: 1 } : {}}
        className="relative z-10 container mx-auto px-6 py-20 lg:py-32"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={heroInView ? { x: 0, opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full mb-6">
              <Zap className="w-4 h-4 text-primary-400 mr-2" />
              <span className="text-sm text-primary-400">Trusted by 1000+ creators worldwide</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-heading font-bold mb-6">
              <span className="gradient-text">Connect.</span><br />
              <span className="gradient-text">Create.</span><br />
              <span className="gradient-text">Conquer.</span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Where visionary creators meet elite video editors. Transform your content with professional editing services that captivate and convert.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link to="/auth/register" className="btn btn-primary btn-lg group">
                Get Started Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/marketplace" className="btn btn-outline btn-lg">
                Browse Editors
              </Link>
            </div>

            <div className="flex items-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                14-day money-back guarantee
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={heroInView ? { x: 0, opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="relative glass-morphism-strong rounded-3xl p-8 border border-white/20">
              <div className="aspect-video bg-gradient-to-br from-primary-500/20 to-accent-400/20 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-white/80 mx-auto mb-4" />
                  <p className="text-white/60">Watch how it works</p>
                </div>
              </div>
              
              {/* Floating cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 glass-morphism rounded-xl p-4 border border-white/20"
              >
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-medium">4.9/5 Rating</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 glass-morphism rounded-xl p-4 border border-white/20"
              >
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-medium">2000+ Projects</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        ref={statsRef}
        initial={{ opacity: 0 }}
        animate={statsInView ? { opacity: 1 } : {}}
        className="relative z-10 py-16"
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.number}
                initial={{ y: 50, opacity: 0 }}
                animate={statsInView ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="glass-morphism rounded-2xl p-6 border border-white/10">
                  <stat.icon className="w-8 h-8 text-primary-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold gradient-text mb-2">{stat.number}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        ref={featuresRef}
        id="features"
        initial={{ opacity: 0 }}
        animate={featuresInView ? { opacity: 1 } : {}}
        className="relative z-10 py-20"
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={featuresInView ? { y: 0, opacity: 1 } : {}}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-heading font-bold mb-6">
              Everything You Need to <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Powerful features designed to streamline your video production workflow and connect you with the perfect talent.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 50, opacity: 0 }}
                animate={featuresInView ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: index * 0.1 }}
                className="card-glow group"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Categories Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-heading font-bold mb-6">
              Every <span className="gradient-text">Specialization</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Find experts in every aspect of video production, from editing to motion graphics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <div className={`bg-gradient-to-br ${category.color} p-1 rounded-2xl`}>
                  <div className="bg-dark-900 rounded-2xl p-6 group-hover:bg-dark-800/50 transition-colors">
                    <category.icon className="w-8 h-8 text-white mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                    <p className="text-gray-400 text-sm">Expert editors ready to help</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Editors */}
      <section id="editors" className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-heading font-bold mb-6">
              Meet Our <span className="gradient-text">Top Editors</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Work with the best talent in the industry. Every editor is vetted for quality and professionalism.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEditors.map((editor, index) => (
              <motion.div
                key={editor.id}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="card-glow group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full mr-3" />
                    <div>
                      <h3 className="font-semibold">{editor.name}</h3>
                      <p className="text-sm text-gray-400">{editor.role}</p>
                    </div>
                  </div>
                  <span className="badge badge-primary text-xs">{editor.badge}</span>
                </div>

                <div className="flex items-center mb-3">
                  <div className="flex items-center mr-4">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{editor.rating}</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {editor.projects} projects
                  </div>
                </div>

                <div className="text-2xl font-bold text-primary-400 mb-3">
                  ${editor.hourlyRate}/hr
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {editor.skills.slice(0, 2).map((skill) => (
                    <span key={skill} className="text-xs bg-dark-800 px-2 py-1 rounded-lg">
                      {skill}
                    </span>
                  ))}
                  {editor.skills.length > 2 && (
                    <span className="text-xs bg-dark-800 px-2 py-1 rounded-lg">
                      +{editor.skills.length - 2} more
                    </span>
                  )}
                </div>

                <button className="w-full btn btn-outline group-hover:border-primary-500 group-hover:text-primary-400 transition-all">
                  View Profile
                </button>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/marketplace" className="btn btn-primary btn-lg group">
              Browse All Editors
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <motion.section
        ref={testimonialsRef}
        initial={{ opacity: 0 }}
        animate={testimonialsInView ? { opacity: 1 } : {}}
        className="relative z-10 py-20"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-heading font-bold mb-6">
              Loved by <span className="gradient-text">Creators</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See what our customers have to say about their experience with ClipConnect.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="card-glow text-center"
              >
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-xl text-gray-300 mb-8 leading-relaxed">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full mr-4" />
                  <div>
                    <div className="font-semibold">{testimonials[currentTestimonial].name}</div>
                    <div className="text-sm text-gray-400">{testimonials[currentTestimonial].role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentTestimonial
                      ? 'bg-primary-500 w-8'
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="gradient-border rounded-3xl p-12 text-center"
          >
            <h2 className="text-4xl lg:text-5xl font-heading font-bold mb-6">
              Ready to <span className="gradient-text">Get Started?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of creators and editors who are already creating amazing content together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/register" className="btn btn-primary btn-lg group">
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/marketplace" className="btn btn-outline btn-lg">
                Browse Projects
              </Link>
            </div>

            <div className="flex items-center justify-center mt-8 space-x-8 text-sm text-gray-400">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                No setup fees
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                Cancel anytime
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                24/7 support
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold font-heading">ClipConnect</span>
              </div>
              <p className="text-gray-400 text-sm">
                Connecting creators with elite video editors worldwide.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#editors" className="hover:text-white transition-colors">Browse Editors</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 ClipConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
