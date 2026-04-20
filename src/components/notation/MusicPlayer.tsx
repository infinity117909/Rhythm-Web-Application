import { useEffect, useRef, useState } from "react";
import osmd from 'opensheetmusicdisplay';
const {OpenSheetMusicDisplay} = osmd;
import * as Tone from "tone";
import { drumEngine } from "@/utils/DrumEngine";
import { DRUM_MIDI_TO_SAMPLE } from "@/utils/MIDIMapper";

interface MusicPlayerProps {
   filePath: string; // URL to the MusicXML file
}

export function getDrumMidiFromGraphicalNote(g: osmd.GraphicalNote): number | null {
   if (!g?.sourceNote) return null;
   if (g.sourceNote.isRest()) return null;

   const midi = g.sourceNote.Pitch. getMidiPitch();
   return typeof midi === "number" ? midi : null;
}


export default function MusicPlayer({ filePath }: MusicPlayerProps) {
   const containerRef = useRef<HTMLDivElement>(null);
   const osmdRef = useRef<osmd.OpenSheetMusicDisplay | null>(null);
   const [ready, setReady] = useState(false);
   

   useEffect(() => {
      if (!containerRef.current || !filePath) return;

      const osmd = new OpenSheetMusicDisplay(containerRef.current, {
         autoResize: true,
         drawTitle: true,
      });

      osmdRef.current = osmd;

      async function load() {
         await osmd.load(filePath);
         await osmd.render();
         setReady(true);
      }

      load();
   }, [filePath]);

   

   async function play() {
      if (!osmdRef.current) return;

      await Tone.start(); // required by browsers
      const now = Tone.now();

      const cursor = osmdRef.current.cursor;
      cursor.show();

      cursor.reset();
      cursor.next();

      function scheduleNext() {
         if (cursor.iterator.EndReached) {
            cursor.hide();
            return;
         }
         const gnotes = cursor.GNotesUnderCursor();

        for (const g of gnotes) {
        const midi = getDrumMidiFromGraphicalNote(g);
        if (!midi) continue;

        const sampleName = DRUM_MIDI_TO_SAMPLE[midi];
        if (sampleName) {
            drumEngine.play(sampleName);
        }
        }


         const timestamp = cursor.iterator.currentTimeStamp.RealValue;
         const duration = cursor.iterator.currentTimeStamp.RealValue;

         // simple beep for each note
         const synth = new Tone.Synth().toDestination();
         synth.triggerAttackRelease("C5", duration, now + timestamp);

         cursor.next();
         requestAnimationFrame(scheduleNext);
      }

      scheduleNext();
   }

   return (
      <div>
         <div ref={containerRef} style={{ width: "100%", marginBottom: 20 }} />

         <button disabled={!ready} onClick={play}>
            {ready ? "Play Music" : "Loading..."}
         </button>
      </div>
   );
}
