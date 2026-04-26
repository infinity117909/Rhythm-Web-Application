import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/education/genres/jazz/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/education/genres/jazz"!</div>
}
