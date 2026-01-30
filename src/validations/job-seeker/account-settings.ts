import * as yup from 'yup'

export const passwordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string()
    .min(8, 'New password must be at least 8 characters')
    .matches(/[A-Z]/, 'New password must contain at least one uppercase letter')
    .matches(/\d/, 'New password must contain at least one number')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'New password must contain at least one special character'
    )
    .required('New password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword')], "Passwords don't match")
    .required('Please confirm your new password'),
})