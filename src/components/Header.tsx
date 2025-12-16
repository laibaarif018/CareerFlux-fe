import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="px-4 md:px-10 py-3 flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
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
            <a 
              href="#features" 
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition-colors"
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition-colors"
            >
              How it Works
            </a>
          </nav>
        </div>
        
        {/* Auth Button */}
        <div className="flex items-center gap-3">
          <Link 
            to="/auth/login"
            className="hidden sm:inline-flex h-9 px-4 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  )
}