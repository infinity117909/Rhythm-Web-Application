import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/education/genres/hip-hop/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/education/genres/hip-hop"!</div>
}
