import { useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import Header from '@/components/Header'
import { useResendVerificationCode, useResetPassword } from '@/queries/auth.queries'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { showToast } from '@/utils/swal'

export const Route = createFileRoute('/auth/reset-password')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) || '',
    email: (search.email as string) || '',
  }),
  component: ResetPassword
})

const resetPasswordSchema = Yup.object().shape({
  code: Yup.string()
    .length(6, 'Code must be 6 digits')
    .matches(/^\d+$/, 'Code must contain only numbers')
    .required('Verification code is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], "Passwords don't match")
    .required('Please confirm your password'),
})

type ResetPasswordFormData = Yup.InferType<typeof resetPasswordSchema>

function ResetPassword() {
  const navigate = useNavigate()
  const { email: searchEmail } = useSearch({ from: '/auth/reset-password' })
  const [email, setEmail] = useState('')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [canResend, setCanResend] = useState(true)
  const [countdown, setCountdown] = useState(0)
  
  const resetPassword = useResetPassword()
  const resendCode = useResendVerificationCode()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    trigger,
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      code: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const newPassword = watch('newPassword')
  const confirmPassword = watch('confirmPassword')

  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0
  const codeComplete = code.every((digit) => digit !== '')

  // Countdown effect for resend button
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else {
      setCanResend(true)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  useEffect(() => {
    const emailToUse = searchEmail || localStorage.getItem('email') || ''
    if (emailToUse) {
      setEmail(emailToUse)
    } else {
      navigate({ to: '/auth/forgot-password' })
    }
  }, [searchEmail, navigate])

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0]
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    
    const codeString = newCode.join('')
    setValue('code', codeString, { shouldValidate: true })

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      if (nextInput) (nextInput as HTMLInputElement).focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      if (prevInput) (prevInput as HTMLInputElement).focus()
    }
  }

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPassword.mutate(
      {
        email,
        code: data.code,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      },
      {
        onSuccess: () => {
          localStorage.removeItem('email')
          showToast('Password reset successfully!', 'success')
          navigate({ to: '/auth/login' })
        },
      }
    )
  }

  const handleResendCode = () => {
    if (!canResend) return
  
    resendCode.mutate(
      { email, purpose: 'forgot_password' },
      {
        onSuccess: () => {
          setCanResend(false)
          setCountdown(60)
          showToast('Verification code resent successfully', 'success')
        },
        onError: (error: any) => {
          showToast(error.response?.data?.message || 'Failed to resend code', 'error')
        },
      }
    )
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900 transition-colors">
      <Header />

      <div className="flex flex-1 items-center justify-center p-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Reset Password
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Enter the code sent to{' '}
                <span className="font-medium text-slate-900 dark:text-white">
                  {email}
                </span>
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Verification Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 text-center">
                  Verification Code
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
                      className={`w-12 h-14 text-center text-xl font-semibold border-2 rounded-lg transition-all outline-none
                        bg-white dark:bg-slate-900 text-slate-900 dark:text-white
                        ${errors.code 
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                          : 'border-slate-300 dark:border-slate-600 focus:border-[#0E7C8C] focus:ring-2 focus:ring-[#0E7C8C]/20'
                        }`}
                    />
                  ))}
                </div>
                {errors.code && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-2 text-center">
                    {errors.code.message}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter your new password"
                    {...register('newPassword')}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg transition-all outline-none
                      bg-white dark:bg-slate-900 text-slate-900 dark:text-white
                      placeholder:text-slate-400 dark:placeholder:text-slate-500
                      ${errors.newPassword 
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                        : 'border-slate-300 dark:border-slate-600 focus:border-[#0E7C8C] focus:ring-2 focus:ring-[#0E7C8C]/20'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0E7C8C] transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your new password"
                    {...register('confirmPassword')}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg transition-all outline-none
                      bg-white dark:bg-slate-900 text-slate-900 dark:text-white
                      placeholder:text-slate-400 dark:placeholder:text-slate-500
                      ${errors.confirmPassword 
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                        : 'border-slate-300 dark:border-slate-600 focus:border-[#0E7C8C] focus:ring-2 focus:ring-[#0E7C8C]/20'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0E7C8C] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {/* Password Match Indicator */}
                {confirmPassword && (
                  <p className={`text-xs mt-2 font-medium ${passwordsMatch ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* API Error Message */}
              {resetPassword.isError && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {(resetPassword.error as any)?.response?.data?.message ||
                      'Failed to reset password. Please try again.'}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={resetPassword.isPending || !isValid || !codeComplete}
                className="w-full py-3 bg-[#0E7C8C] text-white font-semibold rounded-lg hover:bg-[#0d6b79] active:bg-[#0c5f6c] transition-all shadow-lg shadow-[#0E7C8C]/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0E7C8C] flex items-center justify-center gap-2"
              >
                {resetPassword.isPending ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>

            {/* Resend Code */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={!canResend || resendCode.isPending}
                  className={`font-semibold transition-colors ${
                    !canResend || resendCode.isPending
                      ? 'text-slate-400 cursor-not-allowed' 
                      : 'text-[#0E7C8C] dark:text-[#3EC3BC] hover:text-[#0d6b79] dark:hover:text-[#4dd4cd]'
                  }`}
                >
                  {resendCode.isPending ? 'Sending...' :
                   canResend ? 'Resend Code' :
                   `Resend (${countdown}s)`}
                </button>
              </p>

              {resendCode.isError && (
                <div className="mt-2 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {(resendCode.error as any)?.response?.data?.message ||
                      'Failed to resend code. Please try again.'}
                  </p>
                </div>
              )}
            </div>

            {/* Sign In Link */}
            <div className="text-center text-sm border-t border-slate-200 dark:border-slate-700 pt-6 mt-6">
              <span className="text-slate-600 dark:text-slate-400">
                Remember your password?{' '}
              </span>
              <button
                type="button"
                onClick={() => navigate({ to: '/auth/login' })}
                className="text-[#0E7C8C] dark:text-[#3EC3BC] hover:text-[#0d6b79] dark:hover:text-[#4dd4cd] font-semibold transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Security Footer */}
          <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-xs mt-6">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Secure 256-bit SSL Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  )
} 