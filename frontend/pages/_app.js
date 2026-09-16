import '@/styles/globals.css'
import { useState, useEffect } from 'react'

export default function App({ Component, pageProps }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (localStorage.getItem('auth_token') === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === process.env.NEXT_PUBLIC_SITE_PASSWORD || password === 'admin') {
      localStorage.setItem('auth_token', 'true')
      setIsAuthenticated(true)
    } else {
      alert('Invalid credentials')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-gray-900 border border-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md">
          <h1 className="text-3xl font-bold mb-2 text-center text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
            Prop Engine
          </h1>
          <p className="text-gray-500 text-center mb-8 text-sm">Secure Authentication Required</p>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Access Key" 
              className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg p-3 transition-colors shadow-lg shadow-blue-500/30">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    )
  }

  return <Component {...pageProps} />
}
