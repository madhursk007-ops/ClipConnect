import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'
import App from './App.jsx'
import './styles/globals.css'
import './styles/animations.css'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-heading text-white mb-4">Something went wrong</h1>
            <p className="text-gray-400 mb-8">We're sorry for the inconvenience. Please refresh the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-primary text-white rounded-lg hover:shadow-glow transition-all duration-300"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Cursor Glow Effect
const CursorGlow = () => {
  React.useEffect(() => {
    const cursor = document.getElementById('cursor-glow')
    let mouseX = 0, mouseY = 0
    let cursorX = 0, cursorY = 0

    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const animateCursor = () => {
      const speed = 0.15
      cursorX += (mouseX - cursorX) * speed
      cursorY += (mouseY - cursorY) * speed

      if (cursor) {
        cursor.style.transform = `translate(${cursorX - 16}px, ${cursorY - 16}px)`
      }

      requestAnimationFrame(animateCursor)
    }

    document.addEventListener('mousemove', handleMouseMove)
    animateCursor()

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return null
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CursorGlow />
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1a1a1f',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                iconTheme: {
                  primary: '#4CAF50',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#f44336',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
