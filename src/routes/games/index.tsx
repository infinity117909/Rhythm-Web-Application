import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/games/')({
  component: RouteComponent,
})

// This is for children components
function RouteComponent() {
   return (
      <>
         <div>
            a
         </div>
      </>
   )
}
