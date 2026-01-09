import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import Header from '@/components/Header'
import { authService } from '@/services/auth.service'
import { useMutation } from '@tanstack/react-query'
import { PublicRoute } from '@/components/PRoutes'

export const Route = createFileRoute('/auth/password')({
  component: () => (
    <PublicRoute>
      <PasswordInput />
    </PublicRoute>
  ),
})

function PasswordInput() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const email = localStorage.getItem('email') || ''

  const login = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      // Temporarily disable the unauthorized redirect for this specific request
      return authService.login({ email, password })
    },
    onSuccess: (data) => {
      setError(null) // Clear any previous error
      localStorage.removeItem('email')
      const role=data.payload;
      if(role==='jobseeker'){
      navigate({ to: '/dashboard' })}
      else
        navigate({ to: '/company/dashboard' })
        
    },
    onError: (error: any) => {
      // Check if this is a 401 error (incorrect password)
      if (error?.statusCode === 401) {
        setError(error.message || 'Invalid password. Please try again.')
      } else {
        setError(error?.message || 'An error occurred. Please try again.')
      }
    }
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null) // Clear any previous error
    login.mutate({ email, password })
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 font-sans transition-colors">
      <Header />

      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 shadow-lg">
          <div className="flex flex-col gap-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Welcome back
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {email}
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#0E7C8C] focus:ring-2 focus:ring-[#3EC3BC]/30 transition-colors"
                />
              </label>

              {login.isError && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                  <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-base mt-0.5">
                    error
                  </span>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {(login.error as any)?.message ||
                      'Invalid password. Please try again.'}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={login.isPending}
                className="h-12 w-full rounded-lg bg-[#0E7C8C] text-sm font-bold text-white
                           hover:bg-[#3EC3BC] active:bg-[#0B666D] transition-colors shadow-lg shadow-[#0E7C8C]/20
                           disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {login.isPending ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-lg">
                      progress_activity
                    </span>
                    Logging in...
                  </>
                ) : (
                  'Continue'
                )}
              </button>
            </form>

            <div className="text-center">
              <a
                href="/auth/forgot-password"
                className="text-sm text-[#0E7C8C] hover:text-[#3EC3BC] dark:text-[#3EC3BC] dark:hover:text-[#0E7C8C] transition-colors"
              >
                Forgot password?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
