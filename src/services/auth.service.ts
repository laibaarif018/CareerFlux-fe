import { HttpService } from '@/lib/http'
import { IApiResponse } from '@/utils/IApiResponse'

export interface IUser {
  sub: string
  name: string
  email: string
  role?: 'user' | 'company'
}

export interface IEmailCheck {
  email: string
  exists: boolean
  hasPassword: boolean
  userId: string
}

export interface ILogin {
  email: string
  password: string
}

export interface ISignup {
  email: string
  name: string
  password: string
  confirmPassword: string
}

export interface IVerify {
  email: string
  code: string
}

export interface IForgotPassword {
  email: string
}
export interface ISetPassword {
  userId: string
  password: string
  // confirmPassword: string;
}
export interface IResetPassword {
  email: string
  code: string
  newPassword: string
  confirmPassword: string
}
export interface IConnectGoogle {
  email: string
  code: string
  googleId: string
}

class AuthService extends HttpService {
  private readonly prefix: string = '/auth'

  /**
   * Check if email exists
   * @param email User email
   */
  checkEmail = (email: string): Promise<IApiResponse<IEmailCheck >> =>
    this.post(`${this.prefix}/check-email`, { email })

  /**
   * Login user with credentials
   * @param credentials User login credentials
   */
  login = (credentials: ILogin): Promise<IApiResponse> =>
    this.post(`${this.prefix}/login`, credentials, undefined, {
      _skipUnauthorizedRedirect: true,
    } as any)

  /**
   * Logout user
   */
  logout = (): Promise<IApiResponse> => this.post(`${this.prefix}/logout`, {})

  /**
   * Signup new user
   * @param userData User signup data
   */
  signup = (userData: ISignup): Promise<IApiResponse> =>
    this.post(`${this.prefix}/signup`, userData)

  /**
   * Verify email with code
   * @param verifyData Email and verification code
   */
  verify = (verifyData: IVerify): Promise<IApiResponse> =>
    this.post(`${this.prefix}/verify`, verifyData)

  /**
   * Forgot password - send reset email
   * @param payload User forgot password payload
   */
  forgotPassword = (payload: IForgotPassword): Promise<IApiResponse> =>
    this.post(`${this.prefix}/forgot-password`, payload)

  /**
   * Reset password with token
   * @param payload User reset password payload
   */
  resetPassword = (payload: IResetPassword): Promise<IApiResponse> =>
    this.post(`${this.prefix}/reset-password`, payload)

  /**
   * Set user role (for OAuth users)
   * @param role User role
   */
  setRole = (role: string): Promise<IApiResponse> =>
    this.put(`${this.prefix}/set-role`, { role })

  /**
   * Set password (for OAuth users)
   * @param password New password
   */
  setPassword = (password: ISetPassword): Promise<IApiResponse> =>
    this.post(`${this.prefix}/set-password`, password)

  /**
   * Get current user (you need to add this endpoint to your backend)
   * @returns Current user data
   */
  getCurrentUser = (): Promise<IApiResponse<IUser>> =>
    this.get(`${this.prefix}/me`)

  connectGoogle = (payload: IConnectGoogle): Promise<IApiResponse> =>
    this.post(`${this.prefix}/connect-google`, payload)

  changePassword = (credentials: {
    currentPassword: string
    newPassword: string
  }): Promise<IApiResponse> =>
    this.post(`${this.prefix}/change-password`, credentials)
}

// Export singleton instance
export const authService = new AuthService()
