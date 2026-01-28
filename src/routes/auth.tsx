import { PublicRoute } from '@/utils/RouteGuard'
import { createFileRoute, Outlet } from '@tanstack/react-router'
export const Route = createFileRoute('/auth')({
  component: () => (
    <PublicRoute>
      <Outlet />
    </PublicRoute>
  ),
})
