import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import storageService from '@/utils/localstorage'

export const Route = createFileRoute('/404')({
  component: NotFound,
})

export default function NotFound() {
  const navigate = useNavigate()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  // Get user role from storage
  const role = storageService.getItem<string>('userRole')

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Role-based navigation handlers
  const handleDashboardClick = () => {
    if (role === 'jobseeker') {
      navigate({ to: '/job-seeker/dashboard' })
    } else if (role === 'company') {
      navigate({ to: '/company/dashboard' })
    } else {
      navigate({ to: '/' })
    }
  }

  const handleJobsClick = () => {
    if (role === 'jobseeker') {
      navigate({ to: '/job-seeker/jobs' })
    } else if (role === 'company') {
      navigate({ to: '/company/jobs' })
    } else {
      navigate({ to: '/' })
    }
  }

  const handleThirdLinkClick = () => {
    if (role === 'jobseeker') {
      navigate({ to: '/job-seeker/upload-resume' })
    } else if (role === 'company') {
      navigate({ to: '/company/add-job' })
    } else {
      navigate({ to: '/' })
    }
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 transition-colors"
      style={{
        fontFamily:
          '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
      }}
    >
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-60 dark:opacity-30">
        <div
          className="absolute top-0 left-0 w-96 h-96 bg-[#3EC3BC]/30 dark:bg-[#3EC3BC]/20 rounded-full blur-3xl animate-float"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        ></div>
        <div
          className="absolute top-1/2 right-0 w-96 h-96 bg-[#0E7C8C]/30 dark:bg-[#0E7C8C]/20 rounded-full blur-3xl animate-float"
          style={{
            animationDelay: '1s',
            transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        ></div>
        <div
          className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl animate-float"
          style={{
            animationDelay: '2s',
            transform: `translate(${mousePosition.y}px, ${mousePosition.x}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        ></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-16 text-center">
        {/* Animated 404 */}
        <div className="mb-8 relative">
          <div className="inline-block relative">
            {/* Glowing Effect */}
            <div className="absolute inset-0 blur-3xl opacity-50">
              <h1 className="text-[12rem] md:text-[16rem] font-black bg-gradient-to-r from-[#3EC3BC] via-[#0E7C8C] to-purple-600 bg-clip-text text-transparent">
                404
              </h1>
            </div>
            {/* Main Number */}
            <h1
              className="relative text-[12rem] md:text-[16rem] font-black bg-gradient-to-r from-[#3EC3BC] via-[#0E7C8C] to-purple-600 bg-clip-text text-transparent animate-pulse-slow leading-none"
              style={{ letterSpacing: '-0.05em' }}
            >
              404
            </h1>
          </div>

          {/* Floating Decorative Elements */}
          <div className="absolute -top-8 left-1/4 w-16 h-16 bg-[#3EC3BC]/20 dark:bg-[#3EC3BC]/10 rounded-full blur-xl animate-float"></div>
          <div
            className="absolute top-1/2 right-1/4 w-20 h-20 bg-[#0E7C8C]/20 dark:bg-[#0E7C8C]/10 rounded-full blur-xl animate-float"
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className="absolute bottom-0 left-1/3 w-12 h-12 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-xl animate-float"
            style={{ animationDelay: '2s' }}
          ></div>
        </div>

        {/* Error Message */}
        <div className="mb-12 space-y-4">
          <h2
            className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white"
            style={{ letterSpacing: '-0.02em' }}
          >
            Page Not Found
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-normal">
            Oops! The page you're looking for seems to have wandered off into
            the digital void. Let's get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => navigate({ to: '/' })}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-[#0E7C8C] text-white text-base font-semibold rounded-xl shadow-lg shadow-[#0E7C8C]/30 transition-all duration-300 hover:bg-[#3EC3BC] hover:shadow-xl hover:shadow-[#3EC3BC]/40 hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">
              home
            </span>
            Back to Home
          </button>

          <button
            onClick={handleDashboardClick}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base font-semibold rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-lg transition-all duration-300 hover:border-[#0E7C8C] dark:hover:border-[#3EC3BC] hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            Go Back
          </button>
        </div>

        {/* Helpful Links - Only show if user is logged in */}
        {role && (
          <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-xl">
            <h3
              className="text-lg font-bold text-slate-900 dark:text-white mb-6"
              style={{ letterSpacing: '-0.01em' }}
            >
              Popular Pages
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Dashboard Link */}
              <LinkCard
                icon="dashboard"
                title="Dashboard"
                description="View your overview"
                onClick={handleDashboardClick}
              />

              {/* Jobs Link */}
              <LinkCard
                icon="work"
                title={role === 'jobseeker' ? 'Find Jobs' : 'Manage Jobs'}
                description={
                  role === 'jobseeker'
                    ? 'Browse opportunities'
                    : 'View your postings'
                }
                onClick={handleJobsClick}
              />

              {/* Third Link - Role Specific */}
              <LinkCard
                icon={role === 'jobseeker' ? 'upload_file' : 'add_circle'}
                title={role === 'jobseeker' ? 'Upload Resume' : 'Post Job'}
                description={
                  role === 'jobseeker'
                    ? 'Analyze your resume'
                    : 'Create new posting'
                }
                onClick={handleThirdLinkClick}
              />
            </div>
          </div>
        )}

        {/* Footer Note */}
        <p className="mt-12 text-sm text-slate-500 dark:text-slate-400 font-normal">
          Error Code: 404 | If this problem persists, please contact support
        </p>
      </main>

      {/* CSS for Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

// -------------------- LINK CARD COMPONENT --------------------
function LinkCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: string
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col items-center gap-3 p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:border-[#0E7C8C] dark:hover:border-[#3EC3BC] hover:shadow-lg hover:scale-105 active:scale-95"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#3EC3BC]/20 dark:bg-[#0E7C8C]/30 text-[#0E7C8C] dark:text-[#3EC3BC] transition-transform group-hover:scale-110">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <div>
        <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
          {title}
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-normal">
          {description}
        </p>
      </div>
    </button>
  )
}