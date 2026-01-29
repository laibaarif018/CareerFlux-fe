export default function SampleReport() {
  // --------------------
  // HARD-CODED SAMPLE DATA
  // --------------------
  const overallScore = 82
  const scoreLabel = 'Good'

  const aiSummary =
    'Your resume demonstrates strong technical fundamentals and relevant experience. Improving keyword alignment and formatting consistency can significantly enhance ATS compatibility.'

  const strengths = [
    'Strong React and TypeScript knowledge',
    'Clear project experience',
    'Good problem-solving skills',
  ]

  const weaknesses = [
    'Missing industry keywords',
    'Inconsistent formatting',
    'Limited leadership examples',
  ]

  const keywords = [
    'React',
    'TypeScript',
    'Node.js',
    'REST APIs',
    'MongoDB',
    'Tailwind CSS',
  ]

  const formattingSuggestions = [
    {
      icon: 'article',
      title: 'Content Score',
      score: 78,
      description: 'Content quality score: 78/100',
    },
    {
      icon: 'palette',
      title: 'Layout Score',
      score: 74,
      description: 'Layout quality score: 74/100',
    },
  ]

  const grammarErrors: string[] = []

  const skillGaps = ['Cloud Computing', 'System Design', 'Docker']

  const learningRoadmap = [
    {
      title: 'Learn Docker fundamentals',
      duration: '2-3 weeks',
      priority: 'High',
    },
    {
      title: 'Practice system design interviews',
      duration: '4-6 weeks',
      priority: 'High',
    },
    {
      title: 'Build a cloud-deployed project',
      duration: '3-4 weeks',
      priority: 'Medium',
    },
  ]

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 font-sans">
              
      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-6">
          {/* Score Card */}
          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[#0E7C8C] dark:text-[#3EC3BC]">
                analytics
              </span>
              <p className="font-bold text-slate-900 dark:text-white">
                Overall Score
              </p>
            </div>

            <div className="relative w-44 h-44 mx-auto">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#0E7C8C]/20 to-[#3EC3BC]/20 blur-xl"></div>

              <svg viewBox="0 0 100 100" className="relative">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  strokeWidth="8"
                  stroke="currentColor"
                  className="text-slate-200 dark:text-slate-700"
                  fill="transparent"
                />
                {/* Progress circle with gradient */}
                <defs>
                  <linearGradient
                    id="scoreGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#0E7C8C" />
                    <stop offset="100%" stopColor="#3EC3BC" />
                  </linearGradient>
                </defs>
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  strokeWidth="8"
                  stroke="url(#scoreGradient)"
                  fill="transparent"
                  strokeDasharray={282.6}
                  strokeDashoffset={282.6 - (282.6 * overallScore) / 100}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  className="transition-all duration-1000"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-extrabold bg-gradient-to-br from-[#0E7C8C] to-[#3EC3BC] bg-clip-text text-transparent">
                  {overallScore}
                </span>
                <span className="text-sm font-semibold text-[#0E7C8C] dark:text-[#3EC3BC] mt-1">
                  {scoreLabel}
                </span>
              </div>
            </div>

            {/* Score breakdown */}
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  ATS Compatibility
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  85%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Content Quality
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  78%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Format & Style
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  74%
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg sticky top-6">

            <div className="space-y-1">
              {[
                ['AI Summary', 'ai-summary', 'psychology'],
                ['Strengths & Weaknesses', 'strengths', 'balance'],
                ['Keyword Analysis', 'keywords', 'tag'],
                ['Formatting', 'formatting', 'brush'],
                ['Grammar Check', 'grammar', 'spellcheck'],
                ['Skill Gaps', 'skills', 'lightbulb'],
                ['Learning Roadmap', 'learning', 'school'],
              ].map(([label, id, icon]) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gradient-to-r hover:from-[#0E7C8C]/10 hover:to-[#3EC3BC]/10 dark:hover:from-[#0E7C8C]/20 dark:hover:to-[#3EC3BC]/20 transition-all group flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 group-hover:text-[#0E7C8C] dark:group-hover:text-[#3EC3BC] text-[18px] transition-colors">
                    {icon}
                  </span>
                  <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-[#0E7C8C] dark:group-hover:text-[#3EC3BC] font-medium transition-colors">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Content */}
        <section className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* AI Summary */}
          <Section
            id="ai-summary"
            title="AI Summary"
            icon="psychology"
            gradient="from-purple-500 to-purple-600"
          >
            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#0E7C8C] to-[#3EC3BC] rounded-full"></div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-4">
                {aiSummary}
              </p>
            </div>
          </Section>

          {/* Strengths & Weaknesses */}
          <Section
            id="strengths"
            title="Strengths & Weaknesses"
            icon="balance"
            gradient="from-blue-500 to-blue-600"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-6 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-green-600 dark:text-green-400">
                    check_circle
                  </span>
                  <h3 className="font-semibold text-green-700 dark:text-green-400">
                    Strengths
                  </h3>
                </div>
                <ul className="space-y-3">
                  {strengths.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-slate-700 dark:text-slate-300"
                    >
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 p-6 rounded-xl border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-orange-600 dark:text-orange-400">
                    warning
                  </span>
                  <h3 className="font-semibold text-orange-700 dark:text-orange-400">
                    Areas to Improve
                  </h3>
                </div>
                <ul className="space-y-3">
                  {weaknesses.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-slate-700 dark:text-slate-300"
                    >
                      <span className="text-orange-500 mt-0.5">•</span>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          {/* Keyword Analysis */}
          <Section
            id="keywords"
            title="Keyword Analysis"
            icon="tag"
            gradient="from-teal-500 to-cyan-600"
          >
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Keywords found in your resume that match industry standards:
            </p>
            <div className="flex flex-wrap gap-2">
              {keywords.map((k, idx) => (
                <span
                  key={k}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-[#0E7C8C]/10 to-[#3EC3BC]/10 border border-[#0E7C8C]/20 text-[#0E7C8C] dark:text-[#3EC3BC] text-sm font-medium hover:scale-105 transition-transform cursor-default"
                  style={{
                    animationDelay: `${idx * 0.1}s`,
                  }}
                >
                  {k}
                </span>
              ))}
            </div>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px]">
                  info
                </span>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Tip:</strong> Add more industry-specific keywords to
                  increase your ATS score by 15-20%.
                </p>
              </div>
            </div>
          </Section>

          {/* Formatting & Content */}
          <Section
            id="formatting"
            title="Formatting & Content"
            icon="brush"
            gradient="from-indigo-500 to-purple-600"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              {formattingSuggestions.map((s) => (
                <div
                  key={s.title}
                  className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-5 rounded-xl border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0E7C8C] to-[#3EC3BC] flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-[20px]">
                          {s.icon}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">
                        {s.title}
                      </h4>
                    </div>
                    <span className="text-2xl font-bold text-[#0E7C8C] dark:text-[#3EC3BC]">
                      {s.score}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-600 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0E7C8C] to-[#3EC3BC] rounded-full transition-all duration-1000"
                      style={{ width: `${s.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Grammar Check */}
          <Section
            id="grammar"
            title="Grammar Check"
            icon="spellcheck"
            gradient="from-green-500 to-emerald-600"
          >
            {grammarErrors.length === 0 ? (
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-white text-2xl">
                    check_circle
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-green-700 dark:text-green-400 mb-1">
                    Perfect Grammar!
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-300">
                    No grammar or spelling errors found in your resume.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {grammarErrors.map((e, i) => (
                  <div
                    key={i}
                    className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                  >
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {e}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Skill Gap Analysis */}
          <Section
            id="skills"
            title="Skill Gap Analysis"
            icon="lightbulb"
            gradient="from-amber-500 to-orange-600"
          >
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Skills that could strengthen your profile:
            </p>
            <div className="flex flex-wrap gap-3">
              {skillGaps.map((s, idx) => (
                <span
                  key={s}
                  className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 border border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300 text-sm font-medium hover:scale-105 transition-transform cursor-default shadow-sm"
                  style={{
                    animationDelay: `${idx * 0.1}s`,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </Section>

          {/* Learning Roadmap */}
          <Section
            id="learning"
            title="Learning Roadmap"
            icon="school"
            gradient="from-violet-500 to-purple-600"
          >
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Recommended learning path to fill skill gaps and boost your
              profile:
            </p>
            <div className="space-y-4">
              {learningRoadmap.map((item, idx) => (
                <div
                  key={idx}
                  className="relative pl-8 pb-6 last:pb-0 border-l-2 border-slate-200 dark:border-slate-700 last:border-l-0"
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gradient-to-br from-[#0E7C8C] to-[#3EC3BC] border-4 border-white dark:border-slate-900"></div>

                  <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-900 dark:text-white flex-1">
                        {item.title}
                      </h4>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          item.priority === 'High'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <span className="material-symbols-outlined text-[16px]">
                        schedule
                      </span>
                      <span>{item.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </section>
      </main>
    </div>
  )
}

/* --------------------
   Enhanced Section Component
-------------------- */
function Section({
  id,
  title,
  icon,
  gradient,
  children,
}: {
  id: string
  title: string
  icon: string
  gradient: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all scroll-mt-24"
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
        >
          <span className="material-symbols-outlined text-white text-2xl">
            {icon}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {title}
        </h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  )
}