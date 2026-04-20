import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/education/genres/Prog')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/education/genres/Prog"!</div>
}
