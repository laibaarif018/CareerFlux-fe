import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/company/dashboard')({
  component: CompanyDashboard,
})

interface Job {
  title: string;
  status: "Active" | "Paused";
  applicants: number;
}

interface Applicant {
  name: string;
  position: string;
  score: number;
  stage: string;
  avatar: string;
}

interface Skill {
  name: string;
  applicants: number;
  progress: number;
}

export default function CompanyDashboard() {
  const navigate = useNavigate()

  const jobs: Job[] = [
    { title: "Senior Product Manager", status: "Active", applicants: 28 },
    { title: "UX/UI Designer", status: "Active", applicants: 45 },
    { title: "Lead Backend Engineer", status: "Paused", applicants: 112 },
    { title: "Data Scientist", status: "Active", applicants: 67 },
  ];

  const applicants: Applicant[] = [
    {
      name: "Sarah Johnson",
      position: "UX/UI Designer",
      score: 92,
      stage: "New",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBKByykQeIh5ZSoqD52rl5cxOIAbhWugPfDPvnVc1kP12ZOaJw043XPltGDyrTSN5yu7diYwsX9VMhuAAObaUnozMNFtqlrJR8f6hPAY6XFp2bZWIMl-HZXP5BQRs-xlr4sg2iAJf2Tsh7p4U0VH7eh8-3Ft0pIsdx1Q3WjUN6_LMnPTbMmqByc_bsA2twK50sBXRIJXIKVCBuuTk0ITK7rfkAPBNT6ox3Xo_bOLXi9gRs5dIbca6onXCqoGXNaPXVSILiLGtiGUEI2",
    },
    {
      name: "Michael Chen",
      position: "Data Scientist",
      score: 89,
      stage: "Reviewing",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_pgsuAHBtf0ATLMiyTeq1WCwL0SdZ0tdwSXigXpglRxL5oskgNmwAYQ_7sE_YK-F53PlvrjJfJqJdbzuv5ZnAkC0p6Dqfytx65pnoyh54XYOEiBK-V11BqGbSRoggDpLul0lNU7HowkPBGf8cKpccU7BVHbfK5FfAZHZQnDP_QkseLcqvtJLxDDlOEKKkzncF2caK7MRlnjtqIMx17LYd7UyqdatsJvE6cDHn-15bLg0wCul9YkvLdarR7PDxYdtW1pgFivAlHBCU",
    },
    {
      name: "Emily Davis",
      position: "Product Manager",
      score: 74,
      stage: "New",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAy2aXVuiQ5_VCwOd1R2xyp9p60EOc6ZBL5xFwZPEOPSZqeP5ZOWld6WW7PLSUKw4-f72Udwd2OC9yZexzyPP3YnkUlkF6huCISmpqiFhAtKHtSlPxOthhS84YCYK8iPOVP1rqvSwXuamI9XpR3DCOKZ_txWxWHmqH5xlXSpr2UlNuTED4AwPN9Kw0WFPVn-n18UbV6tPeGXODFv8yDLbfzII7FhxRAJDhn-QUyx9ntAvDcNLLXNFMtvBIBkFxj1BLuBXm9xfkITX9e",
    },
  ];

  const skills: Skill[] = [
    { name: "Product Management", applicants: 25, progress: 90 },
    { name: "UX Design", applicants: 21, progress: 80 },
    { name: "Python", applicants: 18, progress: 75 },
    { name: "SQL", applicants: 15, progress: 60 },
    { name: "Agile Methodology", applicants: 12, progress: 50 },
  ];

  return (
    <div className="flex min-h-screen font-sans bg-slate-50 dark:bg-slate-900 transition-colors">
      {/* Sidebar */}
      <nav className="flex flex-col justify-between w-64 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
        <div className="flex flex-col gap-6">
          {/* Company Info */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              R
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-bold text-slate-900 dark:text-white">ResumeAI Inc.</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Hiring Manager</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-1">
            <Link to="/company/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <span className="material-symbols-outlined text-xl">dashboard</span>
              <p className="text-sm font-medium">Dashboard</p>
            </Link>
            <Link to="/company/jobs" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors">
              <span className="material-symbols-outlined text-xl">work</span>
              <p className="text-sm font-medium">Jobs</p>
            </Link>
            <Link to="/company/candidates" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors">
              <span className="material-symbols-outlined text-xl">group</span>
              <p className="text-sm font-medium">Candidates</p>
            </Link>
            <Link to="/company/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors">
              <span className="material-symbols-outlined text-xl">settings</span>
              <p className="text-sm font-medium">Settings</p>
            </Link>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-3">
          {/* <button className="h-10 px-4 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm">
            Upgrade Plan
          </button>
          <div className="flex flex-col gap-1 pt-3 border-t border-slate-200 dark:border-slate-700">
            <Link to="/company/support" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors">
              <span className="material-symbols-outlined text-xl">help</span>
              <p className="text-sm font-medium">Support</p>
            </Link> */}
            <button 
              onClick={() => navigate({ to: '/auth/login' })}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
              <p className="text-sm font-medium">Log Out</p>
            </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mx-auto max-w-7xl flex flex-col gap-8">
          {/* Page Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
              <p className="text-slate-600 dark:text-slate-400">
                Welcome back, here's an overview of your recruitment activity.
              </p>
            </div>
            <button className="inline-flex items-center gap-2 px-5 h-11 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-lg shadow-blue-600/20">
              <span className="material-symbols-outlined text-lg">add_circle</span>
              <span>Create New Job</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">work</span>
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Jobs</p>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">12</p>
            </div>
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-600 dark:text-green-400">person_add</span>
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">New Applicants (7d)</p>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">34</p>
            </div>
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">analytics</span>
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg. AI Match Score</p>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">88%</p>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Active Job Postings */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden">
                <h2 className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 text-lg font-bold text-slate-900 dark:text-white">Active Job Postings</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-900/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Job Title</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Applicants</th>
                        <th className="px-6 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {jobs.map((job, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{job.title}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                job.status === "Active"
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                                  : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                              }`}
                            >
                              {job.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{job.applicants}</td>
                          <td className="px-6 py-4">
                            <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                              View →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Applicants */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden">
                <h2 className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 text-lg font-bold text-slate-900 dark:text-white">Recent Applicants</h2>
                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {applicants.map((a, idx) => (
                    <div key={idx} className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-12 h-12 rounded-full bg-center bg-cover flex-shrink-0" style={{ backgroundImage: `url(${a.avatar})` }} />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{a.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Applied for {a.position}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <span className={`text-sm font-bold px-2.5 py-1 rounded-full ${
                            a.score >= 85 
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" 
                              : a.score >= 70 
                              ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300" 
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                          }`}>
                            {a.score}%
                          </span>
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full">
                            {a.stage}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Skills */}
            <div>
              <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                <h3 className="mb-5 text-lg font-bold text-slate-900 dark:text-white">Top Applicant Skills</h3>
                <div className="space-y-5">
                  {skills.map((skill, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{skill.name}</span>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{skill.applicants} applicants</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-2 bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${skill.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}