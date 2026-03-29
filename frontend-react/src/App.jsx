import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useAuthStore } from '@store'
import router from './router'

function App() {
  const { setLoading } = useAuthStore()

  useEffect(() => {
    const initAuth = async () => {
      setLoading(false)
    }

    initAuth()
  }, [setLoading])

  return (
    <div className="min-h-screen bg-dark-900 text-white font-sans">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
