import { RouterProvider } from 'react-router-dom'
import router from './router'

function App() {
  return (
    <div className="min-h-screen bg-dark-900 text-white font-sans">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
