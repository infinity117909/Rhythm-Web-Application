import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/education/genres/punk-rock/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/education/genres/punk-rock"!</div>
}
