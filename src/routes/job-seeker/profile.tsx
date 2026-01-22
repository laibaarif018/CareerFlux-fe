import UserHeader from '@/components/UserHeader'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useGetProfile, useProfile } from '@/queries/user.queries'
import Shimmer from '@/components/Shimmer'
import { requireRole } from '@/utils/RouteGuard'
import * as Yup from 'yup'
import { showToast } from '@/utils/swal'

export const Route = createFileRoute('/job-seeker/profile')({
  beforeLoad: () => {
    requireRole('jobseeker')
  },
  component: Profile,
})

// Yup validation schema
const profileSchema = Yup.object().shape({
  name: Yup.string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9+\s-()]+$/, 'Invalid phone number format'),
  location: Yup.string()
    .required('Location is required')
    .min(2, 'Location must be at least 2 characters'),
  experienceLevel: Yup.string().oneOf(
    ['fresher', 'junior', 'mid', 'senior'],
    'Invalid experience level',
  ),
  roles: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one role is required')
    .required('At least one role is required'),
  industries: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one industry is required')
    .required('At least one industry is required'),
  locations: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one work location is required')
    .required('At least one work location is required'),
  salary: Yup.number()
    .min(30000, 'Minimum salary must be at least $30,000')
    .max(250000, 'Maximum salary cannot exceed $250,000')
    .required('Please set a minimum salary expectation'),
})

type ProfileFormData = Yup.InferType<typeof profileSchema>

export default function Profile() {
  const { data, isLoading } = useGetProfile()
  const profileMutation = useProfile()

  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    phone: '',
    location: '',
    experienceLevel: 'mid',
    roles: [],
    industries: [],
    locations: [],
    salary: 0,
  })

  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  /* Populate data from backend */
  useEffect(() => {
    if (data?.payload?.user && data?.payload?.jobSeeker) {
      const user = data.payload.user
      const jobSeeker = data.payload.jobSeeker

      setEmail(user.email ?? '')
      setFormData({
        name: user.name ?? '',
        phone: jobSeeker.phoneNumber ?? '',
        location: jobSeeker.location ?? '',
        experienceLevel: jobSeeker.experienceLevel ?? 'mid',
        roles: jobSeeker.preferredRoles ?? [],
        industries: jobSeeker.preferredIndustries ?? [],
        locations: jobSeeker.preferredLocations ?? [],
        salary: jobSeeker.minimumSalaryExpected ?? 0,
      })
    }
  }, [data])

  // Validate a single field
  const validateField = async (field: keyof ProfileFormData, value: any) => {
    try {
      await profileSchema.validateAt(field, { ...formData, [field]: value })
      setErrors((prev) => ({ ...prev, [field]: '' }))
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setErrors((prev) => ({ ...prev, [field]: error.message }))
      }
    }
  }

  // Handle input changes
  const handleChange = (field: keyof ProfileFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (touched[field]) {
      validateField(field, value)
    }
  }

  // Handle blur events
  const handleBlur = (field: keyof ProfileFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    validateField(field, formData[field])
  }

  // Handle array additions
  const handleArrayAdd = (
    field: 'roles' | 'industries' | 'locations',
    value: string,
  ) => {
    const updated = [...formData[field], value]
    setFormData((prev) => ({ ...prev, [field]: updated }))
    if (touched[field]) {
      validateField(field, updated)
    }
  }

  // Handle array removals
  const handleArrayRemove = (
    field: 'roles' | 'industries' | 'locations',
    value: string,
  ) => {
    const updated = formData[field].filter((v) => v !== value)
    setFormData((prev) => ({ ...prev, [field]: updated }))
    if (touched[field]) {
      validateField(field, updated)
    }
  }

  // Validate entire form
  const validateForm = async (): Promise<boolean> => {
    try {
      await profileSchema.validate(formData, { abortEarly: false })
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const newErrors: Record<string, string> = {}
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.message
          }
        })
        setErrors(newErrors)

        // Mark all fields as touched
        const allTouched = Object.keys(formData).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {},
        )
        setTouched(allTouched)
      }
      return false
    }
  }

  // Handle save
  const handleSave = async () => {
    const isValid = await validateForm()
    if (!isValid) return

    profileMutation.mutate(
      {
        name: formData.name,
        phoneNumber: formData.phone,
        location: formData.location,
        experienceLevel: formData.experienceLevel as string,
        preferredRoles: formData.roles as string[],
        preferredIndustries: formData.industries as string[],
        preferredLocations: formData.locations as string[],
        minimumSalaryExpected: formData.salary as number,
      },
      {
        onSuccess: () => {
          showToast('Profile updated successfully.')
        },
      },
    )
  }

  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors"
        style={{
          fontFamily:
            '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif"',
        }}
      >
        <UserHeader />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Personal Information Shimmer */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm lg:h-full flex flex-col">
                <Shimmer className="h-7 w-48 mb-6 rounded-md" />
                <div className="space-y-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i}>
                      <Shimmer className="h-4 w-32 mb-2 rounded-md" />
                      <Shimmer className="h-12 w-full rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Preferences Shimmer */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm lg:h-full flex flex-col">
                <Shimmer className="h-7 w-40 mb-6 rounded-md" />
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="mb-6">
                    <Shimmer className="h-4 w-32 mb-2 rounded-md" />
                    <Shimmer className="h-16 w-full rounded-lg" />
                  </div>
                ))}
                <div className="flex justify-end mt-auto pt-6 border-t border-slate-200 dark:border-slate-700">
                  <Shimmer className="h-12 w-24 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors"
      style={{
        fontFamily:
          '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif"',
      }}
    >
      <UserHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm lg:h-full flex flex-col">
              <h3
                className="text-xl font-bold text-slate-900 dark:text-white mb-6"
                style={{ letterSpacing: '-0.01em' }}
              >
                Personal Information
              </h3>
              <div className="space-y-6">
                {/* Name */}
                <label className="flex flex-col">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 pb-2">
                    Full Name <span className="text-red-500">*</span>
                  </p>
                  <div className="relative flex w-full flex-1 items-stretch">
                    <input
                      className={`flex w-full min-w-0 flex-1 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0E7C8C]/20 border ${
                        errors.name && touched.name
                          ? 'border-red-500 dark:border-red-500'
                          : 'border-slate-300 dark:border-slate-600'
                      } bg-white dark:bg-slate-900 h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 pr-10 text-base font-normal transition-colors`}
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      onBlur={() => handleBlur('name')}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 dark:text-slate-500 pointer-events-none">
                      <span className="material-symbols-outlined text-xl">
                        edit
                      </span>
                    </div>
                  </div>
                  {errors.name && touched.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </label>

                {/* Email (Read-only) */}
                <label className="flex flex-col">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 pb-2">
                    Email
                  </p>
                  <div className="relative flex w-full flex-1 items-stretch">
                    <input
                      className="flex w-full min-w-0 flex-1 rounded-lg text-slate-900 dark:text-white focus:outline-none border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-900/50 h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 pr-10 text-base font-normal transition-colors cursor-not-allowed"
                      value={email}
                      readOnly
                      disabled
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 dark:text-slate-500 pointer-events-none">
                      <span className="material-symbols-outlined text-xl">
                        lock
                      </span>
                    </div>
                  </div>
                </label>

                {/* Phone */}
                <label className="flex flex-col">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 pb-2">
                    Phone <span className="text-red-500">*</span>
                  </p>
                  <div className="relative flex w-full flex-1 items-stretch">
                    <input
                      className={`flex w-full min-w-0 flex-1 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0E7C8C]/20 border ${
                        errors.phone && touched.phone
                          ? 'border-red-500 dark:border-red-500'
                          : 'border-slate-300 dark:border-slate-600'
                      } bg-white dark:bg-slate-900 h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 pr-10 text-base font-normal transition-colors`}
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 dark:text-slate-500 pointer-events-none">
                      <span className="material-symbols-outlined text-xl">
                        edit
                      </span>
                    </div>
                  </div>
                  {errors.phone && touched.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </label>

                {/* Location */}
                <label className="flex flex-col">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 pb-2">
                    Location <span className="text-red-500">*</span>
                  </p>
                  <div className="relative flex w-full flex-1 items-stretch">
                    <input
                      className={`flex w-full min-w-0 flex-1 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0E7C8C]/20 border ${
                        errors.location && touched.location
                          ? 'border-red-500 dark:border-red-500'
                          : 'border-slate-300 dark:border-slate-600'
                      } bg-white dark:bg-slate-900 h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 pr-10 text-base font-normal transition-colors`}
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      onBlur={() => handleBlur('location')}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 dark:text-slate-500 pointer-events-none">
                      <span className="material-symbols-outlined text-xl">
                        edit
                      </span>
                    </div>
                  </div>
                  {errors.location && touched.location && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.location}
                    </p>
                  )}
                </label>

                {/* Experience Level */}
                <label className="flex flex-col">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 pb-2">
                    Experience Level
                  </p>
                  <div className="relative">
                    <select
                      value={formData.experienceLevel}
                      onChange={(e) =>
                        handleChange('experienceLevel', e.target.value)
                      }
                      className="flex w-full rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0E7C8C]/20 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 h-12 px-4 pr-10 text-base font-normal transition-colors appearance-none cursor-pointer"
                    >
                      <option value="fresher">Fresher</option>
                      <option value="junior">Junior</option>
                      <option value="mid">Mid-Level</option>
                      <option value="senior">Senior</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500 dark:text-slate-400">
                      <span className="material-symbols-outlined text-xl">
                        unfold_more
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Preferences & Save Button */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm lg:h-full flex flex-col">
              <h3
                className="text-xl font-bold text-slate-900 dark:text-white mb-6"
                style={{ letterSpacing: '-0.01em' }}
              >
                Career Preferences
              </h3>

              {/* Roles */}
              <div className="mb-6">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 pb-2">
                  Desired Roles <span className="text-red-500">*</span>
                </p>
                <div
                  className={`flex flex-wrap gap-2 p-3 border ${
                    errors.roles && touched.roles
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-slate-300 dark:border-slate-600'
                  } rounded-lg bg-slate-50 dark:bg-slate-900 min-h-[48px]`}
                  onBlur={() => handleBlur('roles')}
                >
                  {formData.roles.map((role) => (
                    <span
                      key={role}
                      className="flex items-center gap-1.5 bg-[#3EC3BC]/20 dark:bg-[#0E7C8C]/30 text-[#0E7C8C] dark:text-[#3EC3BC] font-medium text-sm px-3 py-1.5 rounded-full"
                    >
                      {role}
                      <button
                        onClick={() => handleArrayRemove('roles', role as any)}
                        className="hover:bg-[#3EC3BC]/30 dark:hover:bg-[#0E7C8C]/50 rounded-full p-0.5 transition-colors"
                        aria-label={`Remove ${role}`}
                      >
                        <span className="material-symbols-outlined text-base">
                          close
                        </span>
                      </button>
                    </span>
                  ))}
                  <input
                    className="flex-1 min-w-[120px] bg-transparent focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-normal"
                    placeholder="Add a role..."
                    type="text"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        handleArrayAdd('roles', e.currentTarget.value.trim())
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                </div>
                {errors.roles && touched.roles && (
                  <p className="text-red-500 text-xs mt-1">{errors.roles}</p>
                )}
              </div>

              {/* Industries */}
              <div className="mb-6">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 pb-2">
                  Target Industries <span className="text-red-500">*</span>
                </p>
                <div
                  className={`flex flex-wrap gap-2 p-3 border ${
                    errors.industries && touched.industries
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-slate-300 dark:border-slate-600'
                  } rounded-lg bg-slate-50 dark:bg-slate-900 min-h-[48px]`}
                  onBlur={() => handleBlur('industries')}
                >
                  {formData.industries.map((ind) => (
                    <span
                      key={ind}
                      className="flex items-center gap-1.5 bg-[#3EC3BC]/20 dark:bg-[#0E7C8C]/30 text-[#0E7C8C] dark:text-[#3EC3BC] font-medium text-sm px-3 py-1.5 rounded-full"
                    >
                      {ind}
                      <button
                        onClick={() =>
                          handleArrayRemove('industries', ind as any)
                        }
                        className="hover:bg-[#3EC3BC]/30 dark:hover:bg-[#0E7C8C]/50 rounded-full p-0.5 transition-colors"
                        aria-label={`Remove ${ind}`}
                      >
                        <span className="material-symbols-outlined text-base">
                          close
                        </span>
                      </button>
                    </span>
                  ))}
                  <input
                    className="flex-1 min-w-[120px] bg-transparent focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-normal"
                    placeholder="Add an industry..."
                    type="text"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        handleArrayAdd(
                          'industries',
                          e.currentTarget.value.trim(),
                        )
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                </div>
                {errors.industries && touched.industries && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.industries}
                  </p>
                )}
              </div>

              {/* Salary */}
              <div className="mb-6">
                <label
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  htmlFor="salary"
                >
                  Minimum Salary Expectation{' '}
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4 mt-2">
                  <input
                    id="salary"
                    type="range"
                    min={30000}
                    max={250000}
                    step={1000}
                    value={formData.salary}
                    onChange={(e) =>
                      handleChange('salary', Number(e.target.value))
                    }
                    onBlur={() => handleBlur('salary')}
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#0E7C8C] ${
                      errors.salary && touched.salary
                        ? 'bg-red-200 dark:bg-red-900'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-lg whitespace-nowrap min-w-[100px] text-right">
                    ${formData.salary.toLocaleString()}
                  </span>
                </div>
                {errors.salary && touched.salary && (
                  <p className="text-red-500 text-xs mt-1">{errors.salary}</p>
                )}
              </div>

              {/* Locations */}
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 pb-2">
                  Preferred Work Locations{' '}
                  <span className="text-red-500">*</span>
                </p>
                <div
                  className={`flex flex-wrap gap-2 p-3 border ${
                    errors.locations && touched.locations
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-slate-300 dark:border-slate-600'
                  } rounded-lg bg-slate-50 dark:bg-slate-900 min-h-[48px]`}
                  onBlur={() => handleBlur('locations')}
                >
                  {formData.locations.map((loc) => (
                    <span
                      key={loc}
                      className="flex items-center gap-1.5 bg-[#3EC3BC]/20 dark:bg-[#0E7C8C]/30 text-[#0E7C8C] dark:text-[#3EC3BC] font-medium text-sm px-3 py-1.5 rounded-full"
                    >
                      {loc}
                      <button
                        onClick={() =>
                          handleArrayRemove('locations', loc as any)
                        }
                        className="hover:bg-[#3EC3BC]/30 dark:hover:bg-[#0E7C8C]/50 rounded-full p-0.5 transition-colors"
                        aria-label={`Remove ${loc}`}
                      >
                        <span className="material-symbols-outlined text-base">
                          close
                        </span>
                      </button>
                    </span>
                  ))}
                  <input
                    className="flex-1 min-w-[120px] bg-transparent focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-normal"
                    placeholder="Add a location..."
                    type="text"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        handleArrayAdd(
                          'locations',
                          e.currentTarget.value.trim(),
                        )
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                </div>
                {errors.locations && touched.locations && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.locations}
                  </p>
                )}
              </div>

              <div className="flex justify-end mt-auto pt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={handleSave}
                  disabled={profileMutation.isPending}
                  className="bg-[#0E7C8C] text-white font-semibold py-3 px-8 rounded-lg text-base hover:bg-[#3EC3BC] active:bg-[#0E7C8C]/90 focus:outline-none focus:ring-2 focus:ring-[#0E7C8C]/20 transition-colors shadow-lg shadow-[#0E7C8C]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {profileMutation.isPending ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-lg">
                        progress_activity
                      </span>
                      Saving...
                    </>
                  ) : (
                    'Save'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
