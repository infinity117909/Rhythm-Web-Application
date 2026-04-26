import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/education/genres/metal/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/education/genres/metal"!</div>
}
