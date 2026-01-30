import * as Yup from 'yup'

// Yup validation schema
export const signupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], "Passwords don't match")
    .required('Please confirm your password'),
  agreedToTerms: Yup.boolean()
    .oneOf([true], 'You must agree to the Terms & Privacy Policy')
    .required('You must agree to the Terms & Privacy Policy'),
})

export type SignupFormData = Yup.InferType<typeof signupSchema>