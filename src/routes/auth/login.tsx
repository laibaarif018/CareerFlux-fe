import { createFileRoute,  useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import Header from '@/components/Header'
import { useCheckEmail } from '@/queries/auth.queries'
import { z } from 'zod'
import storageService from '@/utils/localstorage'

export const Route = createFileRoute('/auth/login')({
  component: EmailInput
})

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

function EmailInput() {
  const navigate = useNavigate()
  const checkEmail = useCheckEmail()

  const [email, setEmail] = useState('')
  const [validationError, setValidationError] = useState('')
  const [touched, setTouched] = useState(false)

  const hasError = Boolean(validationError || checkEmail.isError)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)

    if (validationError) {
      setValidationError('')
    }
    if (checkEmail.isError) {
      checkEmail.reset()
    }
  }

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)

    if (!email.trim()) {
      setValidationError('Email address is required')
      return
    }

    const result = emailSchema.safeParse({ email })

    if (!result.success) {
      setValidationError('Please enter a valid email address')
      return
    }

    setValidationError('')

    checkEmail.mutate(email, {
      onSuccess: (data) => {
        console.log('Check email response:', data)

        localStorage.setItem('email', email)

        const exists = data.payload?.exists
        const hasPassword = data.payload?.hasPassword
        const userId = data.payload?.userId
        const role=data.payload?.role
        storageService.setItem('userRole',role)

        if (exists && hasPassword === false) {
          // Email exists but password not set (Google signup case)
          localStorage.setItem('userId', userId as any)
          navigate({ to: '/auth/set-password' })
        } else if (exists && hasPassword === true) {
          // Normal login flow
          navigate({ to: '/auth/password' })
        } else {
          // New user
          navigate({ to: '/auth/signup' })
        }
      },
      onError: (error) => {
        console.error('Check email error:', error)
      },
    })
  }
  const handleGoogleSignIn = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`
  }
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 font-sans transition-colors">
      <Header />

      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 shadow-lg">
          <div className="flex flex-col gap-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Welcome
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Enter your email to continue
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleContinue} noValidate>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email address
                </span>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => setTouched(true)}
                  className={`h-12 w-full rounded-lg border bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none transition-colors
                    ${
                      hasError
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-slate-300 dark:border-slate-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20'
                    }
                  `}
                />
              </label>

              {(validationError || checkEmail.isError) && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                  <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-base mt-0.5">
                    error
                  </span>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {validationError ||
                      (checkEmail.error as any)?.message ||
                      'Something went wrong. Please try again.'}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={checkEmail.isPending}
                className="h-12 w-full rounded-lg bg-[#0E7C8C] text-sm font-bold text-white 
             hover:bg-[#3EC3BC] active:bg-[#0B666D] transition-colors shadow-lg shadow-blue-600/20 
             disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {checkEmail.isPending ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-lg">
                      progress_activity
                    </span>
                    Checking...
                  </>
                ) : (
                  'Continue'
                )}
              </button>
            </form>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                OR
              </span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="h-12 w-full rounded-lg border border-[#dadce0] bg-white
             text-sm font-medium text bg-[#0E7C8C]
             hover:bg-[#f8f9fa]
             active:bg-[#f1f3f4]
             transition-colors
             flex items-center justify-center gap-3
             shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
