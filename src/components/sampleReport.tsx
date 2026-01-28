
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
      description: 'Content quality score: 78/100',
    },
    {
      icon: 'palette',
      title: 'Layout Score',
      description: 'Layout quality score: 74/100',
    },
  ]

  const grammarErrors: string[] = []

  const skillGaps = ['Cloud Computing', 'System Design', 'Docker']

  const learningRoadmap = [
    'Learn Docker fundamentals',
    'Practice system design interviews',
    'Build a cloud-deployed project',
  ]

 
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      <main className="max-w-7xl mx-auto px-4 pb-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border">
            <p className="font-bold mb-4">Overall Score</p>

            <div className="relative w-40 h-40 mx-auto">
              <svg viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  strokeWidth="10"
                  stroke="currentColor"
                  className="text-slate-200"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  strokeWidth="10"
                  stroke="currentColor"
                  className="text-[#0E7C8C]"
                  fill="none"
                  strokeDasharray={282.6}
                  strokeDashoffset={282.6 - (282.6 * overallScore) / 100}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold">
                  {overallScore}%
                </span>
                <span className="text-sm text-[#0E7C8C]">{scoreLabel}</span>
              </div>
            </div>
          </div>

          <nav className="bg-white dark:bg-slate-800 p-4 rounded-xl border space-y-1">
            {[
              ['AI Summary', 'ai-summary'],
              ['Strengths & Weaknesses', 'strengths'],
              ['Keyword Analysis', 'keywords'],
              ['Formatting', 'formatting'],
              ['Grammar Check', 'grammar'],
              ['Skill Gaps', 'skills'],
              ['Learning Roadmap', 'learning'],
            ].map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <section className="lg:col-span-8 xl:col-span-9 space-y-6">
          <Section id="ai-summary" title="AI Summary">
            <p>{aiSummary}</p>
          </Section>

          <Section id="strengths" title="Strengths & Weaknesses">
            <div className="grid md:grid-cols-2 gap-6">
              <List title="Strengths" items={strengths} color="teal" />
              <List title="Weaknesses" items={weaknesses} color="orange" />
            </div>
          </Section>

          <Section id="keywords" title="Keyword Analysis">
            <div className="flex flex-wrap gap-2">
              {keywords.map((k) => (
                <span
                  key={k}
                  className="px-3 py-1.5 rounded-full bg-[#3EC3BC]/20 text-[#0E7C8C] text-sm"
                >
                  {k}
                </span>
              ))}
            </div>
          </Section>

          <Section id="formatting" title="Formatting & Content">
            {formattingSuggestions.map((s) => (
              <p key={s.title}>{s.description}</p>
            ))}
          </Section>

          <Section id="grammar" title="Grammar Check">
            {grammarErrors.length === 0 ? (
              <p className="text-green-600">
                No grammar or spelling errors found.
              </p>
            ) : (
              grammarErrors.map((e, i) => <p key={i}>{e}</p>)
            )}
          </Section>

          <Section id="skills" title="Skill Gap Analysis">
            <div className="flex flex-wrap gap-2">
              {skillGaps.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          </Section>

          <Section id="learning" title="Learning Roadmap">
            <ol className="list-decimal pl-5 space-y-2">
              {learningRoadmap.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ol>
          </Section>
        </section>
      </main>
    </div>
  )
}

/* --------------------
   Small helpers
-------------------- */

function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      className="bg-white dark:bg-slate-800 p-6 rounded-xl border space-y-4"
    >
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
    </section>
  )
}

function List({
  title,
  items,
  color,
}: {
  title: string
  items: string[]
  color: 'teal' | 'orange'
}) {
  return (
    <div>
      <h3
        className={`font-semibold mb-2 ${
          color === 'teal' ? 'text-[#0E7C8C]' : 'text-orange-600'
        }`}
      >
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i}>• {i}</li>
        ))}
      </ul>
    </div>
  )
}
