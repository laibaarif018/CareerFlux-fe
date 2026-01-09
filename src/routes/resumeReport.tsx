import UserHeader from '@/components/UserHeader'
import { createFileRoute, useSearch } from '@tanstack/react-router'
import {
  useAnalyzeResume,
  useAnalysisStatus,
  useResumeAnalysis,
} from '@/hooks/useResume'
import { useEffect, useState } from 'react'
import Shimmer, { 
  ShimmerText, 
  ShimmerTitle, 
  ShimmerParagraph, 
  ShimmerButton 
} from '@/components/Shimmer'

export const Route = createFileRoute('/resumeReport')({
  validateSearch: (search: { resumeId?: string }) => ({
    resumeId: search.resumeId,
  }),
  component: ResumeReport,
})

// Update the data extraction section in your ResumeReport component:

export default function ResumeReport() {
  const { resumeId } = useSearch({ from: '/resumeReport' })
  const [hasTriggeredAnalysis, setHasTriggeredAnalysis] = useState(false)

  const analyzeResumeMutation = useAnalyzeResume()
  const { data: statusData } = useAnalysisStatus(resumeId)
  const analysisStatus = statusData?.payload?.analysisStatus

  const { data, error } = useResumeAnalysis(
    analysisStatus === 'completed' ? resumeId : undefined,
    analysisStatus === 'completed'
  )

  useEffect(() => {
    if (!resumeId || hasTriggeredAnalysis) return

    // If analysis already exists (pending, processing, or completed), don't trigger again
    if (analysisStatus === 'pending' || analysisStatus === 'processing' || analysisStatus === 'completed') {
      setHasTriggeredAnalysis(true)
      return
    }

    // Only trigger analysis if status is undefined/null (meaning no analysis has been started)
    if (!analysisStatus) {
      const triggerAnalysis = async () => {
        try {
          await analyzeResumeMutation.mutateAsync(resumeId)
          setHasTriggeredAnalysis(true)
        } catch (err: any) {
          console.error('Failed to trigger analysis:', err)
        }
      }

      triggerAnalysis()
    }
  }, [resumeId, hasTriggeredAnalysis, analysisStatus])

  const showShimmer = analysisStatus !== 'completed' || !data?.payload?.analysisResults
  
  // FIX: Access the nested analysis object
  const analysisData = data?.payload?.analysisResults?.analysis

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
        <UserHeader />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center p-8 max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <span className="material-symbols-outlined text-4xl text-red-600 dark:text-red-400">error</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Error Loading Analysis</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Failed to load analysis data. Please try again later.</p>
            <button
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 h-10 text-sm font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20"
              onClick={() => window.location.reload()}
            >
              <span className="material-symbols-outlined">refresh</span>
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  const getLoadingMessage = () => {
    if (!analysisStatus) return 'Initializing analysis...'
    if (analysisStatus === 'pending') return 'Analysis queued...'
    if (analysisStatus === 'processing') return 'Analyzing your resume...'
    return 'Loading...'
  }

  if (showShimmer) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <UserHeader />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Resume Report
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                {getLoadingMessage()}
              </p>
            </div>
            <div className="h-10 w-40 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <aside className="lg:col-span-4 xl:col-span-3">
              <div className="flex flex-col gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <Shimmer className="h-6 w-32 rounded mb-4" />
                  <Shimmer className="w-40 h-40 mx-auto rounded-full" />
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <Shimmer key={i} className="h-10 rounded-lg" />
                  ))}
                </div>
              </div>
            </aside>

            <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Shimmer className="w-6 h-6 rounded" />
                  <ShimmerTitle width="30%" />
                </div>
                <ShimmerParagraph lines={3} />
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Shimmer className="w-6 h-6 rounded" />
                  <ShimmerTitle width="40%" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="space-y-3">
                      <Shimmer className="h-6 w-24 rounded" />
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="flex gap-2">
                          <Shimmer className="w-5 h-5 rounded flex-shrink-0" />
                          <ShimmerText />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Shimmer className="w-6 h-6 rounded" />
                  <ShimmerTitle width="35%" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <Shimmer key={i} className="h-8 w-20 rounded-full" />
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Shimmer className="w-6 h-6 rounded" />
                  <ShimmerTitle width="50%" />
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4">
                      <Shimmer className="w-10 h-10 rounded-lg flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Shimmer className="h-5 w-32 rounded" />
                        <ShimmerParagraph lines={2} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // FIX: Map the backend structure to match what the UI expects
  const overallScore = Math.round(analysisData?.ats_compatibility_score ?? 0)
  const scoreLabel = overallScore >= 85 ? 'Excellent' : overallScore >= 70 ? 'Good' : 'Needs Improvement'
  const fileName = 'Resume.pdf'
  const aiSummary = analysisData?.summary ?? ''
  const strengths = analysisData?.strengths ?? []
  const weaknesses = analysisData?.weaknesses ?? []
  
  // FIX: Map top_keywords from backend
  const keywords = (analysisData?.keyword_analysis?.top_keywords ?? []).map((k: string) => ({ 
    label: k, 
    found: true 
  }))
  
  // FIX: Grammar check is an array in backend, not an object with errors property
  const grammarErrors = (analysisData?.grammar_and_spelling_check ?? []).map((error: string, idx: number) => ({
    position: `Error ${idx + 1}`,
    message: error
  }))

  const formattingSuggestions = [
    {
      icon: 'article',
      title: 'Content Score',
      description: `Content quality score: ${analysisData?.formatting_content?.content_score ?? 0}/100. ${(analysisData?.formatting_content?.content_score ?? 0) >= 80 ? 'Excellent content quality!' : 'Consider improving content depth and clarity.'}`,
    },
    {
      icon: 'palette',
      title: 'Layout Score',
      description: `Layout quality: ${analysisData?.formatting_content?.layout_score ?? 0}/100. ${(analysisData?.formatting_content?.layout_score ?? 0) >= 80 ? 'Well-structured layout!' : 'Consider improving document structure.'}`,
    },
    {
      icon: 'view_agenda',
      title: 'ATS Compatibility',
      description: `ATS compatibility: ${analysisData?.ats_compatibility_score ?? 0}/100`,
    },
  ]

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleExport = () => {
    console.log('Exporting report...')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans transition-colors">
      <UserHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Resume Report
            </h1>
          </div>
          <button
            onClick={handleExport}
            className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-lg shadow-blue-600/20"
          >
            <span className="material-symbols-outlined text-lg">
              download
            </span>
            Export Report
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-20 flex flex-col gap-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <p className="text-lg font-bold text-slate-900 dark:text-white mb-4">Overall Score</p>
                <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-slate-200 dark:text-slate-700" cx="50" cy="50" r="45" fill="transparent" stroke="currentColor" strokeWidth="10" />
                    <circle
                      className="text-blue-600 dark:text-blue-500"
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="10"
                      style={{
                        strokeDasharray: 282.6,
                        strokeDashoffset: 282.6 - (282.6 * overallScore) / 100,
                        transform: 'rotate(-90deg)',
                        transformOrigin: '50% 50%',
                      }}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{overallScore}%</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">{scoreLabel}</span>
                  </div>
                </div>
              </div>

              <nav className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-1">
                {[
                  { icon: 'insights', label: 'AI Summary', id: 'ai-summary' },
                  { icon: 'check_circle', label: 'Strengths & Weaknesses', id: 'strengths-weaknesses' },
                  { icon: 'sell', label: 'Keyword Analysis', id: 'keyword-analysis' },
                  { icon: 'article', label: 'Formatting & Content', id: 'formatting-content' },
                  { icon: 'spellcheck', label: 'Grammar Check', id: 'grammar-check' },
                  { icon: 'psychology', label: 'Skill Gap Analysis', id: 'skill-gap' },
                  { icon: 'map', label: 'Learning Roadmap', id: 'learning-roadmap' },
                ].map((item) => (
                  <NavItem key={item.label} icon={item.icon} label={item.label} onClick={() => scrollToSection(item.id)} />
                ))}
              </nav>
            </div>
          </aside>

          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
            <Section id="ai-summary" title="AI Summary" icon="insights">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{aiSummary}</p>
            </Section>

            <Section id="strengths-weaknesses" title="Strengths & Weaknesses" icon="check_circle">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StrengthWeaknessColumn title="Strengths" items={strengths} icon="thumb_up" isStrength />
                <StrengthWeaknessColumn title="Weaknesses" items={weaknesses} icon="warning" isStrength={false} />
              </div>
            </Section>

            <Section id="keyword-analysis" title="Keyword Analysis" icon="sell">
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Relevant Keywords Found</h3>
                <div className="flex flex-wrap gap-2">
                  {keywords.length > 0 ? (
                    keywords.map((kw:any, idx:any) => (
                      <span key={idx} className="text-sm font-medium px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">{kw.label}</span>
                    ))
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 text-sm">No relevant keywords identified</p>
                  )}
                </div>
              </div>
              {analysisData?.keyword_analysis?.tag_counts && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Keyword Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(analysisData.keyword_analysis.tag_counts).map(([tag, count]: [string, any]) => (
                      <span key={tag} className="text-sm font-medium px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                        {tag}: {count}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Section>

            <Section id="formatting-content" title="Formatting & Content Suggestions" icon="article">
              <div className="flex flex-col gap-5">
                {formattingSuggestions.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl">{item.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section id="grammar-check" title="Grammar & Spelling Check" icon="spellcheck">
              {grammarErrors.length === 0 ? (
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl">check_circle</span>
                  <p className="text-green-700 dark:text-green-300 font-medium">No grammar or spelling errors found! Your resume looks great.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {grammarErrors.map((error: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                      <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 text-xl mt-0.5">error</span>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">{error.position}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{error.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <Section id="skill-gap" title="Skill Gap Analysis" icon="psychology">
              {(analysisData?.skill_gap_analysis?.gaps?.length ?? 0) === 0 ? (
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-2xl">emoji_events</span>
                  <p className="text-green-700 dark:text-green-300 font-medium">Your skills are well-aligned with industry standards!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Identified Gaps</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysisData.skill_gap_analysis.gaps.map((gap: string, idx: number) => (
                        <span key={idx} className="px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-medium rounded-full">{gap}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Section>

            <Section id="learning-roadmap" title="Learning Roadmap" icon="map">
              {(analysisData?.learning_roadmap?.length ?? 0) === 0 ? (
                <p className="text-slate-600 dark:text-slate-400">No learning recommendations at this time.</p>
              ) : (
                <div className="space-y-4">
                  {analysisData.learning_roadmap.map((item: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-bold">{idx + 1}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">{item}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Focus area for skill development</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </div>
        </div>
      </main>
    </div>
  )
}

function ShimmerLoader({ analysisStatus }: { analysisStatus?: string }) {
  const getMessage = () => {
    if (!analysisStatus) return 'Starting analysis...'
    if (analysisStatus === 'pending') return 'Analysis queued, waiting to start...'
    if (analysisStatus === 'processing') return 'Analyzing your resume with AI...'
    return 'Processing...'
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <Shimmer className="h-8 w-48 rounded" />
            <Shimmer className="h-4 w-32 rounded" />
          </div>
          <ShimmerButton width="w-40" />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-blue-700 dark:text-blue-300 font-medium">{getMessage()} ⏳</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="flex flex-col gap-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <Shimmer className="h-6 w-32 rounded mb-4" />
                <Shimmer className="w-40 h-40 mx-auto rounded-full" />
              </div>
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <Shimmer key={i} className="h-10 rounded-lg" />
                ))}
              </div>
            </div>
          </aside>

          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Shimmer className="w-6 h-6 rounded" />
                <ShimmerTitle width="30%" />
              </div>
              <ShimmerParagraph lines={3} />
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Shimmer className="w-6 h-6 rounded" />
                <ShimmerTitle width="40%" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-3">
                    <Shimmer className="h-6 w-24 rounded" />
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="flex gap-2">
                        <Shimmer className="w-5 h-5 rounded flex-shrink-0" />
                        <ShimmerText />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Shimmer className="w-6 h-6 rounded" />
                <ShimmerTitle width="35%" />
              </div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Shimmer key={i} className="h-8 w-20 rounded-full" />
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Shimmer className="w-6 h-6 rounded" />
                <ShimmerTitle width="50%" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Shimmer className="w-10 h-10 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Shimmer className="h-5 w-32 rounded" />
                      <ShimmerParagraph lines={2} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

function Section({ id, title, icon, children }: { id: string; title: string; icon: string; children: React.ReactNode }) {
  return (
    <section id={id} className="flex flex-col gap-4 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm scroll-mt-24">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">{icon}</span>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function NavItem({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors text-left"
    >
      <span className="material-symbols-outlined text-lg text-slate-500 dark:text-slate-400">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}

function StrengthWeaknessColumn({ title, items, icon, isStrength }: { title: string; items: string[]; icon: string; isStrength: boolean }) {
  const colorClasses = isStrength ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
  const iconName = isStrength ? 'check' : 'close'

  return (
    <div className="flex flex-col gap-3">
      <h3 className={`text-lg font-semibold ${colorClasses} flex items-center gap-2`}>
        <span className="material-symbols-outlined">{icon}</span>
        {title}
      </h3>
      <ul className="space-y-3 text-slate-700 dark:text-slate-300">
        {items.map((item: string, idx: number) => (
          <li key={idx} className="flex items-start gap-3">
            <span className={`material-symbols-outlined ${colorClasses} mt-0.5 text-base flex-shrink-0`}>{iconName}</span>
            <span className="text-sm">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}