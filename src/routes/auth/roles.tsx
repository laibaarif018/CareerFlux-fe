import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import Header from '@/components/Header'
import { useRole } from '@/hooks/useAuth'
import { ProtectedRoute } from '@/components/PRoutes'

export const Route = createFileRoute('/auth/roles')({
  component: () => (
    <ProtectedRoute>
      <SelectRole />
    </ProtectedRoute>
  ),
})

function SelectRole() {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState<string>('jobseeker')
  const role = useRole()

  const handleRoleChange = (roleValue: string) => {
    setSelectedRole(roleValue)

    // Clear errors when user changes selection
    if (role.isError) {
      role.reset()
    }
  }

  const handleContinue = () => {
    if (!selectedRole) return

    role.mutate(selectedRole, {
      onSuccess: () => {
        // Navigate based on selected role
        if (selectedRole === 'jobseeker') {
          navigate({ to: '/profile' })
        } else if (selectedRole === 'company') {
          navigate({ to: '/company/profileSetup' })
        }
      },
    })
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 dark:bg-slate-900 font-sans overflow-x-hidden transition-colors">
      <Header />
      <div className="flex h-full grow flex-col">
        <div className="flex flex-1 justify-center items-center px-4 py-12">
          <div className="flex w-full max-w-2xl flex-col">
            <div className="rounded-2xl bg-white dark:bg-slate-800 p-8 md:p-10 shadow-xl border border-slate-200 dark:border-slate-700">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                  What describes you best?
                </h1>
                <p className="text-base text-slate-600 dark:text-slate-400">
                  Select your role to personalize your experience.
                </p>
              </div>

              {/* ROLE SELECTION */}
              <div
                className="flex flex-col sm:flex-row gap-4 w-full mb-8"
                role="radiogroup"
              >
                <label
                  className={`flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border-2 p-8 text-base font-semibold cursor-pointer transition-all duration-200 hover:shadow-lg
                    ${
                      selectedRole === 'jobseeker'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-600/20 shadow-md'
                        : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                    }`}
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                      selectedRole === 'jobseeker'
                        ? 'bg-blue-100 dark:bg-blue-900/50'
                        : 'bg-slate-100 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-4xl ${
                        selectedRole === 'jobseeker'
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      person
                    </span>
                  </div>
                  <span
                    className={`${
                      selectedRole === 'jobseeker'
                        ? 'text-blue-700 dark:text-blue-300'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    I am a Job Seeker
                  </span>
                  <input
                    type="radio"
                    name="role-selection"
                    className="sr-only"
                    value="jobseeker"
                    checked={selectedRole === 'jobseeker'}
                    onChange={() => handleRoleChange('jobseeker')}
                  />
                </label>

                <label
                  className={`flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border-2 p-8 text-base font-semibold cursor-pointer transition-all duration-200 hover:shadow-lg
                    ${
                      selectedRole === 'company'
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-600/20 shadow-md'
                        : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                    }`}
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                      selectedRole === 'company'
                        ? 'bg-blue-100 dark:bg-blue-900/50'
                        : 'bg-slate-100 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-4xl ${
                        selectedRole === 'company'
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      apartment
                    </span>
                  </div>
                  <span
                    className={`${
                      selectedRole === 'company'
                        ? 'text-blue-700 dark:text-blue-300'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    I am a Company
                  </span>
                  <input
                    type="radio"
                    name="role-selection"
                    className="sr-only"
                    value="company"
                    checked={selectedRole === 'company'}
                    onChange={() => handleRoleChange('company')}
                  />
                </label>
              </div>

              {/* Error Message */}
              {role.isError && (
                <div className="mb-6 flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                  <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-base mt-0.5">
                    error
                  </span>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {(role.error as any)?.response?.data?.message ||
                      'Failed to save your role. Please try again.'}
                  </p>
                </div>
              )}

              {/* CONTINUE BUTTON */}
              <button
                onClick={handleContinue}
                disabled={!selectedRole || role.isPending}
                className={`flex w-full items-center justify-center gap-2 rounded-lg px-5 h-12 text-base font-bold text-white transition-all shadow-lg
                  ${
                    selectedRole && !role.isPending
                      ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-blue-600/20 cursor-pointer'
                      : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-50'
                  }`}
              >
                {role.isPending ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-lg">
                      progress_activity
                    </span>
                    Saving...
                  </>
                ) : (
                  'Continue'
                )}
              </button>

              {/* Helper text */}
              {!selectedRole && (
                <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4">
                  Please select a role to continue
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
