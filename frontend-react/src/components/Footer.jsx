import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Video, Github, Twitter, Linkedin, Mail } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    platform: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Marketplace', href: '/marketplace' },
      { name: 'API', href: '#' }
    ],
    company: [
      { name: 'About', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Contact', href: '#' }
    ],
    resources: [
      { name: 'Documentation', href: '#' },
      { name: 'Tutorials', href: '#' },
      { name: 'Community', href: '#' },
      { name: 'Support', href: '#' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'GDPR', href: '#' }
    ]
  }

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'GitHub', icon: Github, href: '#' },
    { name: 'Email', icon: Mail, href: 'mailto:support@clipconnect.com' }
  ]

  return (
    <footer className="bg-dark-800 border-t border-white/10">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            {/* Brand Column */}
            <div className="col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl flex items-center justify-center">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold font-heading">ClipConnect</span>
              </Link>
              <p className="text-gray-400 mb-6 max-w-sm">
                Connecting visionary creators with elite video editors. Transform your content with professional editing services.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                {footerLinks.platform.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h4 className="font-semibold mb-2">Stay updated</h4>
              <p className="text-gray-400 text-sm">
                Get the latest news and updates from ClipConnect
              </p>
            </div>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="input w-64"
              />
              <button className="btn btn-primary">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} ClipConnect. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" />
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
