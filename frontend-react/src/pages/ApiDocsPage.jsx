import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Code, 
  Terminal, 
  Key, 
  BookOpen,
  Server,
  Database,
  Shield,
  ArrowRight,
  Copy,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Mail
} from 'lucide-react'

const ApiDocsPage = () => {
  const [copiedEndpoint, setCopiedEndpoint] = useState(null)
  const [selectedEndpoint, setSelectedEndpoint] = useState('auth')

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedEndpoint(id)
    setTimeout(() => setCopiedEndpoint(null), 2000)
  }

  const categories = [
    { id: 'auth', name: 'Authentication', icon: Shield },
    { id: 'users', name: 'Users', icon: Database },
    { id: 'projects', name: 'Projects', icon: Code },
    { id: 'payments', name: 'Payments', icon: Server }
  ]

  const endpoints = {
    auth: [
      {
        method: 'POST',
        path: '/api/auth/register',
        description: 'Register a new user account',
        request: `{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "editor"
}`,
        response: `{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "12345",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "editor"
  }
}`
      },
      {
        method: 'POST',
        path: '/api/auth/login',
        description: 'Authenticate user and get access token',
        request: `{
  "email": "john@example.com",
  "password": "securepassword"
}`,
        response: `{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "12345",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "editor"
  }
}`
      },
      {
        method: 'GET',
        path: '/api/auth/me',
        description: 'Get current user profile',
        request: 'Headers: Authorization: Bearer <token>',
        response: `{
  "id": "12345",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "editor",
  "profile": {
    "bio": "Professional video editor",
    "skills": ["Premiere Pro", "After Effects"],
    "portfolio": [...]
  }
}`
      }
    ],
    users: [
      {
        method: 'GET',
        path: '/api/users',
        description: 'Get all users (paginated)',
        request: 'Query: ?page=1&limit=10&role=editor',
        response: `{
  "users": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}`
      },
      {
        method: 'GET',
        path: '/api/users/:id',
        description: 'Get user by ID',
        request: 'Params: id (user ID)',
        response: `{
  "id": "12345",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "editor",
  "profile": {...}
}`
      },
      {
        method: 'PUT',
        path: '/api/users/profile',
        description: 'Update user profile',
        request: `{
  "bio": "Updated bio",
  "skills": ["Premiere Pro", "DaVinci Resolve"],
  "portfolio": [...]
}`,
        response: `{
  "success": true,
  "message": "Profile updated successfully",
  "user": {...}
}`
      }
    ],
    projects: [
      {
        method: 'GET',
        path: '/api/projects',
        description: 'Get all projects',
        request: 'Query: ?status=open&category=video-editing',
        response: `{
  "projects": [...],
  "pagination": {...}
}`
      },
      {
        method: 'POST',
        path: '/api/projects',
        description: 'Create new project',
        request: `{
  "title": "Product Demo Video",
  "description": "Need 2-minute product demo",
  "budget": 500,
  "deadline": "2026-04-30",
  "category": "video-editing",
  "skills": ["Motion Graphics", "Color Grading"]
}`,
        response: `{
  "success": true,
  "project": {
    "id": "proj_123",
    "title": "Product Demo Video",
    "status": "open",
    ...
  }
}`
      },
      {
        method: 'POST',
        path: '/api/projects/:id/apply',
        description: 'Apply to project',
        request: `{
  "message": "I'm interested in this project...",
  "portfolioItems": ["item1", "item2"]
}`,
        response: `{
  "success": true,
  "message": "Application submitted successfully"
}`
      }
    ],
    payments: [
      {
        method: 'GET',
        path: '/api/payments/wallet',
        description: 'Get wallet balance',
        request: 'Headers: Authorization: Bearer <token>',
        response: `{
  "balance": 1500.00,
  "currency": "USD",
  "pending": 300.00
}`
      },
      {
        method: 'POST',
        path: '/api/payments/withdraw',
        description: 'Request withdrawal',
        request: `{
  "amount": 500.00,
  "method": "bank_transfer",
  "accountDetails": {...}
}`,
        response: `{
  "success": true,
  "message": "Withdrawal request submitted",
  "transactionId": "txn_12345"
}`
      }
    ]
  }

  const gettingStarted = [
    {
      step: 1,
      title: 'Get API Key',
      description: 'Sign up for a ClipConnect account and generate your API key from the dashboard settings.',
      icon: Key
    },
    {
      step: 2,
      title: 'Authentication',
      description: 'Include your API key in the Authorization header: Bearer YOUR_API_KEY',
      icon: Shield
    },
    {
      step: 3,
      title: 'Make Requests',
      description: 'Start making API calls to build your integration. All endpoints return JSON.',
      icon: Terminal
    },
    {
      step: 4,
      title: 'Handle Responses',
      description: 'Process API responses and handle errors gracefully in your application.',
      icon: Server
    }
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
              <Code className="w-5 h-5 text-primary-400 mr-2" />
              <span className="text-primary-400 font-medium">REST API v1.0</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              API <span className="text-primary-400">Documentation</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Build powerful integrations with the ClipConnect platform. Our REST API provides programmatic access to users, projects, payments, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#getting-started"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-400 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <a
                href="#endpoints"
                className="inline-flex items-center px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                View Endpoints
                <ExternalLink className="w-5 h-5 ml-2" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Getting Started */}
      <section id="getting-started" className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-800/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Getting Started</h2>
            <p className="text-gray-300 text-xl">Four simple steps to start building</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {gettingStarted.map((step, index) => (
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
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">{step.step}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Base URL */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass-morphism rounded-2xl p-8 border border-white/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Base URL</h2>
            <div className="flex items-center justify-between bg-dark-800/50 rounded-xl p-4">
              <code className="text-primary-400 text-lg">https://api.clipconnect.com/v1</code>
              <button
                onClick={() => copyToClipboard('https://api.clipconnect.com/v1', 'base-url')}
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                {copiedEndpoint === 'base-url' ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2 text-success" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 mr-2" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Authentication */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass-morphism rounded-2xl p-8 border border-white/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-400 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Authentication</h2>
            </div>
            <p className="text-gray-300 mb-6">
              All API requests require authentication. Include your API key in the Authorization header:
            </p>
            <div className="bg-dark-800/50 rounded-xl p-4 mb-6">
              <code className="text-sm text-gray-300">
                Authorization: Bearer YOUR_API_KEY
              </code>
            </div>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-1">Security Notice</h4>
                  <p className="text-gray-300 text-sm">
                    Never expose your API key in client-side code. Use environment variables and server-side requests.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* API Endpoints */}
      <section id="endpoints" className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-800/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">API Endpoints</h2>
            <p className="text-gray-300 text-xl">Explore available endpoints by category</p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass-morphism rounded-2xl p-4 border border-white/10 sticky top-24">
                <h3 className="font-bold text-white mb-4 px-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedEndpoint(category.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-left ${
                        selectedEndpoint === category.id
                          ? 'bg-gradient-to-r from-primary-500 to-accent-400 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <category.icon className="w-5 h-5" />
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Endpoints */}
            <div className="lg:col-span-3">
              <div className="space-y-6">
                {endpoints[selectedEndpoint]?.map((endpoint, index) => (
                  <motion.div
                    key={index}
                    className="glass-morphism rounded-2xl p-6 border border-white/10"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                          endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                          endpoint.method === 'POST' ? 'bg-green-500/20 text-green-400' :
                          endpoint.method === 'PUT' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {endpoint.method}
                        </span>
                        <code className="text-primary-400">{endpoint.path}</code>
                      </div>
                      <button
                        onClick={() => copyToClipboard(`${endpoint.method} ${endpoint.path}`, `${selectedEndpoint}-${index}`)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {copiedEndpoint === `${selectedEndpoint}-${index}` ? (
                          <CheckCircle className="w-5 h-5 text-success" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    
                    <p className="text-gray-300 mb-4">{endpoint.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-2">Request</h4>
                        <pre className="bg-dark-800/50 rounded-lg p-4 overflow-x-auto">
                          <code className="text-sm text-gray-300">{endpoint.request}</code>
                        </pre>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-2">Response</h4>
                        <pre className="bg-dark-800/50 rounded-lg p-4 overflow-x-auto">
                          <code className="text-sm text-gray-300">{endpoint.response}</code>
                        </pre>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rate Limits */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass-morphism rounded-2xl p-8 border border-white/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Rate Limits</h2>
            <p className="text-gray-300 mb-6">
              To ensure service stability, API requests are rate limited based on your plan:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-dark-800/50 rounded-xl">
                <h3 className="font-semibold text-white mb-2">Free</h3>
                <p className="text-gray-300">100 requests/hour</p>
              </div>
              <div className="p-4 bg-dark-800/50 rounded-xl">
                <h3 className="font-semibold text-white mb-2">Pro</h3>
                <p className="text-gray-300">1,000 requests/hour</p>
              </div>
              <div className="p-4 bg-dark-800/50 rounded-xl">
                <h3 className="font-semibold text-white mb-2">Premium</h3>
                <p className="text-gray-300">10,000 requests/hour</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Support */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="glass-morphism-strong rounded-3xl p-12 border border-primary-500/30 bg-gradient-to-r from-primary-500/10 to-accent-400/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Need Help?
            </h2>
            <p className="text-gray-300 mb-8">
              Our developer support team is here to help you integrate with the ClipConnect API.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:developers@clipconnect.com"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-400 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all"
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact Developer Support
              </a>
              <Link
                to="/help"
                className="px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                View Documentation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default ApiDocsPage
