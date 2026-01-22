import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { IProfile, userService } from '@/services/user.service'

export function useGetProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => userService.getProfile(),
  })
}
export function useGetJobSeeker(){
  return useQuery({
    queryKey: ['job-seeker'],
    queryFn: () => userService.getJobSeeker(),
  })
}

export function useProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: IProfile) => userService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useSavedJobs() {
  return useQuery({
    queryKey: ['saved-jobs'],
    queryFn: () => userService.getSavedJobs(),
  })
}

export function useSaveJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (jobId: string) => userService.saveJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] })
    },
  })
}

export function useUnsaveJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (jobId: string) => userService.unsaveJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] })
    },
  })
}
