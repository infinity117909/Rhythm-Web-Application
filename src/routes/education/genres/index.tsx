import { createFileRoute, Link } from '@tanstack/react-router'
import React, { useState, useEffect, useRef } from "react";

export const Route = createFileRoute('/education/genres/')({
  component: RouteComponent,
})

function RouteComponent() {
   //useEffect(() => {
   //   const psychElem = document.getElementById("psychology-info");
   //   console.log(psychElem.style.height);
   //});

   {/*grid-template-rows: auto auto 1fr 1fr 13fr */ }
   {/*h-[height: calc(100vh + 10px)]*/ }
   {/*[grid-template-columns: repeat(9, 1fr)]*/ }
   {/*lg:grid-cols-6 lg:grid-rows-10*/ }
   {/*[grid-template-areas:'aaa_bbb'_'ccc_ddd']*/ }
   {/*lg:[grid-template-areas:'aaa'_'bbb_ddd'_'bbb_ddd'_'bbb_ddd'_'ccc_ddd'_'ccc_ddd'_'eee'_'fff']*/ }
   {/*lg:[grid-template-areas:'aaa_bbb_ccc_ddd']*/ }
   {/*[grid-template-columns:2fr_1fr]]*/ }

   {/*row-span-1 col-span-2 self-start*/ }
   {/*row-span-2 col-span-2 col-start-3*/ }
   {/*row-span-2 col-span-2 self-end*/ }

   {/*[grid-template-columns:40vw_20vw]*/ }
   {/*[grid-template-columns:0.575fr_0fr_0.425fr]*/ }
   
   return (
      <article className="grid grid-flow-row font-gotu tracking-wide bg-porcelain-50 p-10 gap-10">

         <section className="text-center hyphens-auto">
            <h1 className="text-8xl text-khaki-beige-300">Music Genres</h1>
            <p>This is the genres page. It will go over different genres' inspiration or cause, style, and impact.</p>
         </section>

         {/* Center the columns + align sections at the top */}
         <div className="text-justify flex gap-10 m-10 bg-bone-100 p-5 border-y-2 border-khaki-beige-300/40 rounded-md 
                        justify-center items-start">

            {/* LEFT COLUMN */}
            <div className=" flex flex-col w-2/3 text-base/7 m-10 self-center">

               <section className="h-fit border-y border-jungle-teal-600 py-5 ">
                  <h2 className="text-jungle-teal-600 text-xl">What are Music Genres?</h2>
                  <p>
                     A Music Genre has origins, hybrid genres, and impacts. Since this website is focused on rhythm, I will mainly cover how the rhythm and groove of a genre is formed and how that genre shapes other new genres.

                     In each genre, there will be an explanation of origin, style, and impact.

                     The origin of a genre is a main cause of its existence. For example, punk music was a reaction to the overproduced and commercialized rock music of the 1970s. It was a way for people to express their frustration and rebellion against the mainstream music industry.

                     The style of a genre is the unique characteristics that define it. For example, jazz music is characterized by its improvisation, swing rhythms, and complex harmonies.

                     The impact of a genre is the influence it has on other genres and the music industry as a whole. For example, hip hop music has had a significant impact on popular culture and has influenced many other genres, such as pop and R&B.
                  </p>
               </section>

               <section className="border-b border-jungle-teal-600 py-5">
                  <h2 className="text-jungle-teal-600 text-xl">What Makes a Music Genre?</h2>
                  <p className="block-fit">
                     Since music is an art form, it is also subjective in nature.

                     When art is created, it has both a message and a medium. When an artist creates a piece of art, their unconscious and consciousness will <em>combine</em>. This is often based on stimuli that they are exposed to during the course of their life. This is also why some artists may not see a message in their artwork, while others do.

                     When we listen to music, it is synonymous to other art forms; we—the listeners (medium)—will interpret music made by artists (message). Similarly to an artist's message, interpretations are also based on our own unique experiences to stimuli, thereby linking us to music, whether lyrically or sonically.

                     Music genres exist so that people can listen to music that they like with relative certainty.
                  </p>
               </section>

            </div>

            {/* RIGHT COLUMN */}
            <div className="gap-5 flex flex-col w-1/3 text-base/7 border-l-2 border-jungle-teal-600 pl-5">
               <section>
               <h2 className="text-jungle-teal-600 text-xl">Psychology</h2>
                  <p>
                     Psychologically, our brains handle information in <em>schema</em>, which is a mental structure that organizes knowledge and expectations. We, as humans who use schemas, appreciate structure. When attempting to explore something potentially abstract, our brain will try and categorize it into multiple schemas. This is what births genres of music.

                     If one were to like rap music, they would listen to rap music; they would (probably) not listen to music stations or artists that are not in the rap <em>scene</em>. This is because music like Classical does not fit into the schema of rap music.

                     WARNING: Schemas can be extremely helpful for people to understand and conceptualize the world around them, however, the idea of schemas are not dissimilar to those of prejudice. For example, when people first heard jazz music, classical music fans called this <em>degenerate music</em> because it was different (there was also a classist and elitist reason too but you get the idea).

                     If someone really likes getting in the car and listening to pop music like Taylor Swift, they are not likely going to search for the works of Captain Beefheart and his avant-garde rock album <em>Trout Mask Replica</em>. Similarly, someone who likes Tool might not have a good time listening to artists like Shaboozey or Jelly Roll. This is all due to schemas and the way our brains process information and organize it into categories.
                  </p>
               </section>
            </div>

         </div>

         <footer className="hyphens-auto bg-jungle-teal-600 py-5 rounded-md">
            <h2 className="text-center text-2xl text-porcelain-50">Genres to Explore</h2>
            <div className="justify-items-center mt-3">
               <ul className="flex gap-5 text-justify tracking-wide text-md text-porcelain-50">
                  <li><Link to="/education/genres/Jazz">Jazz Music</Link></li>
                  <li><Link to="/education/genres/AfroCuban">Afro Cuban</Link></li>
                  <li><Link to="/education/genres/HipHop">Hip Hop</Link></li>
                  <li><Link to="/education/genres/Metal">Metal Music</Link></li>
                  <li><Link to="/education/genres/Rock">Rock Music</Link></li>
                  <li><Link to="/education/genres/Punk">Punk Music</Link></li>
                  <li><Link to="/education/genres/Prog">Prog Music</Link></li>
                  <li><Link to="/education/genres/Pop">Pop Music</Link></li>
                  <li><Link to="/education/genres/EDM">Electronic Dance Music</Link></li>
               </ul>
            </div>
         </footer>

      </article>


   )

}
