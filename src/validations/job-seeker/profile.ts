import * as Yup from 'yup'

// Yup validation schema
export const profileSchema = Yup.object().shape({
  name: Yup.string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters'),
  phone: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9+\s-()]+$/, 'Invalid phone number format'),
  location: Yup.string()
    .required('Location is required')
    .min(2, 'Location must be at least 2 characters'),
  experienceLevel: Yup.string().oneOf(
    ['fresher', 'junior', 'mid', 'senior'],
    'Invalid experience level',
  ),
  roles: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one role is required')
    .required('At least one role is required'),
  industries: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one industry is required')
    .required('At least one industry is required'),
  locations: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one work location is required')
    .required('At least one work location is required'),
  salary: Yup.number()
    .min(30000, 'Minimum salary must be at least $30,000')
    .max(250000, 'Maximum salary cannot exceed $250,000')
    .required('Please set a minimum salary expectation'),
})

export type ProfileFormData = Yup.InferType<typeof profileSchema>