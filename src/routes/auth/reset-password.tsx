import { useState, useEffect } from 'react'
import { Eye, EyeOff, Check, Circle } from 'lucide-react'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import Header from '@/components/Header'
import { useResetPassword } from '@/queries/auth.queries'
import * as Yup from 'yup'

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
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    code: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof ResetPasswordFormData, string>>>({})
  const resetPassword = useResetPassword()

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
    
    const codeString = [...newCode].join('')
    setFormData((prev) => ({ ...prev, code: codeString }))
    
    if (errors.code) setErrors((prev) => ({ ...prev, code: undefined }))
    if (resetPassword.isError) resetPassword.reset()

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

  const register = (field: 'newPassword' | 'confirmPassword') => ({
    value: formData[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }))
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
      if (resetPassword.isError) resetPassword.reset()
    },
    onBlur: async () => {
      try {
        await resetPasswordSchema.validateAt(field, formData)
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          setErrors((prev) => ({ ...prev, [field]: error.message }))
        }
      }
    },
  })

  const hasMinLength = formData.newPassword.length >= 8
  const hasNumber = /\d/.test(formData.newPassword)
  const hasUppercase = /[A-Z]/.test(formData.newPassword)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword)
  const allRequirementsMet = hasMinLength && hasNumber && hasUppercase && hasSpecialChar
  const passwordsMatch = formData.newPassword === formData.confirmPassword && formData.confirmPassword.length > 0
  const codeComplete = code.every((digit) => digit !== '')

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await resetPasswordSchema.validate(formData, { abortEarly: false })
      setErrors({})
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const newErrors: Partial<Record<keyof ResetPasswordFormData, string>> = {}
        error.inner.forEach((err) => {
          if (err.path) newErrors[err.path as keyof ResetPasswordFormData] = err.message
        })
        setErrors(newErrors)
        return
      }
    }

    resetPassword.mutate(
      {
        email,
        code: formData.code,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      },
      {
        onSuccess: () => {
          localStorage.removeItem('email')
          navigate({ to: '/auth/login' })
        },
      }
    )
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900 transition-colors" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
      <Header />

      <div className="flex h-full grow flex-col justify-center items-center p-4 py-12">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3" style={{ letterSpacing: '-0.01em' }}>
              Reset Password
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-normal">
              A secure code has been sent to{' '}
              <strong className="text-slate-700 dark:text-slate-300 font-semibold">
                {email}
              </strong>
              . Enter the code and your new password below.
            </p>
          </div>

          <form onSubmit={handleResetPassword} noValidate>
            {/* Verification Code */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 text-center">
                Verification Code
              </label>
              <div className="flex gap-2 justify-center mb-2">
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
                    className={`w-12 h-14 text-center text-xl font-semibold border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-[#0E7C8C]/20 outline-none transition-all ${
                      errors.code
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-slate-200 dark:border-slate-700 focus:border-[#0E7C8C]'
                    }`}
                  />
                ))}
              </div>
              {errors.code && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1 text-center font-normal">
                  {errors.code}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter your new password"
                  {...register('newPassword')}
                  className={`w-full pl-4 pr-12 py-3 border bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-[#0E7C8C]/20 outline-none placeholder-slate-400 dark:placeholder:text-slate-500 font-normal ${
                    errors.newPassword
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-slate-300 dark:border-slate-700 focus:border-[#0E7C8C]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0E7C8C] dark:hover:text-[#3EC3BC] transition-colors"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-normal">
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your new password"
                  {...register('confirmPassword')}
                  className={`w-full pl-4 pr-12 py-3 border bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-[#0E7C8C]/20 outline-none placeholder-slate-400 dark:placeholder:text-slate-500 font-normal ${
                    errors.confirmPassword
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-slate-300 dark:border-slate-700 focus:border-[#0E7C8C]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0E7C8C] dark:hover:text-[#3EC3BC] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <p className={`text-xs mt-2 font-medium ${passwordsMatch ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-normal">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6 text-sm">
              <div className="flex items-center gap-2">
                {hasMinLength ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Circle size={16} className="text-slate-300" />
                )}
                <span className={`font-normal ${hasMinLength ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  8+ characters
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasUppercase ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Circle size={16} className="text-slate-300" />
                )}
                <span className={`font-normal ${hasUppercase ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  1 uppercase letter
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasNumber ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Circle size={16} className="text-slate-300" />
                )}
                <span className={`font-normal ${hasNumber ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  1 number
                </span>
              </div>
              <div className="flex items-center gap-2">
                {hasSpecialChar ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Circle size={16} className="text-slate-300" />
                )}
                <span className={`font-normal ${hasSpecialChar ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  1 special character
                </span>
              </div>
            </div>

            {/* Error Message */}
            {resetPassword.isError && (
              <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-base mt-0.5">
                  error
                </span>
                <p className="text-sm text-red-600 dark:text-red-400 font-normal">
                  {(resetPassword.error as any)?.response?.data?.message ||
                    'Failed to reset password. Please try again.'}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={resetPassword.isPending || !allRequirementsMet || !passwordsMatch || !codeComplete}
              className="w-full py-3 bg-[#0E7C8C] text-white font-semibold rounded-lg hover:bg-[#3EC3BC] active:bg-[#0E7C8C]/90 transition-colors shadow-lg shadow-[#0E7C8C]/20 mb-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {resetPassword.isPending ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">
                    progress_activity
                  </span>
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center text-sm border-t border-slate-200 dark:border-slate-700 pt-4">
            <span className="text-slate-500 dark:text-slate-400 font-normal">
              Remember your password?{' '}
            </span>
            <button
              type="button"
              onClick={() => navigate({ to: '/auth/login' })}
              className="text-[#0E7C8C] dark:text-[#3EC3BC] hover:text-[#3EC3BC] dark:hover:text-[#0E7C8C] font-semibold transition-colors"
            >
              Sign In
            </button>
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