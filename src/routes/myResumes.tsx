import UserHeader from '@/components/UserHeader'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAllResumes } from '@/hooks/useResume'
import Shimmer from '@/components/Shimmer'
import { useState } from 'react'
import ResumeViewer from '@/components/ResumeViewer'

export const Route = createFileRoute('/myResumes')({
  component: MyResumes,
})

export default function MyResumes() {
  const navigate = useNavigate()

  const page = 1
  const limit = 5

  const { data, isLoading } = useAllResumes(page, limit)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const resumes = data?.payload?.resumes?.records ?? []

  const handleDelete = (resumeName: string) => {
    if (confirm(`Are you sure you want to delete "${resumeName}"?`)) {
      console.log('Deleting resume:', resumeName)
      // Add delete logic here
    }
  }

  const handleReanalyze = (resumeName: string) => {
    console.log('Re-analyzing resume:', resumeName)
    // Add re-analysis logic here
  }

  return (
    <div className="font-sans bg-slate-50 dark:bg-slate-900 min-h-screen flex flex-col transition-colors">
      {/* Header */}
      <UserHeader />

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header - Always show */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">
              My Resumes
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-base">
              Manage, analyze, and track all your resumes in one place.
            </p>
          </div>
          {resumes.length > 0 && (
            <button
              onClick={() => navigate({ to: '/uploadResume' })}
              className="inline-flex items-center justify-center gap-2 rounded-lg h-11 px-4 bg-teal-600 text-white text-sm font-bold shadow-lg shadow-teal-600/20 hover:bg-teal-700 active:bg-teal-800 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">
                upload_file
              </span>
              <span className="truncate">Upload New Resume</span>
            </button>
          )}
        </div>

        {/* Resumes Table */}
        {isLoading ? (
          // Shimmer loading state
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase bg-slate-100 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-left">
                      RESUME NAME
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-left">
                      UPLOAD DATE
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-left">
                      LATEST SCORE
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-right">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                            <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">
                              description
                            </span>
                          </div>
                          <Shimmer className="h-4 w-32 rounded" />
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <Shimmer className="h-4 w-24 rounded" />
                      </td>

                      <td className="px-6 py-5">
                        <Shimmer className="h-4 w-16 rounded" />
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end items-center gap-2">
                          <Shimmer className="h-8 w-20 rounded" />
                          <Shimmer className="h-8 w-8 rounded-full" />
                          <Shimmer className="h-8 w-8 rounded-full" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : resumes.length > 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase bg-slate-100 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-left">
                      RESUME NAME
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-left">
                      UPLOAD DATE
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-left">
                      LATEST SCORE
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-right">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {resumes.map((resume: any, idx: number) => {
                    const score = resume.latestScore
                    const scoreColor =
                      typeof score === 'number'
                        ? score >= 80
                          ? 'text-green-600 dark:text-green-400'
                          : score >= 60
                            ? 'text-orange-600 dark:text-orange-400'
                            : 'text-red-600 dark:text-red-400'
                        : ''

                    const status =
                      typeof score === 'number'
                        ? score >= 80
                          ? 'trending_up'
                          : score >= 60
                            ? 'horizontal_rule'
                            : 'trending_down'
                        : null

                    return (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <a
                              href={resume.fileUrl} // Cloudinary PDF link
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3"
                            >
                              <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-teal-600 dark:text-teal-400">
                                  description
                                </span>
                              </div>
                              <span className="font-medium text-slate-900 dark:text-white hover:underline">
                                {resume.fileName}
                              </span>
                            </a>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-slate-500 dark:text-slate-400">
                          {new Date(resume.uploadedAt).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: '2-digit',
                              year: 'numeric',
                            },
                          )}
                        </td>

                        <td className="px-6 py-5">
                          {typeof score === 'number' ? (
                            <div className="inline-flex items-center gap-1.5">
                              <span
                                className={`material-symbols-outlined text-base ${scoreColor}`}
                              >
                                {status}
                              </span>
                              <span className={`font-semibold ${scoreColor}`}>
                                {score}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-500 dark:text-slate-400">
                              Not analyzed
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end items-center gap-2">
                            <button
                              onClick={() => setPreviewUrl(resume.fileUrl)}
                              className="inline-flex items-center justify-center gap-2 rounded-lg h-9 px-4 bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 active:bg-teal-800 transition-colors"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => handleReanalyze(resume.fileName)}
                              className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                              title="Re-analyze"
                            >
                              <span className="material-symbols-outlined text-lg">
                                refresh
                              </span>
                            </button>
                            <button
                              onClick={() => handleDelete(resume.fileName)}
                              className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                              title="Delete"
                            >
                              <span className="material-symbols-outlined text-lg">
                                delete
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            {/* Empty State - Only show when no resumes */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center shadow-sm min-h-[60vh] flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 max-w-md">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-slate-400 dark:text-slate-500">
                    description
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    No resumes yet
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Upload your first resume to get started with AI-powered
                    analysis.
                  </p>
                  <button
                    onClick={() => navigate({ to: '/uploadResume' })}
                    className="inline-flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-teal-600 text-white text-sm font-bold shadow-lg shadow-teal-600/20 hover:bg-teal-700 active:bg-teal-800 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">
                      upload_file
                    </span>
                    Upload Your First Resume
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      {previewUrl && (
        <ResumeViewer
          fileUrl={previewUrl}
          onClose={() => setPreviewUrl(null)}
        />
      )}
    </div>
  )
}
