import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import Header from '@/components/Header'
import { useForgotPassword } from '@/hooks/useAuth'
import { PublicRoute } from '@/components/PRoutes'
import { z } from 'zod'

export const Route = createFileRoute('/auth/forgot-password')({
  component: () => (
    <PublicRoute>
      <ForgotPassword />
    </PublicRoute>
  ),
})

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [touched, setTouched] = useState(false)
  const forgotPassword = useForgotPassword()

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)

    // Clear errors when user types
    if (error) {
      setError('')
    }
    if (forgotPassword.isError) {
      forgotPassword.reset()
    }
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)

    // Check if email is empty
    if (!email.trim()) {
      setError('Email address is required')
      return
    }

    // Validate email format
    const result = emailSchema.safeParse({ email })

    if (!result.success) {
      setError('Please enter a valid email address')
      return
    }

    setError('')

    forgotPassword.mutate(
      { email },
      {
        onSuccess: () => {
          localStorage.setItem('email', email)
          navigate({ to: '/auth/reset-password', search: { email, token: '' } })
        },
      },
    )
  }

  const hasError = Boolean(error || forgotPassword.isError)

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
      <Header />

      {/* Main Content */}
      <div className="flex h-full grow flex-col justify-center items-center p-4 py-12">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#3EC3BC]/20 dark:bg-[#0E7C8C]/30 flex items-center justify-center text-[#0E7C8C] dark:text-[#3EC3BC]">
              <span className="material-symbols-outlined text-4xl">
                lock_reset
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-3xl font-extrabold text-center mb-3 text-slate-900 dark:text-white" style={{ letterSpacing: '-0.01em' }}>
            Forgot Password?
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm text-center mb-8 leading-relaxed font-normal">
            Enter your email address and we'll send you a verification code to
            reset your password.
          </p>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSendCode} noValidate>
            <div>
              <label
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                htmlFor="email-address"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                  mail
                </span>
                <input
                  id="email-address"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => setTouched(true)}
                  className={`w-full h-12 pl-12 pr-4 text-sm rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none transition-colors font-normal ${
                    hasError
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-[#0E7C8C]/20 focus:border-[#0E7C8C]'
                  }`}
                />
              </div>
            </div>

            {/* Error Message */}
            {touched && (error || forgotPassword.isError) && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-base mt-0.5">
                  error
                </span>
                <p className="text-sm text-red-600 dark:text-red-400 font-normal">
                  {error ||
                    (forgotPassword.error as any)?.response?.data?.message ||
                    'Failed to send verification code. Please try again.'}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={forgotPassword.isPending}
              className="flex w-full items-center justify-center gap-2 h-12 px-5 bg-[#0E7C8C] hover:bg-[#3EC3BC] active:bg-[#0E7C8C]/90 text-white font-semibold rounded-lg shadow-lg shadow-[#0E7C8C]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {forgotPassword.isPending ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">
                    progress_activity
                  </span>
                  Sending...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">
                    send
                  </span>
                  Send Verification Code
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center border-t border-slate-200 dark:border-slate-700 pt-6">
            <p className="text-sm text-slate-600 dark:text-slate-400 font-normal">
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => navigate({ to: '/auth/login' })}
                className="text-[#0E7C8C] dark:text-[#3EC3BC] font-semibold hover:text-[#3EC3BC] dark:hover:text-[#0E7C8C] hover:underline transition-colors"
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Security Footer */}
      <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-xs pb-4 font-normal">
        <span className="material-symbols-outlined text-sm">verified_user</span>
        <span>Secure 256-bit SSL Encrypted</span>
      </div>
    </div>
  )
}



