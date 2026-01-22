// useJob.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  jobService,
  ICreateJobDto,
  IUpdateJobDto,
} from '@/services/job.service'

export const useJobs = (filters?: {
  location?: string
  experienceLevel?: string
  minSalary?: number
  maxSalary?: number
  isActive?: boolean
}) => {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      const res = await jobService.getJobs(filters)
      return res.payload
    },
    placeholderData: (previousData) => previousData,
  })
}

// Get single job by ID
export const useJob = (jobId: string) => {
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      const res = await jobService.getJobById(jobId)
      return res.payload
    },
    enabled: !!jobId,
  })
}

// Create new job
export const useCreateJob = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateJobDto) => jobService.createJob(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      console.log('✅ Job created successfully:', response.payload)
    },
    onError: (error: any) => {
      console.error('❌ Error creating job:', error)
      const message = error.response?.data?.message || 'Failed to create job'
      throw new Error(message)
    },
  })
}

// Update existing job
export const useUpdateJob = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ jobId, data }: { jobId: string; data: IUpdateJobDto }) =>
      jobService.updateJob(jobId, data),
    onSuccess: (_, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['job', jobId] })
      console.log('✅ Job updated successfully')
    },
    onError: (error: any) => {
      console.error('❌ Error updating job:', error)
      const message = error.response?.data?.message || 'Failed to update job'
      throw new Error(message)
    },
  })
}

export const useToggleJobStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ jobId, isActive }: { jobId: string; isActive: boolean }) =>
      jobService.changeStatus(jobId, isActive),
    onSuccess: (_, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      queryClient.invalidateQueries({ queryKey: ['job', jobId] })
      console.log('✅ Job status toggled successfully')
    },
    onError: (error: any) => {
      console.error('❌ Error toggling job status:', error)
      const message =
        error.response?.data?.message || 'Failed to toggle job status'
      throw new Error(message)
    },
  })
}

// Delete job
export const useDeleteJob = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (jobId: string) => jobService.deleteJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      console.log('✅ Job deleted successfully')
    },
    onError: (error: any) => {
      console.error('❌ Error deleting job:', error)
      const message = error.response?.data?.message || 'Failed to delete job'
      throw new Error(message)
    },
  })
}

// Get matched jobs for user with pagination
export const useMatchedJobs = (
  userId: string,
  params?: {
    limit?: number
    page?: number
  },
) => {
  return useQuery({
    queryKey: ['matched-jobs', userId, params],
    queryFn: async () => {
      const res = await jobService.getMatchedJobs(userId, params)
      return res.payload
    },
    enabled: !!userId,
  })
}

// Get single matched job with score
export const useMatchedJob = (userId: string, jobId: string) => {
  return useQuery({
    queryKey: ['matched-job', userId, jobId],
    queryFn: async () => {
      const res = await jobService.getMatchedJob(userId, jobId)
      return res.payload
    },
    enabled: !!userId && !!jobId,
  })
}

// Apply to a job
export const useApplyToJob = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ jobId, userId }: { jobId: string; userId: string }) =>
      jobService.jobaApply(jobId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matched-jobs'] })
      console.log('Applied to job successfully')
    },
    onError: (error: any) => {
      console.error('Error applying to job:', error)
    },
  })
}

// Get applicants for a job
export const useJobApplicants = (jobId: string) => {
  return useQuery({
    queryKey: ['job-applicants', jobId],
    queryFn: async () => {
      const res = await jobService.getApplicants(jobId)
      return res // Return the whole response, not res.payload
    },
    enabled: !!jobId,
  })
}
export const useCompanyJobs = () => {
  return useQuery({
    queryKey: ['company-jobs'],
    queryFn: async () => {
      const res = await jobService.getCompanyJobs()
      return res // This will have { company: {...}, jobs: [...] }
    },
  })
}
