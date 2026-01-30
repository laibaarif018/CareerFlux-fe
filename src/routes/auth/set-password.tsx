import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import Header from '@/components/Header'
import { useSetPassword } from '@/queries/auth.queries'
import { Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { setPasswordSchema, type PasswordFormData } from '@/validations/auth/set-password'
import storageService from '@/utils/localstorage'

export const Route = createFileRoute('/auth/set-password')({
  component: SetPassword
})

function SetPassword() {
  const navigate = useNavigate()
  const setPassword = useSetPassword()
  const role = storageService.getItem<string>('userRole')

  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm<PasswordFormData>({
    resolver: yupResolver(setPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (data: PasswordFormData) => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      setError('newPassword', {
        type: 'manual',
        message: 'User not found. Please try again.'
      })
      return
    }

    setPassword.mutate(
      { userId, password: data.newPassword },
      {
        onSuccess: () => {
          localStorage.removeItem('userId')
          if (role === 'jobseeker')
            navigate({ to: '/job-seeker/dashboard' })
          else if (role === 'company')
            navigate({ to: '/company/dashboard' })
          else if (role === 'unassigned')
            navigate({ to: '/roles' })
        },
      }
    )
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900 transition-colors">
      <Header />

      <main className="flex-1 flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Set Your Password
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              You signed in with Google. Create a password to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
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
                  className={`w-full h-12 px-4 pr-12 rounded-lg border transition-all outline-none
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
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  {...register('confirmPassword')}
                  className={`w-full h-12 px-4 pr-12 rounded-lg border transition-all outline-none
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
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* API Error Message */}
            {setPassword.isError && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {(setPassword.error as any)?.response?.data?.message ||
                    'Failed to set password. Please try again.'}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={setPassword.isPending || !isValid}
              className="w-full h-12 px-5 bg-[#0E7C8C] text-white font-semibold rounded-lg
                hover:bg-[#0d6b79] active:bg-[#0c5f6c] transition-all shadow-lg shadow-[#0E7C8C]/20
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0E7C8C]
                flex items-center justify-center gap-2"
            >
              {setPassword.isPending ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving Password...
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




