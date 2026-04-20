import { createFileRoute } from '@tanstack/react-router'
import ParseXML from '@/components/notation/ParseXML'

export const Route = createFileRoute('/education/genres/Pop')({
  component: RouteComponent,
})

function RouteComponent() {
   return (
      <>
         <article>
            <h1>Pop Music</h1>
            <p>When someone thinks of <em>Pop Music</em>, they might think of music that one listens to in their car. 

               Pop music—short for <em>Popular Music</em> (shocking I know)—is a genre that contains music which is widely popular and <em>accessible</em>.

               Pop music as a genre is an extremely broad category of music, so let us draw some guidelines:
               <ul>
                  <li>Widely accessible to people who listen to music</li>
                  <li><em>Easy</em> to listen to</li>
                  <li>Likely played on the radio, commercial, or advertisements</li>
               </ul>
            </p>

            <h2>The Style(s) of Pop Music</h2>
            <p>Pop music, in its modern form, is a genre that has existed since the mid-1950s. Originating in the UK and US, Pop incorperated rock and roll and other youth-inspired music styles derived from it.

               Some of the best examples of pop music include artists like Michael Jackson, Madonna, The Beatles, Taylor Swift, Lady Gaga, Miley Cirus, Arianna Grande (yes... all varients of her) and so many more!

               To really understand pop music, we can also look at why music is created in the first place!
            </p>
         </article>
      </>
  )
}
