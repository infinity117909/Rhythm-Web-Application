import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/visualization/rhythms/rhythm-visual')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/visualization/rhythms/rhythm-visual"!</div>
}
