import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { useSignup } from '@/queries/auth.queries'
import * as Yup from 'yup'
import { Eye, EyeOff } from 'lucide-react'
import { PublicRoute } from '@/utils/RouteGuard'

export const Route = createFileRoute('/auth/signup')({
  component: () => (
    <PublicRoute>
      <SignUpPage />
    </PublicRoute>
  ),
})

// Yup validation schema
const signupSchema = Yup.object().shape({
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

type SignupFormData = Yup.InferType<typeof signupSchema>

function SignUpPage() {
  const navigate = useNavigate()
  const signup = useSignup()
  
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    const email = localStorage.getItem('email') || ''
    if (email) {
      setFormData((prev) => ({ ...prev, email }))
    }
  }, [])

  // Validate a single field
  const validateField = async (field: keyof SignupFormData, value: any) => {
    try {
      await signupSchema.validateAt(field, { ...formData, [field]: value })
      setErrors((prev) => ({ ...prev, [field]: '' }))
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setErrors((prev) => ({ ...prev, [field]: error.message }))
      }
    }
  }

  const handleInputChange = (field: keyof SignupFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
    
    // Validate on change if field was touched
    if (touched[field]) {
      validateField(field, value)
    }
    
    if (signup.isError) {
      signup.reset()
    }
  }

  const handleBlur = (field: keyof SignupFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    validateField(field, formData[field])
  }

  const validateForm = async (): Promise<boolean> => {
    try {
      await signupSchema.validate(formData, { abortEarly: false })
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const newErrors: Record<string, string> = {}
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.message
          }
        })
        setErrors(newErrors)
        
        // Mark all fields as touched
        setTouched({
          name: true,
          email: true,
          password: true,
          confirmPassword: true,
          agreedToTerms: true,
        })
      }
      return false
    }
  }

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault()

    const isValid = await validateForm()
    if (!isValid) return

    signup.mutate(
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      },
      {
        onSuccess: () => {
          navigate({
            to: '/auth/verification',
            search: { email: formData.email },
          })
        },
      }
    )
  }

  const handleGoogleSignUp = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`
  }

  const getFieldError = (field: string) => {
    return touched[field] && errors[field] ? errors[field] : ''
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans transition-colors">
      <Header />

      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-5">
          {/* LEFT INFO PANEL */}
          <div className="hidden lg:flex lg:col-span-2 flex-col justify-between bg-slate-50 dark:bg-slate-900/50 p-10 border-r border-slate-200 dark:border-slate-700">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                Build your career with confidence
              </h2>

              <ul className="space-y-6">
                {[
                  [
                    'check_circle',
                    'ATS Optimized',
                    'Beat resume filters easily',
                    'text-green-500',
                  ],
                  [
                    'work',
                    'AI Job Matching',
                    'Jobs tailored to your skills',
                    'text-blue-600 dark:text-blue-400',
                  ],
                  [
                    'analytics',
                    'Resume Insights',
                    'Score & improve instantly',
                    'text-purple-500',
                  ],
                ].map(([icon, title, desc, color]) => (
                  <li key={title} className="flex gap-4">
                    <div
                      className={`h-10 w-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm ${color}`}
                    >
                      <span className="material-symbols-outlined">{icon}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {title}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              © ResumeAI {new Date().getFullYear()}
            </p>
          </div>

          {/* RIGHT FORM PANEL */}
          <div className="lg:col-span-3 flex items-center justify-center p-8 md:p-12">
            <div className="w-full max-w-md">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                Create your account
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                Start analyzing your resume and matching with jobs.
              </p>

              {/* SOCIAL */}
              <button
                onClick={handleGoogleSignUp}
                type="button"
                className="mb-6 w-full h-11 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 flex items-center justify-center gap-2 font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 10.8v2.8h4.1c-.2 1-.8 1.9-1.7 2.5v2h2.7c1.6-1.5 2.5-3.7 2.5-6 0-.5 0-1-.1-1.4H12z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 22c2.2 0 4-0.7 5.3-2l-2.7-2c-.7.5-1.6.8-2.6.8-2 0-3.7-1.3-4.3-3.1H4.7v2c1.3 2.5 3.9 4.3 7.3 4.3z"
                  />
                  <path
                    fill="#4A90E2"
                    d="M7.7 13.7c-.2-.5-.3-1-.3-1.7s.1-1.2.3-1.7v-2H4.7C4.1 9.4 3.7 10.6 3.7 12s.4 2.6 1 3.7l3-2z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M12 7.7c1.2 0 2.3.4 3.2 1.3l2.4-2.4C16 4.9 14.2 4 12 4 8.6 4 6 5.8 4.7 8.3l3 2c.6-1.8 2.3-2.6 4.3-2.6z"
                  />
                </svg>
                Continue with Google
              </button>

              {/* DIVIDER */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white dark:bg-slate-800 px-2 text-slate-500 dark:text-slate-400">
                    OR CONTINUE WITH EMAIL
                  </span>
                </div>
              </div>

              {/* FORM */}
              <form
                className="space-y-4"
                onSubmit={handleCreateAccount}
                noValidate
              >
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    className={`w-full h-11 rounded-lg border bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none transition-colors ${
                      getFieldError('name')
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-slate-300 dark:border-slate-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20'
                    }`}
                  />
                  {getFieldError('name') && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {getFieldError('name')}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={`w-full h-11 rounded-lg border bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none transition-colors ${
                      getFieldError('email')
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-slate-300 dark:border-slate-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20'
                    }`}
                  />
                  {getFieldError('email') && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {getFieldError('email')}
                    </p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange('password', e.target.value)
                      }
                      onBlur={() => handleBlur('password')}
                      className={`w-full h-11 rounded-lg border bg-white dark:bg-slate-900 pl-4 pr-12 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none transition-colors ${
                        getFieldError('password')
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'border-slate-300 dark:border-slate-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {getFieldError('password') && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {getFieldError('password')}
                    </p>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange('confirmPassword', e.target.value)
                      }
                      onBlur={() => handleBlur('confirmPassword')}
                      className={`w-full h-11 rounded-lg border bg-white dark:bg-slate-900 pl-4 pr-12 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none transition-colors ${
                        getFieldError('confirmPassword')
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'border-slate-300 dark:border-slate-600 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {getFieldError('confirmPassword') && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {getFieldError('confirmPassword')}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreedToTerms}
                      onChange={(e) =>
                        handleInputChange('agreedToTerms', e.target.checked)
                      }
                      onBlur={() => handleBlur('agreedToTerms')}
                      className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-[#0E7C8C] focus:ring-2 focus:ring-[#0E7C8C]/20"
                    />
                    <span>I agree to the Terms & Privacy Policy</span>
                  </label>
                  {getFieldError('agreedToTerms') && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      {getFieldError('agreedToTerms')}
                    </p>
                  )}
                </div>

                {signup.isError && (
                  <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                    <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-base mt-0.5">
                      error
                    </span>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {(signup.error as any)?.message ||
                        'Failed to create account. Please try again.'}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={signup.isPending}
                  className="w-full h-11 rounded-lg bg-[#0E7C8C] text-white font-bold hover:bg-[#3EC3BC] active:bg-[#0B666D] transition-colors shadow-lg shadow-[#0E7C8C]/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {signup.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined animate-spin text-lg">
                        progress_activity
                      </span>
                      Creating...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <Link
                  to="/auth/login"
                  className="text-[#0E7C8C] font-bold hover:text-[#3EC3BC]"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}