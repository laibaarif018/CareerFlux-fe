import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/googleVerification')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/auth/googleVerification"!</div>
}
