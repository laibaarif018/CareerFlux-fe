import { Link, useNavigate } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'

export default function UserHeader() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [hovering, setHovering] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...')
    navigate({ to: '/auth/login' })
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="px-4 md:px-10 py-3 flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="flex items-center justify-center text-blue-600 dark:text-blue-400 w-8 h-8">
            <span className="material-symbols-outlined text-3xl">smart_toy</span>
          </div>
          <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">
            ResumeAI
          </h2>
        </Link>
        
        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex gap-6">
            <Link 
              to="/dashboard"
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              to="/jobs"
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition-colors"
            >
              Jobs
            </Link>
            <Link 
              to="/myResumes"
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition-colors"
            >
              My Resumes
            </Link>
          </nav>
        </div>
        
        {/* Right Side - Profile & Settings */}
        <div className="flex items-center gap-3">
          {/* Settings Icon */}
          <Link
            to="/accountSetting"
            className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Account Settings"
          >
            <span className="material-symbols-outlined text-xl">settings</span>
          </Link>

          {/* Profile Dropdown */}
          <div
            ref={menuRef}
            className="relative"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm hover:opacity-90 transition-opacity"
            >
              A
            </button>

            <div
              className={`absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 transition-all duration-200 ${
                menuOpen || hovering
                  ? 'opacity-100 scale-100 pointer-events-auto'
                  : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Alex Johnson</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">alex@example.com</p>
              </div>
              
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">person</span>
                My Profile
              </Link>

              <div className="border-t border-slate-200 dark:border-slate-700 mt-1 pt-1">
                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}