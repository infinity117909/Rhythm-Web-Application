import { createFileRoute } from '@tanstack/react-router'
import BlockBeatVisualizer from '@/metronome/Metronome'

export const Route = createFileRoute('/visualization/metronome')({
  component: BlockBeatVisualizer,
})