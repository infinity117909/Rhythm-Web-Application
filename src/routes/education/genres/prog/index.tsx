import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/education/genres/prog/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/education/genres/prog"!</div>
}
