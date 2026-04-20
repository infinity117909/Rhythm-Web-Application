import { createFileRoute, Outlet } from '@tanstack/react-router'
import { GameNavbar } from '../../components/Navbars'


export const Route = createFileRoute('/games')({
  component: RouteComponent,
})

// This is for persistant display throughout all games.
function RouteComponent() {
   return (
      <>
         <GameNavbar/>         
      </>
   )
}
