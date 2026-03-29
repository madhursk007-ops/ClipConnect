import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Play, 
  Zap, 
  Shield, 
  Clock,
  Star,
  Users,
  CheckCircle
} from 'lucide-react';
import { useStats } from '@hooks';

const Landing = () => {
  const { stats, loading } = useStats();

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="bg-dark-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Animated Orbs */}
        <motion.div
          className="absolute w-4 h-4 bg-primary-400 rounded-full"
          animate={{ x: [0, 100, 200, 100, 0], y: [0, -100, 0, 100, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ top: '20%', left: '10%' }}
        />
        <motion.div
          className="absolute w-3 h-3 bg-accent-400 rounded-full"
          animate={{ x: [0, -150, -100, -200, 0], y: [0, 50, 150, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          style={{ bottom: '30%', right: '15%' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full mb-8"
          >
            <Zap className="w-4 h-4 text-primary-400 mr-2" />
            <span className="text-primary-400 text-sm font-semibold">The Future of Video Editing</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Connect.{' '}
            <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              Create.
            </span>{' '}
            Conquer.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto"
          >
            Connect with top-tier video editors and clients worldwide. 
            Turn your creative vision into stunning reality.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/register?role=client"
              className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-primary-500/25 transition-all duration-300 flex items-center"
            >
              Hire an Editor
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/register?role=editor"
              className="px-8 py-4 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/5 transition-all duration-300"
            >
              Become an Editor
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {!loading && (
              <>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{stats.totalUsers?.toLocaleString() || '0'}</div>
                  <div className="text-sm text-gray-400">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{stats.editors?.toLocaleString() || '0'}</div>
                  <div className="text-sm text-gray-400">Expert Editors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{stats.totalProjects?.toLocaleString() || '0'}</div>
                  <div className="text-sm text-gray-400">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">4.9</div>
                  <div className="text-sm text-gray-400">Average Rating</div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <span className="text-primary-400 text-sm font-semibold uppercase tracking-wider">Features</span>
            <h2 className="text-4xl font-bold text-white mt-2 mb-4">Why Choose ClipConnect?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to find, hire, and collaborate with professional video editors
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: 'Expert Editors', desc: 'Access thousands of vetted video editing professionals with proven portfolios.' },
              { icon: Shield, title: 'Secure Payments', desc: 'Your payments are protected. Release funds only when satisfied with the work.' },
              { icon: Clock, title: 'Fast Delivery', desc: 'Get your projects completed on time with our efficient workflow system.' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="glass-morphism p-8 rounded-2xl border border-white/5 hover:border-primary-500/20 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-dark-800/50">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <span className="text-primary-400 text-sm font-semibold uppercase tracking-wider">Process</span>
            <h2 className="text-4xl font-bold text-white mt-2 mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Post Your Project', desc: 'Describe your video editing needs, timeline, and budget.' },
              { step: '02', title: 'Choose Your Editor', desc: 'Review proposals and select the perfect editor for your project.' },
              { step: '03', title: 'Get Results', desc: 'Collaborate, review drafts, and receive your final video.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <span className="text-primary-400 text-sm font-semibold uppercase tracking-wider">Testimonials</span>
            <h2 className="text-4xl font-bold text-white mt-2 mb-4">Loved by Creators</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Johnson', role: 'Content Creator', text: 'Found an amazing editor within 24 hours. The quality exceeded my expectations!' },
              { name: 'Mike Chen', role: 'Video Editor', text: 'ClipConnect transformed my freelance career. Consistent high-quality projects.' },
              { name: 'Emma Wilson', role: 'Marketing Director', text: 'Our team\'s go-to platform for all video editing needs. Reliable and professional.' },
            ].map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="glass-morphism p-8 rounded-2xl border border-white/5"
              >
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">{testimonial.name[0]}</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <motion.div
          {...fadeInUp}
          className="max-w-4xl mx-auto glass-morphism p-12 rounded-3xl border border-white/10 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-400/10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Join thousands of creators and editors already transforming video content on ClipConnect.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-primary-500/25 transition-all duration-300"
              >
                Create Free Account
              </Link>
              <Link
                to="/marketplace"
                className="px-8 py-4 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/5 transition-all duration-300"
              >
                Browse Editors
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-400 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">ClipConnect</span>
              </div>
              <p className="text-gray-400 text-sm">
                The premier platform connecting video editors with clients worldwide.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/marketplace" className="hover:text-white">Marketplace</Link></li>
                <li><Link to="/projects" className="hover:text-white">Projects</Link></li>
                <li><Link to="/how-it-works" className="hover:text-white">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 text-center text-gray-400 text-sm">
            © 2026 ClipConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
