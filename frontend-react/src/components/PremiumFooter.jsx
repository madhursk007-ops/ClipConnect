import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Film, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight,
  Twitter, 
  Linkedin, 
  Instagram, 
  Github,
  ArrowRight,
  Star,
  Zap,
  Shield
} from 'lucide-react'
import { Link } from 'react-router-dom'

const PremiumFooter = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setTimeout(() => setIsSubscribed(false), 3000)
      setEmail('')
    }
  }

  const footerLinks = {
    product: [
      { name: 'Browse Editors', href: '/marketplace?tab=editors', icon: Film },
      { name: 'Post Project', href: '/marketplace?tab=projects', icon: Zap },
      { name: 'Pricing Plans', href: '/pricing', icon: Star },
      { name: 'How It Works', href: '/how-it-works', icon: Shield }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Blog', href: '/blog' },
      { name: 'Press Kit', href: '/press' }
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Safety Center', href: '/safety' },
      { name: 'API Docs', href: '/docs' }
    ],
    legal: [
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'GDPR Compliance', href: '/gdpr' }
    ]
  }

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/clipconnect', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/clipconnect', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://instagram.com/clipconnect', label: 'Instagram' },
    { icon: Github, href: 'https://github.com/clipconnect', label: 'GitHub' }
  ]

  const FooterLink = ({ href, children, icon: Icon, external = false }) => (
    <Link
      to={href}
      className={`flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition-colors group ${
        external ? 'inline-flex' : 'block'
      }`}
      {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{children}</span>
      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all translate-x-1" />
    </Link>
  )

  return (
    <footer className="bg-dark-900 border-t border-white/10">
      {/* Newsletter Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="glass-morphism-strong rounded-3xl p-8 lg:p-12 border border-primary-500/20 bg-gradient-to-r from-primary-500/5 to-accent-400/5 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Stay Connected
            </h3>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Get the latest updates on new features, editor spotlights, and exclusive tips for video production.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 bg-dark-800/50 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-500/50 transition-colors"
                required
              />
              <motion.button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-400 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubscribed ? 'Subscribed!' : 'Subscribe'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl flex items-center justify-center mr-3">
                  <Film className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">ClipConnect</span>
              </div>
              
              <p className="text-gray-300 mb-6 max-w-sm">
                The premium marketplace connecting top video editors with brands that need exceptional content. 
                AI-powered matching, secure payments, and world-class talent.
              </p>

              {/* Social Links */}
              <div className="flex items-center space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-dark-800/50 border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary-400 hover:border-primary-500/50 transition-all"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-white font-semibold mb-6">Product</h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <FooterLink href={link.href} icon={link.icon}>
                      {link.name}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <FooterLink href={link.href}>
                      {link.name}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support & Legal Links */}
            <div>
              <h4 className="text-white font-semibold mb-6">Support</h4>
              <ul className="space-y-3 mb-6">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <FooterLink href={link.href}>
                      {link.name}
                    </FooterLink>
                  </li>
                ))}
              </ul>
              
              <h4 className="text-white font-semibold mb-6">Legal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <FooterLink href={link.href}>
                      {link.name}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} ClipConnect. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>Made with ❤️ for video creators</span>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default PremiumFooter
