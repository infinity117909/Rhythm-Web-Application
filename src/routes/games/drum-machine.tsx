import DrumMachine from '@/drum-machine/DrumMachine'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/games/drum-machine')({
  component: RouteComponent,
})

function RouteComponent() {
  return <DrumMachine />
}
