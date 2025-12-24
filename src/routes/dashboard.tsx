import UserHeader from '@/components/UserHeader'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { getAuthToken } from '@/utils/auth'
import { useEffect } from 'react'
import { ProtectedRoute } from '@/components/PRoutes'
import { useGetProfile } from '@/hooks/useUser'

export const Route = createFileRoute('/dashboard')({
  component: () => (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  )
})

function DashboardPage() {
  const navigate = useNavigate()
  const { data } = useGetProfile()
  
  useEffect(() => {
    if (!getAuthToken()) {
      navigate({ to: '/auth/login' })
    }
  }, [navigate])

  // Get user name
  const userName = data?.payload?.user?.name || 'User'
  const firstName = userName.split(' ')[0]

  // replace later with TanStack Query / API
  const stats = {
    totalResumes: 0,
    bestScore: null,
    savedJobs: 0,
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif" }}>
      {/* Header */}
      <UserHeader />

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome + Actions */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white" style={{ letterSpacing: '-0.01em' }}>
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
              onClick={() => navigate({ to: '/uploadResume' })}
            >
              Upload Resume
            </ActionButton>

            <ActionButton
              icon="analytics"
              onClick={() => navigate({ to: '/parsedResume' })}
            >
              Analyze Resume
            </ActionButton>

            <ActionButton
              icon="search"
              onClick={() => navigate({ to: '/jobs' })}
            >
              Find Jobs
            </ActionButton>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
        </div>

        {/* Activity */}
        <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
          <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6 py-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white" style={{ letterSpacing: '-0.01em' }}>
              Recent Activity
            </h3>
          </header>

          {/* Empty State */}
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
                Upload your first resume to start analyzing and matching with
                jobs.
              </p>
            </div>
            <button
              onClick={() => navigate({ to: '/uploadResume' })}
              className="mt-4 inline-flex h-11 items-center gap-2 rounded-lg bg-[#0E7C8C] px-5 text-sm font-semibold text-white shadow-lg shadow-[#0E7C8C]/20 transition-colors hover:bg-[#3EC3BC] active:bg-[#0E7C8C]/90"
            >
              <span className="material-symbols-outlined text-lg">
                upload_file
              </span>
              Upload Resume
            </button>
          </div>
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

// ---------------- ACTIVITY ITEM (Optional) ----------------
function ActivityItem({
  icon,
  title,
  subtitle,
  time,
}: {
  icon: string
  title: string
  subtitle: string
  time: string
}) {
  return (
    <li className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-700 p-4 transition-colors last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700/50">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
        <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">
          {icon}
        </span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          {title}
        </p>
        <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400 font-normal">
          {subtitle}
        </p>
      </div>
      <span className="text-sm text-slate-500 dark:text-slate-400 font-normal">{time}</span>
    </li>
  )
}