import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import Header from '@/components/Header'

export const Route = createFileRoute('/auth/verification')({
  component: OtpVerification,
})

function OtpVerification() {
  const navigate = useNavigate()
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const email = 'your.email@example.com' // Get from route params or context

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return
    if (!/^\d*$/.test(value)) return // Only allow digits
    
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newCode = [...code]
    pastedData.split('').forEach((char, i) => {
      if (i < 6) newCode[i] = char
    })
    setCode(newCode)
    
    // Focus last filled input or first empty
    const lastIndex = Math.min(pastedData.length, 5)
    document.getElementById(`otp-${lastIndex}`)?.focus()
  }

  const handleVerify = async () => {
    const verificationCode = code.join('')
    
    if (verificationCode.length !== 6) {
      setError('Please enter the complete 6-digit code')
      return
    }

    setIsLoading(true)
    setError('')
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Simulate verification (replace with actual logic)
    if (verificationCode === '123456') {
      setIsLoading(false)
      navigate({ to: '/auth/roles' })
    } else {
      setIsLoading(false)
      setError('Invalid verification code. Please try again.')
      setCode(['', '', '', '', '', ''])
      document.getElementById('otp-0')?.focus()
    }
  }

  const handleResend = async () => {
    setIsLoading(true)
    setError('')
    
    // Simulate resending code
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    setCode(['', '', '', '', '', ''])
    alert('New verification code sent to your email!')
    document.getElementById('otp-0')?.focus()
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900 font-sans overflow-x-hidden transition-colors">
      {/* HEADER */}
      <Header />

      {/* MAIN */}
      <main className="flex flex-1 justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
          
          <div className="flex flex-col items-center">
            {/* Icon */}
            <div className="mb-6 w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-4xl">
                mail_lock
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-3">
              Verify Your Email
            </h1>

            <p className="text-center text-slate-600 dark:text-slate-400 text-sm mb-8 leading-relaxed">
              We've sent a 6-digit verification code to{' '}
              <strong className="text-slate-900 dark:text-white">
                {email}
              </strong>
            </p>

            {/* OTP INPUTS */}
            <div className="w-full mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 text-center">
                Enter Verification Code
              </label>
              <div className="flex justify-center gap-2">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 text-center text-2xl font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
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

            {/* BUTTONS */}
            <div className="flex flex-col w-full gap-3 mb-6">
              <button 
                onClick={handleVerify}
                disabled={isLoading || code.some(d => !d)}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
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

              <button 
                onClick={handleResend}
                disabled={isLoading}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-lg">refresh</span>
                Resend Code
              </button>
            </div>

            {/* Info Box */}
            <div className="w-full p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 mb-6">
              <p className="text-xs text-blue-900 dark:text-blue-300 text-center">
                Check your spam folder if you don't see the email. The code expires in 10 minutes.
              </p>
            </div>

            {/* FOOTER LINK */}
            <Link
              to="/auth/login"
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
            >
              Back to Log In
            </Link>
          </div>
        </div>
      </main>

      {/* Security Footer */}
      <div className="pb-8 flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
        <span className="material-symbols-outlined text-sm">verified_user</span>
        <span>Secure 256-bit SSL Encrypted</span>
      </div>
    </div>
  )
}