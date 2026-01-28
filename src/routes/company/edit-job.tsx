import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useJob, useUpdateJob } from '@/queries/job.queries'
import { z } from 'zod'
import CompanySidebar from '@/components/companysidebar'
import { showSuccess, showError, showConfirm } from '@/utils/swal'

const jobSearchSchema = z.object({
  id: z.string(),
})

export const Route = createFileRoute('/company/edit-job')({
  component: EditJob,

  validateSearch: jobSearchSchema,
})

export default function EditJob() {
  const navigate = useNavigate()
  const { id } = Route.useSearch()
  const { data: job, isLoading, error } = useJob(id)
  const updateJobMutation = useUpdateJob()

  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    location: '',
    description: '',
    experienceLevel: '',
    jobType: '',
    minSalary: '',
    maxSalary: '',
    skills: [] as string[],
    qualifications: [] as string[],
  })

  const [skillInput, setSkillInput] = useState('')
  const [qualificationInput, setQualificationInput] = useState('')
  const [skillError, setSkillError] = useState('')
  const [qualificationError, setQualificationError] = useState('')

  // Pre-fill form when job data is loaded
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        companyName: job.companyName || '',
        location: job.location || '',
        description: job.description || '',
        experienceLevel: job.experienceLevel || '',
        jobType: job.jobType || '',
        minSalary: job.minSalary?.toString() || '',
        maxSalary: job.maxSalary?.toString() || '',
        skills: job.skills || [],
        qualifications: job.qualifications || [],
      })
    }
  }, [job])

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddSkill = () => {
    if (!skillInput.trim()) {
      setSkillError('Please enter a skill before adding')
      return
    }
    setSkillError('')
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, skillInput.trim()],
    }))
    setSkillInput('')
  }

  const handleRemoveSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
  }

  const handleAddQualification = () => {
    if (!qualificationInput.trim()) {
      setQualificationError('Please enter a qualification before adding')
      return
    }
    setQualificationError('')
    setFormData((prev) => ({
      ...prev,
      qualifications: [...prev.qualifications, qualificationInput.trim()],
    }))
    setQualificationInput('')
  }

  const handleRemoveQualification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await showConfirm({
      title: 'Update Job Posting?',
      text: 'Are you sure you want to save these changes?',
      confirmButtonText: 'Yes, Update',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) return

    try {
      await updateJobMutation.mutateAsync({
        jobId: id,
        data: {
          ...formData,
          minSalary: Number(formData.minSalary),
          maxSalary: Number(formData.maxSalary),
        },
      })

      await showSuccess(
        'Job Updated',
        'The job posting has been updated successfully.',
      )

      navigate({ to: '/company/job-details', search: { id } })
    } catch (error: any) {
      showError(
        'Update Failed',
        error?.message || 'Unable to update the job posting.',
      )
    }
  }

  // Loading state with shimmer
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <CompanySidebar />
        <main className="flex-1 ml-64 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6 md:p-8">
            {/* Header Shimmer */}
            <div className="mb-8">
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-4 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
              </div>
              <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded mb-2 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
              </div>
              <div className="h-4 w-96 bg-slate-200 dark:bg-slate-700 rounded relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
              </div>
            </div>

            <div className="space-y-6">
              {/* Basic Information Shimmer */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
                <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                </div>
                <div className="space-y-5">
                  {[...Array(6)].map((_, i) => (
                    <div key={i}>
                      <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-2 relative overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                      </div>
                      <div className="h-12 w-full bg-slate-200 dark:bg-slate-700 rounded-lg relative overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description Shimmer */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
                <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                </div>
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-2 relative overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                </div>
                <div className="h-48 w-full bg-slate-200 dark:bg-slate-700 rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                </div>
              </div>

              {/* Skills Shimmer */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
                <div className="h-6 w-36 bg-slate-200 dark:bg-slate-700 rounded mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                  </div>
                  <div className="w-24 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                  </div>
                </div>
              </div>

              {/* Qualifications Shimmer */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
                <div className="h-6 w-56 bg-slate-200 dark:bg-slate-700 rounded mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                  </div>
                  <div className="w-24 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                  </div>
                </div>
              </div>

              {/* Action Buttons Shimmer */}
              <div className="flex gap-4 justify-end pt-4">
                <div className="w-24 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                </div>
                <div className="w-44 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Error state
  if (error || !job) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <CompanySidebar />
        <div className="flex-1 flex items-center justify-center p-8 ml-64">
          <div className="flex flex-col items-center gap-6 text-center max-w-md">
            <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-6xl text-red-600 dark:text-red-400">
                error
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Job Not Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {error instanceof Error
                  ? error.message
                  : 'The job you are trying to edit could not be found.'}
              </p>
            </div>
            <button
              onClick={() => navigate({ to: '/company/jobs' })}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">
                arrow_back
              </span>
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <CompanySidebar />

      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() =>
                navigate({ to: '/company/job-details', search: { id } })
              }
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 font-medium mb-4 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">
                arrow_back
              </span>
              Back to Job Details
            </button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Edit Job Posting
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Update the details for {job.title}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <div className="w-1 h-6 bg-teal-600 rounded-full"></div>
                Basic Information
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g. Senior Frontend Developer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g. TechCorp Inc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g. San Francisco, CA (Remote)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Job Type *
                    </label>
                    <select
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Select Job Type</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Experience Level *
                    </label>
                    <select
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Select Experience Level</option>
                      <option value="Entry">Entry</option>
                      <option value="Mid">Mid</option>
                      <option value="Senior">Senior</option>
                      <option value="Lead">Lead</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Minimum Salary ($) *
                    </label>
                    <input
                      type="number"
                      name="minSalary"
                      value={formData.minSalary}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                      placeholder="e.g. 80000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Maximum Salary ($) *
                    </label>
                    <input
                      type="number"
                      name="maxSalary"
                      value={formData.maxSalary}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                      placeholder="e.g. 120000"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <div className="w-1 h-6 bg-teal-600 rounded-full"></div>
                Job Description
              </h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={8}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none transition-all"
                  placeholder="Provide a detailed description of the role, responsibilities, and what makes this position exciting..."
                />
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <div className="w-1 h-6 bg-teal-600 rounded-full"></div>
                Required Skills
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => {
                        setSkillInput(e.target.value)
                        if (skillError) setSkillError('')
                      }}
                      onKeyPress={(e) =>
                        e.key === 'Enter' &&
                        (e.preventDefault(), handleAddSkill())
                      }
                      className={`flex-1 px-4 py-3 rounded-lg border ${
                        skillError
                          ? 'border-red-500 dark:border-red-500'
                          : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all`}
                      placeholder="e.g. React, TypeScript, Node.js"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-xl">
                        add
                      </span>
                      Add
                    </button>
                  </div>
                  {skillError && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">
                        error
                      </span>
                      {skillError}
                    </p>
                  )}
                </div>

                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 rounded-lg text-sm font-semibold border border-teal-200 dark:border-teal-800"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(index)}
                          className="hover:text-teal-900 dark:hover:text-teal-100 transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">
                            close
                          </span>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Qualifications */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <div className="w-1 h-6 bg-teal-600 rounded-full"></div>
                Qualifications & Requirements
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={qualificationInput}
                      onChange={(e) => {
                        setQualificationInput(e.target.value)
                        if (qualificationError) setQualificationError('')
                      }}
                      onKeyPress={(e) =>
                        e.key === 'Enter' &&
                        (e.preventDefault(), handleAddQualification())
                      }
                      className={`flex-1 px-4 py-3 rounded-lg border ${
                        qualificationError
                          ? 'border-red-500 dark:border-red-500'
                          : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all`}
                      placeholder="e.g. 5+ years of experience in frontend development"
                    />
                    <button
                      type="button"
                      onClick={handleAddQualification}
                      className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-xl">
                        add
                      </span>
                      Add
                    </button>
                  </div>
                  {qualificationError && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">
                        error
                      </span>
                      {qualificationError}
                    </p>
                  )}
                </div>

                {formData.qualifications.length > 0 && (
                  <ul className="space-y-3">
                    {formData.qualifications.map((qual, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <span className="material-symbols-outlined text-teal-600 dark:text-teal-400 text-xl mt-0.5 flex-shrink-0">
                          check_circle
                        </span>
                        <span className="flex-1 text-gray-700 dark:text-gray-300">
                          {qual}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveQualification(index)}
                          className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                          <span className="material-symbols-outlined text-xl">
                            close
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end pt-4">
              <button
                type="button"
                onClick={() =>
                  navigate({ to: '/company/job-details', search: { id } })
                }
                className="px-6 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateJobMutation.isPending}
                className="px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
              >
                {updateJobMutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-xl">
                      save
                    </span>
                    Update Job Posting
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
