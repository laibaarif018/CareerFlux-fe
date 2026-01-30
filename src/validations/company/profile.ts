import * as yup from 'yup'
export const companyProfileSchema = yup.object({
  companyName: yup
    .string()
    .required('Company name is required')
    .min(2, 'Company name must be at least 2 characters'),
  websiteUrl: yup
    .string()
    .required('Website URL is required')
    .url('Please enter a valid URL'),
  industry: yup.string().required('Industry is required'),
  companySize: yup.string().required('Company size is required'),
  description: yup
    .string()
    .required('Company description is required')
    .min(10, 'Description must be at least 10 characters'),
  contactName: yup
    .string()
    .required('Contact name is required')
    .min(2, 'Contact name must be at least 2 characters'),
  contactEmail: yup
    .string()
    .required('Contact email is required')
    .email('Please enter a valid email address'),
  contactNumber: yup
    .string()
    .required('Contact phone is required')
    .matches(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
      'Please enter a valid phone number',
    ),
  logo: yup
    .mixed<File>()
    .nullable()
    .test('fileSize', 'File size must be less than 5MB', (value) => {
      if (!value) return true
      return value.size <= 5 * 1024 * 1024
    })
    .test('fileType', 'Please upload a valid image file', (value) => {
      if (!value) return true
      return value.type.startsWith('image/')
    }),
})

export type CompanyProfileForm = yup.InferType<typeof companyProfileSchema>