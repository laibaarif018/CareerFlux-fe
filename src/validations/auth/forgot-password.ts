import * as Yup from 'yup'

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
})

export type EmailFormData = Yup.InferType<typeof forgotPasswordSchema>