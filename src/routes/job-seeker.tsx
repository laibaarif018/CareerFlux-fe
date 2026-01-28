import { createFileRoute,  Outlet } from '@tanstack/react-router'
import { ProtectedRoute } from '@/utils/RouteGuard'


export const Route = createFileRoute('/job-seeker')({ 
   component: () => (
      <ProtectedRoute allowedRoles={['jobseeker']}>
        <Outlet />
      </ProtectedRoute>
    ),

})