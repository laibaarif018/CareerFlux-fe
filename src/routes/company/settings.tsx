import CompanySidebar from '@/components/companysidebar'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useGetProfile } from '@/queries/user.queries'
import { useChangePassword } from '@/queries/auth.queries'
import Shimmer from '@/components/Shimmer'

import { showSuccess,showError } from '@/utils/swal'

export const Route = createFileRoute('/company/settings')({
  component: AccountSettings,
})

// Yup validation schema
const passwordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: yup
    .string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('newPassword')], 'Passwords do not match'),
})

type PasswordFormData = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function AccountSettings() {
  const { data: profileData, isLoading: isLoadingProfile } = useGetProfile()
  const changePasswordMutation = useChangePassword()

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field as keyof typeof showPasswords],
    }))
  }

 const onSubmit = async (data: PasswordFormData) => {
  try {
    await changePasswordMutation.mutateAsync({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    })

    await showSuccess(
      'Password Changed',
      'Your password has been updated successfully.',
    )

    reset()
    setShowPasswords({ current: false, new: false, confirm: false })
  } catch (error: any) {
    showError(
      'Password Change Failed',
      error?.response?.data?.message || 'Failed to change password',
    )
  }
}

  const handleCancel = () => {
    reset()
    setShowPasswords({ current: false, new: false, confirm: false })
  }

  // Get user data
  const user = profileData?.payload?.user
  const userEmail = user?.email || 'N/A'
  const accountCreated = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A'

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 font-sans transition-colors">
      <CompanySidebar />

      <main className="flex-1 ml-64 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Account Settings
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your account security and preferences
            </p>
          </div>

          <div className="space-y-6">
            {/* Change Password */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-[#0E7C8C] dark:text-[#3EC3BC]">
                  lock
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Change Password
                </h2>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-5">
                  {/* Current Password */}
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        id="currentPassword"
                        type={showPasswords.current ? 'text' : 'password'}
                        placeholder="Enter your current password"
                        {...register('currentPassword')}
                        className={`w-full h-12 rounded-lg text-slate-900 dark:text-white border ${
                          errors.currentPassword
                            ? 'border-red-500 dark:border-red-500 focus:ring-red-500/20'
                            : 'border-slate-300 dark:border-slate-600 focus:ring-[#0E7C8C]/20'
                        } bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 px-4 pr-12 text-sm transition-colors`}
                        disabled={changePasswordMutation.isPending}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('current')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">
                          {showPasswords.current
                            ? 'visibility_off'
                            : 'visibility'}
                        </span>
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          error
                        </span>
                        {errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        type={showPasswords.new ? 'text' : 'password'}
                        placeholder="Enter a new password"
                        {...register('newPassword')}
                        className={`w-full h-12 rounded-lg text-slate-900 dark:text-white border ${
                          errors.newPassword
                            ? 'border-red-500 dark:border-red-500 focus:ring-red-500/20'
                            : 'border-slate-300 dark:border-slate-600 focus:ring-[#0E7C8C]/20'
                        } bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 px-4 pr-12 text-sm transition-colors`}
                        disabled={changePasswordMutation.isPending}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('new')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">
                          {showPasswords.new ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          error
                        </span>
                        {errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showPasswords.confirm ? 'text' : 'password'}
                        placeholder="Confirm your new password"
                        {...register('confirmPassword')}
                        className={`w-full h-12 rounded-lg text-slate-900 dark:text-white border ${
                          errors.confirmPassword
                            ? 'border-red-500 dark:border-red-500 focus:ring-red-500/20'
                            : 'border-slate-300 dark:border-slate-600 focus:ring-[#0E7C8C]/20'
                        } bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 px-4 pr-12 text-sm transition-colors`}
                        disabled={changePasswordMutation.isPending}
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility('confirm')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">
                          {showPasswords.confirm
                            ? 'visibility_off'
                            : 'visibility'}
                        </span>
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          error
                        </span>
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="mt-5 p-4 rounded-lg bg-[#3EC3BC]/10 dark:bg-[#0E7C8C]/20 border border-[#3EC3BC]/30 dark:border-[#0E7C8C]/30">
                  <p className="text-sm font-medium text-[#0E7C8C] dark:text-[#3EC3BC] mb-2">
                    Password requirements:
                  </p>
                  <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-[#0E7C8C] dark:text-[#3EC3BC]">
                        check_circle
                      </span>
                      At least 8 characters long
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-[#0E7C8C] dark:text-[#3EC3BC]">
                        check_circle
                      </span>
                      Contains uppercase and lowercase letters
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-[#0E7C8C] dark:text-[#3EC3BC]">
                        check_circle
                      </span>
                      Contains at least one number
                    </li>
                  </ul>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center justify-center h-10 px-5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    disabled={changePasswordMutation.isPending}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={changePasswordMutation.isPending}
                    className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg bg-[#0E7C8C] text-white text-sm font-bold hover:bg-[#3EC3BC] active:bg-[#0E7C8C]/90 transition-colors shadow-lg shadow-[#0E7C8C]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {changePasswordMutation.isPending ? (
                      <>
                        <span className="material-symbols-outlined text-lg animate-spin">
                          sync
                        </span>
                        Changing...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-lg">
                          check
                        </span>
                        Change Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Account Information */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-[#0E7C8C] dark:text-[#3EC3BC]">
                  info
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Account Information
                </h2>
              </div>

              {isLoadingProfile ? (
                <div className="space-y-4">
                  <div className="py-3 border-b border-slate-200 dark:border-slate-700">
                    <Shimmer className="h-4 w-32 rounded mb-2" />
                    <Shimmer className="h-4 w-48 rounded" />
                  </div>
                  <div className="py-3 border-b border-slate-200 dark:border-slate-700">
                    <Shimmer className="h-4 w-32 rounded mb-2" />
                    <Shimmer className="h-4 w-40 rounded" />
                  </div>
                  <div className="py-3">
                    <Shimmer className="h-4 w-32 rounded mb-2" />
                    <Shimmer className="h-4 w-24 rounded" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        Email Address
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                        {userEmail}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        Account Created
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                        {accountCreated}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        Account Status
                      </p>
                      <p className="text-sm text-[#0E7C8C] dark:text-[#3EC3BC] mt-0.5 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">
                          check_circle
                        </span>
                        Active
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
