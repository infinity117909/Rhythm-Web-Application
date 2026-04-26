import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/education/genres/classic-rock/')({
  component: RouteComponent,
})

const classicRockRhythms = [
  'Rock Ballad (4/4): [The Beatles – Hey Jude]',
  'Rock Ballad (12/8): [The Animals – House of the Rising Sun]',
  'Mersey Beat: [Gerry and the Pacemakers – Ferry Cross the Mersey]',
  'Shuffle: [The Lovin’ Spoonful – Daydream]',
  'Rock Shuffle: [George Thorogood – Bad to the Bone]',
  'Chicago Shuffle (Jazz Shuffle): [The Turtles – Happy Together]',
  'Steve Gadd: [Simon & Garfunkel – 50 Ways to Leave Your Lover]',
  'Train Beat: [Canned Heat – On the Road Again]',
  'Surf: [Paul Butterfield Blues Band – Born in Chicago]',
  'Country Shuffle: [The Pretty Things – Don’t Bring Me Down]',
  'Funk: [Spencer Davis Group – I’m a Man]',
  'Gospel: [Alexis Korner – Get Off My Cloud]',
  'Riding The Snare: [Jefferson Airplane – Somebody to Love]',
  'Four On The Floor: [Ram Jam – Black Betty]',
] as const

function RouteComponent() {
  useEffect(() => {
    const root = document.documentElement

    root.style.setProperty('--education-nav-bg', 'var(--color-brown-red-700)')
    root.style.setProperty('--education-nav-text', 'var(--color-silver-50)')

    root.style.setProperty('--genres-side-button-bg', 'var(--color-coffee-bean-700)')
    root.style.setProperty('--genres-side-button-text', 'var(--color-silver-50)')
    root.style.setProperty('--genres-side-border', 'var(--color-brown-red-700)')
    root.style.setProperty('--genres-side-panel-bg', 'var(--color-silver-50)')
    root.style.setProperty('--genres-side-heading-text', 'var(--color-coffee-bean-800)')
    root.style.setProperty('--genres-side-divider', 'var(--color-light-bronze-300)')
    root.style.setProperty('--genres-side-link-text', 'var(--color-brown-red-800)')
    root.style.setProperty('--genres-side-link-hover-bg', 'var(--color-light-bronze-100)')
    root.style.setProperty('--genres-side-link-hover-text', 'var(--color-coffee-bean-700)')

    root.style.setProperty('--genres-footer-bg', 'var(--color-brown-red-800)')
    root.style.setProperty('--genres-footer-text', 'var(--color-silver-50)')
    root.style.setProperty('--genres-footer-border', 'var(--color-light-bronze-400)')
    root.style.setProperty('--genres-footer-link-hover-bg', 'var(--color-silver-50)')
    root.style.setProperty('--genres-footer-link-hover-text', 'var(--color-coffee-bean-700)')

    return () => {
      root.style.removeProperty('--education-nav-bg')
      root.style.removeProperty('--education-nav-text')
      root.style.removeProperty('--genres-side-button-bg')
      root.style.removeProperty('--genres-side-button-text')
      root.style.removeProperty('--genres-side-border')
      root.style.removeProperty('--genres-side-panel-bg')
      root.style.removeProperty('--genres-side-heading-text')
      root.style.removeProperty('--genres-side-divider')
      root.style.removeProperty('--genres-side-link-text')
      root.style.removeProperty('--genres-side-link-hover-bg')
      root.style.removeProperty('--genres-side-link-hover-text')
      root.style.removeProperty('--genres-footer-bg')
      root.style.removeProperty('--genres-footer-text')
      root.style.removeProperty('--genres-footer-border')
      root.style.removeProperty('--genres-footer-link-hover-bg')
      root.style.removeProperty('--genres-footer-link-hover-text')
    }
  }, [])

  return (
    <article className="min-h-screen bg-silver-50 px-4 py-6 text-coffee-bean-900 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:gap-5">
        <header className="border-[5px] border-brown-red-700 bg-silver-100 px-6 py-4 text-center shadow-[10px_10px_0_rgba(116,57,42,0.14)]">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.45em] text-deep-pink-700">Education Genre Study
          </p>
          <h1 className="text-4xl font-semibold text-coffee-bean-800 sm:text-5xl">
            Classic Rock
          </h1>
        </header>

        <section className="grid gap-4 lg:grid-cols-[0.9fr_2.1fr] lg:grid-rows-[1fr_auto]">
          <section className="border-[5px] border-brown-red-700 bg-silver-50 p-6 shadow-[8px_8px_0_rgba(116,57,42,0.1)] lg:row-start-1">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-coffee-bean-700">
              The Golden Age of Rock Music
            </p>
            <div className="space-y-4 text-lg leading-8 text-coffee-bean-900">
              <p>
                When one thinks of what Rock music is, many people associate this genre with the Golden Age. This was a time where legends were born, battles of rights were fought and won, and where unity was almost—palpable—in a way. This age of music, starting in the 1960s is the equivalent of “... a decade-long party, of which no-one wanted to experience the hangover” (musicmap.info). This supergenre is one of the most diverse genres, encompassing many styles; in fact, most artists would include different genres within the same album!
              </p>
            </div>
          </section>

          <section className="border-[5px] border-brown-red-700 bg-light-bronze-50 p-6 shadow-[8px_8px_0_rgba(116,57,42,0.1)] lg:row-start-1">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-coffee-bean-700">
              The (Many) Styles of Classic Rock
            </p>
            <div className="space-y-4 text-lg leading-8 text-coffee-bean-900">
              <p>
                Rock aims to provide a more personable story than other genres. Classic Rock is no exception. Classic Rock was the birth of more personal music rather than marketable music. Starting around 1963 with Mersey Beat (because this style started in Mersey, Liverpool) / British Invasion (I know… crazy name for a sub-genre, but this is literally what it is called). This was the launch of boybands, which spread fast across the UK and US. Classic Rock music has a lot of very catchy hooks, musically with songs such as: Steppenwolf – Born to be Wild, ACDC – Thunderstruck, The Beatles – Hey Jude, Rush – Tom Sawyer, Jimi Hendrix – All Along the Watchtower, David Bowie – Starman, The Allman Brothers – Midnight Rider, or Boston – More than a Feeling. These songs all have an extremely catchy riff whether that be from the chorus, guitars, or an ostinato played by the drums. All of these songs tell a story — whether that be a fictitious story, emotional journey, coming-of-age, or a message to the world… All of these songs can fit into this umbrella (or blanket if it feels more cozy) genre as the Golden Age.
              </p>
            </div>
          </section>

          <section className="border-[5px] border-brown-red-700 bg-silver-100 p-6 shadow-[8px_8px_0_rgba(116,57,42,0.1)] lg:row-start-2 lg:col-span-2">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-coffee-bean-700">
              Classic Rock Guidelines
            </p>
            <div className="space-y-4 text-lg leading-8 text-coffee-bean-900">
              <p>
                As mentioned before, Classic Rock does not have a set cookie cutter formula for how it sounds, but it is more about the forms and messages found within these songs. For example, a classic form for Classic Rock is Verse-Chorus-Verse-Chorus-Solo-Chorus (or AB/AB/A’B — as a written form). Successful Classic Rock songs usually have a strong hook to them or a strong message behind them. For example, my favorite song by the artist David Bowie is Five Years. This, objectively, does not have as strong of a hook as Starman, both by David Bowie; however, I am hooked by the lyrical message and instrumentation of Five Years, which is why it too is a successful Classic Rock song.
              </p>
              <p>
                Note: If you want to know what Classic Rock objectively sounds like, play 104.3 on the radio or look up “The Sound of Classic Rock” by “The Sounds of Spotify”!
              </p>
            </div>
          </section>
        </section>

        <section className="border-[5px] border-brown-red-700 bg-silver-50 p-3 shadow-[10px_10px_0_rgba(116,57,42,0.12)]">
          <div className="border-[5px] border-brown-red-700 bg-light-bronze-100 px-6 py-3 text-center">
            <h2 className="text-3xl font-semibold text-coffee-bean-800">Rhythmic Dissection</h2>
          </div>
          <div className="mt-3 border-[5px] border-brown-red-700 bg-silver-100 px-5 py-6 lg:px-6 lg:py-7">
            <div className="space-y-4 text-lg leading-8 text-coffee-bean-900">
              <p>
                In Classic Rock, the rhythms can be very different, with each drummer offering something new to the community. It could be something as simple as the groove from Aerosmith’s Love in an Elevator, something as driving as Tom Petty’s Running Down a Dream, something as laid back as The Beatles’ Ticket To Ride, something as strange as King Crimson’s… well–anything (but Court of the Crimson King is definitely up there as one of the stranger ones…), something as confusing as Ruins’ Skhanddraviza (seriously I’ve never heard this until recently… this is some wild stuff), or as beautiful as REO Speedwagon’s Can’t Fight this Feeling — all of these songs are classified under Rock because of what they present as its messages to the listener(s).
              </p>
            </div>

            <div className="mt-6 rounded-2xl border-2 border-brown-red-600 bg-light-bronze-50 p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3 border-b-2 border-light-bronze-300 pb-3">
                <h3 className="text-2xl font-semibold text-coffee-bean-800">List of Rhythms</h3>
                <span className="rounded-full bg-coffee-bean-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-silver-50">
                  Song Examples
                </span>
              </div>
              <p className="mb-4 text-base leading-7 text-coffee-bean-800">
                Below is a list of rhythms that many rock songs derive from with a song to listen to in order to get a better understanding of that style.
              </p>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {classicRockRhythms.map((rhythm) => (
                  <article
                    key={rhythm}
                    className="rounded-xl border-2 border-light-bronze-300 bg-silver-50 p-4"
                  >
                    <p className="text-sm leading-6 text-coffee-bean-900">{rhythm}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-[5px] border-brown-red-700 bg-light-bronze-50 px-6 py-6 shadow-[10px_10px_0_rgba(116,57,42,0.12)]">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.35em] text-coffee-bean-700">
            Conclusion
          </p>
          <p className="mx-auto max-w-5xl text-center text-lg leading-8 text-coffee-bean-900 sm:text-xl">
            When understanding Classic Rock, we have to understand its position in the world around it. At the time of its creation, there was war and industry was booming. Creativity independence was — not too thriving, especially in musical contexts. Rock music was created to challenge the ideologies of creating music for industrial or commercial purposes.
          </p>
        </section>
      </div>
    </article>
  )
}
