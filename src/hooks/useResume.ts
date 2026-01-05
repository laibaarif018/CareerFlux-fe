import { useMutation, useQuery } from '@tanstack/react-query'
import { resumeService } from '@/services/resume.service'

export function useUploadResume() {
  return useMutation({
    mutationFn: ({
      file,
      onProgress,
    }: {
      file: File
      onProgress?: (percent: number) => void
    }) => resumeService.uploadResume(file, onProgress),
  })
}

// All resumes
export function useAllResumes(page: number, limit: number) {
  return useQuery({
    queryKey: ['resumes', page, limit],
    queryFn: () => resumeService.getMyResumes(page, limit),
    placeholderData: (previousData) => previousData,
  })
}

// Resume status
export function useResumeStatus(resumeId?: string) {
  return useQuery({
    queryKey: ['resume-status', resumeId],
    queryFn: () => resumeService.getResumeStatus(resumeId!),
    enabled: !!resumeId,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
  })
}

//  Parsed resume data
export function useParsedResumeData(resumeId?: string) {
  return useQuery({
    queryKey: ['parsed-resume', resumeId],
    queryFn: () => resumeService.getParsedResumeData(resumeId!),
    enabled: !!resumeId,
    retry: 3,
    staleTime: 10000,
  })
}

export function useTotalCount(userId?: string) {
  return useQuery({
    queryKey: ['totalCount', userId],
    queryFn: () => resumeService.getTotalCount(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60,
  })
}

export function useAnalyzeResume() {
  return useMutation({
    mutationFn: (resumeId: string) =>
      resumeService.analyzeResume(resumeId),
  })
}


// Analysis status 
export function useAnalysisStatus(resumeId?: string) {
  return useQuery({
    queryKey: ['analysis-status', resumeId],
    queryFn: () => resumeService.getAnalysisStatus(resumeId!),
    enabled: !!resumeId,
    refetchInterval: (query) => {
      const status = query.state.data?.payload?.status
      // Stop polling once analysis is completed or failed
      return status === 'completed' || status === 'failed' ? false : 2000
    },
    refetchIntervalInBackground: true,
  })
}

// Analysis results)
export function useResumeAnalysis(
  resumeId?: string,
  isCompleted?: boolean,
) {
  return useQuery({
    queryKey: ['resume-analysis', resumeId],
    queryFn: () => resumeService.getAnalysisResults(resumeId!),
    enabled: !!resumeId && isCompleted === true,
    retry: 3,
    staleTime: 10000,
  })
}
