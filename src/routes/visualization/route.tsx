import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { VisualizationNavbar } from '../../components/Navbars'

export const Route = createFileRoute('/visualization')({
  component: RouteComponent,
})

function RouteComponent() {
   return (
      <>
         <VisualizationNavbar />
      </>
   )
}
