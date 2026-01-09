import { HttpService } from '@/lib/http'
import { IApiResponse } from '@/utils/IApiResponse'

export class ResumeService extends HttpService {
  private readonly prefix = '/resume'

  uploadResume = (
    file: File,
    onProgress?: (percent: number) => void,
  ): Promise<IApiResponse> => {
    const formData = new FormData()
    formData.append('file', file)

    return this.post(
      `${this.prefix}/upload`,
      formData,
      {
        'Content-Type': 'multipart/form-data',
      },
      {
        onUploadProgress: (e) => {
          if (!e.total || !onProgress) return
          const percent = Math.round((e.loaded * 100) / e.total)
          onProgress(percent)
        },
      },
    )
  }

  getMyResumes = (page = 1, limit = 5): Promise<IApiResponse> => {
    return this.get(`${this.prefix}/my-resumes`, {
      params: { page, limit },
    })
  }

  getResumeStatus(resumeId: string): Promise<IApiResponse> {
    return this.get(`${this.prefix}/${resumeId}/status`)
  }

  
  getParsedResumeData(resumeId: string): Promise<IApiResponse> {
    return this.get(`${this.prefix}/${resumeId}/parsed`)
  }

  getTotalCount(userId:string):Promise<IApiResponse>{
    return this.get(`${this.prefix}/total/${userId}`)
  }

 
  analyzeResume(resumeId: string): Promise<IApiResponse> {
    return this.post(`${this.prefix}/${resumeId}/analyze`,{})
  }
   getAnalysisStatus(resumeId: string): Promise<IApiResponse> {
    return this.get(`${this.prefix}/${resumeId}/analysis-status`)
  }
  getAnalysisResults(resumeId: string): Promise<IApiResponse> {
    return this.get(`${this.prefix}/${resumeId}/analysis`)
  }
}

export const resumeService = new ResumeService()