import { useLogout } from '@/hooks/useAuth'
import { useGetProfile } from '@/hooks/useUser'
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'

export default function UserHeader() {
  const logout = useLogout()
  const navigate = useNavigate()
  const { data } = useGetProfile()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  
  // Get current route
  const router = useRouterState()
  const currentPath = router.location.pathname

  // Get user info from profile
  const user = data?.payload?.user
  const userName = user?.name || 'User'
  const userEmail = user?.email || ''

  // Get initials from name
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  const initials = getInitials(userName)

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
    logout.mutate(undefined, {
      onSuccess: () => {
        console.log('Logged out successfully')
        navigate({ to: '/auth/login' })
      },
      onError: (error) => {
        console.error('Logout failed', error)
      },
    })
  }

  // Check if a route is active
  const isActive = (path: string) => currentPath === path

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
      <div className="px-4 md:px-10 py-3 flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          to="/dashboard"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center justify-center text-[#0E7C8C] dark:text-[#3EC3BC] w-8 h-8">
            <span className="material-symbols-outlined text-3xl">
              smart_toy
            </span>
          </div>
          <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight" style={{ letterSpacing: '-0.02em' }}>
            CareerFlux
          </h2>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex gap-6">
            <Link
              to="/dashboard"
              className={`font-medium text-sm transition-colors relative ${
                isActive('/dashboard')
                  ? 'text-[#0E7C8C] dark:text-[#3EC3BC]'
                  : 'text-slate-600 dark:text-slate-300 hover:text-[#0E7C8C] dark:hover:text-[#3EC3BC]'
              }`}
            >
              Dashboard
              {isActive('/dashboard') && (
                <span className="absolute -bottom-[13px] left-0 right-0 h-0.5 bg-[#0E7C8C] dark:bg-[#3EC3BC]" />
              )}
            </Link>
            <Link
              to="/jobs"
              className={`font-medium text-sm transition-colors relative ${
                isActive('/jobs')
                  ? 'text-[#0E7C8C] dark:text-[#3EC3BC]'
                  : 'text-slate-600 dark:text-slate-300 hover:text-[#0E7C8C] dark:hover:text-[#3EC3BC]'
              }`}
            >
              Jobs
              {isActive('/jobs') && (
                <span className="absolute -bottom-[13px] left-0 right-0 h-0.5 bg-[#0E7C8C] dark:bg-[#3EC3BC]" />
              )}
            </Link>
            <Link
              to="/myResumes"
              className={`font-medium text-sm transition-colors relative ${
                isActive('/myResumes')
                  ? 'text-[#0E7C8C] dark:text-[#3EC3BC]'
                  : 'text-slate-600 dark:text-slate-300 hover:text-[#0E7C8C] dark:hover:text-[#3EC3BC]'
              }`}
            >
              My Resumes
              {isActive('/myResumes') && (
                <span className="absolute -bottom-[13px] left-0 right-0 h-0.5 bg-[#0E7C8C] dark:bg-[#3EC3BC]" />
              )}
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
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0E7C8C] to-[#3EC3BC] flex items-center justify-center text-white font-bold text-sm hover:opacity-90 transition-opacity"
              aria-label="User menu"
            >
              {initials}
            </button>

            <div
              className={`absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 transition-all duration-200 ${
                menuOpen
                  ? 'opacity-100 scale-100 pointer-events-auto'
                  : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {userName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {userEmail}
                </p>
              </div>

              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">
                  person
                </span>
                My Profile
              </Link>

              <div className="border-t border-slate-200 dark:border-slate-700 mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  disabled={logout.isPending}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {logout.isPending ? (
                    <>
                      <span className="material-symbols-outlined text-lg animate-spin">
                        progress_activity
                      </span>
                      Logging out...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">
                        logout
                      </span>
                      Logout
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}