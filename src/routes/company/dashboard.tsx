import { createFileRoute, useNavigate } from '@tanstack/react-router'
import CompanySidebar from '@/components/companysidebar'
import { useCompanyJobs } from '@/queries/job.queries'
import Shimmer from '@/components/Shimmer'

export const Route = createFileRoute('/company/dashboard')({
  component: CompanyDashboard,
})

export default function CompanyDashboard() {
  const navigate = useNavigate()
  
  // ⭐ Exact same pattern as job seeker dashboard
  const { data, isLoading } = useCompanyJobs()

  // ⭐ Safe data extraction (same as job seeker)
  const jobs = data?.jobs || []
  const company = data?.company
  const activeJobs = jobs.filter((job: any) => job.isActive === true)
  const totalApplicants = jobs.reduce(
    (acc: number, job: any) => acc + (job.applicants?.length || 0),
    0,
  )

  // ⭐ Simple checks (same pattern as job seeker activities.length === 0)
  const hasNoJobs = jobs.length === 0
  const hasNoActiveJobs = jobs.length > 0 && activeJobs.length === 0

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors"
      style={{
        fontFamily:
          '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
      }}
    >
      <CompanySidebar />

      <main className="flex-1 lg:ml-64">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            {isLoading ? (
              <>
                <Shimmer className="h-8 w-64 rounded-md mb-2" />
                <Shimmer className="h-4 w-96 rounded-md" />
              </>
            ) : (
              <>
                <h1
                  className="text-3xl font-bold text-slate-900 dark:text-white mb-1"
                  style={{ letterSpacing: '-0.01em' }}
                >
                  Dashboard
                </h1>
                <p className="text-slate-600 dark:text-slate-400 font-normal">
                  Welcome back{company ? `, ${company.name}` : ''}! Here's an
                  overview of your recruitment activity.
                </p>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <>
                <Shimmer className="h-24 rounded-xl" />
                <Shimmer className="h-24 rounded-xl" />
                <Shimmer className="h-24 rounded-xl" />
              </>
            ) : (
              <>
                <StatCard
                  icon="work"
                  label="Active Jobs"
                  value={activeJobs.length}
                  color="teal"
                />
                <StatCard
                  icon="person_add"
                  label="Total Applicants"
                  value={totalApplicants}
                  color="blue"
                />
                <StatCard
                  icon="description"
                  label="Total Jobs"
                  value={jobs.length}
                  color="purple"
                />
              </>
            )}
          </div>

          {/* Active Jobs Section */}
          <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
            <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6 py-4">
              {isLoading ? (
                <Shimmer className="h-6 w-48 rounded-md" />
              ) : (
                <h2
                  className="text-lg font-bold text-slate-900 dark:text-white"
                  style={{ letterSpacing: '-0.01em' }}
                >
                  Active Job Postings
                </h2>
              )}
            </header>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
                <Shimmer className="h-20 w-20 rounded-full" />
                <div className="space-y-2">
                  <Shimmer className="h-5 w-48 mx-auto rounded-md" />
                  <Shimmer className="h-4 w-64 mx-auto rounded-md" />
                </div>
                <Shimmer className="h-11 w-40 rounded-lg" />
              </div>
            ) : (
              <>
                {/* Empty State - No Jobs */}
                {hasNoJobs && (
                  <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                      <span className="material-symbols-outlined text-5xl text-slate-400 dark:text-slate-500">
                        work_outline
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                        No activity yet
                      </h4>
                      <p className="mt-2 max-w-sm text-sm text-slate-600 dark:text-slate-400 font-normal">
                        You haven't posted any jobs yet. Start your recruitment
                        journey by creating your first job posting.
                      </p>
                    </div>
                    <button
                      onClick={() => navigate({ to: '/company/add-job' })}
                      className="mt-4 inline-flex h-11 items-center gap-2 rounded-lg bg-[#0E7C8C] px-5 text-sm font-semibold text-white shadow-lg shadow-[#0E7C8C]/20 transition-colors hover:bg-[#3EC3BC] active:bg-[#0E7C8C]/90"
                    >
                      <span className="material-symbols-outlined text-lg">
                        add
                      </span>
                      Create Your First Job
                    </button>
                  </div>
                )}

                {/* Empty State - No Active Jobs */}
                {hasNoActiveJobs && (
                  <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                      <span className="material-symbols-outlined text-5xl text-slate-400 dark:text-slate-500">
                        work_off
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                        No Active Jobs
                      </h4>
                      <p className="mt-2 max-w-sm text-sm text-slate-600 dark:text-slate-400 font-normal">
                        You don't have any active job postings at the moment.
                      </p>
                    </div>
                    <button
                      onClick={() => navigate({ to: '/company/add-job' })}
                      className="mt-4 inline-flex h-11 items-center gap-2 rounded-lg bg-[#0E7C8C] px-5 text-sm font-semibold text-white shadow-lg shadow-[#0E7C8C]/20 transition-colors hover:bg-[#3EC3BC] active:bg-[#0E7C8C]/90"
                    >
                      <span className="material-symbols-outlined text-lg">
                        add
                      </span>
                      Post a Job
                    </button>
                  </div>
                )}

                {/* Jobs Table */}
                {activeJobs.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                            Job Title
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                            Location
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                            Experience
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                            Type
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                            Applicants
                          </th>
                          <th className="px-6 py-4"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {activeJobs.map((job: any) => (
                          <JobRow
                            key={job._id}
                            job={job}
                            companyName={company?.name}
                            navigate={navigate}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

// ---------------- STAT CARD ----------------
function StatCard({
  icon,
  label,
  value,
  color = 'teal',
}: {
  icon: string
  label: string
  value: number
  color?: 'teal' | 'blue' | 'purple'
}) {
  const colorClasses = {
    teal: 'bg-[#3EC3BC]/20 dark:bg-[#0E7C8C]/30 text-[#0E7C8C] dark:text-[#3EC3BC]',
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    purple:
      'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  }

  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition-shadow hover:shadow-md">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-lg ${colorClasses[color]}`}
      >
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <div>
        <p className="text-3xl font-bold text-slate-900 dark:text-white">
          {value}
        </p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 font-normal">
          {label}
        </p>
      </div>
    </div>
  )
}

// ---------------- JOB ROW ----------------
function JobRow({
  job,
  companyName,
  navigate,
}: {
  job: any
  companyName?: string
  navigate: any
}) {
  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
      <td className="px-6 py-4">
        <div className="font-semibold text-slate-900 dark:text-white">
          {job.title}
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
          {job.companyName || companyName || 'N/A'}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-normal">
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
          <span className="material-symbols-outlined text-base text-slate-400">
            person
          </span>
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            {job.applicants?.length || 0}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <button
          onClick={() =>
            navigate({
              to: '/company/applicants',
              search: { jobId: job._id },
            })
          }
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-[#0E7C8C] dark:text-[#3EC3BC] bg-[#3EC3BC]/20 dark:bg-[#0E7C8C]/30 border border-[#3EC3BC]/30 dark:border-[#0E7C8C]/50 rounded-lg hover:bg-[#3EC3BC]/30 dark:hover:bg-[#0E7C8C]/40 transition-colors"
        >
          <span className="material-symbols-outlined text-base">
            visibility
          </span>
          View
        </button>
      </td>
    </tr>
  )
}