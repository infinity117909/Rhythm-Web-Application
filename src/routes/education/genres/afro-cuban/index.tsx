import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/education/genres/afro-cuban/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/education/genres/afro-cuban/"!</div>
}
