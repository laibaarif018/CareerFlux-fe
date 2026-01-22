import { redirect,useNavigate } from '@tanstack/react-router'
import { getAuthToken } from '@/utils/auth'
import storageService from '@/utils/localstorage'
import { useEffect, useState, ReactNode } from 'react'
import { FullPageLoader } from '../components/Loader';

const role = storageService.getItem<string>('userRole')
export function requireRole(roleRequired: 'jobseeker' | 'company') {
  const token = getAuthToken()

  if (!token) {
    throw redirect({ to: '/auth/login' })
  }
else if(token){
  if (role !== roleRequired) {
    if (role === 'jobseeker') {
      throw redirect({ to: '/job-seeker/dashboard' })
    }
    if (role === 'company') {
      throw redirect({ to: '/company/dashboard' })
    }

    throw redirect({ to: '/auth/login' })
  }
}}

export function PublicRoute({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const token = getAuthToken()

  useEffect(() => {
    if (token && role==='jobseeker') {
      navigate({ to: '/job-seeker/dashboard' })
    } else if (token && role==='company') {
      navigate({ to: '/company/dashboard' })
    }
    else {
      setChecking(false) // token missing, stop loading
    }
  }, [token, navigate])

  if (checking) return <div><FullPageLoader/></div> // fallback while checking

  return <>{children}</>
}

     


