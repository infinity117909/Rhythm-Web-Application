import { createFileRoute, Outlet } from '@tanstack/react-router'
import '../App.css'
import { HomeNavbar } from '../components/Navbars'

export const Route = createFileRoute('/')({ component: App })
   
function App() {
   return (
      <div className="">
         <HomeNavbar/>
         <Outlet />
      </div>
  )
}
