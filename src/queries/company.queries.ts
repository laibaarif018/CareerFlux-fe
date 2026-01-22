import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { companyService, CompanyProfileData } from '@/services/company.service'

export const COMPANY_PROFILE_KEY = ['company-profile']
export function useCompanyProfile() {
  return useQuery({
    queryKey: COMPANY_PROFILE_KEY,
    queryFn: () => companyService.getProfile(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
export const useUpdateCompanyProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      data,
      logoFile,
    }: {
      data: CompanyProfileData
      logoFile?: File
    }) => companyService.updateProfile(data, logoFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-profile'] })
    },
  })
}

export function useDeleteCompanyProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => companyService.deleteProfile(),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: COMPANY_PROFILE_KEY })
      //   toast.success(response.message || 'Company profile deleted successfully')
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to delete company profile'
      //   toast.error(message)
    },
  })
}
