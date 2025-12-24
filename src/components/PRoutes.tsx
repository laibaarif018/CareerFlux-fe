import { useEffect, useState, ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { getAuthToken } from '@/utils/auth'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const token = getAuthToken()

  useEffect(() => {
    if (!token) {
      navigate({ to: '/auth/login' })
    } else {
      setChecking(false) // token exists, stop loading
    }
  }, [token, navigate])

  if (checking) return <div>Loading...</div> // fallback while checking

  return <>{children}</>
}

export function PublicRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const token = getAuthToken()

  useEffect(() => {
    if (token) {
      navigate({ to: '/dashboard' })
    } else {
      setChecking(false) // token missing, stop loading
    }
  }, [token, navigate])

  if (checking) return <div>Loading...</div> // fallback while checking

  return <>{children}</>
}

