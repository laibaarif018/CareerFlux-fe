import { createFileRoute, useNavigate, Navigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  useResumeStatus,
  useParsedResumeData,
  useAnalyzeResume,
} from '@/queries/resume.queries'
import Shimmer, { ShimmerInput } from '@/components/Shimmer'

export const Route = createFileRoute(`/job-seeker/parsedResume/$resumeId`)({
  component: ParsedResumeDetails
})

export default function ParsedResumeDetails() {

  const { resumeId } = Route.useParams()
  const navigate = useNavigate()

  // Analysis state
  const [isStartingAnalysis, setIsStartingAnalysis] = useState(false)
  const analyzeResumeMutation = useAnalyzeResume()

  // State
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [skills, setSkills] = useState<string[]>([])
  const [workExperience, setWorkExperience] = useState<any[]>([])
  const [education, setEducation] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [newSkill, setNewSkill] = useState('')

  // Poll resume status
  const { data: statusData } = useResumeStatus(resumeId)
  const parsingStatus = statusData?.payload.parsingStatus
  console.log('parsing status', parsingStatus)

  // Fetch parsed data only when completed
  const { data: parsedData, error } = useParsedResumeData(
    parsingStatus === 'completed' ? resumeId : undefined,
  )

  // Show shimmer while parsing or parsedData not ready
  const showShimmer =
    parsingStatus !== 'completed' || !parsedData?.payload?.parsedData

  // Map parsed data to UI state
  useEffect(() => {
    const data = parsedData?.payload?.parsedData
    console.log('data', data)
    if (!data) return

    setPersonalInfo({
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
    })
    setSkills(data.skills || [])
    setWorkExperience(data.experience || [])
    setEducation(
      (data.education || []).map((edu: any) => ({
        university: edu.institute || edu.university || '',
        degree: edu.degree || edu.title || '',
        duration: edu.duration || '',
      })),
    )
    setProjects(
      (data.projects || []).map((proj: any) => ({
        title: proj.title || '',
        duration:
          proj.start_date && proj.end_date
            ? `${proj.start_date} - ${proj.end_date}`
            : proj.start_date || proj.end_date || '',
      })),
    )
  }, [parsedData])

  // Handle Run AI Analysis click
  const handleRunAnalysis = async () => {
    try {
      setIsStartingAnalysis(true)
      console.log('🚀 Starting analysis for resumeId:', resumeId)

      // Trigger the analysis API
      await analyzeResumeMutation.mutateAsync(resumeId)

      console.log('✅ Analysis started, navigating to report...')

      // Navigate to report page
      navigate({
        to: '/job-seeker/resumeReport',
        search: {
          resumeId: resumeId,
        },
      })
    } catch (err: any) {
      console.error('❌ Failed to start analysis:', err)
      setIsStartingAnalysis(false)
      // Optionally show an error toast here
    }
  }

  // Error handling
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <span className="material-symbols-outlined text-4xl text-red-600 dark:text-red-400">
              error
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Error Loading Resume
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Failed to load resume data. Please try again later.
          </p>
          <button
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 h-10 text-sm font-bold text-white hover:bg-teal-700 shadow-lg shadow-teal-600/20"
            onClick={() => window.location.reload()}
          >
            <span className="material-symbols-outlined">refresh</span>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Helper functions
  function updateWorkExperience(index: number, key: string, value: string) {
    const updated = [...workExperience]
    updated[index] = { ...updated[index], [key]: value }
    setWorkExperience(updated)
  }

  function updateEducation(index: number, key: string, value: string) {
    const updated = [...education]
    updated[index] = { ...updated[index], [key]: value }
    setEducation(updated)
  }

  function updateProject(index: number, key: string, value: string) {
    const updated = [...projects]
    updated[index] = { ...updated[index], [key]: value }
    setProjects(updated)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-8">
        {/* Header */}
        <header className="sticky top-5 z-10 flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-4 shadow-sm mb-8">
          <div className="flex items-center gap-3 text-slate-900 dark:text-white">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30">
              <span className="material-symbols-outlined text-teal-600 dark:text-teal-400">
                description
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Parsed Resume Details</h1>
              {showShimmer ? (
                <div className="flex items-center gap-2 mt-1">
                  <span className="material-symbols-outlined text-xs text-teal-600 dark:text-teal-400 animate-pulse">
                    hourglass_empty
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 animate-pulse">
                    Processing resume...
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Last parsed: Just now
                </p>
              )}
            </div>
          </div>

          {showShimmer ? (
            <Shimmer className="h-10 w-40 rounded-lg" />
          ) : (
            <button
              onClick={handleRunAnalysis}
              disabled={isStartingAnalysis}
              className="flex items-center gap-2 rounded-lg bg-teal-600 px-5 h-10 text-sm font-bold text-white hover:bg-teal-700 shadow-lg shadow-teal-600/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isStartingAnalysis ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Starting Analysis...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">
                    auto_awesome
                  </span>
                  Run AI Analysis
                </>
              )}
            </button>
          )}
        </header>

        <main className="flex flex-col gap-8">
          {/* Personal Info Section */}
          <Section title="Personal Info" icon="person">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {showShimmer ? (
                <>
                  <ShimmerInput />
                  <ShimmerInput />
                  <ShimmerInput />
                </>
              ) : (
                <>
                  <Input
                    label="Name"
                    value={personalInfo.name}
                    onChange={(val: any) =>
                      setPersonalInfo({ ...personalInfo, name: val })
                    }
                  />
                  <Input
                    label="Email"
                    value={personalInfo.email}
                    onChange={(val: any) =>
                      setPersonalInfo({ ...personalInfo, email: val })
                    }
                  />
                  <Input
                    label="Phone"
                    value={personalInfo.phone}
                    onChange={(val: any) =>
                      setPersonalInfo({ ...personalInfo, phone: val })
                    }
                  />
                </>
              )}
            </div>
          </Section>

          {/* Skills Section */}
          <Section title="Skills" icon="psychology">
            {showShimmer ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-3 mb-4">
                  <Shimmer className="h-9 w-20 rounded-lg" />
                  <Shimmer className="h-9 w-28 rounded-lg" />
                  <Shimmer className="h-9 w-24 rounded-lg" />
                  <Shimmer className="h-9 w-32 rounded-lg" />
                  <Shimmer className="h-9 w-20 rounded-lg" />
                </div>
                <Shimmer className="h-12 w-full md:w-1/2 rounded-lg" />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-2 rounded-lg bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-100 border border-teal-100 dark:border-teal-800 px-3 py-1.5 text-sm font-medium hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
                    >
                      {skill}
                      <button
                        className="flex items-center justify-center w-5 h-5 rounded-full hover:bg-teal-200 dark:hover:bg-teal-800 text-teal-400 hover:text-teal-700 dark:text-teal-300 dark:hover:text-white transition-colors"
                        onClick={() =>
                          setSkills(skills.filter((s) => s !== skill))
                        }
                      >
                        <span className="material-symbols-outlined text-sm">
                          close
                        </span>
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  placeholder="Type a new skill and press Enter..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newSkill.trim()) {
                      setSkills([...skills, newSkill.trim()])
                      setNewSkill('')
                    }
                  }}
                  className="w-full md:w-1/2 rounded-lg text-slate-900 dark:text-white border-dashed border-2 border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-transparent px-4 py-2.5 text-sm hover:border-teal-500 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all placeholder:text-slate-500 outline-none"
                />
              </div>
            )}
          </Section>

          {/* Work Experience Section */}
          <Section title="Work Experience" icon="work">
            {showShimmer ? (
              <div className="flex flex-col gap-8">
                {[1, 2].map((idx) => (
                  <div
                    key={idx}
                    className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700"
                  >
                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-full"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <ShimmerInput />
                      <ShimmerInput />
                      <ShimmerInput className="md:col-span-2" />
                    </div>
                  </div>
                ))}
                <Shimmer className="h-10 w-40 rounded-lg" />
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {workExperience.length > 0 ? (
                  workExperience.map((exp, idx) => (
                    <div
                      key={idx}
                      className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700"
                    >
                      <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-full"></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <Input
                          label="Role"
                          value={exp.role || ''}
                          onChange={(val: any) =>
                            updateWorkExperience(idx, 'role', val)
                          }
                        />
                        <Input
                          label="Company"
                          value={exp.company || ''}
                          onChange={(val: any) =>
                            updateWorkExperience(idx, 'company', val)
                          }
                        />
                        <Input
                          label="Duration"
                          value={exp.duration || ''}
                          onChange={(val: any) =>
                            updateWorkExperience(idx, 'duration', val)
                          }
                          span
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() =>
                            setWorkExperience(
                              workExperience.filter((_, i) => i !== idx),
                            )
                          }
                          className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
                        >
                          <span className="material-symbols-outlined text-base">
                            delete
                          </span>{' '}
                          Remove Position
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    No work experience found
                  </p>
                )}
                <AddButton
                  onClick={() =>
                    setWorkExperience([
                      ...workExperience,
                      {
                        role: '',
                        company: '',
                        duration: '',
                      },
                    ])
                  }
                >
                  Add Experience
                </AddButton>
              </div>
            )}
          </Section>

          {/* Education Section */}
          <Section title="Education" icon="school">
            {showShimmer ? (
              <div className="flex flex-col gap-8">
                <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-full"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <ShimmerInput />
                    <ShimmerInput />
                    <ShimmerInput className="md:col-span-2" />
                  </div>
                </div>
                <Shimmer className="h-10 w-40 rounded-lg" />
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {education.length > 0 ? (
                  education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700"
                    >
                      <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-full"></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <Input
                          label="University"
                          value={edu.university || ''}
                          onChange={(val: any) =>
                            updateEducation(idx, 'university', val)
                          }
                        />
                        <Input
                          label="Degree"
                          value={edu.degree || ''}
                          onChange={(val: any) =>
                            updateEducation(idx, 'degree', val)
                          }
                        />
                        <Input
                          label="Duration"
                          value={edu.duration || ''}
                          onChange={(val: any) =>
                            updateEducation(idx, 'duration', val)
                          }
                          span
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() =>
                            setEducation(education.filter((_, i) => i !== idx))
                          }
                          className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
                        >
                          <span className="material-symbols-outlined text-base">
                            delete
                          </span>{' '}
                          Remove Education
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    No education found
                  </p>
                )}
                <AddButton
                  onClick={() =>
                    setEducation([
                      ...education,
                      { university: '', degree: '', duration: '' },
                    ])
                  }
                >
                  Add Education
                </AddButton>
              </div>
            )}
          </Section>

          {/* Projects Section */}
          <Section title="Projects" icon="assignment">
            {showShimmer ? (
              <div className="flex flex-col gap-8">
                <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-full"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <ShimmerInput />
                    <ShimmerInput />
                  </div>
                </div>
                <Shimmer className="h-10 w-40 rounded-lg" />
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {projects.length > 0 ? (
                  projects.map((project, idx) => (
                    <div
                      key={idx}
                      className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700"
                    >
                      <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-full"></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <Input
                          label="Title"
                          value={project.title || ''}
                          onChange={(val: any) =>
                            updateProject(idx, 'title', val)
                          }
                          span
                        />
                        <Input
                          label="Duration"
                          value={project.duration || ''}
                          onChange={(val: any) =>
                            updateProject(idx, 'duration', val)
                          }
                          span
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() =>
                            setProjects(projects.filter((_, i) => i !== idx))
                          }
                          className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
                        >
                          <span className="material-symbols-outlined text-base">
                            delete
                          </span>{' '}
                          Remove Project
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    No projects found
                  </p>
                )}
                <AddButton
                  onClick={() =>
                    setProjects([...projects, { title: '', duration: '' }])
                  }
                >
                  Add Project
                </AddButton>
              </div>
            )}
          </Section>

          {/* Footer */}
          <div className="flex justify-end pt-4 pb-12">
            <button className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors text-sm font-medium">
              <span className="material-symbols-outlined">history</span> View
              Parse History
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}

function Section({ title, icon, children }: any) {
  return (
    <section className="rounded-2xl bg-white dark:bg-slate-800 p-8 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
        <span className="material-symbols-outlined text-teal-600 dark:text-teal-400 text-2xl">
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

function Input({ label, value, onChange, span = false }: any) {
  return (
    <label className={`flex flex-col gap-2 ${span ? `md:col-span-2` : ``}`}>
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 px-4 py-3 text-sm font-medium focus:bg-white dark:focus:bg-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all shadow-sm"
      />
    </label>
  )
}

function AddButton({ children, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors px-4 py-2"
    >
      <span className="material-symbols-outlined text-lg">add</span>
      {children}
    </button>
  )
}
