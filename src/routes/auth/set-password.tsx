import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import Header from '@/components/Header'
import { useSetPassword } from '@/hooks/useAuth'
import { Eye, EyeOff } from 'lucide-react'
import { z } from 'zod'
import { ProtectedRoute, PublicRoute } from '@/components/PRoutes'

export const Route = createFileRoute('/auth/set-password')({
  component: () => (
    <PublicRoute>
      <SetPassword />
    </PublicRoute>
  ),
})

const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/\d/, 'Password must contain at least one number')
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        'Password must contain at least one special character',
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

interface IFormData {
  newPassword: string
  confirmPassword: string
}

function SetPassword() {
  const navigate = useNavigate()
  const setPassword = useSetPassword()
  const [formData, setFormData] = useState<IFormData>({
    newPassword: '',
    confirmPassword: '',
  })
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleInputChange = (field: keyof IFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
    if (setPassword.isError) setPassword.reset()
  }

  const handleBlur = (field: keyof IFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ newPassword: true, confirmPassword: true })

    const result = passwordSchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof IFormData
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})

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
        onError: () => {
          setErrors({
            newPassword: 'Failed to set password. Please try again.',
          })
        },
      },
    )
  }

  const getFieldError = (field: keyof IFormData) =>
    touched[field] && errors[field] ? errors[field] : ''

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900 font-sans transition-colors">
      <Header />

      <main className="flex-1 flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Set Your Password
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-base">
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
                  value={formData.newPassword}
                  onChange={(e) =>
                    handleInputChange('newPassword', e.target.value)
                  }
                  onBlur={() => handleBlur('newPassword')}
                  className={`w-full h-12 pl-4 pr-12 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none transition-colors ${
                    getFieldError('newPassword')
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-slate-300 dark:border-slate-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {getFieldError('newPassword') && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {getFieldError('newPassword')}
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
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange('confirmPassword', e.target.value)
                  }
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`w-full h-12 pl-4 pr-12 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none transition-colors ${
                    getFieldError('confirmPassword')
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-slate-300 dark:border-slate-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {getFieldError('confirmPassword') && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {getFieldError('confirmPassword')}
                </p>
              )}
            </div>

            {/* API Error Message */}
            {setPassword.isError && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-base mt-0.5">
                  error
                </span>
                <p className="text-sm text-red-600 dark:text-red-400">
                  {(setPassword.error as any)?.response?.data?.message ||
                    'Failed to set password. Please try again.'}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={setPassword.isPending}
              className="w-full h-12 px-5 bg-blue-600 text-white text-base font-bold rounded-lg hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
