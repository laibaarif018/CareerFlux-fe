import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { PublicRoute } from '@/components/PRoutes'

export const Route = createFileRoute('/auth/oauth-callback')({
  component: () => (
    <PublicRoute>
      <OAuthCallback />
    </PublicRoute>
  ),
})

export default function OAuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    const token = params.get('token')
    const needsPasswordSetup = params.get('needsPasswordSetup')
    const verificationRequired = params.get('verificationRequired')
    const email = params.get('email')
    const googleId = params.get('googleId')

    if (verificationRequired === 'true' && email && googleId) {
      localStorage.setItem('googleLinkEmail', email)
      localStorage.setItem('googleLinkId', googleId)

      window.history.replaceState({}, document.title, '/auth/oauth/callback')

      navigate({ to: '/auth/connect-google' })
      return
    }
    if (token) {
      window.history.replaceState({}, document.title, '/auth/oauth/callback')

      if (needsPasswordSetup === 'true') {
        navigate({ to: '/auth/set-password' })
      } else {
        navigate({ to: '/dashboard' })
      }
      return
    }
    // navigate({ to: '/auth/login' })
  }, [navigate])

  return <p>Signing you in...</p>
}
