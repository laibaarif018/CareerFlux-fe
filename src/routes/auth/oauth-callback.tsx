import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import storageService from '@/utils/localstorage'
import { FullPageLoader } from '@/components/Loader'

export const Route = createFileRoute('/auth/oauth-callback')({
  component: OAuthCallback,
})

export default function OAuthCallback() {
  const navigate = useNavigate()

 useEffect(() => {
  const params = new URLSearchParams(window.location.search)

  const verificationRequired = params.get('verificationRequired')
  const email = params.get('email')
  const googleId = params.get('googleId')
  const role = params.get('role')

  if (role) {
    storageService.setItem('userRole', role)
  }

  if (verificationRequired === 'true' && email && googleId) {
    localStorage.setItem('googleLinkEmail', email)
    localStorage.setItem('googleLinkId', googleId)

    navigate({ to: '/auth/connect-google' })
    return
  }

  // Authenticated via cookie
  if (role === 'unassigned') {
    navigate({ to: '/roles' })
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

  navigate({ to: '/auth/login' })
}, [])


  return <p><FullPageLoader/></p>
}
