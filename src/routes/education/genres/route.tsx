import { GenresFooterNav, GenresSideNav } from '@/components/Navbars'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/education/genres')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <>
        <GenresSideNav />
          <Outlet />
        <GenresFooterNav />
      </>
  )
}
