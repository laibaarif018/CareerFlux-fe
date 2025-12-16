import { createFileRoute } from '@tanstack/react-router'
import Header from '@/components/Header'
import { useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/auth/signup')({
  component: SignUpPage,
})

function SignUpPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  })

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.agreedToTerms) {
      navigate({ to: '/auth/verification' })
    }
  }

  const handleGoogleSignUp = () => {
    console.log('Continue with Google clicked')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans transition-colors">
      {/* Top Header */}
      <Header />

      {/* Page Content */}
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-5">

          {/* LEFT INFO PANEL */}
          <div className="hidden lg:flex lg:col-span-2 flex-col justify-between bg-slate-50 dark:bg-slate-900/50 p-10 border-r border-slate-200 dark:border-slate-700">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                Build your career with confidence
              </h2>

              <ul className="space-y-6">
                {[
                  ['check_circle', 'ATS Optimized', 'Beat resume filters easily', 'text-green-500'],
                  ['work', 'AI Job Matching', 'Jobs tailored to your skills', 'text-blue-600 dark:text-blue-400'],
                  ['analytics', 'Resume Insights', 'Score & improve instantly', 'text-purple-500'],
                ].map(([icon, title, desc, color]) => (
                  <li key={title} className="flex gap-4">
                    <div className={`h-10 w-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm ${color}`}>
                      <span className="material-symbols-outlined">{icon}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{title}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              © ResumeAI {new Date().getFullYear()}
            </p>
          </div>

          {/* RIGHT FORM PANEL */}
          <div className="lg:col-span-3 flex items-center justify-center p-8 md:p-12">
            <div className="w-full max-w-md">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                Create your account
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                Start analyzing your resume and matching with jobs.
              </p>

              {/* SOCIAL */}
              <button 
                onClick={handleGoogleSignUp}
                type="button"
                className="mb-6 w-full h-11 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 flex items-center justify-center gap-2 font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 10.8v2.8h4.1c-.2 1-.8 1.9-1.7 2.5v2h2.7c1.6-1.5 2.5-3.7 2.5-6 0-.5 0-1-.1-1.4H12z"/>
                  <path fill="#34A853" d="M12 22c2.2 0 4-0.7 5.3-2l-2.7-2c-.7.5-1.6.8-2.6.8-2 0-3.7-1.3-4.3-3.1H4.7v2c1.3 2.5 3.9 4.3 7.3 4.3z"/>
                  <path fill="#4A90E2" d="M7.7 13.7c-.2-.5-.3-1-.3-1.7s.1-1.2.3-1.7v-2H4.7C4.1 9.4 3.7 10.6 3.7 12s.4 2.6 1 3.7l3-2z"/>
                  <path fill="#FBBC05" d="M12 7.7c1.2 0 2.3.4 3.2 1.3l2.4-2.4C16 4.9 14.2 4 12 4 8.6 4 6 5.8 4.7 8.3l3 2c.6-1.8 2.3-2.6 4.3-2.6z"/>
                </svg>
                Continue with Google
              </button>

              {/* DIVIDER */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white dark:bg-slate-800 px-2 text-slate-500 dark:text-slate-400">
                    OR CONTINUE WITH EMAIL
                  </span>
                </div>
              </div>

              {/* FORM */}
              <form className="space-y-4" onSubmit={handleCreateAccount}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full h-11 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-colors"
                  required
                />
                
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full h-11 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-colors"
                  required
                />
                
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full h-11 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-colors"
                  required
                />
                
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full h-11 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-colors"
                  required
                />

                <label className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.agreedToTerms}
                    onChange={(e) => setFormData({...formData, agreedToTerms: e.target.checked})}
                    className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-600/20"
                    required
                  />
                  <span>I agree to the Terms & Privacy Policy</span>
                </label>

                <button 
                  type="submit"
                  className="w-full h-11 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-lg shadow-blue-600/20"
                >
                  Create Account
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <Link 
                  to="/auth/login" 
                  className="text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}