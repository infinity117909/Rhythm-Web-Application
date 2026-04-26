import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/education/')({
  component: RouteComponent,
})

function RouteComponent() {
   return (
      <>
         <div className="min-h-screen bg-soft-linen-50 flex flex-col font-gotu w-full py-8 px-4">
            <h1 className="text-center text-[80px] md:text-[200px] font-bold mb-12 text-soft-linen-900">
               Education
            </h1>
            
            <div className="flex flex-col w-full max-w-4xl mx-auto gap-0">
               {/* Description Section */}
               <div className="bg-soft-linen-100 border-3 border-soft-linen-600 p-8 md:p-12">
                  <h2 className="text-3xl font-semibold mb-5 text-soft-linen-900 border-b-2 border-soft-linen-400 pb-3">
                     Description
                  </h2>
                  <p className="text-lg leading-relaxed text-soft-linen-800">
                     The Education section is meant for a deeper understanding on the topics of rhythm in music. Within Education, there are four topics: Rhythm Theory, Genres, Topics, and a Glossary.
                  </p>
               </div>
               
               {/* Pages Section */}
               <div className="bg-soft-linen-100 border-3 border-t-0 border-soft-linen-600 p-8 md:p-12">
                  <h2 className="text-3xl font-semibold mb-6 text-soft-linen-900 border-b-2 border-soft-linen-400 pb-3">
                     Pages
                  </h2>
                  <div className="space-y-5">
                     <div className="bg-soft-linen-50 p-4 rounded-md border-l-4 border-soft-linen-600">
                        <h3 className="font-semibold text-lg mb-2 text-soft-linen-900">Rhythm Theory</h3>
                        <p className="text-base leading-relaxed text-soft-linen-800">
                           The Rhythm Theory pages are meant for more textbook concepts and studies. For example, how can a bar of 4/4 be subdivided into even subdivisions?
                        </p>
                     </div>
                     
                     <div className="bg-soft-linen-50 p-4 rounded-md border-l-4 border-soft-linen-600">
                        <h3 className="font-semibold text-lg mb-2 text-soft-linen-900">Genres</h3>
                        <p className="text-base leading-relaxed text-soft-linen-800">
                           The Genres pages are meant to show the user how different genres incorporate grooves and why those grooves may exist within the genre. For example, Punk Rock and Surfer Rock are very closely related, so both genres include the Mersey Beat.
                        </p>
                     </div>
                     
                     <div className="bg-soft-linen-50 p-4 rounded-md border-l-4 border-soft-linen-600">
                        <h3 className="font-semibold text-lg mb-2 text-soft-linen-900">Topics</h3>
                        <p className="text-base leading-relaxed text-soft-linen-800">
                           The Topics page is meant for the user to research more conceptual essay-style pages. For example, our brain tends to predict where downbeats are within a song, which is why Pop music is so… popular.
                        </p>
                     </div>
                     
                     <div className="bg-soft-linen-50 p-4 rounded-md border-l-4 border-soft-linen-600">
                        <h3 className="font-semibold text-lg mb-2 text-soft-linen-900">Glossary</h3>
                        <p className="text-base leading-relaxed text-soft-linen-800">
                           The Glossary page is meant to check what some terms mean in a musical context. For example, if a genre has post- in the name, it means that it is an offshoot of the genre it is influenced by.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>

  )
}
