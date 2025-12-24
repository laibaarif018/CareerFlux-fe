import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { IProfile, userService } from '@/services/user.service'


export function useGetProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => userService.getProfile(),
  })
}

export function useProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: IProfile) =>
      userService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
