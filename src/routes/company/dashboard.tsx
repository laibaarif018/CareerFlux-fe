import { createFileRoute, useNavigate } from '@tanstack/react-router'
import CompanySidebar from '@/components/companysidebar'
import { useCompanyJobs } from '@/queries/job.queries'
import { requireRole } from '@/utils/RouteGuard'
import {
  ShimmerDashboardStats,
  ShimmerDashboardTable,
} from '@/components/Shimmer'

export const Route = createFileRoute('/company/dashboard')({
  beforeLoad: () => {
    requireRole('company')
  },
  component: CompanyDashboard,
})

export default function CompanyDashboard() {
  const navigate = useNavigate()
  const { data, isLoading, error } = useCompanyJobs()

  const jobs = data?.jobs || []
  const company = data?.company
  const activeJobs = jobs.filter((job: any) => job.isActive === true)
  const totalApplicants = jobs.reduce(
    (acc: number, job: any) => acc + (job.applicants?.length || 0),
    0,
  )

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <CompanySidebar />

      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back{company ? `, ${company.name}` : ''}! Here's an
              overview of your recruitment activity.
            </p>
          </div>

          {/* Stats - Loading State */}
          {isLoading ? (
            <ShimmerDashboardStats />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl text-teal-600 dark:text-teal-400">
                      work
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Active Jobs
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {activeJobs.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl text-blue-600 dark:text-blue-400">
                      person_add
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Total Applicants
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {totalApplicants}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl text-purple-600 dark:text-purple-400">
                      description
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Total Jobs
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {jobs.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Job Postings - Loading State */}
          {isLoading ? (
            <ShimmerDashboardTable />
          ) : (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Active Job Postings
                </h2>
              </div>

              {/* Error State */}
              {error && (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl text-red-600 dark:text-red-400">
                      error
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Error Loading Jobs
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {error instanceof Error
                      ? error.message
                      : 'An unexpected error occurred'}
                  </p>
                </div>
              )}

              {/* Empty State */}
              {!error && activeJobs.length === 0 && (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">
                      work_off
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Active Jobs
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    You don't have any active job postings at the moment.
                  </p>
                  <button
                    onClick={() => navigate({ to: '/company/add-job' })}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold"
                  >
                    <span className="material-symbols-outlined text-base">
                      add
                    </span>
                    Post a Job
                  </button>
                </div>
              )}

              {/* Jobs Table */}
              {!error && activeJobs.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                          Job Title
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                          Location
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                          Experience
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                          Type
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                          Applicants
                        </th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {activeJobs.map((job: any) => (
                        <tr
                          key={job._id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {job.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                              {job.companyName || company?.name || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                            {job.location}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                              {job.experienceLevel}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                              {job.jobType}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-base text-gray-400">
                                person
                              </span>
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                {job.applicants?.length || 0}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  navigate({
                                    to: '/company/applicants',
                                    search: { jobId: job._id },
                                  })
                                }
                                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors"
                              >
                                <span className="material-symbols-outlined text-base">
                                  visibility
                                </span>
                                View
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
