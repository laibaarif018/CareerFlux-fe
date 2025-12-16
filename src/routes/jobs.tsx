import UserHeader from '@/components/UserHeader';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from "react";

export const Route = createFileRoute('/jobs')({
  component: JobListing,
})

interface Job {
  id: number;
  title: string;
  company: string;
  match: number;
  skills: string[];
  description: string;
  logo: string;
  recommended: boolean;
  location: string;
  type: string;
}

const jobsData: Job[] = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "Tech Solutions Inc.",
    match: 92,
    skills: ["React", "TypeScript", "JavaScript"],
    description:
      "We are looking for a skilled developer to join our team, focusing on creating responsive and user-friendly web applications using modern frameworks like React and Vue.",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBu5SARLiT2ONMW3k-2KFVIHkXgEnqlwbboI6V50W-a8UtjkyYIcVO7NrOy0G9XcPuedJ6aJasAE7noEXLjQip0YCWp9IYlHRM6qaifG2kc_DrQ5kRMxSeVjMYK5-nwFW0mL5HNCNRAAPhheXN4YObmAevTgvk4VOKkO42XY7XSprlGgwzMzvYE6Hx8Svfepx7LBYuDUNXju5fbhe8y0W4p5eKJsQGieuGdCZ624-tJnl7lckY1n25Slcv6FfoI9v4cT5UpHwTyRbM",
    recommended: true,
    location: "Remote",
    type: "Full-time"
  },
  {
    id: 2,
    title: "UX/UI Designer",
    company: "Creative Minds LLC",
    match: 88,
    skills: ["Figma", "User Research", "Prototyping"],
    description:
      "Join our creative team to design intuitive and beautiful user interfaces for our next-generation mobile and web applications. A strong portfolio is a must.",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwbhz_zE6WiKL23i6hLgZ2Z_cJJcbSq2s0mkhQX9D18DMK7vGDnYtfMJ97tZK4F78REbXc_XqqTrjIoqWypQdGvHhK0gXMb-i3bZ-hSov6bqgP5SIVWGC22uKdl2VArWISAdKnAr_piZ-UryKOGHxfguN0xx6KmjSmVdooWPcqh0N53tfrX1Nsh7xtArPis7UF2oFCnakOZ7v5qMatipcFkGYCE8rernKMIAq0shSe9NZkoULx9K6pN2wsch8RynnRqGv-1E80WsyM",
    recommended: false,
    location: "Hybrid",
    type: "Full-time"
  },
  {
    id: 3,
    title: "Product Manager",
    company: "Innovation Hub",
    match: 78,
    skills: ["Agile", "Roadmapping", "Stakeholder Management"],
    description:
      "Lead product strategy and execution for our flagship SaaS product. Work with engineering and design teams to deliver exceptional user experiences.",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBu5SARLiT2ONMW3k-2KFVIHkXgEnqlwbboI6V50W-a8UtjkyYIcVO7NrOy0G9XcPuedJ6aJasAE7noEXLjQip0YCWp9IYlHRM6qaifG2kc_DrQ5kRMxSeVjMYK5-nwFW0mL5HNCNRAAPhheXN4YObmAevTgvk4VOKkO42XY7XSprlGgwzMzvYE6Hx8Svfepx7LBYuDUNXju5fbhe8y0W4p5eKJsQGieuGdCZ624-tJnl7lckY1n25Slcv6FfoI9v4cT5UpHwTyRbM",
    recommended: true,
    location: "San Francisco, CA",
    type: "Full-time"
  },
];

function JobListing() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"recommended" | "all">("recommended");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  // Filter jobs based on selected tab and search query
  const filteredJobs = jobsData
    .filter((job) => activeTab === "all" || job.recommended)
    .filter((job) => {
      const query = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.skills.some(skill => skill.toLowerCase().includes(query))
      );
    });

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const getMatchColor = (match: number) => {
    if (match >= 90) return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    if (match >= 80) return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    if (match >= 70) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
    return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-700';
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 font-sans min-h-screen transition-colors">
      <UserHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-6">
          {/* Heading */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Find Your Next Job
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-400">
              Discover opportunities that match your skills and experience.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 dark:text-slate-500">
              search
            </span>
            <input
              type="text"
              placeholder="Search by job title, company, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab("recommended")}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === "recommended"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 font-bold"
                  : "border-transparent text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-base">star</span>
              Recommended ({jobsData.filter(j => j.recommended).length})
            </button>

            <button
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === "all"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 font-bold"
                  : "border-transparent text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined text-base">work</span>
              All Jobs ({jobsData.length})
            </button>
          </div>

          {/* Results Count */}
          {searchQuery && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Found {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} matching "{searchQuery}"
            </p>
          )}

          {/* Jobs List */}
          {filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-5xl text-slate-400 dark:text-slate-500">
                  work_off
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                No jobs found
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
                {searchQuery 
                  ? `Try adjusting your search terms or browse all available jobs.`
                  : `No ${activeTab === 'recommended' ? 'recommended ' : ''}jobs available at the moment.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col p-6 gap-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-all hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-4 items-start flex-1 min-w-0">
                      <div
                        className="w-12 h-12 rounded-lg bg-center bg-cover bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex-shrink-0"
                        style={{ backgroundImage: `url("${job.logo}")` }}
                      />
                      <div className="flex flex-col min-w-0 flex-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                          {job.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {job.company}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            {job.location}
                          </span>
                          <span>•</span>
                          <span>{job.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border ${getMatchColor(job.match)}`}>
                      <span className="material-symbols-outlined text-sm">verified</span>
                      <span>{job.match}%</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <button 
                      onClick={() => toggleSaveJob(job.id)}
                      className={`inline-flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-medium transition-colors ${
                        savedJobs.includes(job.id)
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">
                        {savedJobs.includes(job.id) ? 'bookmark' : 'bookmark_add'}
                      </span>
                      {savedJobs.includes(job.id) ? 'Saved' : 'Save'}
                    </button>
                    <button 
                      onClick={() => navigate({ to: '/jobDetails', search: { id: job.id } })}
                      className="inline-flex items-center justify-center gap-2 px-4 h-10 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm"
                    >
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}