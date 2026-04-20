import { createFileRoute } from '@tanstack/react-router'
import { VisualizationNavbar } from '@/components/Navbars'

export const Route = createFileRoute('/visualization/')({
  component: RouteComponent,
})

function RouteComponent() {
   return (
      <>
         <div>
            Welcome to the Visualization page! Please select a visualization from the menu.
         </div>
      </>
   )
}