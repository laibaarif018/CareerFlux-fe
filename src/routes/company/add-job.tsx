import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import CompanySidebar from '@/components/companysidebar'
import { useCreateJob } from '@/queries/job.queries'
import { jobSchema } from '@/validations/company/job'


export const Route = createFileRoute('/company/add-job')({
  component: AddJob,
})
type JobFormData = {
  title: string
  companyName: string
  location: string
  description: string
  experienceLevel: string
  jobType: string
  minSalary: number
  maxSalary: number
  skills: string[]
  qualifications: string[]
}


export default function AddJob() {
  const navigate = useNavigate()
  const createJobMutation = useCreateJob()

  const [skillInput, setSkillInput] = useState('')
  const [qualificationInput, setQualificationInput] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: yupResolver(jobSchema),
    defaultValues: {
      title: '',
      companyName: '',
      location: '',
      description: '',
      experienceLevel: '',
      jobType: '',
      minSalary: 0,
      maxSalary: 0,
      skills: [],
      qualifications: [],
    },
  })

  const skills = watch('skills') || []
  const qualifications = watch('qualifications') || []

  const addSkill = () => {
    if (!skillInput.trim()) return
    setValue('skills', [...skills, skillInput.trim()], { shouldValidate: true })
    setSkillInput('')
  }

  const removeSkill = (skillToRemove: string) => {
    setValue(
      'skills',
      skills.filter((s) => s !== skillToRemove),
      { shouldValidate: true },
    )
  }

  const addQualification = () => {
    if (!qualificationInput.trim()) return
    setValue('qualifications', [...qualifications, qualificationInput.trim()], {
      shouldValidate: true,
    })
    setQualificationInput('')
  }

  const removeQualification = (qualToRemove: string) => {
    setValue(
      'qualifications',
      qualifications.filter((q) => q !== qualToRemove),
      { shouldValidate: true },
    )
  }

  const onSubmit = async (data: JobFormData) => {
    try {
      console.log('📤 Submitting job:', data)
      console.log('📊 Form data types:', {
        minSalary: typeof data.minSalary,
        maxSalary: typeof data.maxSalary,
        skills: Array.isArray(data.skills),
        qualifications: Array.isArray(data.qualifications),
      })

      // Ensure numbers are properly converted
      const jobData = {
        ...data,
        minSalary: Number(data.minSalary),
        maxSalary: Number(data.maxSalary),
      }

      console.log('📤 Final job data:', jobData)

      await createJobMutation.mutateAsync(jobData)
      console.log('✅ Job created successfully')
      navigate({ to: '/company/jobs' })
    } catch (error) {
      console.error('❌ Failed to create job:', error)
      console.error('Error details:', error)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <CompanySidebar />

      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Add New Job Posting
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Fill out the form below to create a new job posting
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Job Details Section */}
            <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8 shadow-sm mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600 dark:text-teal-400">
                  work
                </span>
                Job Details
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Job Title *
                  </label>
                  <input
                    id="title"
                    placeholder="e.g. Senior Software Engineer"
                    {...register('title')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 transition-all ${
                      errors.title
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">
                        error
                      </span>
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="companyName"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Company Name *
                  </label>
                  <input
                    id="companyName"
                    placeholder="e.g. Tech Corp"
                    {...register('companyName')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 transition-all ${
                      errors.companyName
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.companyName && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">
                        error
                      </span>
                      {errors.companyName.message}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="location"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Location *
                  </label>
                  <input
                    id="location"
                    placeholder="e.g. New York, NY, Remote/Onsite"
                    {...register('location')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 transition-all ${
                      errors.location
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.location && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">
                        error
                      </span>
                      {errors.location.message}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Description Section */}
            <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8 shadow-sm mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600 dark:text-teal-400">
                  description
                </span>
                Job Description
              </h2>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Description *
              </label>
              <textarea
                id="description"
                placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
                {...register('description')}
                className={`w-full min-h-[200px] px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 resize-y transition-all ${
                  errors.description
                    ? 'border-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">
                    error
                  </span>
                  {errors.description.message}
                </p>
              )}
            </section>

            {/* Additional Information Section */}
            <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8 shadow-sm mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600 dark:text-teal-400">
                  info
                </span>
                Additional Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="experienceLevel"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Experience Level *
                  </label>
                  <select
                    id="experienceLevel"
                    {...register('experienceLevel')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all ${
                      errors.experienceLevel
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <option value="">Select Experience Level</option>
                    <option value="Entry">Entry-level</option>
                    <option value="Mid">Mid-level</option>
                    <option value="Senior">Senior-level</option>
                    <option value="Lead">Lead/Principal</option>
                  </select>
                  {errors.experienceLevel && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">
                        error
                      </span>
                      {errors.experienceLevel.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="jobType"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Job Type *
                  </label>
                  <select
                    id="jobType"
                    {...register('jobType')}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all ${
                      errors.jobType
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <option value="">Select Job Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                  {errors.jobType && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">
                        error
                      </span>
                      {errors.jobType.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="minSalary"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Minimum Salary ($) *
                  </label>
                  <input
                    id="minSalary"
                    placeholder="70000"
                    type="number"
                    {...register('minSalary', { valueAsNumber: true })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 transition-all ${
                      errors.minSalary
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.minSalary && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">
                        error
                      </span>
                      {errors.minSalary.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="maxSalary"
                    className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Maximum Salary ($) *
                  </label>
                  <input
                    id="maxSalary"
                    placeholder="120000"
                    type="number"
                    {...register('maxSalary', { valueAsNumber: true })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 transition-all ${
                      errors.maxSalary
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errors.maxSalary && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">
                        error
                      </span>
                      {errors.maxSalary.message}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Skills & Qualifications Section */}
            <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 md:p-8 shadow-sm mb-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600 dark:text-teal-400">
                  verified
                </span>
                Skills & Qualifications
              </h2>

              {/* Skills */}
              <div className="mb-6">
                <label
                  htmlFor="skills"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Required Skills *
                </label>
                <div
                  className={`flex flex-wrap gap-2 mb-3 min-h-[60px] p-3 border rounded-lg bg-gray-50 dark:bg-gray-900/50 ${
                    errors.skills
                      ? 'border-red-500'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {skills.length > 0 ? (
                    skills.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 rounded-lg text-sm font-semibold border border-teal-200 dark:border-teal-800"
                      >
                        {s}
                        <button
                          type="button"
                          onClick={() => removeSkill(s)}
                          className="hover:bg-teal-200 dark:hover:bg-teal-900/50 rounded-full p-0.5 transition-colors"
                          aria-label="Remove skill"
                        >
                          <span className="material-symbols-outlined text-base">
                            close
                          </span>
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400 dark:text-gray-500">
                      No skills added yet
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    id="skills"
                    placeholder="Type a skill (e.g., JavaScript, React, Node.js)"
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addSkill()
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold transition-all"
                  >
                    Add
                  </button>
                </div>
                {errors.skills && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">
                      error
                    </span>
                    {errors.skills.message}
                  </p>
                )}
              </div>

              {/* Qualifications */}
              <div>
                <label
                  htmlFor="qualifications"
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
                >
                  Qualifications *
                </label>
                <div
                  className={`flex flex-wrap gap-2 mb-3 min-h-[60px] p-3 border rounded-lg bg-gray-50 dark:bg-gray-900/50 ${
                    errors.qualifications
                      ? 'border-red-500'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {qualifications.length > 0 ? (
                    qualifications.map((q) => (
                      <span
                        key={q}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200 rounded-lg text-sm font-semibold border border-teal-200 dark:border-teal-800"
                      >
                        {q}
                        <button
                          type="button"
                          onClick={() => removeQualification(q)}
                          className="hover:bg-teal-200 dark:hover:bg-teal-900/50 rounded-full p-0.5 transition-colors"
                          aria-label="Remove qualification"
                        >
                          <span className="material-symbols-outlined text-base">
                            close
                          </span>
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400 dark:text-gray-500">
                      No qualifications added yet
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    id="qualifications"
                    placeholder="Type a qualification (e.g., Bachelor's degree, 5+ years experience)"
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 transition-all"
                    value={qualificationInput}
                    onChange={(e) => setQualificationInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addQualification()
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addQualification}
                    className="px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold transition-all"
                  >
                    Add
                  </button>
                </div>
                {errors.qualifications && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">
                      error
                    </span>
                    {errors.qualifications.message}
                  </p>
                )}
              </div>
            </section>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pb-8">
              <button
                type="button"
                onClick={() => navigate({ to: '/company/jobs' })}
                disabled={createJobMutation.isPending}
                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createJobMutation.isPending}
                className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold transition-all shadow-lg shadow-teal-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createJobMutation.isPending ? (
                  <span className="inline-flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl">
                      add_circle
                    </span>
                    Create Job Posting
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
