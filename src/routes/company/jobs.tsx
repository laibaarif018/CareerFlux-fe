import { createFileRoute, Link,useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from "react";

export const Route = createFileRoute('/company/jobs')({
  component: AllJobs,
})

interface Job {
  id: string;
  title: string;
  status: "Active" | "Paused" | "Closed";
  applicants: number;
  location: string;
  type: string;
}

export default function AllJobs() {
  const navigate = useNavigate();
  // Demo data - remove this and uncomment empty array for new companies
  const [jobs] = useState<Job[]>([
    { id: "1", title: "Senior Product Manager", status: "Active", applicants: 28, location: "Remote", type: "Full-time" },
    { id: "2", title: "UX/UI Designer", status: "Active", applicants: 45, location: "Hybrid", type: "Full-time" },
    { id: "3", title: "Lead Backend Engineer", status: "Paused", applicants: 112, location: "On-site", type: "Full-time" },
  ]);
  // For new companies, use: const [jobs] = useState<Job[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, statusFilter]);

  return (
    <div className="flex min-h-screen font-sans bg-slate-50 dark:bg-slate-900">
      {/* Sidebar - Same as dashboard */}
      <nav className="flex flex-col justify-between w-64 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">R</div>
            <div className="flex flex-col">
              <h1 className="text-sm font-bold text-slate-900 dark:text-white">ResumeAI Inc.</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Hiring Manager</p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Link to="/company/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors">
              <span className="material-symbols-outlined text-xl">dashboard</span>
              <p className="text-sm font-medium">Dashboard</p>
            </Link>
            <Link to="/company/jobs" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
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

        <div className="flex flex-col gap-3">
          <button className="h-10 px-4 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm">Upgrade Plan</button>
          <div className="flex flex-col gap-1 pt-3 border-t border-slate-200 dark:border-slate-700">
            <Link to="/company/support" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors">
              <span className="material-symbols-outlined text-xl">help</span>
              <p className="text-sm font-medium">Support</p>
            </Link>
            <Link to="/auth/login" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors">
              <span className="material-symbols-outlined text-xl">logout</span>
              <p className="text-sm font-medium">Log Out</p>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                All Job Postings
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                View and manage all your job postings.
              </p>
            </div>

            <button
              onClick={() => navigate({ to: '/company/addJob' })}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-lg shadow-blue-600/20"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              Create New Job
            </button>
          </div>

          {/* Filters */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 mb-6 shadow-sm">
            <div className="p-6 flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[240px]">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                  search
                </span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search jobs..."
                  className="w-full h-10 pl-10 pr-4 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Closed">Closed</option>
              </select>

              {(search || statusFilter !== "All") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                  }}
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>

          {/* Empty State or Table */}
          {filteredJobs.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-slate-400 dark:text-slate-500">
                    work_off
                  </span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {search || statusFilter !== "All" ? "No jobs found" : "No jobs yet"}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
                {search || statusFilter !== "All" 
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "Create your first job posting to start receiving candidates."}
              </p>
              <button
                onClick={() => alert("Open Create Job Modal")}
                className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
              >
                <span className="material-symbols-outlined text-lg">add_circle</span>
                Create Job
              </button>
            </div>
          ) : (
            /* Table */
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900/50">
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Applicants
                    </th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredJobs.map((job) => (
                    <tr
                      key={job.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{job.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{job.type}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            job.status === "Active"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                              : job.status === "Paused"
                              ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {job.location}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {job.applicants}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                      </td>
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