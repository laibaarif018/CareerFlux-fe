import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import Header from '@/components/Header'
import { useSetPassword } from '@/queries/auth.queries'
import { Eye, EyeOff } from 'lucide-react'
import * as Yup from 'yup'
import { PublicRoute } from '@/utils/RouteGuard'

export const Route = createFileRoute('/auth/set-password')({
  component: () => (
    <PublicRoute>
      <SetPassword />
    </PublicRoute>
  ),
})

const passwordSchema = Yup.object().shape({
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

type PasswordFormData = Yup.InferType<typeof passwordSchema>

function SetPassword() {
  const navigate = useNavigate()
  const setPassword = useSetPassword()
  
  const [formData, setFormData] = useState<PasswordFormData>({
    newPassword: '',
    confirmPassword: '',
  })
  
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof PasswordFormData, string>>>({})

  const register = (field: keyof PasswordFormData) => ({
    value: formData[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }))
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
      if (setPassword.isError) setPassword.reset()
    },
    onBlur: async () => {
      try {
        await passwordSchema.validateAt(field, formData)
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          setErrors((prev) => ({ ...prev, [field]: error.message }))
        }
      }
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await passwordSchema.validate(formData, { abortEarly: false })
      setErrors({})
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const newErrors: Partial<Record<keyof PasswordFormData, string>> = {}
        error.inner.forEach((err) => {
          if (err.path) newErrors[err.path as keyof PasswordFormData] = err.message
        })
        setErrors(newErrors)
        return
      }
    }

    const userId = localStorage.getItem('userId')
    if (!userId) {
      setErrors({ newPassword: 'User not found. Please try again.' })
      return
    }

    setPassword.mutate(
      { userId, password: formData.newPassword },
      {
        onSuccess: () => {
          localStorage.removeItem('userId')
          navigate({ to: '/auth/roles' })
        },
      }
    )
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900 transition-colors" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
      <Header />

      <main className="flex-1 flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3" style={{ letterSpacing: '-0.01em' }}>
              Set Your Password
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-base font-normal">
              You signed in with Google. Create a password to continue.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  {...register('newPassword')}
                  className={`w-full h-12 pl-4 pr-12 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none transition-colors font-normal ${
                    errors.newPassword
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-slate-300 dark:border-slate-600 focus:border-[#0E7C8C] focus:ring-2 focus:ring-[#0E7C8C]/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0E7C8C] dark:hover:text-[#3EC3BC] transition-colors"
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
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  {...register('confirmPassword')}
                  className={`w-full h-12 pl-4 pr-12 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none transition-colors font-normal ${
                    errors.confirmPassword
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-slate-300 dark:border-slate-600 focus:border-[#0E7C8C] focus:ring-2 focus:ring-[#0E7C8C]/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0E7C8C] dark:hover:text-[#3EC3BC] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-normal">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* API Error Message */}
            {setPassword.isError && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-base mt-0.5">
                  error
                </span>
                <p className="text-sm text-red-600 dark:text-red-400 font-normal">
                  {(setPassword.error as any)?.response?.data?.message ||
                    'Failed to set password. Please try again.'}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={setPassword.isPending}
              className="w-full h-12 px-5 bg-[#0E7C8C] text-white text-base font-semibold rounded-lg hover:bg-[#3EC3BC] active:bg-[#0E7C8C]/90 focus:outline-none focus:ring-2 focus:ring-[#0E7C8C] focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#0E7C8C]/20"
            >
              {setPassword.isPending ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">
                    progress_activity
                  </span>
                  Saving...
                </>
              ) : (
                'Save Password'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}