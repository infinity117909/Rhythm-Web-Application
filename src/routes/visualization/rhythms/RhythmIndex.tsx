import { createFileRoute, Link } from '@tanstack/react-router'
import Dropdown from '../../../components/notation/RhythmSelect'
import MusicPlayer from '@/components/notation/MusicPlayer'


export const Route = createFileRoute('/visualization/rhythms/RhythmIndex')({
   component: RouteComponent,
})

function RouteComponent() {
   return (
      <div>
         <div>
            <section className="px-100 py-20">
               This is a collection of drum rhythms that I have transcribed. I have a lot more that I want to add, but I wanted to get this up before I forget about it. If you have any rhythms that you think would be interesting to add, please let me know!
            </section>
         </div>
         {/* <MusicPlayer filePath="/rhythms/BossaNova1.musicxml" /> */}

         <Dropdown />
      </div>
   )
}