import UserHeader from '@/components/UserHeader'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/resumeReport')({
  component: ResumeReport,
})

export default function ResumeReport() {
  const navigate = useNavigate()
  const [overallScore] = useState(85)
  const [scoreLabel] = useState('Good')
  const [fileName] = useState('John_Doe_Resume.pdf')

  const [aiSummary] = useState(
    'Your resume is strong in showcasing experience but lacks critical keywords for the target role. Focus on improving the skills section and formatting consistency.',
  )

  const [strengths] = useState([
    'Clear action verbs are used throughout the work experience section.',
    'Quantifiable achievements are included, demonstrating impact.',
    'Contact information is complete and professionally presented.',
  ])

  const [weaknesses] = useState([
    'A professional summary is missing from the top of the resume.',
    'Date formatting is inconsistent between different job entries.',
    'The skills section could be expanded with more relevant keywords.',
  ])

  const [keywords] = useState([
    { label: 'Project Management', found: true, overused: false },
    { label: 'Leadership', found: true, overused: false },
    { label: 'Budgeting', found: true, overused: false },
    { label: 'Agile', found: false, overused: false },
    { label: 'Scrum', found: false, overused: false },
    { label: 'Communication', found: true, overused: true },
  ])

  const formattingSuggestions = [
    {
      icon: 'person',
      title: 'Add a Professional Summary',
      description:
        'Include a 2-3 sentence summary at the top to highlight your key qualifications and career goals. This gives recruiters a quick snapshot of your expertise.',
    },
    {
      icon: 'calendar_month',
      title: 'Standardize Date Formatting',
      description:
        'Ensure all dates follow a consistent format (e.g., "Month YYYY" or "MM/YYYY"). The current resume uses a mix of formats which can look unprofessional.',
    },
    {
      icon: 'format_size',
      title: 'Check Font Consistency',
      description:
        'While the font is clean, ensure font size and weight are consistent for similar headings and sections. For example, all job titles should have the same styling.',
    },
  ]

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleExport = () => {
    console.log('Exporting report...')
    // Add export logic here
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans transition-colors">
      <UserHeader />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Resume Report
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">
                  description
                </span>
                {fileName}
              </p>
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
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-24 flex flex-col gap-6">
              {/* Overall Score */}
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
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                      {overallScore}%
                    </span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      {scoreLabel}
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
                  This score reflects strong ATS compatibility. Minor tweaks
                  could push it into the excellent range.
                </p>
              </div>

              {/* Navigation */}
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
                    icon: 'bar_chart',
                    label: 'Skill Gap',
                    id: 'skill-gap',
                    to: '/skillGap',
                  },
                  {
                    icon: 'timeline',
                    label: 'Learning Roadmap',
                    id: 'learning-roadmap',
                    to: '/learningRoadmap',
                  },
                ].map((item) => (
                  <NavItem
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    onClick={() => {
                      if (item.to) navigate({ to: item.to })
                      else scrollToSection(item.id)
                    }}
                  />
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
            {/* AI Summary */}
            <Section id="ai-summary" title="AI Summary" icon="insights">
              <p className="text-slate-700 dark:text-slate-300">{aiSummary}</p>
            </Section>

            {/* Strengths & Weaknesses */}
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

            {/* Keyword Analysis */}
            <Section id="keyword-analysis" title="Keyword Analysis" icon="sell">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Keywords found in your resume compared to the target job
                description.
              </p>
              <div className="flex flex-wrap gap-2">
                {keywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className={`text-sm font-medium px-3 py-1.5 rounded-full ${
                      kw.found
                        ? kw.overused
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {kw.label}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-400">
                <Legend color="blue" label="Found" />
                <Legend color="gray" label="Missing" dashed />
                <Legend color="yellow" label="Overused" />
              </div>
            </Section>

            {/* Formatting & Content */}
            <Section
              id="formatting-content"
              title="Formatting & Content Suggestions"
              icon="article"
            >
              <div className="flex flex-col gap-5">
                {formattingSuggestions.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl">
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

            {/* Skill Gap */}
            <Section id="skill-gap" title="Skill Gap" icon="bar_chart">
              <p className="text-slate-600 dark:text-slate-400">
                Highlight the areas where your skills do not match the target
                job requirements. Focus on building these skills to improve your
                resume score.
              </p>
            </Section>

            {/* Learning Roadmap */}
            <Section
              id="learning-roadmap"
              title="Learning Roadmap"
              icon="timeline"
            >
              <p className="text-slate-600 dark:text-slate-400">
                Suggested learning roadmap based on your skill gaps. Follow this
                roadmap to bridge gaps and increase job match potential.
              </p>
            </Section>
          </div>
        </div>
      </main>
    </div>
  )
}

// Components
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
        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
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
    ? 'text-green-600 dark:text-green-400'
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
        {items.map((item: string, idx: number) => (
          <li key={idx} className="flex items-start gap-3">
            <span
              className={`material-symbols-outlined ${colorClasses} mt-0.5 text-base flex-shrink-0`}
            >
              {iconName}
            </span>
            <span className="text-sm">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Legend({
  color,
  label,
  dashed = false,
}: {
  color: string
  label: string
  dashed?: boolean
}) {
  const bgClass =
    color === 'blue'
      ? 'bg-blue-100 dark:bg-blue-900/30'
      : color === 'yellow'
        ? 'bg-yellow-100 dark:bg-yellow-900/30'
        : ''

  return (
    <span className="flex items-center gap-2">
      <span
        className={`w-3 h-3 rounded-full ${
          dashed
            ? 'border-2 border-dashed border-slate-300 dark:border-slate-600'
            : bgClass
        }`}
      />
      <span className="text-xs">{label}</span>
    </span>
  )
}
