import { createFileRoute } from '@tanstack/react-router'
import { EducationNavbar } from '../../components/Navbars'

export const Route = createFileRoute('/education')({
   component: RouteComponent,
})
function RouteComponent() {
   return (
      <>
         <EducationNavbar/>
      </>
   )
}
