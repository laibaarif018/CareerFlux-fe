import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { useCompanyJobs } from '@/queries/job.queries'
import CompanySidebar from '@/components/companysidebar'

export const Route = createFileRoute('/company/jobs')({
  component: AllJobs,
})

export default function AllJobs() {
  const navigate = useNavigate()

  // Fetch jobs from backend
  const { data, isLoading, error } = useCompanyJobs()
  const jobs = data?.jobs || []
  const company = data?.company

  // Filter states
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [locationFilter, setLocationFilter] = useState('')
  const [experienceLevelFilter, setExperienceLevelFilter] = useState('')
  const [jobTypeFilter, setJobTypeFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Count active filters
  const activeFiltersCount = [
    statusFilter !== 'All' ? statusFilter : null,
    locationFilter,
    experienceLevelFilter,
    jobTypeFilter,
  ].filter(Boolean).length

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job: any) => {
      const matchesSearch =
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        (job.companyName || company?.name || '')
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && job.isActive) ||
        (statusFilter === 'Closed' && !job.isActive)

      const matchesLocation =
        !locationFilter ||
        job.location.toLowerCase().includes(locationFilter.toLowerCase())

      const matchesExperience =
        !experienceLevelFilter || job.experienceLevel === experienceLevelFilter

      const matchesJobType = !jobTypeFilter || job.jobType === jobTypeFilter

      return (
        matchesSearch &&
        matchesStatus &&
        matchesLocation &&
        matchesExperience &&
        matchesJobType
      )
    })
  }, [
    jobs,
    search,
    statusFilter,
    locationFilter,
    experienceLevelFilter,
    jobTypeFilter,
    company,
  ])

  const clearAllFilters = () => {
    setSearch('')
    setStatusFilter('All')
    setLocationFilter('')
    setExperienceLevelFilter('')
    setJobTypeFilter('')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <CompanySidebar />

      {/* Main Content - with left margin to account for fixed sidebar */}
      <main className="flex-1 ml-64 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                All Job Postings
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                View and manage all your job postings
              </p>
            </div>

            <button
              onClick={() => navigate({ to: '/company/add-job' })}
              className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20"
            >
              <span className="material-symbols-outlined text-xl">
                add_circle
              </span>
              Create New Job
            </button>
          </div>

          {/* Search and Filter Section */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                    search
                  </span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search jobs by title or company..."
                    className="w-full h-12 pl-12 pr-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Filter Toggle Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`relative h-12 px-5 rounded-lg border-2 flex items-center justify-center gap-2 font-semibold transition-all ${
                    showFilters
                      ? 'bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-600/20'
                      : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">
                    tune
                  </span>
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span
                      className={`absolute -top-2 -right-2 min-w-[24px] h-6 px-1.5 rounded-full flex items-center justify-center text-xs font-bold ${
                        showFilters
                          ? 'bg-white text-teal-600'
                          : 'bg-teal-600 text-white'
                      }`}
                    >
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="h-12 px-5 font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Remote, NYC"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Experience Level Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      Experience Level
                    </label>
                    <select
                      value={experienceLevelFilter}
                      onChange={(e) => setExperienceLevelFilter(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    >
                      <option value="">All Levels</option>
                      <option value="Entry">Entry Level</option>
                      <option value="Mid">Mid Level</option>
                      <option value="Senior">Senior Level</option>
                      <option value="Lead">Lead</option>
                    </select>
                  </div>

                  {/* Job Type Filter */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      Job Type
                    </label>
                    <select
                      value={jobTypeFilter}
                      onChange={(e) => setJobTypeFilter(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    >
                      <option value="">All Types</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                </div>

                {/* Active Filter Tags */}
                {activeFiltersCount > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {statusFilter !== 'All' && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 rounded-lg text-sm font-semibold border border-teal-200 dark:border-teal-800">
                        Status: {statusFilter}
                        <button
                          onClick={() => setStatusFilter('All')}
                          className="hover:bg-teal-100 dark:hover:bg-teal-900/40 rounded-full p-0.5 transition-colors"
                        >
                          <span className="material-symbols-outlined text-base">
                            close
                          </span>
                        </button>
                      </span>
                    )}
                    {locationFilter && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 rounded-lg text-sm font-semibold border border-teal-200 dark:border-teal-800">
                        Location: {locationFilter}
                        <button
                          onClick={() => setLocationFilter('')}
                          className="hover:bg-teal-100 dark:hover:bg-teal-900/40 rounded-full p-0.5 transition-colors"
                        >
                          <span className="material-symbols-outlined text-base">
                            close
                          </span>
                        </button>
                      </span>
                    )}
                    {experienceLevelFilter && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 rounded-lg text-sm font-semibold border border-teal-200 dark:border-teal-800">
                        Experience: {experienceLevelFilter}
                        <button
                          onClick={() => setExperienceLevelFilter('')}
                          className="hover:bg-teal-100 dark:hover:bg-teal-900/40 rounded-full p-0.5 transition-colors"
                        >
                          <span className="material-symbols-outlined text-base">
                            close
                          </span>
                        </button>
                      </span>
                    )}
                    {jobTypeFilter && (
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 rounded-lg text-sm font-semibold border border-teal-200 dark:border-teal-800">
                        Type: {jobTypeFilter}
                        <button
                          onClick={() => setJobTypeFilter('')}
                          className="hover:bg-teal-100 dark:hover:bg-teal-900/40 rounded-full p-0.5 transition-colors"
                        >
                          <span className="material-symbols-outlined text-base">
                            close
                          </span>
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Loading State with Shimmer */}
          {isLoading && (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Job Title
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Location
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Experience
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Posted
                      </th>
                      <th className="px-6 py-4" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {[...Array(5)].map((_, index) => (
                      <tr key={index} className="animate-pulse">
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
                              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-gray-500/60 to-transparent" />
                            </div>
                            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
                              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-gray-500/60 to-transparent" />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-7 w-16 bg-gray-200 dark:bg-gray-700 rounded-full relative overflow-hidden">
                            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-gray-500/60 to-transparent" />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
                            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-gray-500/60 to-transparent" />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
                            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-gray-500/60 to-transparent" />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
                            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-gray-500/60 to-transparent" />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-lg relative overflow-hidden">
                              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-gray-500/60 to-transparent" />
                            </div>
                            <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-lg relative overflow-hidden">
                              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/90 dark:via-gray-500/60 to-transparent" />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-gray-400 dark:text-gray-500">
                    work_off
                  </span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {error instanceof Error &&
                error.message.toLowerCase().includes('no job')
                  ? 'No Jobs Uploaded'
                  : 'Error Loading Jobs'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                {error instanceof Error &&
                error.message.toLowerCase().includes('no job')
                  ? "You haven't created any job postings yet. Create your first job posting to start receiving candidates."
                  : error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred while loading your jobs.'}
              </p>
              <button
                onClick={() => navigate({ to: '/company/add-job' })}
                className="inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20"
              >
                <span className="material-symbols-outlined text-xl">
                  add_circle
                </span>
                Create Job
              </button>
            </div>
          )}
          {/* Empty State */}
          {!isLoading && !error && filteredJobs.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-gray-400 dark:text-gray-500">
                    work_off
                  </span>
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {search || activeFiltersCount > 0
                  ? 'No Jobs Found'
                  : 'No Jobs Yet'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                {search || activeFiltersCount > 0
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : 'Create your first job posting to start receiving candidates.'}
              </p>
              <button
                onClick={() => navigate({ to: '/company/add-job' })}
                className="inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20"
              >
                <span className="material-symbols-outlined text-xl">
                  add_circle
                </span>
                Create Job
              </button>
            </div>
          )}

          {/* Jobs Table */}
          {!isLoading && !error && filteredJobs.length > 0 && (
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Job Title
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Location
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Experience
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Posted
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Applicants
                      </th>
                      <th className="px-6 py-4" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredJobs.map((job: any) => (
                      <tr
                        key={job._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {job.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {job.jobType}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                              job.isActive
                                ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${job.isActive ? 'bg-teal-500' : 'bg-gray-500'}`}
                            ></span>
                            {job.isActive ? 'Active' : 'Closed'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                          {job.location}
                        </td>

                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                          {job.experienceLevel}
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                          {formatDate(job.createdAt)}
                        </td>

                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              navigate({
                                to: '/company/applicants',
                                search: { jobId: job._id },
                              })
                            }
                            className="inline-flex items-center gap-2 px-3 py-2 bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors font-semibold text-sm border border-teal-200 dark:border-teal-800"
                          >
                            <span className="material-symbols-outlined text-base">
                              group
                            </span>
                            <span>{job.applicants?.length || 0}</span>
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <div className="relative group">
                              <button
                                onClick={() =>
                                  navigate({
                                    to: '/company/job-details',
                                    search: { id: job._id },
                                  })
                                }
                                className="p-2 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-colors"
                              >
                                <span className="material-symbols-outlined text-xl">
                                  visibility
                                </span>
                              </button>
                              <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                                View Details
                                <span className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></span>
                              </span>
                            </div>
                            <div className="relative group">
                              <button
                                onClick={() =>
                                  navigate({
                                    to: '/company/edit-job',
                                    search: { id: job._id },
                                  })
                                }
                                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                              >
                                <span className="material-symbols-outlined text-xl">
                                  edit
                                </span>
                              </button>
                              <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                                Edit Job
                                <span className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></span>
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
