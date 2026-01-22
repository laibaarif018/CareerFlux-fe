import { HttpService } from '@/lib/http'
import { IApiResponse } from '@/utils/IApiResponse'


export interface ICreateJobDto {
  title: string
  companyName: string
  location: string
  description: string
  experienceLevel: string
  jobType: string
  minSalary: number
  maxSalary: number
  skills: string[]
  qualifications: string[]
}

export interface IUpdateJobDto {
  title?: string
  companyName?: string
  location?: string
  description?: string
  experienceLevel?: string
  jobType?: string
  minSalary?: number
  maxSalary?: number
  skills?: string[]
  isActive?: boolean
  qualifications?: string[]
}
 export interface Applicant {
  user: {
    id: string;
    name: string;
    email: string;
  };
  jobSeekerProfile: {
    _id: string;
    userId: string;
    __v: number;
    createdAt: string;
    experienceLevel: string;
    location: string;
    minimumSalaryExpected: number;
    phoneNumber: string;
    preferredIndustries: string[];
    preferredLocations: string[];
    preferredRoles: string[];
    savedJobs: string[];
    updatedAt: string;
  };
  resume: {
    fileName: string;
    fileUrl: string;
    atsScore: number;
    strengths: string[];
    skills: string[];
  };
  matchScore: number; // New field for job match score
  appliedAt: string;
}
export interface IJob {
  _id: string
  title: string
  description: string
  companyId: string
  companyName: string
  location: string
  experienceLevel: string
  jobType: string
  minSalary: number
  maxSalary: number
  skills: string[]
  qualifications: string[]
  createdAt: string
  updatedAt: string
  isActive: boolean
  isSaved?: boolean
  applicants: string[]
}
export interface IMatchedJob extends IJob {
  expMatch: number
  locMatch: number
  preferredLocMatch: number
  salaryMatch: number
  skillsMatch: number
  roleMatch: number
  qualificationMatch: number
  industryMatch: number
  matchScore: number
  hasApplied: boolean
}

export interface IMatchedJobsResponse {
  _id: string
  userId: string
  experienceLevel: string
  location: string
  minimumSalaryExpected: number
  phoneNumber: string
  preferredIndustries: string[]
  preferredLocations: string[]
  preferredRoles: string[]
  savedJobs: string[]
  createdAt: string
  updatedAt: string
  matchedJobs: IMatchedJob[]
}

export interface IMatchedJobResponse {
  _id: string
  userId: string
  experienceLevel: string
  location: string
  minimumSalaryExpected: number
  phoneNumber: string
  preferredIndustries: string[]
  preferredLocations: string[]
  preferredRoles: string[]
  savedJobs: string[]
  createdAt: string
  updatedAt: string
  matchedJob: IMatchedJob[]
  resume: {
    parsedData: {
      skills: string[]
    }
  }
}

interface CompanyJobsResponse {
  company: {
    id: string;
    name: string;
    industry: string;
    website: string;
  };
  jobs: any[];
}
export class JobService extends HttpService {
  private readonly prefix = 'job'

  // CREATE JOB
  createJob = (data: ICreateJobDto) => {
    return this.post<IApiResponse<IJob>>(this.prefix, data)
  }

  // GET ALL JOBS (filters optional)
  // job.service.ts
  getJobs = (filters?: {
    location?: string
    experienceLevel?: string
    minSalary?: number
    maxSalary?: number
    isActive?: boolean
  }) => {
    return this.get<IApiResponse<IJob[]>>(this.prefix, filters)
  }

  // GET SINGLE JOB
  getJobById = (jobId: string) => {
    return this.get<IApiResponse<IJob>>(`${this.prefix}/${jobId}`)
  }

  // UPDATE JOB
  updateJob = (jobId: string, data: IUpdateJobDto) => {
    return this.put<IApiResponse<IJob>>(`${this.prefix}/${jobId}`, data)
  }

  // DELETE JOB
  deleteJob = (jobId: string) => {
    return this.delete<IApiResponse<void>>(`${this.prefix}/${jobId}`)
  }

  // CHANGE JOB STATUS
  changeStatus = (jobId: string, isActive: boolean) => {
    return this.put<IApiResponse<IJob>>(`${this.prefix}/${jobId}/status`, {
      isActive,
    })
  }

  // GET MATCHED JOBS FOR USER
  getMatchedJobs = (
    userId: string,
    params?: {
      limit?: number
      page?: number
    },
  ) => {
    return this.get<IApiResponse<IMatchedJobsResponse>>(
      `${this.prefix}/match/${userId}`,
      params,
    )
  }

  // GET SINGLE MATCHED JOB WITH SCORE
  getMatchedJob = (userId: string, jobId: string) => {
    return this.get<IApiResponse<IMatchedJobResponse>>(
      `${this.prefix}/match/${userId}/${jobId}`,
    )
  }

  jobaApply = (jobId: string, userId: string) => {
    return this.post<IApiResponse<void>>(`${this.prefix}/apply/${jobId}`, {
      userId,
    })
  }



// Update your service method:
getApplicants = (jobId: string) => {
  return this.get<IApiResponse<Applicant[]>>(
    `${this.prefix}/${jobId}/applicants`,
  )
}


getCompanyJobs = () => {
  return this.get<CompanyJobsResponse>(`${this.prefix}/company/:companyId`)
  // The :companyId will be replaced by your backend from the cookie
  // Or just use the endpoint path your backend expects
}
}
export const jobService = new JobService()
