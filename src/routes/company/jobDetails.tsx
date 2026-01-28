import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useJob, useDeleteJob, useToggleJobStatus } from '@/queries/job.queries'
import { z } from 'zod'
import CompanySidebar from '@/components/companysidebar'

import { showConfirm, showError, showToast, showSuccess } from '@/utils/swal'

const jobSearchSchema = z.object({
  id: z.string(),
})

export const Route = createFileRoute('/company/jobDetails')({
  component: JobDetails,

  validateSearch: jobSearchSchema,
})

export default function JobDetails() {
  const navigate = useNavigate()
  const { id } = Route.useSearch()
  const { data: job, isLoading, error } = useJob(id)
  const deleteJobMutation = useDeleteJob()
  const toggleStatusMutation = useToggleJobStatus()

  const handleToggleStatus = async () => {
    if (!job) return

    const newStatus = !job.isActive

    const result = await showConfirm({
      title: newStatus ? 'Reactivate Job?' : 'Close Job?',
      text: newStatus
        ? 'This job will become visible to candidates again.'
        : 'This job will no longer accept applications.',
      confirmButtonText: newStatus ? 'Yes, Reactivate' : 'Yes, Close Job',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) return

    try {
      await toggleStatusMutation.mutateAsync({
        jobId: id,
        isActive: newStatus,
      })

      showToast(
        newStatus ? 'Job reactivated successfully' : 'Job closed successfully',
        'success',
      )
    } catch (error: any) {
      showError(
        'Update Failed',
        error?.message || 'Unable to update job status',
      )
    }
  }
  const handleDeleteJob = async () => {
    const result = await showConfirm({
      title: 'Delete Job Posting?',
      text: 'This action cannot be undone.',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) return

    try {
      await deleteJobMutation.mutateAsync(id)

      await showSuccess(
        'Job Deleted',
        'The job posting has been deleted successfully.',
      )

      navigate({ to: '/company/jobs' })
    } catch (error: any) {
      showError('Deletion Failed', error?.message || 'Unable to delete the job')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatSalary = (min: number, max: number) => {
    return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`
  }

  // Loading state with shimmer
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <CompanySidebar />
        <main className="flex-1 ml-64 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
            {/* Breadcrumb Shimmer */}
            <div className="flex items-center gap-2">
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
              </div>
              <div className="h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
              </div>
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
              </div>
            </div>

            {/* Job Header Card Shimmer */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex gap-4 md:gap-6 flex-1">
                    <div className="h-20 w-20 md:h-24 md:w-24 bg-slate-200 dark:bg-slate-700 rounded-2xl relative overflow-hidden flex-shrink-0">
                      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                    </div>
                    <div className="flex flex-col gap-3 flex-1">
                      <div className="flex items-start gap-3 flex-wrap">
                        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded relative overflow-hidden">
                          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                        </div>
                        <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full relative overflow-hidden">
                          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-6">
                        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded relative overflow-hidden">
                          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                        </div>
                        <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded relative overflow-hidden">
                          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                        </div>
                        <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded relative overflow-hidden">
                          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-11 w-28 bg-slate-200 dark:bg-slate-700 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                    </div>
                    <div className="h-11 w-28 bg-slate-200 dark:bg-slate-700 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column Shimmer */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
                  <div className="h-6 w-40 bg-slate-200 dark:bg-slate-700 rounded mb-6 relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                  </div>
                  <div className="space-y-3 mb-8">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded relative overflow-hidden"
                        style={{ width: i === 4 ? '80%' : '100%' }}
                      >
                        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                      </div>
                    ))}
                  </div>
                  <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="h-5 w-56 bg-slate-200 dark:bg-slate-700 rounded mb-4 relative overflow-hidden">
                      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                    </div>
                    <div className="space-y-3">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded relative overflow-hidden"
                        >
                          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="h-5 w-64 bg-slate-200 dark:bg-slate-700 rounded mb-4 relative overflow-hidden">
                      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded-lg relative overflow-hidden"
                        >
                          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column Shimmer */}
              <div className="space-y-6">
                {/* Job Details Shimmer */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-6 relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                  </div>
                  <div className="space-y-5">
                    {[...Array(5)].map((_, i) => (
                      <div key={i}>
                        <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded mb-2 relative overflow-hidden">
                          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                        </div>
                        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded relative overflow-hidden">
                          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-slate-500/60 to-transparent" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Danger Zone Shimmer */}
                <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl border-2 border-red-200 dark:border-red-800 p-6">
                  <div className="h-4 w-24 bg-red-200 dark:bg-red-800 rounded mb-2 relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-red-100/90 dark:via-red-700/60 to-transparent" />
                  </div>
                  <div className="h-3 w-full bg-red-200 dark:bg-red-800 rounded mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-red-100/90 dark:via-red-700/60 to-transparent" />
                  </div>
                  <div className="h-12 w-full bg-red-200 dark:bg-red-800 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-red-100/90 dark:via-red-700/60 to-transparent" />
                  </div>
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
                  : 'The job you are looking for could not be found.'}
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
      {/* Sidebar */}
      <CompanySidebar />

      {/* Main Content - with left margin to account for fixed sidebar */}
      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm">
            <Link
              to="/company/jobs"
              className="text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors"
            >
              Job Postings
            </Link>
            <span className="material-symbols-outlined text-gray-400 text-lg">
              chevron_right
            </span>
            <span className="text-gray-900 dark:text-white font-medium">
              {job.title}
            </span>
          </nav>

          {/* Job Header Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex gap-4 md:gap-6 flex-1">
                  <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl h-20 w-20 md:h-24 md:w-24 flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="material-symbols-outlined text-white text-4xl md:text-5xl">
                      rocket_launch
                    </span>
                  </div>
                  <div className="flex flex-col gap-3 flex-1 min-w-0">
                    <div className="flex items-start gap-3 flex-wrap">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                        {job.title}
                      </h1>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${
                          job.isActive
                            ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${job.isActive ? 'bg-teal-500' : 'bg-gray-500'}`}
                        ></span>
                        {job.isActive ? 'Active' : 'Closed'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600 dark:text-gray-400 text-sm">
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">
                          calendar_today
                        </span>
                        <span>Posted {formatDate(job.createdAt)}</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">
                          location_on
                        </span>
                        <span>{job.location}</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">
                          payments
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatSalary(job.minSalary, job.maxSalary)}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                  <button
                    onClick={() =>
                      navigate({
                        to: '/company/editJob',
                        search: { id: job._id },
                      })
                    }
                    className="flex items-center justify-center gap-2 rounded-lg h-11 px-5 bg-teal-600 dark:bg-teal-600 text-white font-semibold hover:bg-teal-700 dark:hover:bg-teal-700 transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-xl">
                      edit
                    </span>
                    Edit Job
                  </button>
                  <button
                    onClick={handleToggleStatus}
                    disabled={toggleStatusMutation.isPending}
                    className={`flex items-center justify-center gap-2 rounded-lg h-11 px-5 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      job.isActive
                        ? 'border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        : 'bg-teal-600 text-white hover:bg-teal-700'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {job.isActive ? 'block' : 'check_circle'}
                    </span>
                    {toggleStatusMutation.isPending
                      ? 'Updating...'
                      : job.isActive
                        ? 'Close Job'
                        : 'Reactivate Job'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Description */}
              <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <div className="w-1 h-6 bg-teal-600 rounded-full"></div>
                  Job Description
                </h2>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {job.description}
                  </p>
                </div>

                {/* Qualifications */}
                {job.qualifications && job.qualifications.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      Qualifications & Requirements
                    </h3>
                    <ul className="space-y-3">
                      {job.qualifications.map((qual, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-gray-600 dark:text-gray-300"
                        >
                          <span className="material-symbols-outlined text-teal-600 dark:text-teal-400 text-xl mt-0.5 flex-shrink-0">
                            check_circle
                          </span>
                          <span className="leading-relaxed">{qual}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Skills */}
                {job.skills && job.skills.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      Required Skills & Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 rounded-lg text-sm font-semibold border border-teal-200 dark:border-teal-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Job Details */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">
                    info
                  </span>
                  Job Details
                </h3>
                <div className="space-y-5">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                      Job Type
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {job.jobType}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                      Experience Level
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {job.experienceLevel}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                      Salary Range
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatSalary(job.minSalary, job.maxSalary)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                      Location
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {job.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                      Last Updated
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatDate(job.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl border-2 border-red-200 dark:border-red-800 p-6">
                <h3 className="text-sm font-bold text-red-900 dark:text-red-300 mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">
                    warning
                  </span>
                  Danger Zone
                </h3>
                <p className="text-xs text-red-700 dark:text-red-400 mb-4 leading-relaxed">
                  Once you delete this job, there is no going back. Please be
                  certain.
                </p>
                <button
                  onClick={handleDeleteJob}
                  disabled={deleteJobMutation.isPending}
                  className="w-full py-3 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {deleteJobMutation.isPending
                    ? 'Deleting...'
                    : 'Delete Job Posting'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
