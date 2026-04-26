import { createFileRoute } from '@tanstack/react-router'
import { LoadMusicXMLShort } from '@/components/notation/ParseXML';

export const Route = createFileRoute('/education/theory/Introduction')({
  component: RouteComponent,
})

const wholeXml = `
<?xml version="1.0" encoding="UTF-8"?>  
<score-partwise version="3.1">  
  <part-list>  
    <score-part id="P1">  
      <part-name> </part-name>  
    </score-part>  
  </part-list>  
  <part id="P1">  
    <measure number="1">  
      <attributes>  
        <divisions>1</divisions>  
        <key>  
          <fifths>0</fifths>  
        </key>  
        <time>  
          <beats>4</beats>  
          <beat-type>4</beat-type>  
        </time>  
        <clef>  
          <sign>G</sign>  
          <line>2</line>  
        </clef>  
      </attributes>  
      <note>  
        <pitch>  
          <step>C</step>  
          <octave>5</octave>  
        </pitch>  
        <duration>4</duration>  
        <voice>1</voice>  
        <type>whole</type>  
      </note>  
    </measure>  
  </part>  
</score-partwise>`;

const halfXml = `<?xml version="1.0" encoding="UTF-8"?>  
<score-partwise version="3.1">  
  <part-list>  
    <score-part id="P1">  
      <part-name> </part-name>  
    </score-part>  
  </part-list>  
  <part id="P1">  
    <measure number="1">  
      <attributes>  
        <divisions>1</divisions>  
        <key>  
          <fifths>0</fifths>  
        </key>  
        <time>  
          <beats>4</beats>  
          <beat-type>4</beat-type>  
        </time>  
        <clef>  
          <sign>G</sign>  
          <line>2</line>  
        </clef>  
      </attributes>  
      <note>  
        <pitch>  
          <step>C</step>  
          <octave>5</octave>  
        </pitch>  
        <duration>4</duration>  
        <voice>1</voice>  
        <type>half</type>  
      </note>  
      <note>  
        <pitch>  
          <step>C</step>  
          <octave>5</octave>  
        </pitch>  
        <duration>4</duration>  
        <voice>1</voice>  
        <type>half</type>  
      </note>  
    </measure>  
  </part>  
</score-partwise>`;

const quarterXml = `<?xml version="1.0" encoding="UTF-8"?>  
<score-partwise version="3.1">  
  <part-list>  
    <score-part id="P1">  
      <part-name> </part-name>  
    </score-part>  
  </part-list>  
  <part id="P1">  
    <measure number="1">  
      <attributes>  
        <divisions>1</divisions>  
        <key>  
          <fifths>0</fifths>  
        </key>  
        <time>  
          <beats>4</beats>  
          <beat-type>4</beat-type>  
        </time>  
        <clef>  
          <sign>G</sign>  
          <line>2</line>  
        </clef>  
      </attributes>  
      <note>  
        <pitch>  
          <step>C</step>  
          <octave>5</octave>  
        </pitch>  
        <duration>4</duration>  
        <voice>1</voice>  
        <type>quarter</type>  
      </note>  
      <note>  
        <pitch>  
          <step>C</step>  
          <octave>5</octave>  
        </pitch>  
        <duration>4</duration>  
        <voice>1</voice>  
        <type>quarter</type>  
      </note>  
      <note>  
        <pitch>  
          <step>C</step>  
          <octave>5</octave>  
        </pitch>  
        <duration>4</duration>  
        <voice>1</voice>  
        <type>quarter</type>  
      </note>  
      <note>  
        <pitch>  
          <step>C</step>  
          <octave>5</octave>  
        </pitch>  
        <duration>4</duration>  
        <voice>1</voice>  
        <type>quarter</type>  
      </note>  
    </measure>  
  </part>  
</score-partwise>`;

const eighthXml = `<?xml version="1.0" encoding="UTF-8"?>  
<score-partwise version="3.1">  
  <part-list>  
    <score-part id="P1">  
      <part-name> </part-name>
    </score-part>  
  </part-list>  
  <part id="P1">  
    <measure number="1">  
      <attributes>  
        <divisions>1</divisions>  
        <key>  
          <fifths>0</fifths>  
        </key>  
        <time>  
          <beats>4</beats>  
          <beat-type>4</beat-type>  
        </time>  
        <clef>  
          <sign>G</sign>  
          <line>2</line>  
        </clef>  
      </attributes>  
      <note>  
        <pitch>  
          <step>C</step>  
          <octave>5</octave>  
        </pitch>  
        <duration>4</duration>  
        <voice>1</voice>  
        <type>eighth</type>
        <beam number="1">begin</beam>
      </note>  
      <note>  
        <pitch>  
          <step>C</step>  
          <octave>5</octave>  
        </pitch>  
        <duration>4</duration>  
        <voice>1</voice>  
        <type>eighth</type>
        <beam number="1">continue</beam>
      </note>  
      <note>  
        <pitch>  
          <step>C</step>  
          <octave>5</octave>  
        </pitch>  
        <duration>4</duration>  
        <voice>1</voice>  
        <type>eighth</type>
        <beam number="1">continue</beam>
      </note>  
      <note>  
        <pitch>  
          <step>C</step>  
          <octave>5</octave>  
        </pitch>  
        <duration>4</duration>  
        <voice>1</voice>  
        <type>eighth</type>
        <beam number="1">end</beam>
      </note> <note>
        <pitch>
          <step>C</step>
          <octave>5</octave>
        </pitch>
        <duration>4</duration>
        <voice>1</voice>
        <type>eighth</type>
        <beam number="1">begin</beam>
      </note>
      <note>
        <pitch>
          <step>C</step>
          <octave>5</octave>
        </pitch>
        <duration>4</duration>
        <voice>1</voice>
        <type>eighth</type>
        <beam number="1">continue</beam>
      </note>
      <note>
        <pitch>
          <step>C</step>
          <octave>5</octave>
        </pitch>
        <duration>4</duration>
        <voice>1</voice>
        <type>eighth</type>
        <beam number="1">continue</beam>
      </note>
      <note>
        <pitch>
          <step>C</step>
          <octave>5</octave>
        </pitch>
        <duration>4</duration>
        <voice>1</voice>
        <type>eighth</type>
        <beam number="1">end</beam>
      </note>
    </measure>  
  </part>  
</score-partwise>`;

const sixteenthXml = `<?xml version="1.0" encoding="UTF-8"?>  
<score-partwise version="3.1">  
  <part-list>  
    <score-part id="P1">  
      <part-name> </part-name>  
    </score-part>  
  </part-list>  
  <part id="P1">  
    <measure number="1">  
      <attributes>  
        <divisions>4</divisions>  
        <key>  
          <fifths>0</fifths>  
        </key>  
        <time>  
          <beats>4</beats>  
          <beat-type>4</beat-type>  
        </time>  
        <clef>  
          <sign>G</sign>  
          <line>2</line>  
        </clef>  
      </attributes>  
      <note>  
        <pitch>  
          <step>C</step>  
          <octave>5</octave>  
        </pitch>  
        <duration>1</duration>  
        <voice>1</voice>  
        <type>16th</type>  
        <stem>down</stem>  
        <beam number="1">begin</beam>  
        <beam number="2">begin</beam>  
      </note>  
      <note>  
        <pitch>  
          <step>C</step>  
          <octave>5</octave>  
        </pitch>  
        <duration>1</duration>  
        <voice>1</voice>  
        <type>16th</type>  
        <stem>down</stem>  
        <beam number="1">continue</beam>  
        <beam number="2">continue</beam>  
      </note>  
      <note>  
        <pitch>  
          <step>C</step>  
          <octave>5</octave>  
        </pitch>  
        <duration>1</duration>  
        <voice>1</voice>  
        <type>16th</type>  
        <stem>down</stem>  
        <beam number="1">continue</beam>  
        <beam number="2">continue</beam>  
      </note>  
      <note>  
        <pitch>  
          <step>C</step>  
          <octave>5</octave>  
        </pitch>  
        <duration>1</duration>  
        <voice>1</voice>  
        <type>16th</type>  
        <stem>down</stem>  
        <beam number="1">end</beam>  
        <beam number="2">end</beam>  
      </note>  
      <note>  
        <pitch>  
          <step>C</step>  
          <octave>5</octave>  
        </pitch>  
        <duration>1</duration>  
        <voice>1</voice>  
        <type>16th</type>  
        <stem>down</stem>  
        <beam number="1">begin</beam>  
        <beam number="2">begin</beam>  
      </note>  
      <note>  
        <pitch>  
          <step>C</step>  
          <octave>5</octave>  
        </pitch>  
        <duration>1</duration>  
        <voice>1</voice>  
        <type>16th</type>  
        <stem>down</stem>  
        <beam number="1">continue</beam>  
        <beam number="2">continue</beam>  
      </note>  
      <note>  
        <pitch>  
          <step>C</step>  
          <octave>5</octave>  
        </pitch>  
        <duration>1</duration>  
        <voice>1</voice>  
        <type>16th</type>  
        <stem>down</stem>  
        <beam number="1">continue</beam>  
        <beam number="2">continue</beam>  
      </note>  
      <note>  
        <pitch>  
          <step>C</step>  
          <octave>5</octave>  
        </pitch>  
        <duration>1</duration>  
        <voice>1</voice>  
        <type>16th</type>  
        <stem>down</stem>  
        <beam number="1">end</beam>  
        <beam number="2">end</beam>  
      </note>  
      <note>  
        <pitch>  
          <step>C</step>  
          <octave>5</octave>  
        </pitch>  
        <duration>1</duration>  
        <voice>1</voice>  
        <type>16th</type>  
        <stem>down</stem>  
        <beam number="1">begin</beam>  
        <beam number="2">begin</beam>  
      </note>  
      <note>  
        <pitch>  
          <step>C</step>  
          <octave>5</octave>  
        </pitch>  
        <duration>1</duration>  
        <voice>1</voice>  
        <type>16th</type>  
        <stem>down</stem>  
        <beam number="1">continue</beam>  
        <beam number="2">continue</beam>  
      </note>  
      <note>  
        <pitch>  
          <step>C</step>  
          <octave>5</octave>  
        </pitch>  
        <duration>1</duration>  
        <voice>1</voice>  
        <type>16th</type>  
        <stem>down</stem>  
        <beam number="1">continue</beam>  
        <beam number="2">continue</beam>  
      </note>  
      <note>  
        <pitch>  
          <step>C</step>  
          <octave>5</octave>  
        </pitch>  
        <duration>1</duration>  
        <voice>1</voice>  
        <type>16th</type>  
        <stem>down</stem>  
        <beam number="1">end</beam>  
        <beam number="2">end</beam>  
      </note>  
      <note>  
        <pitch>  
          <step>C</step>  
          <octave>5</octave>  
        </pitch>  
        <duration>1</duration>  
        <voice>1</voice>  
        <type>16th</type>  
        <stem>down</stem>  
        <beam number="1">begin</beam>  
        <beam number="2">begin</beam>  
      </note>  
      <note>  
        <pitch>  
          <step>C</step>  
          <octave>5</octave>  
        </pitch>  
        <duration>1</duration>  
        <voice>1</voice>  
        <type>16th</type>  
        <stem>down</stem>  
        <beam number="1">continue</beam>  
        <beam number="2">continue</beam>  
      </note>  
      <note>  
        <pitch>  
          <step>C</step>  
          <octave>5</octave>  
        </pitch>  
        <duration>1</duration>  
        <voice>1</voice>  
        <type>16th</type>  
        <stem>down</stem>  
        <beam number="1">continue</beam>  
        <beam number="2">continue</beam>  
      </note>  
      <note>  
        <pitch>  
          <step>C</step>  
          <octave>5</octave>  
        </pitch>  
        <duration>1</duration>  
        <voice>1</voice>  
        <type>16th</type>  
        <stem>down</stem>  
        <beam number="1">end</beam>  
        <beam number="2">end</beam>  
      </note>  
    </measure>  
  </part>  
</score-partwise>`;


function RouteComponent() {
   
   return (
      <article className="font-gotu flex flex-col bg-porcelain-50 min-h-screen py-8 px-4">
        {/* Title */}
        <h1 className="text-center text-5xl md:text-7xl font-bold text-khaki-beige-700 mb-12">
          Introduction to Rhythm Theory
        </h1>

        {/* Two-column section: Why rhythm and Why Rhythm Theory */}
          <div className="flex flex-col md:flex-row gap-6 mb-8 w-full">
          <div className="flex-1 border-3 border-deep-teal-600 p-6 bg-soft-linen-50">
            <h2 className="text-2xl font-semibold text-center text-deep-teal-600 mb-4">Why <em>rhythm</em>, specifically?</h2>
            <p className="text-deep-teal-800 text-sm leading-relaxed">
              Well... in music, there are two (main) kinds of theory: <span className="font-semibold">Music Theory</span> and <span className="font-semibold">Rhythm Theory</span>. Music Theory is the overarching study of how music works. This can be from how to classify intervals, chords (and chord progressions), rhythm, and so many more! Rhythm Theory is a <span className="font-semibold">concentration</span> of how rhythm works within music. For the sake of this project, we will mainly work under rhythm theory.
            </p>
          </div>

          <div className="flex-1 border-3 border-deep-teal-600 p-6 bg-soft-linen-50">
            <h2 className="text-2xl font-semibold text-center text-deep-teal-600 mb-4">Why Rhythm Theory?</h2>
            <p className="text-deep-teal-800 text-sm leading-relaxed">
              Because it's way cooler! Rhythm can describe an objective love that many people have towards music. In fact, many times, people will like a song without actually understanding the <em>why</em> behind the song that they like.
            </p>
          </div>
        </div>

        {/* Pulse, Sound, Meter centered section */}
        <div className="border-3 border-deep-teal-600 p-6 bg-soft-linen-50 mb-8 w-full">
          <h2 className="text-center text-2xl font-semibold text-deep-teal-600 mb-3">
            Pulse, Sound, and Meter
          </h2>
          <p className="text-center text-deep-teal-800 text-sm leading-relaxed">
            These three components make up the beginning of how rhythm can be analyzed. By understanding pulse, we can understand how to find meter, and thus—how a rhythm <em>grooves</em>.
          </p>
        </div>

        {/* Three-column section: Pulse, Sound, Meter */}
        <div className="flex flex-col md:flex-row gap-6 mb-8 w-full">
          <div className="flex-1 border-3 border-deep-teal-600 p-6 bg-soft-linen-50">
            <h3 className="text-xl font-semibold text-center text-deep-teal-600 mb-4">Pulse</h3>
            <p className="text-deep-teal-800 text-sm leading-relaxed">
              Many people seem to argue about the perfect definition of what a <em>pulse</em> is, so for simplicity, here is my definition: <b>Pulse</b> is the <em>measured time</em> between two <em>sounds</em>. Many people believe that pulse should be consistent; however, I do not believe this to be the case. A piece of technology that is able to measure this for us is the <b>metronome</b>. Nowadays, we have electronic metronomes, but the original analogue metronomes consist of a pendulum that swings back and forth, creating a ticking sound at regular intervals. The speed of the metronome can be adjusted to create different tempos, which is the speed at which the pulse is measured. Each click of the metronome can be called the pulse.
            </p>
          </div>

          <div className="flex-1 border-3 border-deep-teal-600 p-6 bg-soft-linen-50">
            <h3 className="text-xl font-semibold text-center text-deep-teal-600 mb-4">Sound</h3>
            <p className="text-deep-teal-800 text-sm leading-relaxed">
              Sound is the vibration of air particles. When we hear a sound, we are actually hearing the vibrations of air particles that are created by an object. For example, when we hit a drum, we are creating vibrations in the air that we can hear as sound.
            </p>
          </div>

          <div className="flex-1 border-3 border-deep-teal-600 p-6 bg-soft-linen-50">
            <h3 className="text-xl font-semibold text-center text-deep-teal-600 mb-4">Meter</h3>
            <p className="text-deep-teal-800 text-sm leading-relaxed">
              Taking what we know about pulse, we can now tackle what BPM is. BPM stands for <b>Beats Per Minute</b>, and it is a way to measure the tempo of a piece of music. It is calculated by counting the number of beats in a minute and dividing it by the number of beats in a measure. For example, if there are 4 beats in a measure and the tempo is 120 BPM, then there are 120/4 = 30 measures per minute and the meter is called <span><sup>4</sup>/<sub>4</sub></span>. There are many different meters, both complex and simple, but for this short introduction, we will only cover the most common meters.
            </p>
          </div>
        </div>

        {/* Subdivisions large section */}
        <div className="w-full mb-8 rounded-xl border-3 border-deep-teal-600 bg-soft-linen-50 p-8 shadow-sm">
          <h2 className="text-center text-2xl font-semibold text-deep-teal-600 mb-6">Subdivisions: The Cutting of Music</h2>
          <p className="text-center text-deep-teal-800 text-sm leading-relaxed mb-6">
            A <b>Subdivision</b> is a broken down fragment of a beat. The formula for common subdivisions are quite simple. For this example, we will work under <span><sup>4</sup>/<sub>4</sub></span>.
          </p>

          <div className="mb-6 flex flex-col items-stretch gap-6 md:flex-row">
            <div className="flex h-full flex-1 flex-col rounded-lg border-2 border-deep-teal-300/50 bg-porcelain-50/70 p-4">
              <figcaption className="mb-2 min-h-[2.75rem] text-center text-sm leading-snug text-deep-teal-800">A whole note spans the entirety of a measure.</figcaption>
              <figure className="mt-auto w-full rounded-md border border-deep-teal-200/70 bg-white/40 p-2"><LoadMusicXMLShort music={ wholeXml } /></figure>
            </div>
            <div className="flex h-full flex-1 flex-col rounded-lg border-2 border-deep-teal-300/50 bg-porcelain-50/70 p-4">
              <figcaption className="mb-2 min-h-[2.75rem] text-center text-sm leading-snug text-deep-teal-800">This whole note can be <em>subdivided</em> into two half notes, meaning there are two half notes per measure.</figcaption>
              <figure className="mt-auto w-full rounded-md border border-deep-teal-200/70 bg-white/40 p-2"><LoadMusicXMLShort music={ halfXml } /></figure>
            </div>
          </div>

          <div className="mb-6 flex flex-col items-stretch gap-6 md:flex-row">
            <div className="flex h-full flex-1 flex-col rounded-lg border-2 border-deep-teal-300/50 bg-porcelain-50/70 p-4">
              <figcaption className="mb-2 min-h-[2.75rem] text-center text-sm leading-snug text-deep-teal-800">Each half note will split into two quarter notes, meaning there are four quarter notes per measure.</figcaption>
              <figure className="mt-auto w-full rounded-md border border-deep-teal-200/70 bg-white/40 p-2"><LoadMusicXMLShort music={ quarterXml } /></figure>
            </div>
            <div className="flex h-full flex-1 flex-col rounded-lg border-2 border-deep-teal-300/50 bg-porcelain-50/70 p-4">
              <figcaption className="mb-2 min-h-[2.75rem] text-center text-sm leading-snug text-deep-teal-800">Each quarter note can be subdivided into two eighth notes, meaning there are eight eighth notes per measure.</figcaption>
              <figure className="mt-auto w-full rounded-md border border-deep-teal-200/70 bg-white/40 p-2"><LoadMusicXMLShort music={ eighthXml } /></figure>
            </div>
          </div>

          <div className="flex flex-col items-center rounded-lg border-2 border-deep-teal-300/50 bg-porcelain-50/70 p-4">
            <figcaption className="mb-3 text-center text-sm text-deep-teal-800">Each eighth note can be subdivided into two sixteenth notes, meaning there are sixteen sixteenth notes per measure. This process can continue indefinitely, but for the sake of this introduction, we will stop at sixteenth notes.</figcaption>
            <figure className="mx-auto w-full rounded-md border border-deep-teal-200/70 bg-white/40 p-2 md:w-1/2"><LoadMusicXMLShort music={ sixteenthXml } /></figure>
            <p className="mt-3 text-center text-sm text-deep-teal-800">Subdivisions are important because they allow us to understand how rhythm can be broken down into smaller parts!</p>
          </div>
        </div>

        {/* Two-column groove section */}
        <div className="flex flex-col md:flex-row gap-6 mb-8 w-full">
          <div className="flex-1 rounded-xl border-3 border-deep-teal-600 bg-soft-linen-50 p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-center text-deep-teal-600 mb-4">Groove: Why We Dance</h3>
            <p className="text-deep-teal-800 text-sm leading-relaxed">
              By utilizing all that we have learned so far, we can finally explain what groove is: Groove is the feeling you get when your favorite song comes on and you start nodding your head, tapping your feet, or even clicking your teeth to the beat; however, groove is very subjective in nature. One person might love technical grooves from bands or artists such as 'Yes', 'King Crimson', 'Tool', or 'Rush'; however, other people might prefer more <em>simplistic</em> grooves from bands or artists such as 'Michael Jackson', 'NLE Choppa', 'The Beatles', or 'The Grateful Dead'!
            </p>
          </div>

          <div className="flex-1 rounded-xl border-3 border-deep-teal-600 bg-soft-linen-50 p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-center text-deep-teal-600 mb-4">Groove vs. Rhythm: Quantizing Feel</h3>
            <p className="text-deep-teal-800 text-sm leading-relaxed">
              Throughout reading, many of these terms can easily be replaced with <em>rhythm</em>. That being said, I want to ensure that there is a clear distinction between rhythm and groove. Rhythm is the perfectly measured time; groove is a humanized version. People can groove on time, rushing, or dragging. Computers can produce rhythm on time or synthesized to be <em>off time</em>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-3 border-deep-teal-600 bg-deep-teal-600 p-6 text-center w-full">
          <p className="text-soft-linen-50 text-lg font-semibold">
            If groove is how we feel music, rhythm is how we study it
          </p>
        </footer>
      </article>
  )
}