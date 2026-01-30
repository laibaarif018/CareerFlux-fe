import { z } from 'zod'

export const jobSearchSchema = z.object({
  query: z.string().optional(),
  location: z.string().optional(),
  experience: z.string().optional(),
  jobType: z.string().optional(),
})