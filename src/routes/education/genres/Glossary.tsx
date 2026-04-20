import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/education/genres/Glossary')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/education/genres/Glossary"!</div>
}
