import { HttpService } from '@/lib/http'
import { IApiResponse } from '@/utils/IApiResponse'

export interface CompanyProfileData {
  companyName: string
  websiteUrl?: string
  industry?: string
  companySize?: string
  description?: string
  contactName?: string
  contactEmail: string
  contactNumber?: string
}

export class CompanyService extends HttpService {
  private readonly prefix = '/company'

  // Get company profile
  getProfile = (): Promise<IApiResponse> => {
    return this.get(`${this.prefix}/profile`)
  }
  //Update company profile
  updateProfile = (
    data: CompanyProfileData,
    logoFile?: File,
  ): Promise<IApiResponse> => {
    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value)
      }
    })
    if (logoFile) {
      formData.append('logo', logoFile, logoFile.name)
    }

    return this.put(`${this.prefix}/profile`, formData)
  }
  // Delete company profile
  deleteProfile = (): Promise<IApiResponse> => {
    return this.delete(`${this.prefix}/profile`)
  }
}

export const companyService = new CompanyService()
