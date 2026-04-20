import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/education/theory/rhythm-education')({
  component: RouteComponent,
})

function RouteComponent() {
   return (
      <>
         <body className="information">
            <h1>Hello</h1>
         </body>

      </>
  )
}
