import UserHeader from "@/components/UserHeader";
import { createFileRoute, useNavigate } from "@tanstack/react-router"

export const Route = createFileRoute('/myResumes')({
  component: MyResumes,
})

const resumes = [
  {
    name: "Senior Frontend Developer.pdf",
    date: "April 15, 2024",
    score: 95,
    status: "trending_up",
    scoreColor: "text-green-600 dark:text-green-400",
  },
  {
    name: "Product Manager Resume_v2.docx",
    date: "April 12, 2024",
    score: 92,
    status: "trending_up",
    scoreColor: "text-green-600 dark:text-green-400",
  },
  {
    name: "UX Designer Portfolio Resume.pdf",
    date: "March 28, 2024",
    score: 78,
    status: "horizontal_rule",
    scoreColor: "text-orange-600 dark:text-orange-400",
  },
  {
    name: "Resume_General_2024.pdf",
    date: "March 05, 2024",
    score: null,
    status: null,
    scoreColor: "",
  },
  {
    name: "Data Scientist CV.pdf",
    date: "February 21, 2024",
    score: 55,
    status: "trending_down",
    scoreColor: "text-red-600 dark:text-red-400",
  },
];

export default function MyResumes() {
  const navigate = useNavigate();

  const handleDelete = (resumeName: string) => {
    if (confirm(`Are you sure you want to delete "${resumeName}"?`)) {
      console.log('Deleting resume:', resumeName);
      // Add delete logic here
    }
  };

  const handleReanalyze = (resumeName: string) => {
    console.log('Re-analyzing resume:', resumeName);
    // Add re-analysis logic here
  };

  return (
    <div className="font-sans bg-slate-50 dark:bg-slate-900 min-h-screen flex flex-col transition-colors">
      {/* Header */}
      <UserHeader />
      
      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">
              My Resumes
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-base">
              Manage, analyze, and track all your resumes in one place.
            </p>
          </div>
          <button 
            onClick={() => navigate({ to: '/uploadResume' })}
            className="inline-flex items-center justify-center gap-2 rounded-lg h-11 px-4 bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:bg-blue-800 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">upload_file</span>
            <span className="truncate">Upload New Resume</span>
          </button>
        </div>

        {/* Resumes Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                    Resume Name
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                    Upload Date
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">
                    Latest Score
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {resumes.map((resume, idx) => (
                  <tr
                    key={idx}
                    className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                          <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
                            description
                          </span>
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {resume.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {resume.date}
                    </td>
                    <td className="px-6 py-4">
                      {resume.score ? (
                        <div className="inline-flex items-center gap-1.5">
                          <span className={`material-symbols-outlined text-lg ${resume.scoreColor}`}>
                            {resume.status}
                          </span>
                          <span className={`font-semibold ${resume.scoreColor}`}>
                            {resume.score}%
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <span className="material-symbols-outlined text-lg">help</span>
                          Not analyzed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate({ to: '/resumeReport' })}
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg h-9 px-4 bg-blue-600 text-white text-xs font-bold shadow-sm hover:bg-blue-700 active:bg-blue-800 transition-colors"
                        >
                          <span className="material-symbols-outlined text-base">visibility</span>
                          View Details
                        </button>
                        <button 
                          onClick={() => handleReanalyze(resume.name)}
                          className="inline-flex items-center justify-center rounded-lg h-9 w-9 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                          title="Re-analyze resume"
                        >
                          <span className="material-symbols-outlined text-base">autorenew</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(resume.name)}
                          className="inline-flex items-center justify-center rounded-lg h-9 w-9 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Delete resume"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State Alternative (if no resumes) */}
        {resumes.length === 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center shadow-sm">
            <div className="flex flex-col items-center gap-4">
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
                  Upload your first resume to get started with AI-powered analysis.
                </p>
                <button 
                  onClick={() => navigate({ to: '/uploadResume' })}
                  className="inline-flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">upload_file</span>
                  Upload Your First Resume
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}