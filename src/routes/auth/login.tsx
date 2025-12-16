import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import Header from '@/components/Header'
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/login')({
  component: EmailInput,
})

function EmailInput() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleContinue = () => {
    if (!email) {
      navigate({ to: '/auth/signup' })
    } else {
      navigate({ to: '/auth/password' })
    }
    console.log('Email entered:', email)
  }

  const handleGoogleSignIn = () => {
    console.log('Continue with Google clicked')
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 font-sans transition-colors">
      {/* Header — stays at top */}
      <Header />

      {/* Page content */}
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 shadow-lg">
          <div className="flex flex-col gap-8">
            {/* Welcome */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Welcome
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Enter your email to continue
              </p>
            </div>

            {/* Email */}
            <div className="space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email address
                </span>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-colors"
                />
              </label>

              <button
                onClick={handleContinue}
                className="h-12 w-full rounded-lg bg-blue-600 text-sm font-bold text-white hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-lg shadow-blue-600/20"
              >
                Continue
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">OR</span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            </div>

            {/* Google */}
            <button
              onClick={handleGoogleSignIn}
              className="h-12 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 active:bg-slate-100 dark:active:bg-slate-600 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.5777 12.2714C22.5777 11.4727 22.5152 10.6864 22.3838 9.92727H12.0002V14.3323H18.0672C17.7842 15.8959 16.9242 17.2795 15.5892 18.2323V20.8414H19.2482C21.3117 19.0064 22.5777 15.9327 22.5777 12.2714Z"
                />
                <path
                  fill="#34A853"
                  d="M12.0002 23.0001C15.2202 23.0001 17.9352 21.9376 19.2482 20.8414L15.5892 18.2323C14.5092 18.9668 13.1367 19.3973 12.0002 19.3973C9.37318 19.3973 7.15118 17.6536 6.33118 15.2759H2.55118V17.9755C4.10318 21.0318 7.75518 23.0001 12.0002 23.0001Z"
                />
                <path
                  fill="#FBBC05"
                  d="M6.33104 15.2758C6.08454 14.5412 5.94204 13.7549 5.94204 12.9498C5.94204 12.1448 6.08454 11.3585 6.33104 10.6239V7.92432H2.55104C1.92104 9.15765 1.57104 10.5126 1.57104 11.9498C1.57104 13.387 1.92104 14.7419 2.55104 15.9753L6.33104 15.2758Z"
                />
                <path
                  fill="#EA4335"
                  d="M12.0002 6.50227C13.8052 6.50227 15.3532 7.14227 15.9892 7.74227L19.3242 4.40727C17.9272 3.10227 15.2202 1.89955 12.0002 1.89955C7.75518 1.89955 4.10318 3.86782 2.55118 6.92409L6.33118 8.62364C7.15118 6.24591 9.37318 4.50227 12.0002 4.50227Z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Sign up link
            <div className="text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate({ to: '/auth/signup' })}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  Sign up
                </button>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}