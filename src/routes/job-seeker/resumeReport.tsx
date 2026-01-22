import UserHeader from '@/components/UserHeader'
import { createFileRoute, useSearch, useNavigate } from '@tanstack/react-router'
import {
  useAnalyzeResume,
  useAnalysisStatus,
  useResumeAnalysis,
} from '@/queries/resume.queries'
import { useEffect, useState } from 'react'
import Shimmer, {
  ShimmerText,
  ShimmerTitle,
  ShimmerParagraph,
  ShimmerButton,
} from '@/components/Shimmer'
import { requireRole } from '@/utils/RouteGuard'

export const Route = createFileRoute('/job-seeker/resumeReport')({
  validateSearch: (search: { resumeId?: string }) => ({
    resumeId: search.resumeId,
  }),
  beforeLoad: () => {
      requireRole('jobseeker')
    },
    component: ResumeReport,
 })
 

export default function ResumeReport() {
  const { resumeId } = useSearch({ from: '/job-seeker/resumeReport' })
  const navigate = useNavigate()
  console.log('resumeId', resumeId)
  const [hasTriggeredAnalysis, setHasTriggeredAnalysis] = useState(false)

  const analyzeResumeMutation = useAnalyzeResume()
  const { data: statusData } = useAnalysisStatus(resumeId)
  const analysisStatus = statusData?.payload?.analysisStatus

  const { data, error } = useResumeAnalysis(
    analysisStatus === 'completed' ? resumeId : undefined,
    analysisStatus === 'completed',
  )

  useEffect(() => {
    if (!resumeId || hasTriggeredAnalysis) return

    if (
      analysisStatus === 'pending' ||
      analysisStatus === 'processing' ||
      analysisStatus === 'completed'
    ) {
      setHasTriggeredAnalysis(true)
      return
    }

    const triggerAnalysis = async () => {
      try {
        await analyzeResumeMutation.mutateAsync(resumeId)
        setHasTriggeredAnalysis(true)
      } catch (err: any) {
        console.error('Failed to trigger analysis:', err)
      }
    }

    triggerAnalysis()
  }, [resumeId, hasTriggeredAnalysis, analysisStatus])

  const showShimmer =
    analysisStatus !== 'completed' || !data?.payload?.analysisResults
  const analysis = data?.payload?.analysisResults

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
        <UserHeader />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center p-8 max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <span className="material-symbols-outlined text-4xl text-red-600 dark:text-red-400">
                error
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Error Loading Analysis
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Failed to load analysis data. Please try again later.
            </p>
            <button
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0E7C8C] px-4 h-10 text-sm font-bold text-white hover:bg-[#3EC3BC] shadow-lg shadow-[#0E7C8C]/20"
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

  if (showShimmer) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <UserHeader />
        <ShimmerLoader />
      </div>
    )
  }

  // Fixed data extraction to handle both response formats
  const overallScore = Math.round(analysis?.ats_compatibility_score ?? 0)
  const scoreLabel =
    overallScore >= 85
      ? 'Excellent'
      : overallScore >= 70
        ? 'Good'
        : 'Needs Improvement'

  // Handle both 'summary' and 'ai_summary' fields
  const aiSummary =
    analysis?.analysis?.summary ||
    analysis?.ai_summary ||
    'No summary available'

  // Handle strengths - can be in analysis.strengths or top-level strengths
  const strengths = Array.isArray(analysis?.analysis?.strengths)
    ? analysis.analysis.strengths
    : Array.isArray(analysis?.strengths)
      ? analysis.strengths
      : []

  // Handle weaknesses - can be in analysis.weaknesses or top-level weaknesses
  const weaknesses = Array.isArray(analysis?.analysis?.weaknesses)
    ? analysis.analysis.weaknesses
    : Array.isArray(analysis?.weaknesses)
      ? analysis.weaknesses
      : []

  // Handle keyword extraction - multiple possible formats
  const keywordData =
    analysis?.keyword_analysis?.top_keywords ||
    analysis?.keyword_analysis?.skills ||
    analysis?.keyword_analysis?.industry ||
    []
  const keywords = Array.isArray(keywordData)
    ? keywordData.map((k: any) => ({
        label: typeof k === 'string' ? k : String(k),
        found: true,
      }))
    : []

  // Handle grammar errors - can be array or object with errors property
  const grammarData =
    analysis?.grammar_and_spelling_check?.errors ||
    analysis?.grammar_and_spelling_check ||
    []
  const grammarErrors = Array.isArray(grammarData)
    ? grammarData.map((item: any) => ({
        position: 'Unknown',
        message: typeof item === 'string' ? item : String(item),
      }))
    : []

  // Handle formatting scores - can be nested differently
  const contentScore =
    analysis?.formatting_content?.Content?.Score ||
    analysis?.formatting_content?.content_score ||
    0
  const layoutScore =
    analysis?.formatting_content?.Formatting?.Score ||
    analysis?.formatting_content?.layout_score ||
    0

  const formattingSuggestions = [
    {
      icon: 'article',
      title: 'Content Score',
      description: `Content quality score: ${contentScore}/100`,
    },
    {
      icon: 'palette',
      title: 'Layout Score',
      description: `Layout quality score: ${layoutScore}/100`,
    },
  ]

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleExport = () => {
    console.log('Exporting report...')
  }

  // Safely extract skill gaps - handle different formats
  let skillGapData = []

  if (Array.isArray(analysis?.skill_gap_analysis?.gaps)) {
    // Format 1: { gaps: ["Databases", "Cloud Computing"] }
    skillGapData = analysis.skill_gap_analysis.gaps
  } else if (Array.isArray(analysis?.skill_gap_analysis?.['Missing skills'])) {
    // Format 2: { "Missing skills": [...] }
    skillGapData = analysis.skill_gap_analysis['Missing skills']
  } else if (Array.isArray(analysis?.skill_gap_analysis?.['Required skills'])) {
    // Format 3: { "Required skills": [...] }
    skillGapData = analysis.skill_gap_analysis['Required skills']
  }

  const validSkillGaps = Array.isArray(skillGapData)
    ? skillGapData.filter(
        (gap: any) => typeof gap === 'string' || typeof gap === 'number',
      )
    : []

  // Safely extract learning roadmap - handle different formats
  let learningData = []

  if (Array.isArray(analysis?.learning_roadmap)) {
    // Format 1: Direct array ["Databases", "Cloud Computing"]
    learningData = analysis.learning_roadmap
  } else if (analysis?.learning_roadmap?.['Required courses']) {
    // Format 2: Nested object { "Required courses": [...] }
    learningData = analysis.learning_roadmap['Required courses']
  }

  const validLearningRoadmap = Array.isArray(learningData)
    ? learningData.filter(
        (item: any) => typeof item === 'string' || typeof item === 'number',
      )
    : []

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans transition-colors">
      <UserHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate({ to: '/job-seeker/myResumes' })}
              className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">
                arrow_back
              </span>
              Back to Resumes
            </button>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Resume Report
              </h1>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg bg-[#0E7C8C] text-white text-sm font-semibold hover:bg-[#3EC3BC] active:bg-[#0E7C8C]/90 transition-colors shadow-lg shadow-[#0E7C8C]/20"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            Export Report
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-20 flex flex-col gap-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <p className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Overall Score
                </p>
                <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      className="text-slate-200 dark:text-slate-700"
                      cx="50"
                      cy="50"
                      r="45"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="10"
                    />
                    <circle
                      className="text-[#0E7C8C] dark:text-[#3EC3BC]"
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
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                      {overallScore}%
                    </span>
                    <span className="text-sm font-medium text-[#0E7C8C] dark:text-[#3EC3BC]">
                      {scoreLabel}
                    </span>
                  </div>
                </div>
              </div>

              <nav className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col gap-1">
                {[
                  { icon: 'insights', label: 'AI Summary', id: 'ai-summary' },
                  {
                    icon: 'check_circle',
                    label: 'Strengths & Weaknesses',
                    id: 'strengths-weaknesses',
                  },
                  {
                    icon: 'sell',
                    label: 'Keyword Analysis',
                    id: 'keyword-analysis',
                  },
                  {
                    icon: 'article',
                    label: 'Formatting & Content',
                    id: 'formatting-content',
                  },
                  {
                    icon: 'spellcheck',
                    label: 'Grammar Check',
                    id: 'grammar-check',
                  },
                  {
                    icon: 'psychology',
                    label: 'Skill Gap Analysis',
                    id: 'skill-gap',
                  },
                  {
                    icon: 'map',
                    label: 'Learning Roadmap',
                    id: 'learning-roadmap',
                  },
                ].map((item) => (
                  <NavItem
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    onClick={() => scrollToSection(item.id)}
                  />
                ))}
              </nav>
            </div>
          </aside>

          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
            <Section id="ai-summary" title="AI Summary" icon="insights">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {aiSummary}
              </p>
            </Section>

            <Section
              id="strengths-weaknesses"
              title="Strengths & Weaknesses"
              icon="check_circle"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StrengthWeaknessColumn
                  title="Strengths"
                  items={strengths}
                  icon="thumb_up"
                  isStrength
                />
                <StrengthWeaknessColumn
                  title="Weaknesses"
                  items={weaknesses}
                  icon="warning"
                  isStrength={false}
                />
              </div>
            </Section>

            <Section id="keyword-analysis" title="Keyword Analysis" icon="sell">
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Top Keywords Found
                </h3>
                <div className="flex flex-wrap gap-2">
                  {keywords.length > 0 ? (
                    keywords.map((kw: any, idx: number) => (
                      <span
                        key={idx}
                        className="text-sm font-medium px-3 py-1.5 rounded-full bg-[#3EC3BC]/20 dark:bg-[#0E7C8C]/30 text-[#0E7C8C] dark:text-[#3EC3BC]"
                      >
                        {kw.label}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      No relevant keywords identified
                    </p>
                  )}
                </div>
              </div>
            </Section>

            <Section
              id="formatting-content"
              title="Formatting & Content Suggestions"
              icon="article"
            >
              <div className="flex flex-col gap-5">
                {formattingSuggestions.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#3EC3BC]/20 dark:bg-[#0E7C8C]/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#0E7C8C] dark:text-[#3EC3BC] text-xl">
                        {item.icon}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section
              id="grammar-check"
              title="Grammar & Spelling Check"
              icon="spellcheck"
            >
              {grammarErrors.length === 0 ? (
                <div className="flex items-center gap-3 p-4 bg-[#3EC3BC]/10 dark:bg-[#0E7C8C]/20 border border-[#3EC3BC]/30 dark:border-[#0E7C8C]/40 rounded-lg">
                  <span className="material-symbols-outlined text-[#0E7C8C] dark:text-[#3EC3BC] text-2xl">
                    check_circle
                  </span>
                  <p className="text-[#0E7C8C] dark:text-[#3EC3BC] font-medium">
                    No grammar or spelling errors found! Your resume looks
                    great.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {grammarErrors.map((error: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg"
                    >
                      <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 text-xl mt-0.5">
                        error
                      </span>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                          {error.message}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <Section
              id="skill-gap"
              title="Skill Gap Analysis"
              icon="psychology"
            >
              {validSkillGaps.length === 0 ? (
                <div className="flex items-center gap-3 p-4 bg-[#3EC3BC]/10 dark:bg-[#0E7C8C]/20 border border-[#3EC3BC]/30 dark:border-[#0E7C8C]/40 rounded-lg">
                  <span className="material-symbols-outlined text-[#0E7C8C] dark:text-[#3EC3BC] text-2xl">
                    emoji_events
                  </span>
                  <p className="text-[#0E7C8C] dark:text-[#3EC3BC] font-medium">
                    Your skills are well-aligned with industry standards!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                      Identified Gaps
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {validSkillGaps.map((gap: any, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-medium rounded-full"
                        >
                          {String(gap)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Section>

            <Section id="learning-roadmap" title="Learning Roadmap" icon="map">
              {validLearningRoadmap.length === 0 ? (
                <p className="text-slate-600 dark:text-slate-400">
                  No learning recommendations at this time.
                </p>
              ) : (
                <div className="space-y-4">
                  {validLearningRoadmap.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-4 bg-gradient-to-r from-[#3EC3BC]/10 to-[#0E7C8C]/10 dark:from-[#0E7C8C]/20 dark:to-[#3EC3BC]/20 border border-[#3EC3BC]/30 dark:border-[#0E7C8C]/40 rounded-lg"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#0E7C8C] dark:bg-[#3EC3BC] flex items-center justify-center text-white dark:text-slate-900 font-bold">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">
                          {String(item)}
                        </h3>
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

function ShimmerLoader() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Shimmer className="h-10 w-40 rounded-lg" />
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Resume Report
              </h1>
            </div>
          </div>
          <ShimmerButton width="w-40" />
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
    </>
  )
}

function Section({
  id,
  title,
  icon,
  children,
}: {
  id: string
  title: string
  icon: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className="flex flex-col gap-4 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm scroll-mt-24"
    >
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-[#0E7C8C] dark:text-[#3EC3BC]">
          {icon}
        </span>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}

function NavItem({
  icon,
  label,
  onClick,
}: {
  icon: string
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors text-left"
    >
      <span className="material-symbols-outlined text-lg text-slate-500 dark:text-slate-400">
        {icon}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  )
}

function StrengthWeaknessColumn({
  title,
  items,
  icon,
  isStrength,
}: {
  title: string
  items: string[]
  icon: string
  isStrength: boolean
}) {
  const colorClasses = isStrength
    ? 'text-[#0E7C8C] dark:text-[#3EC3BC]'
    : 'text-orange-600 dark:text-orange-400'
  const iconName = isStrength ? 'check' : 'close'

  return (
    <div className="flex flex-col gap-3">
      <h3
        className={`text-lg font-semibold ${colorClasses} flex items-center gap-2`}
      >
        <span className="material-symbols-outlined">{icon}</span>
        {title}
      </h3>
      <ul className="space-y-3 text-slate-700 dark:text-slate-300">
        {items.length > 0 ? (
          items.map((item: string, idx: number) => (
            <li key={idx} className="flex items-start gap-3">
              <span
                className={`material-symbols-outlined ${colorClasses} mt-0.5 text-base flex-shrink-0`}
              >
                {iconName}
              </span>
              <span className="text-sm">{String(item)}</span>
            </li>
          ))
        ) : (
          <li className="text-sm text-slate-500 dark:text-slate-400">
            No {title.toLowerCase()} identified
          </li>
        )}
      </ul>
    </div>
  )
}
