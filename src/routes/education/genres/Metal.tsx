import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/education/genres/Metal')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/education/genres/Metal"!</div>
}
