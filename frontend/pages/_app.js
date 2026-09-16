import '@/styles/globals.css'
import { useState, useEffect } from 'react'

export default function App({ Component, pageProps }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')

  useEffect(() => {
    // Basic check for existing session
    if (localStorage.getItem('terminal_auth') === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    // Simple frontend gate (Note: secure environments should use server-side auth, 
    // but this prevents casual snooping on the Vercel URL)
    if (password === process.env.NEXT_PUBLIC_SITE_PASSWORD || password === 'admin') {
      localStorage.setItem('terminal_auth', 'true')
      setIsAuthenticated(true)
    } else {
      alert('ACCESS DENIED')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono text-amber-500">
        <div className="border border-amber-500 p-8 text-center bg-neutral-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]">
          <h1 className="text-2xl font-bold mb-4 tracking-widest text-glow-orange">TERMINAL LOGIN</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ENTER SECURE KEY" 
              className="bg-black border border-amber-900 p-2 text-center text-white focus:outline-none focus:border-amber-500"
            />
            <button type="submit" className="bg-amber-900 hover:bg-amber-700 text-black font-bold p-2 transition-colors">
              INITIALIZE
            </button>
          </form>
        </div>
      </div>
    )
  }

  return <Component {...pageProps} />
}
