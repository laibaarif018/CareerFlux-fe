import { useNavigate, useLocation, Link } from '@tanstack/react-router'

export default function CompanySidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const menuItems = [
    { icon: 'dashboard', label: 'Dashboard', path: '/company/dashboard' },
    { icon: 'work', label: 'Jobs', path: '/company/jobs' },
    { icon: 'group', label: 'Candidates', path: '/company/candidates' },
    { icon: 'account_circle', label: 'Profile', path: '/company/profile' },
    { icon: 'settings', label: 'Settings', path: '/company/settings' },
  ]

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 overflow-y-auto z-50">
      <div className="flex flex-col h-full">
        {/* Logo/Brand */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              <span>R</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">ResumeAI</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Company Panel</p>
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
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Menu */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={() => navigate({ to: '/auth/login' })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            Log Out
          </button>
        </div>
      </div>
    </aside>
  )
}