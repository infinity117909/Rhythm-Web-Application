import { createFileRoute } from '@tanstack/react-router'
import { LoadMusicXMLShort } from '@/components/notation/ParseXML';
import * as OSMD from "opensheetmusicdisplay";
import { useEffect, useRef } from 'react';

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
      <article className="font-gotu tracking-wide text-justify flex flex-col bg-porcelain-50">

        <h1 className="self-center text-8xl text-center text-khaki-beige-300 pt-10 pb-5">
            Introduction to Rhythm Theory!
        </h1>

        {/* Secondary 30% block */}
        <div className="flex flex-row bg-bone-100 text-left px-5 my-10 border-y-2 border-khaki-beige-300/40">
            <section className="w-1/2 flex flex-col border-r-2 border-jungle-teal-600 pr-5 py-5">
              <h2 className="text-xl self-center text-jungle-teal-600">Why <em>rhythm</em>, specifically?</h2>
              <p className="text-justify">
                  Well... in music, there are two (main) kinds of theory: <span className="text-khaki-beige-300">Music Theory</span> and <span className="text-khaki-beige-300">Rhythm Theory</span> Music Theory is the overarching study of how music works. This can be from how to classify intervals, chords (and chord progressions), rhythm, and so many more! Rhythm Theory is a <span className="text-khaki-beige-300">concentration</span> of how rhythm works within music. For the sake of this project, we will mainly work under rhythm theory.
              </p>
            </section>

            <section className="w-1/2 flex flex-col border-l-2 border-jungle-teal-600 pl-5 py-5">
              <h2 className="text-xl self-center text-jungle-teal-600">Why Rhythm Theory?</h2>
              <p className="text-justify">
                  Because it's way cooler! Rhythm can describe an objective love that many people have towards music. In fact, many times, people will like a song without actually understanding the <em>why</em> behind the song that they like.
              </p>
            </section>
        </div>

        <div className="flex flex-col gap-10">
            <section className="w-full flex flex-col">
              <h2 className="text-xl self-center text-center">
                  <span className="text-jungle-teal-600">Pulse</span>, 
                  <span className="text-khaki-beige-300"> Sound</span>, 
                  <span className="text-orange-500"> Meter</span>
              </h2>
              <p className="self-center text-center w-1/3">
                  These three components make up the beginning of how rhythm can be analyzed. By understanding pulse, we can understand how to find meter, and thus—how a rhythm <em>grooves</em>
              </p>
            </section>

            {/* Secondary 30% block */}
            <div className="flex flex-row gap-10 p-5 bg-bone-100 border-y-2 border-khaki-beige-300/40">
              <section className="w-1/3 flex flex-col">
              <h2 className="text-xl self-center text-jungle-teal-600">Pulse: The Impact</h2>
                  <p>Many people seem to argue about the perfect definition of what a <em>pulse</em> is, so for simplicity, here is my definition: <b>Pulse</b> is the <em>measured time</em> between two <em>sounds</em>. Many people believe that pulse should be consistent; however, I do not believe this to be the case. A piece of technology that is able to measure this for us is the <b>metronome</b>. Nowadays, we have electronic metronomes, but the original analogue metronomes consist of a pendulum that swings back and forth, creating a ticking sound at regular intervals. The speed of the metronome can be adjusted to create different tempos, which is the speed at which the pulse is measured. Each click of the metronome can be called the pulse.</p>
              </section>

              <section className="w-1/3 flex flex-col">
                  <h2 className="text-xl self-center text-jungle-teal-600">Sound: The Resonant</h2>
                  <p>Sound is the vibration of air particles. When we hear a sound, we are actually hearing the vibrations of air particles that are created by an object. For example, when we hit a drum, we are creating vibrations in the air that we can hear as sound.</p>
              </section>

              <section className="w-1/3 flex flex-col">
                  <h2 className="text-xl self-center text-jungle-teal-600">Meter: The Container</h2>
                  <p>Taking what we know about pulse, we can now tackle what BPM is. BPM stands for <b>Beats Per Minute</b>, and it is a way to measure the tempo of a piece of music. It is calculated by counting the number of beats in a minute and dividing it by the number of beats in a measure. For example, if there are 4 beats in a measure and the tempo is 120 BPM, then there are 120/4 = 30 measures per minute and the meter is called <span><sup>4</sup>/<sub>4</sub></span>. There are many different meters, both complex and simple, but for this short introduction, we will only cover the most common meters.</p>
              </section>
            </div>
        </div>

        {/* Primary 60% block */}
          <div className="flex flex-col gap-10 px-20 pb-10 bg-porcelain-50">
            <section className="pt-5 self-center text-center flex flex-col">
            <h2 className="text-xl text-jungle-teal-600">Subdivisions: The Cutting of Music</h2>
              <p className="w-1/2 self-center">A <b>Subdivision</b> is a broken down fragment of a beat. The formula for common subdivisions are quite simple. For this example, we will work under <span><sup>4</sup>/<sub>4</sub></span>.</p>
            </section>

            {/* Alternating secondary block */}
            <div className="flex flex-row gap-10 bg-bone-100 p-5 rounded-md border border-khaki-beige-300/30">
              <div className="flex flex-col self-end w-1/2">
                  <figcaption className="self-center text-center">A whole note spans the entirety of a measure.</figcaption>
                  <figure className="w-full self-center m-2"><LoadMusicXMLShort music={ wholeXml } /></figure>
              </div>

              <div className="flex flex-col self-end w-1/2">
                  <figcaption className="self-center text-center">This whole note can be <em>subdivided</em> into two half notes, meaning there are two half notes per measure.</figcaption>
                  <figure className="w-full self-center m-2"><LoadMusicXMLShort music={ halfXml } /></figure>
              </div>
            </div>

            <div className="flex flex-row gap-10">
              <div className="flex flex-col self-end w-1/2">
                  <figcaption className="self-center text-center">Each half note will split into two quarter notes, meaning there are four quarter notes per measure.</figcaption>
                  <figure className="w-full"><LoadMusicXMLShort music={ quarterXml } /></figure>
              </div>
              <div className="flex flex-col self-end w-1/2">
                  <figcaption className="self-center text-center">Each quarter note can be subdivided into two eighth notes, meaning there are eight eighth notes per measure.</figcaption>
                  <figure className="w-full"><LoadMusicXMLShort music={ eighthXml } /></figure>
              </div>
            </div>

            <div className="flex flex-col">
              <figcaption className="w-1/2 self-center text-center">Each eighth note can be subdivided into two sixteenth notes, meaning there are sixteen sixteenth notes per measure. This process can continue indefinitely, but for the sake of this introduction, we will stop at sixteenth notes. </figcaption>
              <figure className="w-1/2 self-center m-2"><LoadMusicXMLShort music={ sixteenthXml } /></figure>
              <p className="w-1/2 self-center text-center">Subdivisions are important because they allow us to understand how rhythm can be broken down into smaller parts!</p>
            </div>
        </div>

        {/* Secondary 30% block */}
          <div className="flex flex-row gap-5 p-5 bg-bone-100 border-t-2 border-khaki-beige-300/40">
            <section className="flex flex-col w-1/2">
            <h2 className="text-xl self-center text-jungle-teal-600">Groove: Why We Dance</h2>
              <p>By utilizing all that we have learned so far, we can finally explain what groove is: Groove is the feeling you get when your favorite song comes on and you start nodding your head, tapping your feet, or even clicking your teeth to the beat; however, groove is very subjective in nature.

                  One person might love technical grooves from bands or artists such as 'Yes', 'King Crimson', 'Tool', or 'Rush'; however, other people might prefer more <em>simplistic</em> grooves from bands or artists such as 'Michael Jackson', 'NLE Choppa', 'The Beatles', or 'The Grateful Dead'!</p>
            </section>
            <section className="flex flex-col w-1/2">
              <h2 className="text-xl self-center text-jungle-teal-600">Groove vs. Rhythm: Quantizing Feel</h2>
              <p>Throughout reading, many of these terms can easily be replaced with <em>rhythm</em>. That being said, I want to ensure that there is a clear distinction between rhythm and groove. Rhythm is the perfectly measured time; groove is a humanized version. People can groove on time, rushing, or dragging. Computers can produce rhythm on time or synthesized to be <em>off time</em>.</p>
            </section>
        </div>

        {/* Accent-heavy footer */}
        <footer className="flex flex-row bg-jungle-teal-600">
            <p className="m-10 self-center text-center text-porcelain-50 w-full text-3xl">
              If groove is how we feel music rhythm is how we study it
            </p>
        </footer>
      </article>


  )
}