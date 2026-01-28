import { createFileRoute, useNavigate } from '@tanstack/react-router'
import CompanySidebar from '@/components/companysidebar'
import { useJobApplicants } from '@/queries/job.queries'
import { Applicant } from '@/services/job.service'
export const Route = createFileRoute('/company/applicant-detail')({
  component: ApplicantDetail,

  validateSearch: (search: Record<string, unknown>) => {
    return {
      jobId: (search.jobId as string) || '',
      applicantId: (search.applicantId as string) || '',
    }
  },
})

function ApplicantDetail() {
  const { applicantId, jobId } = Route.useSearch()
  const navigate = useNavigate()
  const { data, isLoading, error } = useJobApplicants(jobId)

  const applicants: Applicant[] = data?.payload || []
  const applicant = applicants.find((app) => app.user.id === applicantId)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
        <CompanySidebar />
        <main className="flex-1 ml-64 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto p-6 md:p-10 space-y-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !applicant) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
        <CompanySidebar />
        <main className="flex-1 ml-64 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto p-6 md:p-10">
            <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-red-600 dark:text-red-400">
                    error
                  </span>
                </div>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {error ? 'Error Loading Applicant' : 'Applicant Not Found'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {error
                  ? 'An unexpected error occurred'
                  : "The applicant you're looking for could not be found."}
              </p>
              <button
                onClick={() =>
                  navigate({ to: '/company/applicants', search: { jobId } })
                }
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0E7C8C] text-white rounded-lg hover:bg-[#3EC3BC] transition-colors font-bold shadow-lg shadow-[#0E7C8C]/20"
              >
                <span className="material-symbols-outlined text-base">
                  arrow_back
                </span>
                Back to Applicants
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <CompanySidebar />

      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-5">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 px-4 py-2 mb-4">
            <button
              onClick={() =>
                navigate({ to: '/company/applicants', search: { jobId } })
              }
              className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-normal hover:underline hover:text-[#0E7C8C] dark:hover:text-[#3EC3BC]"
            >
              Applicants
            </button>
            <span className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-normal">
              /
            </span>
            <span className="text-slate-900 dark:text-white text-sm font-medium leading-normal">
              {applicant.user.name}
            </span>
          </div>

          {/* Profile Header */}
          <div className="bg-white dark:bg-slate-800 rounded-xl mb-6 shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
              <div className="flex gap-6 items-center">
                <div className="min-h-24 w-24 rounded-full bg-gradient-to-br from-[#0E7C8C] to-[#3EC3BC] flex items-center justify-center text-white text-2xl font-bold border-4 border-white dark:border-slate-800 shadow-lg">
                  {getInitials(applicant.user.name)}
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-3">
                    <p className="text-slate-900 dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">
                      {applicant.user.name}
                    </p>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#3EC3BC]/20 dark:bg-[#0E7C8C]/30 text-[#0E7C8C] dark:text-[#3EC3BC] text-xs font-bold uppercase tracking-wider">
                      {applicant.jobSeekerProfile.experienceLevel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mt-1">
                    <span className="material-symbols-outlined text-lg">
                      location_on
                    </span>
                    <p className="text-sm font-normal leading-normal">
                      {applicant.jobSeekerProfile.location}
                    </p>
                  </div>
                  <p className="text-[#0E7C8C] dark:text-[#3EC3BC] text-sm font-semibold mt-1">
                    Applied on {formatDate(applicant.appliedAt)}
                  </p>
                </div>
              </div>
              <div className="flex w-full max-w-[480px] gap-3 md:w-auto">
                <a
                  href={applicant.resume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] flex-1 md:flex-auto hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <span className="material-symbols-outlined mr-2 text-lg">
                    download
                  </span>
                  <span className="truncate">Resume</span>
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <aside className="w-full lg:w-1/3 flex flex-col gap-6">
              {/* Contact Info */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">
                  Contact Information
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#3EC3BC]/10 dark:bg-[#0E7C8C]/20 text-[#0E7C8C] dark:text-[#3EC3BC]">
                      <span className="material-symbols-outlined">email</span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wider">
                        Email
                      </p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {applicant.user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#3EC3BC]/10 dark:bg-[#0E7C8C]/20 text-[#0E7C8C] dark:text-[#3EC3BC]">
                      <span className="material-symbols-outlined">call</span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wider">
                        Phone
                      </p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {applicant.jobSeekerProfile.phoneNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#3EC3BC]/10 dark:bg-[#0E7C8C]/20 text-[#0E7C8C] dark:text-[#3EC3BC]">
                      <span className="material-symbols-outlined">
                        payments
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wider">
                        Min. Salary
                      </p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(
                          applicant.jobSeekerProfile.minimumSalaryExpected,
                        )}{' '}
                        / year
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preferred Roles */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">
                  Preferred Roles
                </h3>
                <div className="flex flex-col gap-2">
                  {applicant.jobSeekerProfile.preferredRoles.map(
                    (role, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700"
                      >
                        <span className="material-symbols-outlined text-[#0E7C8C] dark:text-[#3EC3BC]">
                          work
                        </span>
                        <p className="text-slate-900 dark:text-white text-sm font-medium">
                          {role}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">
                  Preferences
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium uppercase mb-2">
                      Industries
                    </p>
                    <p className="text-sm text-slate-900 dark:text-white">
                      {applicant.jobSeekerProfile.preferredIndustries.join(
                        ', ',
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium uppercase mb-2">
                      Target Locations
                    </p>
                    <p className="text-sm text-slate-900 dark:text-white">
                      {applicant.jobSeekerProfile.preferredLocations.join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
              {/* ATS Score */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-center gap-6">
                  <div className="relative flex items-center justify-center">
                    <svg className="size-24 -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="8"
                        className="dark:stroke-slate-700"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        fill="none"
                        stroke="#0E7C8C"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(applicant.resume.atsScore / 100) * 251.2} 251.2`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-extrabold text-[#0E7C8C] dark:text-[#3EC3BC]">
                        {applicant.resume.atsScore}%
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      ATS Score
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 max-w-[120px]">
                      {applicant.resume.atsScore >= 80
                        ? 'Highly optimized'
                        : applicant.resume.atsScore >= 60
                          ? 'Well optimized'
                          : 'Needs improvement'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                  Skills Cloud
                </h2>
                <div className="flex flex-wrap gap-2">
                  {applicant.resume.skills &&
                  applicant.resume.skills.length > 0 ? (
                    applicant.resume.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-[#3EC3BC]/20 dark:bg-[#0E7C8C]/30 text-[#0E7C8C] dark:text-[#3EC3BC] rounded-full text-sm font-bold"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      No skills listed
                    </p>
                  )}
                </div>
              </div>

              {/* Strengths & Match Score */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-green-500">
                      verified
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Strengths
                    </h2>
                  </div>
                  <ul className="space-y-3">
                    {applicant.resume.strengths &&
                    applicant.resume.strengths.length > 0 ? (
                      applicant.resume.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-[#0E7C8C] dark:text-[#3EC3BC] text-lg mt-0.5">
                            check_circle
                          </span>
                          <p className="text-sm text-slate-900 dark:text-white">
                            {strength}
                          </p>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-slate-600 dark:text-slate-400">
                        No strengths listed
                      </li>
                    )}
                  </ul>
                </div>

                {/* Match Score */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        Match Score
                      </h2>
                      <span
                        className="material-symbols-outlined text-slate-600 dark:text-slate-400 cursor-pointer"
                        title="AI-calculated compatibility"
                      >
                        info
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-5xl font-black ${
                          applicant.matchScore >= 70
                            ? 'text-green-500'
                            : applicant.matchScore >= 40
                              ? 'text-orange-500'
                              : 'text-red-500'
                        }`}
                      >
                        {applicant.matchScore}%
                      </span>
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                        match
                      </span>
                    </div>
                  </div>
                  <div
                    className={`mt-4 p-3 rounded-lg border ${
                      applicant.matchScore >= 70
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800'
                        : applicant.matchScore >= 40
                          ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800'
                          : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800'
                    }`}
                  >
                    <p
                      className={`text-xs ${
                        applicant.matchScore >= 70
                          ? 'text-green-800 dark:text-green-300'
                          : applicant.matchScore >= 40
                            ? 'text-orange-800 dark:text-orange-300'
                            : 'text-red-800 dark:text-red-300'
                      }`}
                    >
                      <strong>
                        {applicant.matchScore >= 70
                          ? 'Excellent Match'
                          : applicant.matchScore >= 40
                            ? 'Good Match'
                            : 'Fair Match'}
                        :
                      </strong>{' '}
                      {applicant.matchScore >= 70
                        ? 'Strong alignment with job requirements and company culture.'
                        : applicant.matchScore >= 40
                          ? 'Moderate fit with some areas for development.'
                          : 'May require additional evaluation or development.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ApplicantDetail
