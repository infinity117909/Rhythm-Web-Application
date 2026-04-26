import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/visualization/')({
  component: RouteComponent,
})

function RouteComponent() {
   return (
      <div className="min-h-screen bg-azure-mist-50 px-6 py-10 md:px-10">
         <div className="mx-auto flex w-full max-w-5xl flex-col gap-0">
            <h1 className="mb-8 text-center text-6xl font-semibold text-shadow-grey-900 md:text-8xl">
               Visualization
            </h1>

            <section className="border-2 border-blue-slate-600 bg-pale-sky-100 p-6 md:p-10">
               <h2 className="mb-4 text-center text-2xl font-semibold text-blue-slate-800">Description</h2>
               <p className="mx-auto max-w-4xl text-center text-base leading-relaxed text-shadow-grey-900 md:text-lg">
                  The Visualization section of the website is meant to see how rhythmic concepts can be
                  displayed. For example, the fact that the DVD logo bouncing around our screen as
                  2000’s kids can actually be graphed out to form a polyrhythm (cool, right?)!
               </p>
            </section>

            <section className="border-2 border-blue-slate-600 border-t-0 bg-azure-mist-100 p-6 md:p-10">
               <h2 className="mb-6 text-center text-2xl font-semibold text-blue-slate-800">Pages</h2>
               <div className="grid gap-4">
                  <p className="rounded-lg border border-pale-sky-300 bg-pale-sky-50 p-4 text-sm leading-relaxed text-shadow-grey-900 md:text-base">
                     The Rhythm page is dedicated to view the various styles of rhythms that exist. At the
                     moment, there are only a small fraction of the total derivable rhythms that exist in
                     the world, but I’ll get there (even if it takes forever~)!
                  </p>
                  <p className="rounded-lg border border-pale-sky-300 bg-pale-sky-50 p-4 text-sm leading-relaxed text-shadow-grey-900 md:text-base">
                     The Metronome page is for musicians who… need to practice with a metronome;
                     however, my metronome adds something else. You can calculate bpm based on
                     subdivisions or polyrhythms entered!!!
                  </p>
                  <p className="rounded-lg border border-pale-sky-300 bg-pale-sky-50 p-4 text-sm leading-relaxed text-shadow-grey-900 md:text-base">
                     The DVD Polyrhythm page is for 2000’s kids who liked watching the DVD logo bounce
                     around their DVD player’s screen!
                  </p>
               </div>
            </section>
         </div>
      </div>
   )
}