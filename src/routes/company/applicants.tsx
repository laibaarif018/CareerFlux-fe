import { createFileRoute, useNavigate } from '@tanstack/react-router'
import CompanySidebar from '@/components/companysidebar'
import { useJobApplicants } from '@/queries/job.queries'
import { Applicant } from '@/services/job.service'

// Define route with search params for jobId
export const Route = createFileRoute('/company/applicants')({
  component: JobCandidateMatches,

  validateSearch: (search: Record<string, unknown>) => {
    return {
      jobId: (search.jobId as string) || '',
    }
  },
})

function JobCandidateMatches() {
  const { jobId } = Route.useSearch()
  const { data, isLoading, error } = useJobApplicants(jobId)
  const navigate = useNavigate()

  const applicants: Applicant[] = data?.payload || []

  const getExperienceBadgeColor = (level: string) => {
    const colors: Record<string, string> = {
      junior:
        'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      mid: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      senior:
        'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
      lead: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    }
    return (
      colors[level.toLowerCase()] ||
      'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800'
    )
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 70) return 'text-teal-600 dark:text-teal-400'
    if (score >= 50) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getMatchScoreBarColor = (score: number) => {
    if (score >= 70) return 'bg-teal-500'
    if (score >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  // Show message if no jobId is provided
  if (!jobId) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <CompanySidebar />
        <main className="flex-1 ml-64 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
            <div className="rounded-2xl border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-yellow-600 dark:text-yellow-400">
                    info
                  </span>
                </div>
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                No Job Selected
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Please select a job from your job listings to view applicants.
              </p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <CompanySidebar />

      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Job Applicants
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Review and manage candidates who have applied to your position
            </p>
          </div>

          {/* Loading State with Shimmer */}
          {isLoading && (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Candidate
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Match Score
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Experience
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Location
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Applied
                      </th>
                      <th className="px-6 py-4" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {[...Array(5)].map((_, index) => (
                      <tr key={index} className="animate-pulse">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full relative overflow-hidden">
                              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-gray-500/60 to-transparent" />
                            </div>
                            <div className="space-y-2">
                              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
                                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-gray-500/60 to-transparent" />
                              </div>
                              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
                                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-gray-500/60 to-transparent" />
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
                            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-gray-500/60 to-transparent" />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full relative overflow-hidden">
                            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-gray-500/60 to-transparent" />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
                            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-gray-500/60 to-transparent" />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
                            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-gray-500/60 to-transparent" />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg relative overflow-hidden">
                              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-gray-500/60 to-transparent" />
                            </div>
                            <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg relative overflow-hidden">
                              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-gray-500/60 to-transparent" />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-red-600 dark:text-red-400">
                    error
                  </span>
                </div>
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Error Loading Applicants
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {error instanceof Error
                  ? error.message
                  : 'An unexpected error occurred'}
              </p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && applicants.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-gray-400 dark:text-gray-500">
                    group_off
                  </span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No Applicants Yet
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                When candidates apply to this job posting, they will appear here
                for you to review.
              </p>
            </div>
          )}

          {/* Applicants Table */}
          {!isLoading && !error && applicants.length > 0 && (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl text-teal-600 dark:text-teal-400">
                        group
                      </span>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Total Applicants
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {applicants.length}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl text-blue-600 dark:text-blue-400">
                        analytics
                      </span>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Average Match Score
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {Math.round(
                          applicants.reduce(
                            (acc, app) => acc + app.matchScore,
                            0,
                          ) / applicants.length,
                        )}
                        %
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl text-green-600 dark:text-green-400">
                        star
                      </span>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        High Matches (70+)
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {
                          applicants.filter((app) => app.matchScore >= 70)
                            .length
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                          Candidate
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                          Match Score
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                          Experience
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                          Location
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                          Applied
                        </th>
                        <th className="px-6 py-4" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {applicants.map((applicant) => (
                        <tr
                          key={applicant.user.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                                {applicant.user.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 dark:text-white">
                                  {applicant.user.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                  {applicant.user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 min-w-[80px] max-w-[100px]">
                                <div
                                  className={`${getMatchScoreBarColor(applicant.matchScore)} h-2 rounded-full transition-all`}
                                  style={{
                                    width: `${applicant.matchScore}%`,
                                  }}
                                />
                              </div>
                              <span
                                className={`text-sm font-bold ${getMatchScoreColor(applicant.matchScore)}`}
                              >
                                {applicant.matchScore}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${getExperienceBadgeColor(applicant.jobSeekerProfile.experienceLevel)}`}
                            >
                              {applicant.jobSeekerProfile.experienceLevel}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {applicant.jobSeekerProfile.location}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {formatDate(applicant.appliedAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <div className="relative group">
                                <a
                                  href={applicant.resume.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                  <span className="material-symbols-outlined text-base">
                                    download
                                  </span>
                                  Resume
                                </a>
                                <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-10">
                                  Download Resume
                                  <span className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></span>
                                </span>
                              </div>
                              <div className="relative group">
                                <button
                                  onClick={() =>
                                    navigate({
                                      to: '/company/applicant-detail',
                                      search: {
                                        jobId,
                                        applicantId: applicant.user.id,
                                      },
                                    })
                                  }
                                  className="inline-flex items-center gap-1.5 px-3 py-2 border border-transparent rounded-lg text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20"
                                >
                                  <span className="material-symbols-outlined text-base">
                                    person
                                  </span>
                                  View Profile
                                </button>
                                <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-10">
                                  View Full Profile
                                  <span className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></span>
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
