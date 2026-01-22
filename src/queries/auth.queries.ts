import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '../services/auth.service'
import type {
  ILogin,
  ISignup,
  IVerify,
  IForgotPassword,
  IResetPassword,
  ISetPassword,
  IConnectGoogle,
} from '../services/auth.service'


export function useCheckEmail() {
  return useMutation({
    mutationFn: (email: string) => authService.checkEmail(email),
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (credentials: ILogin) => authService.login(credentials),
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all queries
      queryClient.clear()
    },
  })
}

export function useSignup() {
  return useMutation({
    mutationFn: (userData: ISignup) => authService.signup(userData),
  })
}

export function useVerify() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (verifyData: IVerify) => authService.verify(verifyData),
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: IForgotPassword) =>
      authService.forgotPassword(payload),
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: IResetPassword) => authService.resetPassword(payload),
  })
}

export function useRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (role: string) => authService.setRole(role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    },
  })
}

export function useSetPassword() {
  return useMutation({
    mutationFn: (password: ISetPassword) => authService.setPassword(password),
  })
}

export function useConnetGoogle() {
  return useMutation({
    mutationFn: (payload: IConnectGoogle) => authService.connectGoogle(payload),
  })
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['c urrentUser'],
    queryFn: () => authService.getCurrentUser(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
 
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: {
      currentPassword: string;
      newPassword: string;
    }) => authService.changePassword(data),

    onSuccess: () => {
      // toast.success('Password changed successfully');
    },

    onError: (error: any) => {
      // toast.error(
      //   error?.response?.data?.message ||
      //   'Failed to change password'
      // );
    },
  });
};