import { createFileRoute,  Outlet } from '@tanstack/react-router'

import { ProtectedRoute } from '@/utils/RouteGuard'

export const Route = createFileRoute('/company')({
  component: () => (
  <ProtectedRoute allowedRoles={['company']} >
  <Outlet />
</ProtectedRoute>

  ),
})

//fallback={<div>Redirecting…</div>}
// beforeLoad: () => {
//   const token = getAuthToken()
//   const role = getRole();
//   console.log("role",role)

//   if (!token) {
//     throw redirect({ to: '/auth/login' })
//   }

//   if (role !== 'company') {
//     throw redirect({ to:role==='jobseeker'? '/job-seeker/dashboard' :'/auth/login'})
//   }
// },
