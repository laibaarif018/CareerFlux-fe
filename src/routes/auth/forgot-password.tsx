import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import Header from '@/components/Header'

export const Route = createFileRoute('/auth/forgot-password')({
  component: ForgotPassword,
})

function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'email' | 'verification'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setIsLoading(true)
    setError('')
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    setStep('verification')
    console.log('Verification code sent to:', email)
  }

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return
    if (!/^\d*$/.test(value)) return // Only allow digits
    
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    const verificationCode = code.join('')
    
    if (verificationCode.length !== 6) {
      setError('Please enter the complete 6-digit code')
      return
    }

    setIsLoading(true)
    setError('')
    // Simulate API call to verify code
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Simulate verification (replace with actual verification logic)
    if (verificationCode === '123456') {
      setIsLoading(false)
      navigate({ to: '/auth/reset-password', search: { email, code: verificationCode } })
    } else {
      setIsLoading(false)
      setError('Invalid verification code. Please try again.')
      setCode(['', '', '', '', '', ''])
      document.getElementById('code-0')?.focus()
    }
  }

  const handleResendCode = async () => {
    setIsLoading(true)
    setError('')
    // Simulate resending code
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    setCode(['', '', '', '', '', ''])
    alert('New verification code sent to your email!')
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-sans transition-colors">
      <Header /> 

      {/* Main Content */}
      <div className="flex h-full grow flex-col justify-center items-center p-4 py-12">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
          
          {step === 'email' ? (
            // Email Step
            <>
              {/* Back Link */}
              {/* <div className="mb-6">
                <button
                  onClick={() => navigate({ to: '/auth/login' })}
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                  Back to Login
                </button>
              </div> */}

              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <span className="material-symbols-outlined text-4xl">lock_reset</span>
                </div>
              </div>

              {/* Headline */}
              <h1 className="text-3xl font-bold text-center mb-3 text-slate-900 dark:text-white">
                Forgot Password?
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm text-center mb-8 leading-relaxed">
                Enter your email address and we'll send you a verification code to reset your password.
              </p>

              {/* Form */}
              <form className="space-y-6" onSubmit={handleSendCode}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" htmlFor="email-address">
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
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full h-12 pl-12 pr-4 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 h-12 px-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-lg shadow-lg shadow-blue-600/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">send</span>
                      Send Verification Code
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-8 text-center border-t border-slate-200 dark:border-slate-700 pt-6">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Remember your password?{' '}
                  <button
                    onClick={() => navigate({ to: '/auth/login' })}
                    className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
                  >
                    Log in
                  </button>
                </p>
              </div>
            </>
          ) : (
            // Verification Step
            <>
              {/* Back Link */}
              <div className="mb-6">
                <button
                  onClick={() => setStep('email')}
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                  Back
                </button>
              </div>

              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <span className="material-symbols-outlined text-4xl">mail_lock</span>
                </div>
              </div>

              {/* Headline */}
              <h1 className="text-3xl font-bold text-center mb-3 text-slate-900 dark:text-white">
                Check Your Email
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm text-center mb-8 leading-relaxed">
                We've sent a 6-digit verification code to <strong className="text-slate-900 dark:text-white">{email}</strong>
              </p>

              {/* Verification Code Form */}
              <form className="space-y-6" onSubmit={handleVerifyCode}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 text-center">
                    Enter Verification Code
                  </label>
                  <div className="flex gap-2 justify-center">
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-14 text-center text-2xl font-bold rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                      />
                    ))}
                  </div>
                  {error && (
                    <p className="text-red-600 dark:text-red-400 text-sm text-center mt-3 flex items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-base">error</span>
                      {error}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || code.some(d => !d)}
                  className="flex w-full items-center justify-center gap-2 h-12 px-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-lg shadow-lg shadow-blue-600/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">check_circle</span>
                      Verify Code
                    </>
                  )}
                </button>
              </form>

              {/* Resend Code */}
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors disabled:opacity-50"
                >
                  Resend Code
                </button>
              </div>

              {/* Info Box */}
              <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-900 dark:text-blue-300 text-center">
                  Check your spam folder if you don't see the email in your inbox.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Security Footer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
          <span className="material-symbols-outlined text-sm">verified_user</span>
          <span>Secure 256-bit SSL Encrypted</span>
        </div>
      </div>
    </div>
  )
}