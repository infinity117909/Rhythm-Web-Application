import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/education/genres/Pop')({
  component: RouteComponent,
})

const popGuidelines = [
  'Widely accessible to people who listen to music.',
  'Easy to listen to and quick to connect with.',
  'Commonly promoted through radio, commercials, and other mass media.',
]

const rhythmExamples = [
  ['Rockabilly (Train Beat)', 'Example not listed'],
  ['Polka', 'Roy Black & Anita - Schon Ist es Auf der Welt Zu Sein'],
  ['Waltz', 'Waltz #2 (XO) - Elliott Smith'],
  ['Cha-cha-cha', 'Example not listed'],
  ['Shuffle', 'The Beatles - All My Loving'],
  ['Big Band Swing', 'Frank Sinatra - New York, New York'],
  ['Ballad Blues', 'Paul Anka - Put Your Head on My Shoulder'],
  ["Rock 'n' Roll", 'Example not listed'],
  ['Funk', 'The Jackson 5 - I Want You Back'],
  ['Straight Funk', 'Michael Jackson - Billie Jean'],
  ['Electronic Style Funk', 'Yellow Magic Orchestra - Tong Poo'],
  ['Rock (1957-Present)', 'Example not listed'],
  ['Afro-Beat', 'Example not listed'],
  ['Carnival', 'Simply Red - Fairground'],
  ['Four-on-the-Floor', 'Eurythmics - Sweet Dreams'],
  ['Hardstyle / Pop Punk / SoCal / Disco / J-Pop', 'EGOIST - Royz'],
  ['Alternative Pop Groove', 'Ocean Colour Scene - Hundred Mile High City'],
  ['Hip-Hop', 'Backstreet Boys - Everybody'],
  ['Pop Punk', 'Muse - Bliss'],
  ['Angular Dance-Rock', 'Bloc Party - Banquet'],
  ['Art Pop Pulse', 'Thom Yorke - Black Swan'],
] as const

function RouteComponent() {
  return (
    <article className="min-h-screen bg-banana-cream-50 px-4 py-6 text-lavender-purple-900 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:gap-5">
        <header className="border-[5px] border-lavender-purple-700 bg-banana-cream-100 px-6 py-4 text-center shadow-[10px_10px_0_rgba(54,20,79,0.12)]">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.45em] text-deep-pink-700">
            Education Genre Study
          </p>
          <h1 className="text-4xl font-semibold text-lavender-purple-800 sm:text-5xl">
            Pop Music
          </h1>
        </header>

        <section className="grid gap-4 lg:grid-cols-[0.9fr_2.1fr] lg:grid-rows-[1fr_auto]">
          <section className="border-[5px] border-lavender-purple-700 bg-banana-cream-50 p-6 shadow-[8px_8px_0_rgba(54,20,79,0.1)] lg:row-start-1">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-deep-pink-700">
              The Origins Of Pop Music
            </p>
            <div className="space-y-4 text-lg leading-8 text-lavender-purple-900">
              <p>
                When someone thinks of pop music, they might think of music that one listens to in
                their car. Pop music, short for popular music, is a genre that contains music which is
                widely known and accessible. Pop music as a genre is an extremely broad category of
                music, so let's draw some guidelines.
              </p>
            </div>
          </section>

          <section className="border-[5px] border-lavender-purple-700 bg-lavender-purple-100 p-6 shadow-[8px_8px_0_rgba(54,20,79,0.1)] lg:row-span-2 lg:row-start-1">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-deep-pink-700">
              The Styles Of Pop Music
            </p>
            <div className="space-y-4 text-lg leading-8 text-lavender-purple-900">
              <p>
                Pop music, in its modern form, is a genre that has existed since the mid-1950s, with
                influences being traced even further back. Originating in the UK and US, pop incorporated
                rock 'n' roll mainly. When a genre or style of music becomes popular, other music will be
                created that is similar to that style.
              </p>
              <p>
                Some examples of pop music include artists like Michael Jackson, Madonna, The Beatles,
                Taylor Swift, Lady Gaga, Miley Cyrus, Ariana Grande, and so many more.
              </p>
              <p>
                It is said that three over-encompassing traits of pop music are light entertainment,
                commercial imperatives, and personal identification. Along with this, pop music also tends
                to be more focused on production rather than performance or live performance.
              </p>
              <p>
                Pop music aims to be an instant hit toward the people who listen to it. This could mean
                that it evokes a feeling of relatability with the artist. That being said, the musicality
                of pop music is not normally intriguing to an average musician; however, musicians can
                cover pop songs and make them sound more interesting.
              </p>
              <div className="grid gap-3 rounded-xl border-2 border-deep-sky-blue-600 bg-banana-cream-100 p-4 sm:grid-cols-3">
                <div className="rounded-lg bg-deep-sky-blue-100 p-3 text-center">
                  <p className="text-xs uppercase tracking-[0.25em] text-deep-sky-blue-800">Trait 1</p>
                  <p className="mt-2 font-semibold text-lavender-purple-900">Instant familiarity</p>
                </div>
                <div className="rounded-lg bg-aquamarine-100 p-3 text-center">
                  <p className="text-xs uppercase tracking-[0.25em] text-aquamarine-900">Trait 2</p>
                  <p className="mt-2 font-semibold text-lavender-purple-900">Commercial clarity</p>
                </div>
                <div className="rounded-lg bg-deep-pink-100 p-3 text-center">
                  <p className="text-xs uppercase tracking-[0.25em] text-deep-pink-800">Trait 3</p>
                  <p className="mt-2 font-semibold text-lavender-purple-900">Personal relatability</p>
                </div>
              </div>
            </div>
          </section>

          <section className="border-[5px] border-lavender-purple-700 bg-banana-cream-100 p-6 shadow-[8px_8px_0_rgba(54,20,79,0.1)] lg:row-start-2">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-deep-pink-700">
              Pop Music Guidelines
            </p>
            <ul className="space-y-3 text-lg leading-8">
              {popGuidelines.map((guideline) => (
                <li
                  key={guideline}
                  className="rounded-lg border-2 border-deep-pink-300 bg-banana-cream-50 px-4 py-3"
                >
                  {guideline}
                </li>
              ))}
            </ul>
          </section>
        </section>

        <section className="border-[5px] border-lavender-purple-700 bg-lavender-purple-50 p-3 shadow-[10px_10px_0_rgba(54,20,79,0.12)]">
          <div className="border-[5px] border-lavender-purple-700 bg-deep-pink-100 px-6 py-3 text-center">
            <h2 className="text-3xl font-semibold text-lavender-purple-800">Rhythmic Dissection</h2>
          </div>
          <div className="mt-3 border-[5px] border-lavender-purple-700 bg-banana-cream-50 px-5 py-6 lg:px-6 lg:py-7">
            <div className="space-y-4 text-lg leading-8 text-lavender-purple-900">
              <p>
                Pop music, as mentioned, is a very broad category of music, so there are many qualities
                to understand when dissecting its rhythmic qualities. For example, pop music started
                predominantly based around acoustic and live instruments, playing blues, rock 'n' roll,
                or other Latin jazz music.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border-2 border-deep-sky-blue-600 bg-deep-sky-blue-50 p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3 border-b-2 border-deep-sky-blue-300 pb-3">
                <h3 className="text-2xl font-semibold text-lavender-purple-800">List of Rhythms</h3>
                <span className="rounded-full bg-deep-pink-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-banana-cream-50">
                  Song Examples
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {rhythmExamples.map(([rhythm, example]) => (
                  <article
                    key={rhythm}
                    className="rounded-xl border-2 border-lavender-purple-200 bg-banana-cream-50 p-4"
                  >
                    <p className="font-semibold text-lavender-purple-800">{rhythm}</p>
                    <p className="mt-2 text-sm leading-6 text-lavender-purple-700">{example}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-[5px] border-lavender-purple-700 bg-banana-cream-100 px-6 py-6 shadow-[10px_10px_0_rgba(54,20,79,0.12)]">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.35em] text-deep-pink-700">
            Conclusion
          </p>
          <p className="mx-auto max-w-5xl text-center text-lg leading-8 text-lavender-purple-900 sm:text-xl">
            The aspects of rhythm observed from these styles of music shows that many of the rhythms are
            much like the music, very palatable. Styles like four-on-the-floor lets people groove easier
            due to our brain's feed-forward approach, which is when our brain anticipates the rhythm of a
            song. This mixed with familiarity of music, humans may intrinsically appreciate the simple
            nature of pop music based on rhythm alone.
          </p>
        </section>
      </div>
    </article>
  )
}
