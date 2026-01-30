import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { CompanyProfileForm, companyProfileSchema } from '@/validations/company/profile'
import CompanySidebar from '@/components/companysidebar'
import {
  useCompanyProfile,
  useUpdateCompanyProfile,
} from '@/queries/company.queries'
import { ShimmerProfileForm } from '@/components/Shimmer'
import React from 'react'
import { showAlert, showToast } from '@/utils/swal'

export const Route = createFileRoute('/company/profile')({
  component: CompanyProfileSetup,
})

export default function CompanyProfileSetup() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: profileData, isLoading } = useCompanyProfile()
  const updateProfileMutation = useUpdateCompanyProfile()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CompanyProfileForm>({
    resolver: yupResolver(companyProfileSchema as any),
    defaultValues: {
      companyName: '',
      websiteUrl: '',
      industry: '',
      companySize: '',
      description: '',
      contactName: '',
      contactEmail: '',
      contactNumber: '',
      logo: null,
    },
  })

  // Watch logo for preview
  const logoFile = watch('logo')
  const logoPreview = logoFile
    ? URL.createObjectURL(logoFile)
    : profileData?.payload?.logoUrl || ''

  // Load existing profile data
  React.useEffect(() => {
    if (profileData?.payload) {
      const profile = profileData.payload
      reset({
        companyName: profile.companyName || '',
        websiteUrl: profile.websiteUrl || '',
        industry: profile.industry || '',
        companySize: profile.companySize || '',
        description: profile.description || '',
        contactName: profile.contactName || '',
        contactEmail: profile.contactEmail || '',
        contactNumber: profile.contactNumber || '',
        logo: null,
      })
    }
  }, [profileData, reset])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue('logo', file, { shouldValidate: true })
    }
  }

  const onSubmit = async (data: CompanyProfileForm) => {
    try {
      const { logo, ...profileData } = data

      await updateProfileMutation.mutateAsync({
        data: profileData,
        logoFile: logo || undefined,
      })

      showToast('Profile updated successfully!')
       navigate({ to: '/company/dashboard' })
    } catch (error) {
      console.error('Error updating profile:', error)
      showAlert({ title: 'Failed to update profile, Try again' })
    }
  }

  const handleReset = () => {
    if (profileData?.payload) {
      reset({
        companyName: profileData.payload.companyName || '',
        websiteUrl: profileData.payload.websiteUrl || '',
        industry: profileData.payload.industry || '',
        companySize: profileData.payload.companySize || '',
        description: profileData.payload.description || '',
        contactName: profileData.payload.contactName || '',
        contactEmail: profileData.payload.contactEmail || '',
        contactNumber: profileData.payload.contactNumber || '',
        logo: null,
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
        <CompanySidebar />
        <main className="flex-1 ml-64 px-4 py-8">
          <ShimmerProfileForm />
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 font-sans transition-colors">
      <CompanySidebar />

      <main className="flex-1 ml-64 px-4 py-8">
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Company Profile Setup
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Provide your company details to get started. This information will
              be visible to candidates.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Company Information Section */}
            <section className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 overflow-hidden mb-6">
              <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0E7C8C] to-[#3EC3BC] flex items-center justify-center shadow-lg shadow-[#0E7C8C]/20">
                    <span className="material-symbols-outlined text-white text-xl">
                      business
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Company Information
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Basic details about your organization
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 flex flex-col gap-6">
                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Company Logo{' '}
                    {logoFile && (
                      <span className="text-green-600">({logoFile.name})</span>
                    )}
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`group relative border-2 border-dashed rounded-2xl px-6 py-12 text-center transition-all cursor-pointer ${
                      errors.logo
                        ? 'border-red-500 dark:border-red-400 bg-red-50/50 dark:bg-red-900/10'
                        : 'border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-900/30 hover:border-[#0E7C8C] dark:hover:border-[#3EC3BC] hover:bg-[#3EC3BC]/5 dark:hover:bg-[#0E7C8C]/10'
                    }`}
                  >
                    {logoPreview ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="w-28 h-28 object-contain rounded-xl shadow-lg"
                          />
                          <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity text-3xl">
                              edit
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Click to change logo
                          </p>
                          {logoFile && (
                            <p className="text-xs text-slate-500 mt-1">
                              {(logoFile.size / 1024).toFixed(2)} KB •{' '}
                              {logoFile.type.split('/')[1].toUpperCase()}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="mb-4 relative">
                          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#3EC3BC]/20 to-[#0E7C8C]/20 dark:from-[#0E7C8C]/30 dark:to-[#3EC3BC]/30 flex items-center justify-center border border-[#3EC3BC]/30 dark:border-[#0E7C8C]/30 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[#0E7C8C] dark:text-[#3EC3BC] text-4xl">
                              cloud_upload
                            </span>
                          </div>
                        </div>
                        <p className="text-base font-bold text-slate-900 dark:text-white mb-1">
                          Upload Company Logo
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                          Drag & drop or{' '}
                          <span className="text-[#0E7C8C] dark:text-[#3EC3BC] font-semibold">
                            browse
                          </span>{' '}
                          to upload
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                  {errors.logo && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">
                        error
                      </span>
                      {errors.logo.message}
                    </p>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="companyName"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Company Name *
                    </label>
                    <input
                      id="companyName"
                      type="text"
                      placeholder="Enter company name"
                      {...register('companyName')}
                      className={`w-full h-11 rounded-lg border bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-colors ${
                        errors.companyName
                          ? 'border-red-500 dark:border-red-400 focus:ring-red-600/20 focus:border-red-600'
                          : 'border-slate-300 dark:border-slate-600 focus:ring-[#0E7C8C]/20 focus:border-[#0E7C8C]'
                      }`}
                    />
                    {errors.companyName && (
                      <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">
                          error
                        </span>
                        {errors.companyName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="websiteUrl"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Website URL *
                    </label>
                    <input
                      id="websiteUrl"
                      type="url"
                      placeholder="https://example.com"
                      {...register('websiteUrl')}
                      className={`w-full h-11 rounded-lg border bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-colors ${
                        errors.websiteUrl
                          ? 'border-red-500 dark:border-red-400 focus:ring-red-600/20 focus:border-red-600'
                          : 'border-slate-300 dark:border-slate-600 focus:ring-[#0E7C8C]/20 focus:border-[#0E7C8C]'
                      }`}
                    />
                    {errors.websiteUrl && (
                      <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">
                          error
                        </span>
                        {errors.websiteUrl.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="industry"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Industry *
                    </label>
                    <select
                      id="industry"
                      {...register('industry')}
                      className={`w-full h-11 rounded-lg border bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                        errors.industry
                          ? 'border-red-500 dark:border-red-400 focus:ring-red-600/20 focus:border-red-600'
                          : 'border-slate-300 dark:border-slate-600 focus:ring-[#0E7C8C]/20 focus:border-[#0E7C8C]'
                      }`}
                    >
                      <option value="">Select Industry</option>
                      <option value="Technology">Technology</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Education">Education</option>
                      <option value="Retail">Retail</option>
                    </select>
                    {errors.industry && (
                      <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">
                          error
                        </span>
                        {errors.industry.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="companySize"
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                    >
                      Company Size *
                    </label>
                    <select
                      id="companySize"
                      {...register('companySize')}
                      className={`w-full h-11 rounded-lg border bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                        errors.companySize
                          ? 'border-red-500 dark:border-red-400 focus:ring-red-600/20 focus:border-red-600'
                          : 'border-slate-300 dark:border-slate-600 focus:ring-[#0E7C8C]/20 focus:border-[#0E7C8C]'
                      }`}
                    >
                      <option value="">Select Company Size</option>
                      <option value="1-10">1–10 employees</option>
                      <option value="11-50">11–50 employees</option>
                      <option value="51-200">51–200 employees</option>
                      <option value="201-500">201–500 employees</option>
                      <option value="501+">501+ employees</option>
                    </select>
                    {errors.companySize && (
                      <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">
                          error
                        </span>
                        {errors.companySize.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Company Description *
                  </label>
                  <textarea
                    id="description"
                    placeholder="Tell us about your company, mission, and culture..."
                    {...register('description')}
                    rows={4}
                    className={`w-full rounded-lg border bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-colors resize-none ${
                      errors.description
                        ? 'border-red-500 dark:border-red-400 focus:ring-red-600/20 focus:border-red-600'
                        : 'border-slate-300 dark:border-slate-600 focus:ring-[#0E7C8C]/20 focus:border-[#0E7C8C]'
                    }`}
                  />
                  {errors.description && (
                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">
                        error
                      </span>
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Primary Contact section */}
            <section className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 overflow-hidden mb-6">
              <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0E7C8C] to-[#3EC3BC] flex items-center justify-center shadow-lg shadow-[#0E7C8C]/20">
                    <span className="material-symbols-outlined text-white text-xl">
                      person
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Primary Contact
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Contact information for your company
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="contactName"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Contact Name *
                  </label>
                  <input
                    id="contactName"
                    type="text"
                    placeholder="John Doe"
                    {...register('contactName')}
                    className={`w-full h-11 rounded-lg border bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-colors ${
                      errors.contactName
                        ? 'border-red-500 dark:border-red-400 focus:ring-red-600/20 focus:border-red-600'
                        : 'border-slate-300 dark:border-slate-600 focus:ring-[#0E7C8C]/20 focus:border-[#0E7C8C]'
                    }`}
                  />
                  {errors.contactName && (
                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">
                        error
                      </span>
                      {errors.contactName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="contactNumber"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Contact Phone *
                  </label>
                  <input
                    id="contactNumber"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    {...register('contactNumber')}
                    className={`w-full h-11 rounded-lg border bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-colors ${
                      errors.contactNumber
                        ? 'border-red-500 dark:border-red-400 focus:ring-red-600/20 focus:border-red-600'
                        : 'border-slate-300 dark:border-slate-600 focus:ring-[#0E7C8C]/20 focus:border-[#0E7C8C]'
                    }`}
                  />
                  {errors.contactNumber && (
                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">
                        error
                      </span>
                      {errors.contactNumber.message}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="contactEmail"
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                  >
                    Contact Email *
                  </label>
                  <input
                    id="contactEmail"
                    type="email"
                    placeholder="contact@company.com"
                    {...register('contactEmail')}
                    className={`w-full h-11 rounded-lg border bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-colors ${
                      errors.contactEmail
                        ? 'border-red-500 dark:border-red-400 focus:ring-red-600/20 focus:border-red-600'
                        : 'border-slate-300 dark:border-slate-600 focus:ring-[#0E7C8C]/20 focus:border-[#0E7C8C]'
                    }`}
                  />
                  {errors.contactEmail && (
                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">
                        error
                      </span>
                      {errors.contactEmail.message}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className="flex justify-end gap-3 pb-8">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center h-11 px-6 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500 transition-all"
                disabled={updateProfileMutation.isPending}
              >
                <span className="material-symbols-outlined text-lg mr-2">
                  refresh
                </span>
                Reset
              </button>
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="inline-flex items-center justify-center gap-2 h-11 px-8 rounded-xl bg-gradient-to-r from-[#0E7C8C] to-[#3EC3BC] text-white font-bold hover:from-[#3EC3BC] hover:to-[#0E7C8C] active:scale-95 transition-all shadow-xl shadow-[#0E7C8C]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-[#0E7C8C] disabled:hover:to-[#3EC3BC] disabled:active:scale-100"
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">
                      check_circle
                    </span>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
