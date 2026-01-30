import { useNavigate } from '@tanstack/react-router'
import { getAuthToken } from '@/utils/auth'
import storageService from '@/utils/localstorage'
import { useEffect, useState, ReactNode } from 'react'
import { FullPageLoader } from '../components/Loader'

export function PublicRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const token = getAuthToken()
  const role = storageService.getItem<string>('userRole')

  useEffect(() => {
    if (token && role === 'jobseeker') {
      navigate({ to: '/job-seeker/dashboard' })
    } else if (token && role === 'company') {
      navigate({ to: '/company/dashboard' })
    } else {
      setChecking(false) // token missing, stop loading
    }
  }, [token, navigate])

  if (checking)
    return (
      <div>
        <FullPageLoader />
      </div>
    ) // fallback while checking

  return <>{children}</>
}
type ProtectedRouteProps = {
  children: ReactNode
  allowedRoles?: ('jobseeker' | 'company')[]
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const navigate = useNavigate()
  const [role, setRole] = useState<string | null>(null)
  const [checking, setChecking] = useState(true) // loading state

  const token = getAuthToken()

  useEffect(() => {
    const currentRole = storageService.getItem<any>('userRole')

    setRole(currentRole)

    if (!token) {
      // Check if we're already on the login page to avoid double navigation
      if (window.location.pathname !== '/auth/login') {
        <FullPageLoader />
        navigate({ to: '/auth/login' })
      }
      setChecking(false)
      return
    }

    // Only redirect if user has a role but it's not allowed
    if (
      allowedRoles &&
      currentRole &&
      !allowedRoles.includes(currentRole as any)
    ) {
      navigate({
        to:
          currentRole === 'company'
            ? '/company/dashboard'
            : '/job-seeker/dashboard',
      })
    }
    setChecking(false)
  }, [token, navigate, allowedRoles])
  if (checking)
    return (
      <div>
        <FullPageLoader />
      </div>
    )

  // Render the page immediately
  return <>{children}</>
}
export function UnassignedOnlyRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)

  const token = getAuthToken()
  const role = storageService.getItem<string>('userRole')

  useEffect(() => {
    if (!token) {
      // Check if we're already on the login page to avoid double navigation
      if (window.location.pathname !== '/auth/login') {
        <FullPageLoader />

        navigate({ to: '/auth/login' })
      }
      return
    }

    if (role === 'jobseeker') {
      navigate({ to: '/job-seeker/dashboard' })
      return
    }

    if (role === 'company') {
      navigate({ to: '/company/dashboard' })
      return
    }

    if (role === 'unassigned') {
      setChecking(false)
      return
    }

    // fallback (corrupt state)
    // Check if we're already on the login page to avoid double navigation
    if (window.location.pathname !== '/auth/login') {
      navigate({ to: '/auth/login' })
    }
  }, [token, role, navigate])

  if (checking) return <FullPageLoader />

  return <>{children}</>
}
