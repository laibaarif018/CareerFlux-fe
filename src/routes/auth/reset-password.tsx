import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/auth/reset-password')({
  component: ForgotPassword,
})

function ForgotPassword() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    // Implement your reset password logic here
    console.log('Reset link requested for:', email)
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-[#0d121b] dark:text-white font-display">
      {/* Navigation Bar */}
      <header className="flex items-center justify-between border-b border-solid border-b-[#e7ebf3] dark:border-b-[#2a3441] px-10 py-3 bg-white dark:bg-[#1a202c]">
        <div className="flex items-center gap-4 text-[#0d121b] dark:text-white">
          <div className="size-8 text-primary">
            <span className="material-symbols-outlined !text-[32px]">psychology</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">ResumeAI</h2>
        </div>
        <div className="flex gap-2">
          <button className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-background-light dark:bg-[#2a3441] text-sm font-bold hover:bg-[#e7ebf3] dark:hover:bg-[#374151] transition-colors">
            Don't have an account? Sign Up
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="layout-container flex h-full grow flex-col justify-center items-center p-4">
        <div className="w-full max-w-[480px] bg-white dark:bg-[#1a202c] rounded-xl shadow-lg border border-[#e7ebf3] dark:border-[#2a3441] p-8 md:p-12">
          {/* Back Link */}
          <div className="mb-6">
            <a className="inline-flex items-center gap-2 text-sm font-bold text-[#637588] dark:text-[#9ca3af] hover:text-primary transition-colors" href="#">
              <span className="material-symbols-outlined !text-lg">arrow_back</span>
              Back to Login
            </a>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined !text-[32px]">lock_reset</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-[32px] font-bold leading-tight text-center mb-2">Forgot Password?</h1>
          <p className="text-[#637588] dark:text-[#9ca3af] text-base font-normal leading-normal text-center mb-8">
            No worries, we'll send you reset instructions. Please enter the email address associated with your account.
          </p>

          {/* Form */}
          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-base font-medium text-[#0d121b] dark:text-white" htmlFor="email-address">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#9ca3af]">mail</span>
                <input
                  id="email-address"
                  type="email"
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input w-full h-14 pl-12 pr-4 text-base rounded-lg border border-[#cfd7e7] dark:border-[#4b5563] bg-background-light dark:bg-[#101622] text-[#0d121b] dark:text-white placeholder:text-[#9ca3af] focus:outline-0 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center h-12 px-5 bg-primary hover:bg-blue-700 text-white font-bold rounded-lg tracking-[0.015em] shadow-md shadow-blue-500/20 transition-colors"
            >
              Send Reset Link
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center border-t border-[#e7ebf3] dark:border-[#2a3441] pt-6">
            <p className="text-sm text-[#637588] dark:text-[#9ca3af]">
              Remember your password?{' '}
              <a className="text-primary font-bold hover:underline" href="#">
                Log in
              </a>
            </p>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[#9ca3af] text-xs">
          <span className="material-symbols-outlined !text-sm">verified_user</span>
          <span>Secure 256-bit SSL Encrypted</span>
        </div>
      </div>
    </div>
  )
}
