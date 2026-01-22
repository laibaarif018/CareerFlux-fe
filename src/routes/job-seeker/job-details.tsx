import { createFileRoute, useNavigate } from '@tanstack/react-router'
import UserHeader from '@/components/UserHeader'
import { useMatchedJob, useApplyToJob } from '@/queries/job.queries'
import {
  useSaveJob,
  useUnsaveJob,
  useSavedJobs,
  useGetProfile,
} from '@/queries/user.queries'
import { z } from 'zod'
import Shimmer from '@/components/Shimmer'
import { requireRole } from '@/utils/RouteGuard'
import { useState } from 'react'
import { showError, showToast } from '@/utils/swal'

const jobSearchSchema = z.object({
  id: z.string(),
})

export const Route = createFileRoute('/job-seeker/job-details')({
  beforeLoad: () => {
    requireRole('jobseeker')
  },
  component: JobDetails,

  validateSearch: jobSearchSchema,
})

interface SkillCategory {
  name: string
  skills: string[]
  color: 'green' | 'teal' | 'gray'
}

// Shimmer Loading State Component
function JobDetailsShimmer() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 font-sans min-h-screen transition-colors">
      <UserHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Shimmer className="h-5 w-32 rounded-md" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 space-y-3">
                  <Shimmer className="h-8 w-3/4 rounded-md" />
                  <div className="flex gap-3">
                    <Shimmer className="h-5 w-40 rounded-md" />
                    <Shimmer className="h-5 w-32 rounded-md" />
                  </div>
                </div>
                <Shimmer className="w-16 h-16 rounded-xl" />
              </div>
              <div className="flex gap-2 mb-4">
                <Shimmer className="h-8 w-24 rounded-full" />
                <Shimmer className="h-8 w-28 rounded-full" />
                <Shimmer className="h-8 w-20 rounded-full" />
              </div>
              <div className="flex gap-3">
                <Shimmer className="h-10 w-32 rounded-lg" />
                <Shimmer className="h-10 w-40 rounded-lg" />
                <Shimmer className="h-10 w-10 rounded-lg" />
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24 flex flex-col gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center shadow-sm">
                <Shimmer className="h-4 w-32 mx-auto mb-4 rounded-md" />
                <Shimmer className="w-40 h-40 mx-auto rounded-full mb-4" />
                <Shimmer className="h-6 w-28 mx-auto rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function JobDetails() {
  const navigate = useNavigate()
  const { id } = Route.useSearch()

  // Get user profile to extract userId
  const { data: profileData, isLoading: isProfileLoading } = useGetProfile()
  const userId = profileData?.payload?.user?._id

  // Fetch matched job data with scores from backend
  const {
    data: matchedData,
    isLoading: isJobLoading,
    error,
  } = useMatchedJob(userId || '', id)

  // Application state - check if user has already applied from backend data
  const job = matchedData?.matchedJob?.[0]
  const hasAppliedFromBackend = job?.hasApplied || false // Assuming backend returns hasApplied field
  const [localHasApplied, setLocalHasApplied] = useState(false)

  // Combined applied state
  const hasApplied = hasAppliedFromBackend || localHasApplied

  // Save/unsave mutations
  const { mutate: saveJob } = useSaveJob()
  const { mutate: unsaveJob } = useUnsaveJob()

  // Apply mutation
  const applyMutation = useApplyToJob()

  // Check if job is saved
  const { data: savedJobs } = useSavedJobs()
  const isSaved =
    savedJobs?.payload?.some((savedJob: any) => savedJob._id === job?._id) ||
    false

  // Get match score from backend response
  const matchScore = job?.matchScore ? Math.round(job.matchScore) : 0

  // Handle apply to job
  const handleApply = async () => {
  if (!userId) {
    showError('Not Logged In', 'Please log in to apply for this job.')
    return
  }

  if (!job) return

  try {
    await applyMutation.mutateAsync({ jobId: job._id, userId })

    setLocalHasApplied(true)

    showToast(
      'Successfully applied for this job.',
    )
  } catch (error: any) {
    showError(
      'Application Failed',
      error?.response?.data?.message ||
        'Failed to apply. Please try again.',
    )
  }
}


  // Categorize skills based on user's actual skills from resume
  const categorizeSkills = (jobSkills: string[]): SkillCategory[] => {
    if (!matchedData?.resume?.parsedData?.skills) {
      return []
    }

    const userSkills = matchedData.resume.parsedData.skills.map((s: string) =>
      s.toLowerCase(),
    )

    const strong: string[] = []
    const moderate: string[] = []
    const missing: string[] = []

    jobSkills.forEach((skill) => {
      const skillLower = skill.toLowerCase()
      if (
        userSkills.some(
          (us: any) => us.includes(skillLower) || skillLower.includes(us),
        )
      ) {
        strong.push(skill)
      } else if (
        userSkills.some((us: any) => {
          const words = us.split(/[\s.-]/)
          return words.some(
            (word: any) =>
              skillLower.includes(word) || word.includes(skillLower),
          )
        })
      ) {
        moderate.push(skill)
      } else {
        missing.push(skill)
      }
    })

    return [
      {
        name: `Strong Skills (${strong.length})`,
        skills: strong,
        color: 'green' as const,
      },
      {
        name: `Moderate Skills (${moderate.length})`,
        skills: moderate,
        color: 'teal' as const,
      },
      {
        name: `Missing Skills (${missing.length})`,
        skills: missing,
        color: 'gray' as const,
      },
    ].filter((cat) => cat.skills.length > 0)
  }

  const getMatchLabel = (score: number) => {
    if (score >= 90) return 'Excellent Match'
    if (score >= 80) return 'Great Match'
    if (score >= 70) return 'Good Match'
    if (score >= 50) return 'Moderate Match'
    return 'Partial Match'
  }

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400'
    if (score >= 60) return 'text-teal-600 dark:text-teal-400'
    if (score >= 40) return 'text-amber-600 dark:text-amber-400'
    return 'text-orange-600 dark:text-orange-400'
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'stroke-emerald-600 dark:stroke-emerald-500'
    if (score >= 60) return 'stroke-teal-600 dark:stroke-teal-500'
    if (score >= 40) return 'stroke-amber-600 dark:stroke-amber-500'
    return 'stroke-orange-600 dark:stroke-orange-500'
  }

  const formatSalary = (min: number, max: number) => {
    return `$${(min / 1000).toFixed(0)}k - $${(max / 1000).toFixed(0)}k`
  }

  const handleSaveToggle = () => {
  if (!job) return

  if (isSaved) {
    unsaveJob(job._id, {
      onSuccess: () => {
        showToast('Job Removed from saved ')
      },
      onError: (error: any) => {
        showError(
          'Failed to Remove',
          error?.response?.data?.message ||
            'Unable to remove job from saved list.',
        )
      },
    })
  } else {
    saveJob(job._id, {
      onSuccess: () => {
        showToast( 'Job added to your saved jobs.')
      },
      onError: (error: any) => {
        showError(
          'Failed to Save',
          error?.response?.data?.message ||
            'Unable to save job. Please try again.',
        )
      },
    })
  }
}
  
  // Generate match insights based on backend scores
  const getMatchInsights = () => {
    if (!job) return ''

    const insights: string[] = []

    if (job.expMatch === 1) {
      insights.push(
        `Your ${matchedData?.experienceLevel || 'experience'} level matches perfectly`,
      )
    }

    if (job.locMatch === 1) {
      insights.push(`location in ${job.location} aligns with your preferences`)
    }

    if (job.salaryMatch === 1) {
      insights.push(`salary range meets your expectations`)
    }

    if (job.skillsMatch && job.skillsMatch > 0.5) {
      insights.push(
        `strong skill overlap in ${job.skills.slice(0, 3).join(', ')}`,
      )
    }

    if (insights.length === 0) {
      return `This ${job.experienceLevel} level position in ${job.location} has potential matches with your profile.`
    }

    return `This role is a great fit because: ${insights.join(', ')}.`
  }

  // Combined loading state
  const isLoading = isProfileLoading || isJobLoading

  // Loading state with shimmer
  if (isLoading) {
    return <JobDetailsShimmer />
  }

  // Error state
  if (error || !job) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 font-sans min-h-screen transition-colors">
        <UserHeader />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate({ to: '/job-seeker/jobs' })}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">
              arrow_back
            </span>
            <span className="text-sm font-medium">Back to Jobs</span>
          </button>
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-5xl text-red-600 dark:text-red-400">
                error
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Job not found
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mb-4">
              {error instanceof Error
                ? error.message
                : 'The job you are looking for could not be found.'}
            </p>
            <button
              onClick={() => navigate({ to: '/job-seeker/jobs' })}
              className="inline-flex items-center gap-2 px-4 h-10 rounded-lg bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 transition-colors"
            >
              Browse Jobs
              <span className="material-symbols-outlined text-base">
                arrow_forward
              </span>
            </button>
          </div>
        </main>
      </div>
    )
  }

  const skillCategories = categorizeSkills(job.skills)

  return (
    <div className="bg-gray-50 dark:bg-gray-900 font-sans min-h-screen transition-colors">
      <UserHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate({ to: '/job-seeker/jobs' })}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span className="text-sm font-medium">Back to Jobs</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Job Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {job.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className="material-symbols-outlined text-base">
                          business
                        </span>
                        {job.companyName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">
                          location_on
                        </span>
                        {job.location}
                      </span>
                    </div>
                  </div>

                  {/* Company Logo Placeholder */}
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                    {job.companyName.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Job Badges */}
                <div className="flex gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                    <span className="material-symbols-outlined text-sm">
                      schedule
                    </span>
                    {job.jobType}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <span className="material-symbols-outlined text-sm">
                      payments
                    </span>
                    {formatSalary(job.minSalary, job.maxSalary)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                    <span className="material-symbols-outlined text-sm">
                      workspace_premium
                    </span>
                    {job.experienceLevel}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSaveToggle}
                    className={`inline-flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-medium transition-colors ${
                      isSaved
                        ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {isSaved ? 'bookmark' : 'bookmark_add'}
                    </span>
                    {isSaved ? 'Saved' : 'Save Job'}
                  </button>

                  <button
                    onClick={handleApply}
                    disabled={
                      hasApplied || applyMutation.isPending || !job.isActive
                    }
                    className={`inline-flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-bold transition-all shadow-sm flex-1 sm:flex-none disabled:cursor-not-allowed ${
                      hasApplied
                        ? 'bg-green-600 text-white cursor-default'
                        : !job.isActive
                          ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                          : 'bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800'
                    }`}
                  >
                    {applyMutation.isPending ? (
                      <>
                        <span className="material-symbols-outlined text-lg animate-spin">
                          refresh
                        </span>
                        Applying...
                      </>
                    ) : hasApplied ? (
                      <>
                        <span className="material-symbols-outlined text-lg">
                          check_circle
                        </span>
                        Applied
                      </>
                    ) : !job.isActive ? (
                      <>
                        <span className="material-symbols-outlined text-lg">
                          block
                        </span>
                        Closed
                      </>
                    ) : (
                      <>
                        Apply Now
                        <span className="material-symbols-outlined text-lg">
                          arrow_forward
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Match Score Breakdown */}
            {matchScore > 0 && (
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl border border-teal-200 dark:border-teal-800 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-600 dark:text-teal-400">
                    analytics
                  </span>
                  Match Score Breakdown
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold mb-1 ${job.expMatch === 1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}
                    >
                      {job.expMatch === 1 ? '✓' : 'NA'}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Experience
                    </p>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold mb-1 ${job.locMatch === 1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}
                    >
                      {job.locMatch === 1 ? '✓' : 'NA'}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Location
                    </p>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold mb-1 ${job.salaryMatch === 1 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}
                    >
                      {job.salaryMatch === 1 ? '✓' : 'NA'}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Salary
                    </p>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold mb-1 ${job.skillsMatch && job.skillsMatch > 0.5 ? 'text-emerald-600 dark:text-emerald-400' : job.skillsMatch && job.skillsMatch > 0.3 ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400 dark:text-gray-500'}`}
                    >
                      {job.skillsMatch
                        ? `${Math.round(job.skillsMatch * 100)}%`
                        : '0%'}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Skills
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Job Description */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600 dark:text-teal-400">
                  description
                </span>
                Job Description
              </h2>
              <div className="space-y-6 text-gray-600 dark:text-gray-300">
                <p className="leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>

                {job.qualifications && job.qualifications.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">
                      Requirements
                    </h3>
                    <ul className="space-y-2">
                      {job.qualifications.map((q, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-base mt-0.5 flex-shrink-0">
                            verified
                          </span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Skills Required */}
                {job.skills && job.skills.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">
                      Skills Required
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 text-sm font-medium rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-teal-600 dark:text-teal-400">
                  info
                </span>
                Additional Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">
                    event
                  </span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Posted Date
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {new Date(job.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">
                    update
                  </span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Last Updated
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {new Date(job.updatedAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 flex flex-col gap-6">
              {/* Match Score */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-center shadow-sm">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                  Your Match Score
                </p>
                <div className="relative w-40 h-40 mx-auto">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    <path
                      className="text-gray-200 dark:text-gray-700"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                    />
                    <path
                      className={getProgressColor(matchScore)}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray={`${matchScore}, 100`}
                      strokeLinecap="round"
                      strokeWidth={3}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className={`text-4xl font-bold ${getMatchColor(matchScore)}`}
                    >
                      {matchScore}%
                    </span>
                  </div>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white mt-4">
                  {getMatchLabel(matchScore)}
                </p>
              </div>

              {/* Why This Job - Only show if match score > 50 */}
              {matchScore > 50 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500 text-xl">
                      auto_awesome
                    </span>
                    Why this job matches
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {getMatchInsights()}
                  </p>
                </div>
              )}

              {/* Skill Overlap */}
              {skillCategories.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-teal-600 dark:text-teal-400 text-xl">
                      psychology
                    </span>
                    Skill Analysis
                  </h3>
                  <div className="space-y-5">
                    {skillCategories.map((cat, i) => (
                      <div key={i}>
                        <p
                          className={`text-sm font-bold mb-2 ${
                            cat.color === 'green'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : cat.color === 'teal'
                                ? 'text-teal-600 dark:text-teal-400'
                                : 'text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          {cat.name}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {cat.skills.map((skill, j) => (
                            <span
                              key={j}
                              className={`px-3 py-1 text-xs font-medium rounded-full ${
                                cat.color === 'green'
                                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                  : cat.color === 'teal'
                                    ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600'
                              }`}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
