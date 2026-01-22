import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import Header from '@/components/Header'
import { useNavigate } from '@tanstack/react-router'
import { getAuthToken } from '@/utils/auth'
import storageService from '@/utils/localstorage'

export const Route = createFileRoute('/')({
  component: HomePage,
})

export default function HomePage() {
  const [fileName, setFileName] = useState<string>('')
  const navigate = useNavigate()

  const handleResumeClick = () => {
    const token = getAuthToken()
    const role = storageService.getItem<string>('userRole')

    if (!token) {
      navigate({ to: '/auth/login' })
      return
    }

    if (role === 'jobseeker') {
      navigate({ to: '/job-seeker/dashboard' })
    } else if (role === 'company') {
      navigate({ to: '/company/dashboard' })
    } else {
      navigate({ to: '/auth/login' })
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
      console.log('File selected:', file.name)
    }
  }

  const handleAnalyze = () => {
    if (fileName) {
      console.log('Analyzing file:', fileName)
    } else {
      document.getElementById('resume-upload')?.click()
    }
  }

  return (
    <div
      className="relative flex flex-col w-full min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors"
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
      }}
    >
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-20 px-4 md:px-10 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6 text-center lg:text-left">
              <div className="space-y-4">
                <h1
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  Optimize Your Resume & Find Your{' '}
                  <span
                    className="bg-clip-text text-transparent font-extrabold"
                    style={{
                      backgroundImage:
                        'linear-gradient(90deg, #3B4DA5, #3EC3BC)',
                    }}
                  >
                    Dream Job
                  </span>
                </h1>
                <p
                  className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
                  style={{ letterSpacing: '0.01em' }}
                >
                  Get instant feedback on your CV, beat the ATS, and get matched
                  with jobs that fit your unique skills perfectly using our
                  advanced AI.
                </p>
              </div>

              <div className="w-full max-w-lg mx-auto lg:mx-0 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
                <label
                  htmlFor="resume-upload"
                  className="relative w-full h-16 cursor-pointer group block"
                  onClick={(e) => {
                    e.preventDefault()
                    handleResumeClick()
                  }}
                >
                  <div className="absolute inset-0 flex items-center pl-4 pr-36 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 group-hover:border-[#0E7C8C] transition-colors">
                    <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 mr-3">
                      upload_file
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm truncate pr-2 font-medium">
                      {fileName || 'Drop your resume (PDF, DOCX)'}
                    </span>
                  </div>
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.docx,.doc"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <div className="absolute right-2 top-2 bottom-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleResumeClick()
                      }}
                      className="h-full px-6 bg-[#0E7C8C] hover:bg-[#3EC3BC] text-white rounded-md text-sm font-semibold shadow-md transition-all tracking-wide"
                    >
                      Analyze
                    </button>
                  </div>
                </label>
                <div className="flex items-center gap-2 mt-2 px-2 pb-1">
                  <span className="material-symbols-outlined text-green-500 text-sm">
                    check_circle
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Free Scan
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full h-full flex justify-center lg:justify-end relative">
              <div className="relative z-10 w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                {/* Background pattern */}
                <div
                  className="absolute inset-0 opacity-[0.4] dark:opacity-[0.1]"
                  style={{
                    backgroundImage:
                      'radial-gradient(#cbd5e1 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                ></div>

                {/* Glow effects */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#0E7C8C]/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#3EC3BC]/20 rounded-full blur-3xl"></div>

                {/* Main resume mockup card */}
                <div className="absolute top-8 left-8 right-20 bottom-12 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-4 transform rotate-[-2deg] transition-transform hover:rotate-0 duration-500 origin-bottom-left group">
                  {/* Header with avatar and name */}
                  <div className="flex gap-4 items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0E7C8C] to-[#3EC3BC] flex items-center justify-center text-white">
                      <span className="material-symbols-outlined text-lg">
                        person
                      </span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="text-base font-bold text-slate-900 dark:text-white">
                        Alex Morgan
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Senior Product Manager
                      </div>
                    </div>
                  </div>

                  {/* Resume content lines with actual text */}
                  <div className="space-y-3 pt-1">
                    {/* Experience section */}
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-[#0E7C8C] dark:text-[#3EC3BC] uppercase tracking-wide">
                        Experience
                      </div>
                      <div className="text-xs text-slate-700 dark:text-slate-300">
                        • Led cross-functional teams of 10+ to launch 3 new
                        features
                      </div>
                      <div className="text-xs text-slate-700 dark:text-slate-300">
                        • Increased user engagement by 42% through data-driven
                        optimizations
                      </div>
                      <div className="text-xs text-slate-700 dark:text-slate-300">
                        • Managed $2M product budget with 15% cost reduction
                      </div>
                    </div>

                    {/* Skills section */}
                    <div className="space-y-1 mt-2">
                      <div className="text-xs font-semibold text-[#0E7C8C] dark:text-[#3EC3BC] uppercase tracking-wide">
                        Skills
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded">
                          Product Strategy
                        </span>
                        <span className="text-[10px] bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 px-2 py-0.5 rounded">
                          Agile
                        </span>
                        <span className="text-[10px] bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded">
                          Data Analysis
                        </span>
                      </div>
                    </div>

                    {/* Education section */}
                    <div className="space-y-1 mt-2">
                      <div className="text-xs font-semibold text-[#0E7C8C] dark:text-[#3EC3BC] uppercase tracking-wide">
                        Education
                      </div>
                      <div className="text-xs text-slate-700 dark:text-slate-300">
                        MBA, Stanford University • 2018
                      </div>
                    </div>

                    {/* Contact info */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                        <span className="material-symbols-outlined text-[10px]">
                          mail
                        </span>
                        <span>alex.morgan@email.com</span>
                      </div>
                    </div>
                  </div>

                  {/* Animated scanning line - REMOVED from under Experience */}

                  {/* Analysis highlights overlay */}
                  <div className="absolute -bottom-2 -right-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-2 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                    <div className="text-[8px] font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider">
                      AI Analysis Active
                    </div>
                  </div>
                </div>

                {/* ATS Score card */}
                <div
                  className="absolute top-12 right-5 w-44 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-white/50 dark:border-slate-600 animate-bounce"
                  style={{ animationDuration: '3s' }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                      ATS Score
                    </span>
                    <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded">
                      94/100
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#0E7C8C] to-[#3EC3BC] h-full rounded-full w-[94%]"></div>
                  </div>
                  <div className="mt-2 flex gap-1 items-center">
                    <span className="material-symbols-outlined text-[10px] text-[#3EC3BC]">
                      check_circle
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Keywords Optimized
                    </span>
                  </div>
                  <div className="mt-1 flex gap-1 items-center">
                    <span className="material-symbols-outlined text-[10px] text-green-500">
                      check_circle
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Format ✓
                    </span>
                  </div>
                </div>

                {/* Job Match card */}
                <div className="absolute bottom-6 right-6 bg-white dark:bg-slate-800 p-4 pr-8 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 flex items-center gap-3 max-w-[240px]">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0E7C8C] to-[#3EC3BC] flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-lg">
                      work
                    </span>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Best Match
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      Product Manager
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Tech Corp • $140-160k
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-green-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                    98%
                  </div>
                </div>

                {/* Skill Match card */}
                <div className="absolute top-1/2 left-6 w-36 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-sm">
                        psychology
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-900 dark:text-white">
                      Skill Match
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] text-slate-500 dark:text-slate-400">
                        Product Strategy
                      </span>
                      <span className="text-[8px] font-bold text-green-600">
                        95%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] text-slate-500 dark:text-slate-400">
                        Leadership
                      </span>
                      <span className="text-[8px] font-bold text-green-600">
                        92%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background glow effects */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#0E7C8C]/20 rounded-full blur-3xl -z-0"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#3EC3BC]/20 rounded-full blur-3xl -z-0"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-white dark:bg-slate-800">
          <div className="max-w-6xl mx-auto px-4 md:px-10">
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4"
                style={{ letterSpacing: '-0.01em' }}
              >
                Why Choose CareerFlux?
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
                We use advanced natural language processing to read your resume
                exactly like a recruiter would.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700 group">
                <div className="w-12 h-12 rounded-lg bg-[#0E7C8C]/20 dark:bg-[#0E7C8C]/40 flex items-center justify-center text-[#0E7C8C] dark:text-[#3EC3BC] mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">
                    fact_check
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  ATS Scoring
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Identify if your resume is readable by Applicant Tracking
                  Systems used by 99% of Fortune 500 companies.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700 group">
                <div className="w-12 h-12 rounded-lg bg-[#3EC3BC]/20 dark:bg-[#3EC3BC]/40 flex items-center justify-center text-[#3EC3BC] dark:text-[#0E7C8C] mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">
                    psychology
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Smart Keywords
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  Get suggestions for high-impact action verbs and
                  industry-specific keywords missing from your profile.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700 group">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400 mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">
                    handshake
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Job Matching
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  We scan thousands of live job listings to match your optimized
                  resume with roles that fit you perfectly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section (How it works) */}
        <section
          id="how-it-works"
          className="py-20 bg-slate-50 dark:bg-slate-900 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 md:px-10 relative">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[#0E7C8C] dark:text-[#3EC3BC] font-semibold tracking-widest uppercase text-xs mb-3 block">
                Simple Process
              </span>
              <h2
                className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6"
                style={{ letterSpacing: '-0.01em' }}
              >
                From Resume to Hired in 3 Steps
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
                Stop guessing what recruiters want. Our AI-driven process guides
                you from your first upload to your final interview with
                data-backed precision.
              </p>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Connector line */}
              <div className="hidden md:block absolute top-[60px] left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-[#0E7C8C]/40 via-[#3EC3BC]/40 to-[#0E7C8C]/40 -z-0"></div>

              {/* Step 1 */}
              <div className="relative flex flex-col items-center text-center group">
                <div className="relative z-10 w-32 h-32 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full shadow-xl border-4 border-[#0E7C8C] mb-8 group-hover:scale-105 transition-transform duration-300">
                  <span className="material-symbols-outlined text-5xl text-[#0E7C8C]">
                    upload_file
                  </span>
                  <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#0E7C8C] text-white rounded-full flex items-center justify-center font-bold shadow-md border-2 border-white dark:border-slate-800">
                    1
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Upload Your Resume
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal px-4">
                  Drag & drop your CV (PDF/DOCX). We instantly parse your skills
                  and experience securely.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col items-center text-center group">
                <div className="relative z-10 w-32 h-32 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full shadow-xl border-4 border-[#0E7C8C] mb-8 group-hover:scale-105 transition-transform duration-300">
                  <span className="material-symbols-outlined text-5xl text-[#3EC3BC]">
                    smart_toy
                  </span>
                  <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#0E7C8C] text-white rounded-full flex items-center justify-center font-bold shadow-md border-2 border-white dark:border-slate-800">
                    2
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  AI Analysis & Scoring
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal px-4">
                  Our deep learning model evaluates 50+ data points to score
                  your resume against ATS standards.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col items-center text-center group">
                <div className="relative z-10 w-32 h-32 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full shadow-xl border-4 border-[#0E7C8C] mb-8 group-hover:scale-105 transition-transform duration-300">
                  <span className="material-symbols-outlined text-5xl text-[#0E7C8C]">
                    work_history
                  </span>
                  <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#0E7C8C] text-white rounded-full flex items-center justify-center font-bold shadow-md border-2 border-white dark:border-slate-800">
                    3
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  Get Matched & Hired
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal px-4">
                  Unlock a personalized list of active job openings that
                  perfectly match your optimized profile.
                </p>
              </div>
            </div>

            <div className="mt-16 text-center">
              <button className="inline-flex items-center gap-2 text-[#0E7C8C] dark:text-[#3EC3BC] font-semibold hover:text-[#3EC3BC] dark:hover:text-[#0E7C8C] transition-colors border-b-2 border-[#0E7C8C]/20 hover:border-[#0E7C8C] pb-0.5">
                See a sample analysis report
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white dark:bg-slate-800">
          <div className="max-w-6xl mx-auto px-4 md:px-10">
            <h2
              className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-12 text-center"
              style={{ letterSpacing: '-0.01em' }}
            >
              Success Stories
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Testimonial 1 */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-sm">
                      star
                    </span>
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-6 italic font-normal">
                  "I was applying for months with no response. After using
                  CareerFlux to optimize my keywords, I got 3 callbacks in one
                  week!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3EC3BC] to-[#0E7C8C] flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-lg">
                      person
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      Sarah Jenkins
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                      Marketing Manager
                    </p>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-sm">
                      star
                    </span>
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-6 italic font-normal">
                  "The job matching feature is incredible. It didn't just find
                  random jobs, it found roles that actually fit my career
                  trajectory."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B4DA5] to-[#0E7C8C] flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-lg">
                      person
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      David Chen
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                      Software Engineer
                    </p>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow hidden lg:block">
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[...Array(4)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-sm">
                      star
                    </span>
                  ))}
                  <span className="material-symbols-outlined text-sm">
                    star_half
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-6 italic font-normal">
                  "Simple, fast, and effective. The initial score was a wake-up
                  call, but the actionable tips helped me fix it in minutes."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-lg">
                      person
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      Elena Rodriguez
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                      Product Designer
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#0E7C8C] text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ letterSpacing: '-0.01em' }}
            >
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-white/90 text-base md:text-lg mb-8 max-w-xl mx-auto font-normal leading-relaxed">
              Join 50,000+ job seekers who have optimized their resumes with AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
                View Sample Report
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4 text-white">
                <span className="material-symbols-outlined text-[#3EC3BC]">
                  smart_toy
                </span>
                <span
                  className="font-bold text-lg"
                  style={{
                    background: 'linear-gradient(90deg, #3B4DA5, #3EC3BC)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em',
                  }}
                >
                  CareerFlux
                </span>
              </div>
              <p className="text-sm leading-relaxed font-normal">
                AI-powered tools to help you build a better resume and find the
                perfect job faster.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm font-normal">
                <li>
                  <Link
                    to="#"
                    className="hover:text-[#3EC3BC] transition-colors"
                  >
                    Resume Checker
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="hover:text-[#3EC3BC] transition-colors"
                  >
                    Job Matcher
                  </Link>
                </li>
                {/* <li><Link to="#" className="hover:text-[#3EC3BC] transition-colors">Cover Letter Gen</Link></li> */}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm font-normal">
                <li>
                  <Link
                    to="#"
                    className="hover:text-[#3EC3BC] transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="hover:text-[#3EC3BC] transition-colors"
                  >
                    Career Advice
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="hover:text-[#3EC3BC] transition-colors"
                  >
                    Resume Examples
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm font-normal">
                <li>
                  <Link
                    to="#"
                    className="hover:text-[#3EC3BC] transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    className="hover:text-[#3EC3BC] transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-normal">
              © 2023 CareerFlux Inc. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link
                to="#"
                className="text-slate-400 hover:text-[#3EC3BC] transition-colors"
                aria-label="Twitter"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </Link>
              <Link
                to="#"
                className="text-slate-400 hover:text-[#3EC3BC] transition-colors"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
