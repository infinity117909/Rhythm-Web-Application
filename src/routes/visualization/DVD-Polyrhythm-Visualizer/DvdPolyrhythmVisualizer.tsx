import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { PolyrhythmCanvas } from '@/components/DVDPolyrhythmCalculations'
//import MathComponent from '@/components/MathJax'

export const Route = createFileRoute(
  '/visualization/DVD-Polyrhythm-Visualizer/DvdPolyrhythmVisualizer',
)({
  component: RouteComponent,
})

function RouteComponent() {
   useEffect(() => {
      console.log('RouteComponent mounted')
   }, [])
   
   return (
      <>
         <div className="min-h-screen bg-azure-mist-50 py-6 px-4 md:px-8">
            <div className="mx-auto max-w-6xl">
               <div className="mb-4 rounded-xl border-2 border-blue-slate-600 bg-pale-sky-300/45 p-3 text-center text-shadow-grey-900 shadow-sm">
                  <strong>Route loaded:</strong> DVD Polyrhythm Visualizer
               </div>
               <h1 className="text-3xl text-center mt-0 font-semibold font-gotu text-shadow-grey-900 tracking-wide">
                  Polyrhythm Visualizer
               </h1>
               <p className="text-xl text-center text-blue-slate-600">
                  Polyrhythms are an extremely <em>mathematical</em> aspect of music
               </p>
               <div className="mt-5 rounded-2xl border-2 border-pale-sky-300 bg-white/45 p-4 md:p-6 text-shadow-grey-900">
                  <dt className="text-lg">The <b className="font-semibold">polyrhythm</b>: </dt>
                  <dd className="indent-8 mt-1">This is when one rhythm is played over another rhythm (which can be played over even more layers of rhythms) simultaneously!</dd>
                  <br />

                  <section className="indent-8 leading-relaxed">
                     <p>
                        As kids in the 2000's, we have quite the affinity to the classic DVD Logo bouncing arond the screen when it went idle. We could watch this logo hypnotically for <b>hours</b> (maybe just me) never knowing when that logo would hit the corner so we could finally stop watching the screen!
                     </p>

                     <br />

                     <label>
                        
                        <details className="rounded-lg border border-pale-sky-300 bg-azure-mist-50/70 px-4 py-3">
                           <summary className="cursor-pointer font-semibold text-blue-slate-600">Click to see more</summary>
                           <p>
                              Polyrhythms are, at its core, ratios. When writing a ratio, you can write them as their conventional form by using a colon
                              ( x <sub><span className="text-xl">&#8758;</span></sub> y )
                              or you can write them as fractions
                              ( <sup>x</sup>/<sub>y</sub> ).

                              Seeing as these are both ratios and fractions, we can also write them as a division equation. Along with that, we can also graph that ratio by dissecting a coordinate plane into x by y segments.

                              There are x <span>&#8901;</span> y segments on the coordinate plane at the time of calculation. The algorithm finds these segments by dividing the width of the canvas by the y-polyrhythm and dividing the height of the canvas by the x-polyrhythm. The intersections between the borders of the canvas are called keyframes. These keyframes are how we count the polyrhythm's increments.
                           </p>

                           <br />

                           <p>
                              For example, a 2:3 polyrhythm will have keyframes at
                              (0, 0) <span>&#8594;</span> (2, 2) <span>&#8594;</span> (3, 1) <span>&#8594;</span> (2, 0) <span>&#8594;</span> (0, 2) <span>&#8594;</span> (2, 0) <span>&#8594;</span> (3, 1) <span>&#8594;</span> (2, 2) <span>&#8594;</span> (0, 0)
                           </p>

                        </details>
                     </label>
                  </section>
               <div className="mt-6 mx-auto w-full max-w-5xl rounded-2xl border-2 border-blue-slate-600 bg-shadow-grey-900/95 p-3 md:p-4">
                  <PolyrhythmCanvas />
               </div>
               </div>
            </div>
         </div>
      </>
  )
}
