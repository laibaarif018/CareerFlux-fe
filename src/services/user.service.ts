import { HttpService } from '@/lib/http'
import { User } from 'lucide-react'

export interface IApiResponse<T = any> {
  statusCode: number
  message: string
  payload?: T
  errors?: { [key: string]: string }
}
export interface IProfile {
  name: string
  phoneNumber: string
  location: string
  experienceLevel:string,
  preferredRoles: string[]
  preferredIndustries: string[]
  preferredLocations: string[]
  minimumSalaryExpected: Number
}

export class UserService extends HttpService {
     private readonly prefix: string = '/user'

      updateProfile = (credentials: IProfile): Promise<IApiResponse> =>
        this.put(`${this.prefix}/profile`, credentials)

      getProfile=():Promise<IApiResponse>=>
        this.get(`${this.prefix}/profile`)
    
}
export const userService = new UserService()
