import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/education/genres/HipHop')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/education/genres/HipHop"!</div>
}
