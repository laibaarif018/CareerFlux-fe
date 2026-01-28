import UserHeader from '@/components/UserHeader'
import { createFileRoute, useNavigate, Navigate } from '@tanstack/react-router'
import { useState, useMemo, useEffect } from 'react'
import { useMatchedJobs } from '@/queries/job.queries'
import {
  useSaveJob,
  useUnsaveJob,
  useSavedJobs,
  useGetProfile,
} from '@/queries/user.queries'
import Shimmer from '@/components/Shimmer'
import { showToast, showError } from '@/utils/swal'

export const Route = createFileRoute('/job-seeker/jobs')({
  component: JobListing,
})

function JobListing() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'recommended' | 'all'>(
    'recommended',
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 10

  const { data: profileData, isLoading: isProfileLoading } = useGetProfile()
  const userId = profileData?.payload?.user?._id

  const [locationFilter, setLocationFilter] = useState('')
  const [experienceLevelFilter, setExperienceLevelFilter] = useState('')
  const [minSalaryFilter, setMinSalaryFilter] = useState<number | undefined>()
  const [maxSalaryFilter, setMaxSalaryFilter] = useState<number | undefined>()

  // Save/unsave mutations
  const { mutate: saveJob } = useSaveJob()
  const { mutate: unsaveJob } = useUnsaveJob()
  const { data: savedJobs } = useSavedJobs()

  // Fetch matched jobs with pagination
  const {
    data: matchedJobsData,
    isLoading,
    error,
  } = useMatchedJobs(userId || '', {
    limit: jobsPerPage,
    page: currentPage,
  })

  const jobs = matchedJobsData?.matchedJobs || []

  // Count active filters
  const activeFiltersCount = [
    locationFilter,
    experienceLevelFilter,
    minSalaryFilter,
    maxSalaryFilter,
  ].filter(Boolean).length

  // Apply filters to matched jobs
  const filteredJobsByFilters = useMemo(() => {
    return jobs.filter((job) => {
      // Location filter
      if (
        locationFilter &&
        !job.location.toLowerCase().includes(locationFilter.toLowerCase())
      ) {
        return false
      }

      // Experience level filter
      if (
        experienceLevelFilter &&
        job.experienceLevel !== experienceLevelFilter
      ) {
        return false
      }

      // Salary filters
      if (minSalaryFilter && job.maxSalary < minSalaryFilter) {
        return false
      }

      if (maxSalaryFilter && job.minSalary > maxSalaryFilter) {
        return false
      }

      return true
    })
  }, [
    jobs,
    locationFilter,
    experienceLevelFilter,
    minSalaryFilter,
    maxSalaryFilter,
  ])

  // Determine recommended jobs based on match score
  const jobsWithRecommendation = useMemo(() => {
    return filteredJobsByFilters.map((job) => ({
      ...job,
      recommended: job.matchScore >= 50, // Jobs with 50%+ match are recommended
    }))
  }, [filteredJobsByFilters])

  // Filter jobs based on selected tab and search query
  const filteredJobs = jobsWithRecommendation
    .filter((job) => activeTab === 'all' || job.recommended)
    .filter((job) => {
      const query = searchQuery.toLowerCase()
      return (
        job.title.toLowerCase().includes(query) ||
        job.companyName.toLowerCase().includes(query) ||
        job.skills.some((skill) => skill.toLowerCase().includes(query)) ||
        job.location.toLowerCase().includes(query)
      )
    })

  const recommendedCount = jobsWithRecommendation.filter(
    (j) => j.recommended,
  ).length

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [
    locationFilter,
    experienceLevelFilter,
    minSalaryFilter,
    maxSalaryFilter,
    activeTab,
  ])

  const toggleSaveJob = (jobId: string) => {
    const isSaved = savedJobs?.payload?.some(
      (savedJob: any) => savedJob._id === jobId,
    )

    if (isSaved) {
      unsaveJob(jobId, {
        onSuccess: () => {
          showToast('Job removed from saved jobs', 'success')
        },
        onError: (error: any) => {
          showError(
            'Failed to Remove',
            error?.response?.data?.message ||
              'Unable to remove job from saved list.',
          )
        },
      })
    } else {
      saveJob(jobId, {
        onSuccess: () => {
          showToast('Job saved successfully', 'success')
        },
        onError: (error: any) => {
          showError(
            'Failed to Save',
            error?.response?.data?.message ||
              'Unable to save job. Please try again.',
          )
        },
      })
    }
  }

  const isJobSaved = (jobId: string) => {
    return (
      savedJobs?.payload?.some((savedJob: any) => savedJob._id === jobId) ||
      false
    )
  }

  const getMatchColor = (match: number) => {
    if (match >= 90)
      return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
    if (match >= 80)
      return 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800'
    if (match >= 70)
      return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
    return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700'
  }

  // Format salary range
  const formatSalary = (min: number, max: number) => {
    return `${min.toLocaleString()} - ${max.toLocaleString()}`
  }

  // Shimmer Loading Component
  const JobListingShimmer = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col p-6 gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex gap-4 items-start flex-1">
              <Shimmer className="w-12 h-12 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Shimmer className="h-6 w-3/4 rounded-md" />
                <Shimmer className="h-4 w-1/2 rounded-md" />
                <Shimmer className="h-3 w-2/3 rounded-md" />
              </div>
            </div>
            <Shimmer className="w-16 h-7 rounded-full" />
          </div>

          <div className="space-y-2">
            <Shimmer className="h-4 w-full rounded-md" />
            <Shimmer className="h-4 w-5/6 rounded-md" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Shimmer className="h-6 w-16 rounded-full" />
              <Shimmer className="h-6 w-20 rounded-full" />
              <Shimmer className="h-6 w-24 rounded-full" />
              <Shimmer className="h-6 w-16 rounded-full" />
            </div>
            <Shimmer className="h-4 w-48 rounded-md" />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            <Shimmer className="h-10 w-24 rounded-lg" />
            <Shimmer className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="bg-gray-50 dark:bg-gray-900 font-sans min-h-screen transition-colors">
      <UserHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-6">
          {/* Heading */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Find Your Next Job
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Discover opportunities that match your skills and experience.
            </p>
          </div>

          {/* Search Bar with Filter Button */}
          <div className="relative flex gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 dark:text-gray-500">
                search
              </span>
              <input
                type="text"
                placeholder="Search by job title, company, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-600/20 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <span className="material-symbols-outlined text-xl">
                    close
                  </span>
                </button>
              )}
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`relative h-12 px-4 rounded-lg border flex items-center gap-2 font-medium text-sm transition-all ${
                showFilters
                  ? 'bg-teal-600 border-teal-600 text-white'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className="material-symbols-outlined text-xl">tune</span>
              <span className="hidden sm:inline">Filters</span>
              {activeFiltersCount > 0 && (
                <span
                  className={`absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    showFilters
                      ? 'bg-white text-teal-600'
                      : 'bg-teal-600 text-white'
                  }`}
                >
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Filters Panel - Dropdown */}
          {showFilters && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">
                    tune
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Filter Jobs
                  </h3>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={() => {
                      setLocationFilter('')
                      setExperienceLevelFilter('')
                      setMinSalaryFilter(undefined)
                      setMaxSalaryFilter(undefined)
                    }}
                    className="text-xs font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Location Filter */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                    Location
                  </label>
                  <span className="absolute left-3 bottom-2.5 material-symbols-outlined text-gray-400 dark:text-gray-500 text-lg">
                    location_on
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Remote, NYC"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full h-10 pl-10 pr-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 dark:focus:border-teal-400 transition-colors text-sm"
                  />
                  {locationFilter && (
                    <button
                      onClick={() => setLocationFilter('')}
                      className="absolute right-3 bottom-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <span className="material-symbols-outlined text-lg">
                        close
                      </span>
                    </button>
                  )}
                </div>

                {/* Experience Level Filter */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                    Experience Level
                  </label>
                  <span className="absolute left-3 bottom-2.5 material-symbols-outlined text-gray-400 dark:text-gray-500 text-lg pointer-events-none">
                    workspace_premium
                  </span>
                  <select
                    value={experienceLevelFilter}
                    onChange={(e) => setExperienceLevelFilter(e.target.value)}
                    className="w-full h-10 pl-10 pr-8 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 dark:focus:border-teal-400 transition-colors text-sm appearance-none cursor-pointer"
                  >
                    <option value="">All Levels</option>
                    <option value="Entry">Entry Level</option>
                    <option value="Mid">Mid Level</option>
                    <option value="Senior">Senior Level</option>
                    <option value="Lead">Lead</option>
                  </select>
                  <span className="absolute right-3 bottom-2.5 material-symbols-outlined text-gray-400 dark:text-gray-500 text-lg pointer-events-none">
                    expand_more
                  </span>
                </div>

                {/* Min Salary Filter */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                    Minimum Salary
                  </label>
                  <span className="absolute left-3 bottom-2.5 material-symbols-outlined text-gray-400 dark:text-gray-500 text-lg">
                    payments
                  </span>
                  <input
                    type="number"
                    placeholder="e.g. 50000"
                    value={minSalaryFilter ?? ''}
                    onChange={(e) =>
                      setMinSalaryFilter(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    className="w-full h-10 pl-10 pr-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 dark:focus:border-teal-400 transition-colors text-sm"
                  />
                  {minSalaryFilter && (
                    <button
                      onClick={() => setMinSalaryFilter(undefined)}
                      className="absolute right-3 bottom-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <span className="material-symbols-outlined text-lg">
                        close
                      </span>
                    </button>
                  )}
                </div>

                {/* Max Salary Filter */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                    Maximum Salary
                  </label>
                  <span className="absolute left-3 bottom-2.5 material-symbols-outlined text-gray-400 dark:text-gray-500 text-lg">
                    account_balance_wallet
                  </span>
                  <input
                    type="number"
                    placeholder="e.g. 150000"
                    value={maxSalaryFilter ?? ''}
                    onChange={(e) =>
                      setMaxSalaryFilter(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    className="w-full h-10 pl-10 pr-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 dark:focus:border-teal-400 transition-colors text-sm"
                  />
                  {maxSalaryFilter && (
                    <button
                      onClick={() => setMaxSalaryFilter(undefined)}
                      className="absolute right-3 bottom-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <span className="material-symbols-outlined text-lg">
                        close
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Active Filters Display */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {locationFilter && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-lg text-xs font-medium">
                      <span className="material-symbols-outlined text-sm">
                        location_on
                      </span>
                      {locationFilter}
                      <button
                        onClick={() => setLocationFilter('')}
                        className="hover:bg-teal-100 dark:hover:bg-teal-900/50 rounded p-0.5"
                      >
                        <span className="material-symbols-outlined text-sm">
                          close
                        </span>
                      </button>
                    </span>
                  )}
                  {experienceLevelFilter && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-lg text-xs font-medium">
                      <span className="material-symbols-outlined text-sm">
                        workspace_premium
                      </span>
                      {experienceLevelFilter}
                      <button
                        onClick={() => setExperienceLevelFilter('')}
                        className="hover:bg-teal-100 dark:hover:bg-teal-900/50 rounded p-0.5"
                      >
                        <span className="material-symbols-outlined text-sm">
                          close
                        </span>
                      </button>
                    </span>
                  )}
                  {minSalaryFilter && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-lg text-xs font-medium">
                      <span className="material-symbols-outlined text-sm">
                        payments
                      </span>
                      Min: ${minSalaryFilter.toLocaleString()}
                      <button
                        onClick={() => setMinSalaryFilter(undefined)}
                        className="hover:bg-teal-100 dark:hover:bg-teal-900/50 rounded p-0.5"
                      >
                        <span className="material-symbols-outlined text-sm">
                          close
                        </span>
                      </button>
                    </span>
                  )}
                  {maxSalaryFilter && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-lg text-xs font-medium">
                      <span className="material-symbols-outlined text-sm">
                        account_balance_wallet
                      </span>
                      Max: ${maxSalaryFilter.toLocaleString()}
                      <button
                        onClick={() => setMaxSalaryFilter(undefined)}
                        className="hover:bg-teal-100 dark:hover:bg-teal-900/50 rounded p-0.5"
                      >
                        <span className="material-symbols-outlined text-sm">
                          close
                        </span>
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('recommended')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'recommended'
                  ? 'border-teal-600 text-teal-600 dark:text-teal-400 font-bold'
                  : 'border-transparent text-gray-600 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">star</span>
              Recommended ({recommendedCount})
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === 'all'
                  ? 'border-teal-600 text-teal-600 dark:text-teal-400 font-bold'
                  : 'border-transparent text-gray-600 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">work</span>
              All Jobs ({jobs.length})
            </button>
          </div>

          {/* Results Count */}
          {searchQuery && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Found {filteredJobs.length}{' '}
              {filteredJobs.length === 1 ? 'job' : 'jobs'} matching "
              {searchQuery}"
            </p>
          )}

          {/* Loading State */}
          {isLoading && <JobListingShimmer />}

          {/* Error State */}
          {error && (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-5xl text-red-600 dark:text-red-400">
                  error
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Error loading jobs
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                {error instanceof Error
                  ? error.message
                  : 'An unexpected error occurred'}
              </p>
            </div>
          )}

          {/* Jobs List */}
          {!isLoading && !error && filteredJobs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-5xl text-gray-400 dark:text-gray-500">
                  work_off
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                No jobs found
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                {searchQuery
                  ? `Try adjusting your search terms or browse all available jobs.`
                  : `No ${activeTab === `recommended` ? `recommended ` : ``}jobs available at the moment. Browse all jobs`}
              </p>
            </div>
          )}

          {!isLoading && !error && filteredJobs.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredJobs.map((job) => (
                <div
                  key={job._id}
                  className="flex flex-col p-6 gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl transition-all hover:shadow-lg hover:border-teal-300 dark:hover:border-teal-700"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-4 items-start flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-2xl text-gray-400 dark:text-gray-500">
                          business
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {job.companyName}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">
                              location_on
                            </span>
                            {job.location}
                          </span>
                          <span>•</span>
                          <span>{job.jobType}</span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border ${getMatchColor(job.matchScore)}`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        verified
                      </span>
                      <span>{job.matchScore.toFixed(1)}%</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2">
                      {job.skills.slice(0, 4).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 4 && (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          +{job.skills.length - 4} more
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <span className="material-symbols-outlined text-sm">
                        payments
                      </span>
                      <span className="font-medium">
                        {formatSalary(job.minSalary, job.maxSalary)}
                      </span>
                      <span>•</span>
                      <span>{job.experienceLevel}</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => toggleSaveJob(job._id)}
                      className={`inline-flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-medium transition-colors ${
                        isJobSaved(job._id)
                          ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-900/50'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">
                        {isJobSaved(job._id) ? 'bookmark' : 'bookmark_add'}
                      </span>
                      {isJobSaved(job._id) ? 'Saved' : 'Save'}
                    </button>
                    <button
                      onClick={() =>
                        navigate({
                          to: '/job-seeker/job-details',
                          search: { id: job._id },
                        })
                      }
                      className="inline-flex items-center justify-center gap-2 px-4 h-10 rounded-lg bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 active:bg-teal-800 transition-colors shadow-sm"
                    >
                      <span className="material-symbols-outlined text-base">
                        arrow_forward
                      </span>
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
  )
}
