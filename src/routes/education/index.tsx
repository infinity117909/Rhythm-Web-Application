import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/education/')({
  component: RouteComponent,
})

function RouteComponent() {
   return (
      <>
         <div className="flex flex-col font-gotu w-full self-center">
         {/*PLEASE CHANGE THE CENTERING*/}
            <h2 className="text-[50px] self-end text-center my-5 pt-30 w-full md:text-[200px] self-center w-1/2">Education</h2> 
            <div className="flex flex-row gap-5 m-5 text-center items-stretch">
               <p className="text-[24px] w-1/2 self-start">
                  This is the boring page. You will most likely not read this nor the subsequent pages unless you are a devoted music nerd who wants to learn even more about their special interest.
               </p>
               <p className="text-[24px] w-1/2 self-start">
                  If you are interested in the nuances of rhythm and groove theory, then I welcome you to my repository of all that I know about rhythm and groove in music!
               </p>
            </div>
         </div>
      </>

  )
}
