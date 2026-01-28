import UserHeader from '@/components/UserHeader'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { getAuthToken } from '@/utils/auth'
import { useEffect } from 'react'
import { useGetProfile } from '@/queries/user.queries'
import { useTotalCount, useBestResumeScore } from '@/queries/resume.queries'
import { useSavedJobs } from '@/queries/user.queries'
import { useActivities } from '@/queries/activity.queries'
import Shimmer from '@/components/Shimmer'

export const Route = createFileRoute('/job-seeker/dashboard')({
  component: Dashboard,
})

export function Dashboard() {
  const navigate = useNavigate()
  const { data: profileData, isLoading: isLoadingProfile } = useGetProfile()

  // Get userId from profile
  const userId =
    profileData?.payload?.user?._id || profileData?.payload?.user?.id

  // Fetch total count
  const { data: countData, isLoading: isLoadingCount } = useTotalCount(userId)

  // Fetch best resume score
  const { data: bestScoreData, isLoading: isLoadingBestScore } =
    useBestResumeScore()

  // Fetch saved jobs
  const { data: savedJobsData, isLoading: isLoadingSavedJobs } = useSavedJobs()

  // Fetch activities
  const { data: activitiesData, isLoading: isLoadingActivities } =
    useActivities()

  useEffect(() => {
    if (!getAuthToken()) {
      navigate({ to: '/auth/login' })
    }
  }, [navigate])

  // Get user name
  const userName = profileData?.payload?.user?.name || 'User'
  const firstName = userName.split(' ')[0]

  // Get stats from API
  const stats = {
    totalResumes: countData?.payload.totalResumes || 0,
    bestScore: bestScoreData?.payload?.atsScore ?? null,
    savedJobs: savedJobsData?.payload?.length || 0,
  }

  // Get activities
  const activities = activitiesData || []

  // Show shimmer while loading
  const isLoading =
    isLoadingProfile ||
    isLoadingCount ||
    isLoadingBestScore ||
    isLoadingSavedJobs ||
    isLoadingActivities

  // Format activity data
  const formatActivity = (activity: any) => {
    const date = new Date(activity.createdAt)
    const timeAgo = getTimeAgo(date)

    switch (activity.action) {
      case 'resume_uploaded':
        return {
          icon: 'upload_file',
          title: 'Resume Uploaded',
          subtitle: activity.metadata?.fileName || 'New resume uploaded',
          time: timeAgo,
          onClick: activity.metadata?.resumeId
            ? () =>
                navigate({
                  to: '/job-seeker/my-resumes',
                  search: { id: activity.metadata.resumeId },
                })
            : undefined,
        }
      case 'job_saved':
        return {
          icon: 'bookmark',
          title: 'Job Saved',
          subtitle: 'Saved a job posting',
          time: timeAgo,
          onClick: activity.jobId
            ? () =>
                navigate({
                  to: '/job-seeker/job-details',
                  search: { id: activity.jobId },
                })
            : undefined,
        }
      case 'job_applied':
        return {
          icon: 'send',
          title: 'Applied to Job',
          subtitle: 'Submitted application',
          time: timeAgo,
          onClick: activity.jobId
            ? () =>
                navigate({
                  to: '/job-seeker/job-details',
                  search: { id: activity.jobId },
                })
            : undefined,
        }
      default:
        return {
          icon: 'info',
          title: activity.action
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l: string) => l.toUpperCase()),
          subtitle: 'Activity recorded',
          time: timeAgo,
        }
    }
  }

  // Helper function to get relative time
  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors"
      style={{
        fontFamily:
          '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
      }}
    >
      <UserHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome + Actions */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          {isLoading ? (
            <>
              <div>
                <Shimmer className="h-8 w-64 rounded-md mb-2" />
                <Shimmer className="h-4 w-80 rounded-md" />
              </div>
              <div className="flex flex-wrap gap-3">
                <Shimmer className="h-10 w-40 rounded-lg" />
                <Shimmer className="h-10 w-40 rounded-lg" />
              </div>
            </>
          ) : (
            <>
              <div>
                <h2
                  className="text-3xl font-bold text-slate-900 dark:text-white"
                  style={{ letterSpacing: '-0.01em' }}
                >
                  Welcome back, {firstName}!
                </h2>
                <p className="mt-1 text-slate-600 dark:text-slate-400 font-normal">
                  Here's what's happening with your career journey today.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <ActionButton
                  icon="upload_file"
                  primary
                  onClick={() => navigate({ to: '/job-seeker/upload-resume' })}
                >
                  Upload Resume
                </ActionButton>

                <ActionButton
                  icon="search"
                  onClick={() => navigate({ to: '/job-seeker/jobs' })}
                >
                  Find Jobs
                </ActionButton>
              </div>
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
                icon="description"
                label="Total Resumes"
                value={stats.totalResumes}
              />
              <StatCard
                icon="star"
                label="Best Resume Score"
                value={stats.bestScore ?? '—'}
              />
              <StatCard
                icon="bookmark"
                label="Saved Jobs Count"
                value={stats.savedJobs}
              />
            </>
          )}
        </div>

        {/* Activity */}
        <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
          <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6 py-4">
            {isLoading ? (
              <Shimmer className="h-6 w-40 rounded-md" />
            ) : (
              <h3
                className="text-lg font-bold text-slate-900 dark:text-white"
                style={{ letterSpacing: '-0.01em' }}
              >
                Recent Activity
              </h3>
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
              {/* Activity List or Empty State */}
              {activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                    <span className="material-symbols-outlined text-5xl text-slate-400 dark:text-slate-500">
                      history
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                      No activity yet
                    </h4>
                    <p className="mt-2 max-w-sm text-sm text-slate-600 dark:text-slate-400 font-normal">
                      Upload your first resume to start analyzing and matching
                      with jobs.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate({ to: '/job-seeker/upload-resume' })}
                    className="mt-4 inline-flex h-11 items-center gap-2 rounded-lg bg-[#0E7C8C] px-5 text-sm font-semibold text-white shadow-lg shadow-[#0E7C8C]/20 transition-colors hover:bg-[#3EC3BC] active:bg-[#0E7C8C]/90"
                  >
                    <span className="material-symbols-outlined text-lg">
                      upload_file
                    </span>
                    Upload Resume
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                  {activities.slice(0, 5).map((activity: any) => {
                    const formattedActivity = formatActivity(activity)
                    return (
                      <ActivityItem key={activity._id} {...formattedActivity} />
                    )
                  })}
                </ul>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  )
}

// ---------------- ACTION BUTTON ----------------
function ActionButton({
  icon,
  children,
  primary = false,
  onClick,
}: {
  icon: string
  children: React.ReactNode
  primary?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={
        primary
          ? 'inline-flex h-10 items-center gap-2 rounded-lg bg-[#0E7C8C] px-4 text-sm font-semibold text-white shadow-lg shadow-[#0E7C8C]/20 transition-colors hover:bg-[#3EC3BC] active:bg-[#0E7C8C]/90'
          : 'inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 text-sm font-semibold text-slate-900 dark:text-white transition-colors hover:bg-slate-50 dark:hover:bg-slate-700'
      }
    >
      <span className="material-symbols-outlined text-lg">{icon}</span>
      {children}
    </button>
  )
}

// ---------------- STAT CARD ----------------
function StatCard({
  icon,
  label,
  value,
}: {
  icon: string
  label: string
  value: number | string
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#3EC3BC]/20 dark:bg-[#0E7C8C]/30 text-[#0E7C8C] dark:text-[#3EC3BC]">
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

// ---------------- ACTIVITY ITEM ----------------
function ActivityItem({
  icon,
  title,
  subtitle,
  time,
  onClick,
}: {
  icon: string
  title: string
  subtitle: string
  time: string
  onClick?: () => void
}) {
  const Component = onClick ? 'button' : 'div'

  return (
    <li>
      <Component
        onClick={onClick}
        className={`flex w-full items-center gap-4 p-4 transition-colors ${
          onClick
            ? 'hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer'
            : ''
        }`}
      >
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
          <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">
            {icon}
          </span>
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {title}
          </p>
          <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400 font-normal">
            {subtitle}
          </p>
        </div>
        <span className="text-sm text-slate-500 dark:text-slate-400 font-normal flex-shrink-0">
          {time}
        </span>
      </Component>
    </li>
  )
}
