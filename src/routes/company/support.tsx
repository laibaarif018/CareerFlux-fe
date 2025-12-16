import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/company/support')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/company/support"!</div>
}
