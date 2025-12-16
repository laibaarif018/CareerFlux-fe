import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/company/cadidateMatch')({
  component: JobCandidateMatches,
})
import { useState } from "react";

export default function JobCandidateMatches() {
  const [candidates, setCandidates] = useState<any[]>([]);

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <nav className="w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-2">
            <div className="size-10 rounded-full bg-slate-300" />
            <div>
              <p className="text-slate-900 dark:text-white font-medium">ResumeAI Inc.</p>
              <p className="text-slate-500 text-sm">Hiring Manager</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {['Dashboard', 'Jobs', 'Candidates', 'Settings'].map((item) => (
              <button
                key={item}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <button className="h-10 rounded-lg bg-primary text-white text-sm font-bold">
          Upgrade Plan
        </button>
      </nav>

      {/* Main */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Job Candidate Matches
            </h1>
            <p className="text-slate-500">
              Candidate Matches For: <span className="font-semibold">Senior Product Manager</span>
            </p>
          </div>

          {/* Empty State */}
          {candidates.length === 0 && (
            <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-12 text-center bg-white dark:bg-slate-900">
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                No candidates yet
              </p>
              <p className="text-slate-500 text-sm mt-1">
                Once candidates apply or are matched by AI, they will appear here.
              </p>
            </div>
          )}

          {/* Table (renders only if data exists) */}
          {candidates.length > 0 && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left">Candidate</th>
                    <th className="px-6 py-3 text-left">Match</th>
                    <th className="px-6 py-3 text-left">Stage</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((c) => (
                    <tr key={c.id} className="border-t border-slate-200 dark:border-slate-800">
                      <td className="px-6 py-4 font-medium">{c.name}</td>
                      <td className="px-6 py-4">{c.score}%</td>
                      <td className="px-6 py-4">{c.stage}</td>
                      <td className="px-6 py-4 text-right">⋮</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

