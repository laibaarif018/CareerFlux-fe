import * as yup from 'yup'

export const jobSchema = yup.object({
  title: yup.string().required('Job title is required'),
  companyName: yup.string().required('Company name is required'),
  location: yup.string().required('Location is required'),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),
  experienceLevel: yup.string().required('Experience level is required'),
  jobType: yup.string().required('Job type is required'),
  minSalary: yup
    .number()
    .required('Minimum salary is required')
    .min(0, 'Minimum salary must be positive')
    .typeError('Must be a number'),
  maxSalary: yup
    .number()
    .required('Maximum salary is required')
    .min(0, 'Maximum salary must be positive')
    .typeError('Must be a number')
    .test(
      'is-greater',
      'Maximum salary must be greater than or equal to minimum salary',
      function (value) {
        const { minSalary } = this.parent
        return value >= minSalary
      },
    ),
  skills: yup
    .array()
    .of(yup.string().required())
    .required()
    .min(1, 'At least one skill is required'),
  qualifications: yup
    .array()
    .of(yup.string().required())
    .required()
    .min(1, 'At least one qualification is required'),
})