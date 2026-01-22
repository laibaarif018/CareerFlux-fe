import UserHeader from '@/components/UserHeader'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  useAllResumes,
  useSetPrimaryResume,
  useDeleteResume,
} from '@/queries/resume.queries'
import Shimmer from '@/components/Shimmer'
import { requireRole } from '@/utils/RouteGuard'
import Swal from 'sweetalert2'
import { showConfirm, showError, showToast } from '@/utils/swal'

export const Route = createFileRoute('/job-seeker/myResumes')({
  beforeLoad: () => {
    requireRole('jobseeker')
  },
  component: MyResumes,
})

export default function MyResumes() {
  const navigate = useNavigate()

  const page = 1
  const limit = 5

  const { data, isLoading } = useAllResumes(page, limit)
  const setPrimaryMutation = useSetPrimaryResume()
  const deleteResumeMutation = useDeleteResume()

  const resumes = data?.payload?.resumes?.records ?? []

  const handleDelete = async (resumeId: string, resumeName: string) => {
    const result = await showConfirm({
      title: 'Delete Job Posting?',
      text: 'This action cannot be undone.',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
    })

    if (!result.isConfirmed) return

    try {
      await deleteResumeMutation.mutateAsync(resumeId)

      showToast(`"${resumeName}" deleted successfully`, 'success')
    } catch (error: any) {
      showError(
        'Delete Failed',
        error?.response?.data?.message ||
          'Failed to delete resume. Please try again.',
      )
    }
  }
  const handleSetPrimary = async (
    resumeId: string,
    resumeName: string,
    isCurrentlyPrimary: boolean,
  ) => {
    if (isCurrentlyPrimary) {
      showToast(`"${resumeName}" is already your primary resume`, 'info')
      return
    }

    const result = await Swal.fire({
      title: 'Set as Primary Resume?',
      text: `Do you want to set "${resumeName}" as your primary resume? This will replace your current primary resume.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, set as primary',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#0E7C8C',
    })

    if (!result.isConfirmed) return

    try {
      const response = await setPrimaryMutation.mutateAsync(resumeId)

      if (response?.isOnlyResume) {
        showToast(
          `"${resumeName}" is your only resume and has been set as primary`,
          'success',
        )
      } else {
        showToast(`"${resumeName}" set as primary resume`, 'success')
      }
    } catch (error: any) {
      showError(
        'Update Failed',
        error?.response?.data?.message ||
          'Failed to set resume as primary. Please try again.',
      )
    }
  }
  2
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
              onClick={() => navigate({ to: '/job-seeker/uploadResume' })}
              className="inline-flex items-center justify-center gap-2 rounded-lg h-11 px-4 bg-[#0E7C8C] text-white text-sm font-bold shadow-lg shadow-[#0E7C8C]/20 hover:bg-[#3EC3BC] active:bg-[#0E7C8C]/90 transition-colors"
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
                      Resume Name
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-left">
                      Upload Date
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-left">
                      Latest Score
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-left">
                      Status
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-right">
                      Actions
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
                      Resume Name
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-left">
                      Upload Date
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-left">
                      Latest Score
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-left">
                      Status
                    </th>
                    <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {resumes.map((resume: any, idx: number) => {
                    // Try multiple possible ID field names
                    const resumeId = resume._id || resume.id || resume.resumeId

                    // Get the ATS score from analysisResults
                    const atsScore =
                      resume.analysisResults?.ats_compatibility_score
                    const score =
                      typeof atsScore === 'number'
                        ? Math.round(atsScore)
                        : resume.latestScore

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

                    const isPrimary = resume.isPrimary || false

                    return (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <a
                              href={resume.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3"
                            >
                              <div className="w-10 h-10 rounded-lg bg-[#3EC3BC]/20 dark:bg-[#0E7C8C]/30 flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-[#0E7C8C] dark:text-[#3EC3BC]">
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
                          {isPrimary ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#3EC3BC]/20 dark:bg-[#0E7C8C]/30 text-[#0E7C8C] dark:text-[#3EC3BC]">
                              Primary
                            </span>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500 text-sm">
                              NA
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end items-center gap-2">
                            <button
                              onClick={() => {
                                console.log('Resume ID:', resumeId)
                                console.log('Full resume object:', resume)
                                if (resumeId) {
                                  navigate({
                                    to: '/job-seeker/job-details',
                                    search: { id: resumeId },
                                  })
                                } else {
                                  console.error('Resume ID is undefined!')
                                  alert(
                                    'Unable to view details: Resume ID not found',
                                  )
                                }
                              }}
                              className="inline-flex items-center justify-center gap-2 rounded-lg h-9 px-4 bg-[#0E7C8C] text-white text-xs font-semibold hover:bg-[#3EC3BC] active:bg-[#0E7C8C]/90 transition-colors"
                            >
                              View Report
                            </button>

                            <button
                              onClick={() =>
                                handleSetPrimary(
                                  resumeId,
                                  resume.fileName,
                                  isPrimary,
                                )
                              }
                              disabled={setPrimaryMutation.isPending}
                              className={`inline-flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
                                isPrimary
                                  ? 'text-[#0E7C8C] dark:text-[#3EC3BC] bg-[#3EC3BC]/20 dark:bg-[#0E7C8C]/30'
                                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                              } ${setPrimaryMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                              title={
                                isPrimary ? 'Primary Resume' : 'Set as Primary'
                              }
                            >
                              <span
                                className={`material-symbols-outlined text-lg ${isPrimary ? `filled` : ``}`}
                              >
                                star
                              </span>
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(resumeId, resume.fileName)
                              }
                              disabled={deleteResumeMutation.isPending}
                              className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${
                                deleteResumeMutation.isPending
                                  ? 'opacity-50 cursor-not-allowed'
                                  : ''
                              }`}
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
                    onClick={() => navigate({ to: '/job-seeker/uploadResume' })}
                    className="inline-flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-[#0E7C8C] text-white text-sm font-bold shadow-lg shadow-[#0E7C8C]/20 hover:bg-[#3EC3BC] active:bg-[#0E7C8C]/90 transition-colors"
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
    </div>
  )
}
