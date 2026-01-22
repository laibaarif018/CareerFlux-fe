import { createFileRoute } from '@tanstack/react-router'
import { useGetJobSeeker } from '@/queries/user.queries'
import Shimmer from '@/components/Shimmer'
import { useState } from 'react'
import Sidebar from '@/components/companysidebar'
import { requireRole } from '@/utils/RouteGuard'

export const Route = createFileRoute('/company/candidates')({
  beforeLoad: () => {
    requireRole('company')
  },
  component: CandidatesPage,
})

function CandidatesPage() {
  const { data, isLoading, error } = useGetJobSeeker()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedExperience, setSelectedExperience] = useState('all')
  const [selectedRole, setSelectedRole] = useState('all')

  const candidates = data?.payload || []

  // Filter candidates
  const filteredCandidates = candidates.filter((candidate: any) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesExperience =
      selectedExperience === 'all' ||
      candidate.jobseekerProfile?.experienceLevel === selectedExperience

    const matchesRole =
      selectedRole === 'all' ||
      candidate.jobseekerProfile?.preferredRoles?.includes(selectedRole)

    return matchesSearch && matchesExperience && matchesRole
  })

  // Get unique roles and experience levels for filters
  const allRoles = Array.from(
    new Set(
      candidates.flatMap((c: any) => c.jobseekerProfile?.preferredRoles || []),
    ),
  )

  const experienceLevels = ['junior', 'mid', 'senior', 'lead']

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
        <Sidebar />
        <main className="flex-1 ml-64 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Shimmer className="h-8 w-48 rounded-md mb-2" />
            <Shimmer className="h-4 w-96 rounded-md" />
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <Shimmer className="h-10 rounded-lg" />
            <Shimmer className="h-10 rounded-lg" />
            <Shimmer className="h-10 rounded-lg" />
          </div>

          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Shimmer key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
        <Sidebar />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <span className="material-symbols-outlined text-4xl text-red-600 dark:text-red-400">
                error
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Error Loading Candidates
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Failed to load candidates. Please try again later.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex min-h-screen bg-slate-50 dark:bg-slate-900"
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
      }}
    >
      <Sidebar />

      <main className="flex-1 ml-64 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-slate-900 dark:text-white"
            style={{ letterSpacing: '-0.01em' }}
          >
            Candidates
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400 font-normal">
            Browse and connect with talented job seekers
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              search
            </span>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:border-[#0E7C8C] focus:outline-none focus:ring-2 focus:ring-[#0E7C8C]/20"
            />
          </div>

          <select
            value={selectedExperience}
            onChange={(e) => setSelectedExperience(e.target.value)}
            className="h-10 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white focus:border-[#0E7C8C] focus:outline-none focus:ring-2 focus:ring-[#0E7C8C]/20"
          >
            <option value="all">All Experience Levels</option>
            {experienceLevels.map((level) => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="h-10 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 text-sm text-slate-900 dark:text-white focus:border-[#0E7C8C] focus:outline-none focus:ring-2 focus:ring-[#0E7C8C]/20"
          >
            <option value="all">All Roles</option>
            {allRoles.map((role: any) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Showing{' '}
            <span className="font-semibold text-slate-900 dark:text-white">
              {filteredCandidates.length}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-slate-900 dark:text-white">
              {candidates.length}
            </span>{' '}
            candidates
          </p>
        </div>

        {/* Candidates List */}
        {filteredCandidates.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
              <span className="material-symbols-outlined text-5xl text-slate-400 dark:text-slate-500">
                person_search
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                No candidates found
              </h3>
              <p className="mt-2 max-w-sm text-sm text-slate-600 dark:text-slate-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCandidates.map((candidate: any) => (
              <CandidateCard key={candidate._id} candidate={candidate} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function CandidateCard({ candidate }: { candidate: any }) {
  const profile = candidate.jobseekerProfile
  const score = candidate.resumeScore || 0
  const experienceLevel = profile?.experienceLevel || 'N/A'
  const location = profile?.location || 'Not specified'
  const preferredRoles = profile?.preferredRoles || []
  const preferredIndustries = profile?.preferredIndustries || []
  const savedJobsCount = profile?.savedJobs?.length || 0

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#0E7C8C] dark:text-[#3EC3BC]'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-orange-600 dark:text-orange-400'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-[#3EC3BC]/20 dark:bg-[#0E7C8C]/30'
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30'
    return 'bg-orange-100 dark:bg-orange-900/30'
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-4">
        {/* Left Section */}
        <div className="flex flex-1 items-start gap-4">
          {/* Avatar */}
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-[#3EC3BC]/20 dark:bg-[#0E7C8C]/30 text-2xl font-bold text-[#0E7C8C] dark:text-[#3EC3BC]">
            {candidate.name.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {candidate.name}
              </h3>
              {candidate.isActive && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400"></span>
                  Active
                </span>
              )}
            </div>

            <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base">
                  email
                </span>
                <span>{candidate.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base">
                  location_on
                </span>
                <span>{location}</span>
              </div>
              {profile?.phoneNumber && (
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">
                    phone
                  </span>
                  <span>{profile.phoneNumber}</span>
                </div>
              )}
            </div>

            {/* Summary */}
            {candidate.resumeSummary && (
              <p className="mb-4 text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                {candidate.resumeSummary}
              </p>
            )}

            {/* Preferred Roles */}
            {preferredRoles.length > 0 && (
              <div className="mb-3">
                <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Preferred Roles
                </p>
                <div className="flex flex-wrap gap-2">
                  {preferredRoles.map((role: string) => (
                    <span
                      key={role}
                      className="inline-flex items-center rounded-full bg-[#3EC3BC]/20 dark:bg-[#0E7C8C]/30 px-3 py-1 text-xs font-medium text-[#0E7C8C] dark:text-[#3EC3BC]"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Industries */}
            {preferredIndustries.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Industries
                </p>
                <div className="flex flex-wrap gap-2">
                  {preferredIndustries.map((industry: string) => (
                    <span
                      key={industry}
                      className="inline-flex items-center rounded-full border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300"
                    >
                      {industry}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Stats & Actions */}
        <div className="flex flex-col items-end gap-4">
          {/* Resume Score */}
          <div className="flex flex-col items-center">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full ${getScoreBgColor(score)}`}
            >
              <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                {score}
              </span>
            </div>
            <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400">
              Resume Score
            </p>
          </div>

          {/* Additional Stats */}
          <div className="flex gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {experienceLevel.charAt(0).toUpperCase() +
                  experienceLevel.slice(1)}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Experience
              </p>
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {savedJobsCount}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Saved Jobs
              </p>
            </div>
          </div>

          {/* Actions */}
          {/* <div className="flex gap-2">
            <button className="inline-flex items-center gap-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white transition-colors hover:bg-slate-50 dark:hover:bg-slate-700">
              <span className="material-symbols-outlined text-base">visibility</span>
              View
            </button>
          </div> */}
        </div>
      </div>
    </div>
  )
}
