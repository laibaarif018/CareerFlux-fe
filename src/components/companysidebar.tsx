import { useNavigate, useLocation, Link } from '@tanstack/react-router'
import { useLogout } from '@/queries/auth.queries'
import { useCompanyProfile } from '@/queries/company.queries'
import storageService from '@/utils/localstorage'


export default function CompanySidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const logout = useLogout()
  const { data } = useCompanyProfile()
  
  const company = data?.payload

  const isActive = (path: string) => location.pathname === path

  const menuItems = [
    { icon: 'dashboard', label: 'Dashboard', path: '/company/dashboard' },
    { icon: 'work', label: 'Jobs', path: '/company/jobs' },
    { icon: 'group', label: 'Candidates', path: '/company/candidates' },
    { icon: 'account_circle', label: 'Profile', path: '/company/profile' },
    { icon: 'settings', label: 'Settings', path: '/company/settings' },
  ]
  
  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        console.log('Logged out successfully')
       storageService.removeItem('carrerFlux_userRole');
        navigate({ to: '/auth/login' })
      },
      onError: (error) => {
        console.error('Logout failed', error)
      },
    })
  }

  // Get company initials for logo fallback
  const getInitials = (name?: string) => {
    if (!name) return 'C'
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto z-50">
      <div className="flex flex-col h-full">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-lg overflow-hidden">
              {company?.logoUrl ? (
                <img 
                  src={company.logoUrl} 
                  alt={`${company.companyName || 'Company'} logo`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to initials if image fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = getInitials(company?.companyName);
                  }}
                />
              ) : (
                <span>{getInitials(company?.companyName)}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 dark:text-white truncate">
                {company?.companyName || 'Loading...'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {company?.industry || 'Company Panel'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-gray-200 dark:border-gray-700">
          {/* Logout Button */}
          <div className="p-4">
            <button
              onClick={handleLogout}
              disabled={logout.isPending}
              className="flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
    </aside>
  )
}