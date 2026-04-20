import { createFileRoute } from '@tanstack/react-router'
import OsmdParserPage from '@/osmd-parsing/OsmdParserPage'

export const Route = createFileRoute('/visualization/osmd-parser')({
  component: OsmdParserPage,
})
