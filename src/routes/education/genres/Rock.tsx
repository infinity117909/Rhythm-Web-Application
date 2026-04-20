import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/education/genres/Rock')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/education/genres/Rock"!</div>
}
