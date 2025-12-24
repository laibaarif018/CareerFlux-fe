import UserHeader from '@/components/UserHeader'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ProtectedRoute } from '@/components/PRoutes'
import { useGetProfile, useProfile } from '@/hooks/useUser';

export const Route = createFileRoute('/profile')({
  component: () => (
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  ),
})

export default function Profile() {
  const navigate = useNavigate()
  const { data, isLoading } = useGetProfile()
  const profileMutation = useProfile()

  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    experienceLevel: 'mid',
  })

  const [preferences, setPreferences] = useState({
    roles: [] as string[],
    industries: [] as string[],
    locations: [] as string[],
    salary: 0,
  })

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    location: '',
    roles: '',
    industries: '',
    locations: '',
    salary: '',
  })

  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    location: false,
    roles: false,
    industries: false,
    locations: false,
    salary: false,
  })

  /* Populate data from backend */
  useEffect(() => {
    if (data?.payload?.user) {
      const user = data.payload.user

      setPersonalInfo({
        name: user.name ?? '',
        email: user.email ?? '',
        phone: user.phoneNumber ?? '',
        location: user.location ?? '',
        experienceLevel: user.experienceLevel ?? 'mid',
      })

      setPreferences({
        roles: user.preferredRoles ?? [],
        industries: user.preferredIndustries ?? [],
        locations: user.preferredLocations ?? [],
        salary: user.minimumSalaryExpected ?? 0,
      })
    }
  }, [data])

  const validateField = (field: string, value: any) => {
    switch (field) {
      case 'name':
        return value.trim() === '' ? 'Full name is required' : ''
      case 'phone':
        return value.trim() === '' ? 'Phone number is required' : ''
      case 'location':
        return value.trim() === '' ? 'Location is required' : ''
      case 'roles':
        return value.length === 0 ? 'At least one role is required' : ''
      case 'industries':
        return value.length === 0 ? 'At least one industry is required' : ''
      case 'locations':
        return value.length === 0 ? 'At least one work location is required' : ''
      case 'salary':
        return value === 0 ? 'Please set a minimum salary expectation' : ''
      default:
        return ''
    }
  }

  const handlePersonalChange = (field: string, value: string) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }))
    if (touched[field as keyof typeof touched]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }))
    }
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const value = field === 'roles' || field === 'industries' || field === 'locations'
      ? preferences[field as keyof typeof preferences]
      : field === 'salary'
      ? preferences.salary
      : personalInfo[field as keyof typeof personalInfo]
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }))
  }

  const handlePreferenceAdd = (category: string, value: string) => {
    setPreferences((prev) => {
      const updated = {
        ...prev,
        [category]: Array.isArray(prev[category as keyof typeof prev])
          ? [...(prev[category as keyof typeof prev] as string[]), value]
          : prev[category as keyof typeof prev],
      }
      if (touched[category as keyof typeof touched]) {
        setErrors((e) => ({ ...e, [category]: validateField(category, updated[category as keyof typeof updated]) }))
      }
      return updated
    })
  }

  const handlePreferenceRemove = (category: string, value: string) => {
    setPreferences((prev) => {
      const updated = {
        ...prev,
        [category]: Array.isArray(prev[category as keyof typeof prev])
          ? (prev[category as keyof typeof prev] as string[]).filter((v) => v !== value)
          : prev[category as keyof typeof prev],
      }
      if (touched[category as keyof typeof touched]) {
        setErrors((e) => ({ ...e, [category]: validateField(category, updated[category as keyof typeof updated]) }))
      }
      return updated
    })
  }

  const handleSalaryChange = (value: number) => {
    setPreferences({ ...preferences, salary: value })
    if (touched.salary) {
      setErrors((prev) => ({ ...prev, salary: validateField('salary', value) }))
    }
  }

  const validateAll = () => {
    const newErrors = {
      name: validateField('name', personalInfo.name),
      phone: validateField('phone', personalInfo.phone),
      location: validateField('location', personalInfo.location),
      roles: validateField('roles', preferences.roles),
      industries: validateField('industries', preferences.industries),
      locations: validateField('locations', preferences.locations),
      salary: validateField('salary', preferences.salary),
    }
    
    setErrors(newErrors)
    setTouched({
      name: true,
      phone: true,
      location: true,
      roles: true,
      industries: true,
      locations: true,
      salary: true,
    })

    return !Object.values(newErrors).some((error) => error !== '')
  }

  const handleSave = () => {
    if (!validateAll()) {
      return
    }

    profileMutation.mutate(
      {
        name: personalInfo.name,
        phoneNumber: personalInfo.phone,
        location: personalInfo.location,
        experienceLevel: personalInfo.experienceLevel,
        preferredRoles: preferences.roles,
        preferredIndustries: preferences.industries,
        preferredLocations: preferences.locations,
        minimumSalaryExpected: preferences.salary,
      },
      {
        onSuccess: () => {
          navigate({ to: '/dashboard' })
        },
      },
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0E7C8C]"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors"
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
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
                      value={personalInfo.name}
                      onChange={(e) => handlePersonalChange('name', e.target.value)}
                      onBlur={() => handleBlur('name')}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 dark:text-slate-500 pointer-events-none">
                      <span className="material-symbols-outlined text-xl">edit</span>
                    </div>
                  </div>
                  {errors.name && touched.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </label>

                <label className="flex flex-col">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 pb-2">
                    Email
                  </p>
                  <div className="relative flex w-full flex-1 items-stretch">
                    <input
                      className="flex w-full min-w-0 flex-1 rounded-lg text-slate-900 dark:text-white focus:outline-none border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-900/50 h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 pr-10 text-base font-normal transition-colors cursor-not-allowed"
                      value={personalInfo.email}
                      readOnly
                      disabled
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 dark:text-slate-500 pointer-events-none">
                      <span className="material-symbols-outlined text-xl">lock</span>
                    </div>
                  </div>
                </label>

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
                      value={personalInfo.phone}
                      onChange={(e) => handlePersonalChange('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 dark:text-slate-500 pointer-events-none">
                      <span className="material-symbols-outlined text-xl">edit</span>
                    </div>
                  </div>
                  {errors.phone && touched.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </label>

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
                      value={personalInfo.location}
                      onChange={(e) => handlePersonalChange('location', e.target.value)}
                      onBlur={() => handleBlur('location')}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 dark:text-slate-500 pointer-events-none">
                      <span className="material-symbols-outlined text-xl">edit</span>
                    </div>
                  </div>
                  {errors.location && touched.location && (
                    <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                  )}
                </label>

                <label className="flex flex-col">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 pb-2">
                    Experience Level
                  </p>
                  <div className="relative">
                    <select
                      value={personalInfo.experienceLevel}
                      onChange={(e) => handlePersonalChange('experienceLevel', e.target.value)}
                      className="flex w-full rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0E7C8C]/20 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 h-12 px-4 pr-10 text-base font-normal transition-colors appearance-none cursor-pointer"
                    >
                      <option value="fresher">Fresher</option>
                      <option value="junior">Junior</option>
                      <option value="mid">Mid-Level</option>
                      <option value="senior">Senior</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500 dark:text-slate-400">
                      <span className="material-symbols-outlined text-xl">unfold_more</span>
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
                  {preferences.roles.map((role) => (
                    <span
                      key={role}
                      className="flex items-center gap-1.5 bg-[#3EC3BC]/20 dark:bg-[#0E7C8C]/30 text-[#0E7C8C] dark:text-[#3EC3BC] font-medium text-sm px-3 py-1.5 rounded-full"
                    >
                      {role}
                      <button
                        onClick={() => handlePreferenceRemove('roles', role)}
                        className="hover:bg-[#3EC3BC]/30 dark:hover:bg-[#0E7C8C]/50 rounded-full p-0.5 transition-colors"
                        aria-label={`Remove ${role}`}
                      >
                        <span className="material-symbols-outlined text-base">close</span>
                      </button>
                    </span>
                  ))}
                  <input
                    className="flex-1 min-w-[120px] bg-transparent focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-normal"
                    placeholder="Add a role..."
                    type="text"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        handlePreferenceAdd('roles', e.currentTarget.value.trim())
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
                  {preferences.industries.map((ind) => (
                    <span
                      key={ind}
                      className="flex items-center gap-1.5 bg-[#3EC3BC]/20 dark:bg-[#0E7C8C]/30 text-[#0E7C8C] dark:text-[#3EC3BC] font-medium text-sm px-3 py-1.5 rounded-full"
                    >
                      {ind}
                      <button
                        onClick={() => handlePreferenceRemove('industries', ind)}
                        className="hover:bg-[#3EC3BC]/30 dark:hover:bg-[#0E7C8C]/50 rounded-full p-0.5 transition-colors"
                        aria-label={`Remove ${ind}`}
                      >
                        <span className="material-symbols-outlined text-base">close</span>
                      </button>
                    </span>
                  ))}
                  <input
                    className="flex-1 min-w-[120px] bg-transparent focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-normal"
                    placeholder="Add an industry..."
                    type="text"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        handlePreferenceAdd('industries', e.currentTarget.value.trim())
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                </div>
                {errors.industries && touched.industries && (
                  <p className="text-red-500 text-xs mt-1">{errors.industries}</p>
                )}
              </div>

              {/* Salary */}
              <div className="mb-6">
                <label
                  className="text-sm font-medium text-slate-700 dark:text-slate-300"
                  htmlFor="salary"
                >
                  Minimum Salary Expectation <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4 mt-2">
                  <input
                    id="salary"
                    type="range"
                    min={30000}
                    max={250000}
                    step={1000}
                    value={preferences.salary}
                    onChange={(e) => handleSalaryChange(Number(e.target.value))}
                    onBlur={() => handleBlur('salary')}
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#0E7C8C] ${
                      errors.salary && touched.salary
                        ? 'bg-red-200 dark:bg-red-900'
                        : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-lg whitespace-nowrap min-w-[100px] text-right">
                    ${preferences.salary.toLocaleString()}
                  </span>
                </div>
                {errors.salary && touched.salary && (
                  <p className="text-red-500 text-xs mt-1">{errors.salary}</p>
                )}
              </div>

              {/* Locations */}
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 pb-2">
                  Preferred Work Locations <span className="text-red-500">*</span>
                </p>
                <div
                  className={`flex flex-wrap gap-2 p-3 border ${
                    errors.locations && touched.locations
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-slate-300 dark:border-slate-600'
                  } rounded-lg bg-slate-50 dark:bg-slate-900 min-h-[48px]`}
                  onBlur={() => handleBlur('locations')}
                >
                  {preferences.locations.map((loc) => (
                    <span
                      key={loc}
                      className="flex items-center gap-1.5 bg-[#3EC3BC]/20 dark:bg-[#0E7C8C]/30 text-[#0E7C8C] dark:text-[#3EC3BC] font-medium text-sm px-3 py-1.5 rounded-full"
                    >
                      {loc}
                      <button
                        onClick={() => handlePreferenceRemove('locations', loc)}
                        className="hover:bg-[#3EC3BC]/30 dark:hover:bg-[#0E7C8C]/50 rounded-full p-0.5 transition-colors"
                        aria-label={`Remove ${loc}`}
                      >
                        <span className="material-symbols-outlined text-base">close</span>
                      </button>
                    </span>
                  ))}
                  <input
                    className="flex-1 min-w-[120px] bg-transparent focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 font-normal"
                    placeholder="Add a location..."
                    type="text"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        handlePreferenceAdd('locations', e.currentTarget.value.trim())
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                </div>
                {errors.locations && touched.locations && (
                  <p className="text-red-500 text-xs mt-1">{errors.locations}</p>
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