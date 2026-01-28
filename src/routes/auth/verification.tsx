import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useRef, useEffect } from 'react'
import Header from '@/components/Header'
import { useVerify, useResendVerificationCode } from '@/queries/auth.queries'
import { showToast } from '@/utils/swal'


export const Route = createFileRoute('/auth/verification')({
  validateSearch: (search: Record<string, unknown>) => ({
    email: (search.email as string) || '',
  }),

  component:VerificationPage
})

function VerificationPage() {
  const navigate = useNavigate()
  const { email: searchEmail } = Route.useSearch()
  const verify = useVerify()
  const resendCode = useResendVerificationCode()

  const [code, setCode] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Rate limiting state
  const [canResend, setCanResend] = useState(true)
  const [countdown, setCountdown] = useState(0)

  // Get email from search params or localStorage
  const email = searchEmail || localStorage.getItem('email') || ''

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus()
  }, [])

  // Countdown effect for resend button
  useEffect(() => {
  let timer: NodeJS.Timeout;
  if (countdown > 0) {
    timer = setTimeout(() => setCountdown(countdown - 1), 1000);
  } else {
    setCanResend(true);
  }
  return () => clearTimeout(timer);
}, [countdown]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    const digits = pastedData.split('').filter((char) => /^\d$/.test(char))

    if (digits.length > 0) {
      const newCode = [...code]
      digits.forEach((digit, i) => {
        if (i < 6) newCode[i] = digit
      })
      setCode(newCode)

      // Focus the next empty input or last input
      const nextIndex = Math.min(digits.length, 5)
      inputRefs.current[nextIndex]?.focus()
    }
  }

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()

    const verificationCode = code.join('')
    if (verificationCode.length !== 6) {
      return
    }

    verify.mutate(
      { email, code: verificationCode },
      {
        onSuccess: () => {
          localStorage.removeItem('email')
          navigate({ to: '/roles' })
        },
      },
    )
  }

  const handleResendCode = () => {
  if (!canResend) return;

  resendCode.mutate(
    { email, purpose: 'verification' },
    {
      onSuccess: () => {
        setCanResend(false);
        setCountdown(60); // 60 seconds cooldown
        showToast('Verification code resent successfully');
      },
      onError: (error: any) => {
        console.error('Failed to resend verification code:', error);
        showToast(error.response?.data?.message || 'Failed to resend verification code');
      },
    }
  )
  }

  const isCodeComplete = code.every((digit) => digit !== '')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
      <Header />

      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#3EC3BC]/20 dark:bg-[#3EC3BC]/10 mb-4">
                <span className="material-symbols-outlined text-[#0E7C8C] dark:text-[#3EC3BC] text-3xl">
                  mail
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2" style={{ letterSpacing: '-0.01em' }}>
                Check your email
              </h1>
              <p className="text-slate-600 dark:text-slate-400 font-normal">
                We sent a verification code to
              </p>
              <p className="text-slate-900 dark:text-white font-semibold mt-1">
                {email}
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 text-center">
                  Enter verification code
                </label>
                <div className="flex gap-2 justify-center">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-12 h-14 text-center text-2xl font-bold rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#0E7C8C] focus:ring-2 focus:ring-[#0E7C8C]/20 transition-colors"
                    />
                  ))}
                </div>
              </div>

              {verify.isError && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                  <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-base mt-0.5">
                    error
                  </span>
                  <p className="text-sm text-red-600 dark:text-red-400 font-normal">
                    {(verify.error as any)?.message ||
                      'Invalid verification code. Please try again.'}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={!isCodeComplete || verify.isPending}
                className="w-full h-12 rounded-lg bg-[#0E7C8C] text-white font-semibold hover:bg-[#3EC3BC] active:bg-[#0E7C8C]/90 transition-colors shadow-lg shadow-[#0E7C8C]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {verify.isPending ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-lg">
                      progress_activity
                    </span>
                    Verifying...
                  </>
                ) : (
                  'Verify Email'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400 font-normal">
                Didn't receive the code?{' '}
                <button
                  onClick={handleResendCode}
                  disabled={!canResend}
                  className={`text-[#0E7C8C] dark:text-[#3EC3BC] font-semibold transition-colors ${!canResend ? 'opacity-50 cursor-not-allowed' : 'hover:text-[#3EC3BC] dark:hover:text-[#0E7C8C]'}`}
                >
                  {resendCode.isPending ? 'Sending...' :
                   canResend ? 'Resend' :
                   `Resend (${countdown}s)`}
                </button>
              </p>

              {resendCode.isError && (
                <div className="mt-2 flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                  <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-base mt-0.5">
                    error
                  </span>
                  <p className="text-sm text-red-600 dark:text-red-400 font-normal">
                    {(resendCode.error as any)?.message ||
                      'Failed to resend verification code. Please try again.'}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <p className="text-center text-sm text-slate-600 dark:text-slate-400 font-normal">
                Wrong email?{' '}
                <button
                  onClick={() => navigate({ to: '/auth/signup' })}
                  className="text-[#0E7C8C] dark:text-[#3EC3BC] font-semibold hover:text-[#3EC3BC] dark:hover:text-[#0E7C8C] transition-colors"
                >
                  Change email
                </button>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
              This code will expire in 10 minutes
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}