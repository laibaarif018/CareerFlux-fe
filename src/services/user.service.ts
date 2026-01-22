import { HttpService } from '@/lib/http'
import { IApiResponse } from '@/utils/IApiResponse'

export interface IProfile {
  name: string
  phoneNumber: string
  location: string
  experienceLevel: string
  preferredRoles: string[]
  preferredIndustries: string[]
  preferredLocations: string[]
  minimumSalaryExpected: Number
}

export class UserService extends HttpService {
  private readonly prefix: string = '/user'

  updateProfile = (credentials: IProfile): Promise<IApiResponse> =>
    this.put(`${this.prefix}/profile`, credentials)

  getProfile = (): Promise<IApiResponse> => this.get(`${this.prefix}/profile`)

  getJobSeeker = (): Promise<IApiResponse> =>
    this.get(`${this.prefix}/job-seekers`)

  saveJob = (jobId: string): Promise<IApiResponse> =>
    this.post(`${this.prefix}/save-job/${jobId}`, {})

  unsaveJob = (jobId: string): Promise<IApiResponse> =>
    this.delete(`${this.prefix}/unsave-job/${jobId}`)

  getSavedJobs = (): Promise<IApiResponse> =>
    this.get(`${this.prefix}/saved-jobs`)
}

export const userService = new UserService()
