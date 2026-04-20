import * as Tone from "tone";
import { useEffect, useRef, useState } from "react";
import { drumEngine } from "../../utils/DrumEngine";

interface LoadFileProps {
   audioUrl: string;
}

/** Utility: fetch a file as text */
export async function parseFile({ filePath }: { filePath: string }) {
   try {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const content = await response.text();
      console.log(content);
      return { content };
   } catch (error) {
      console.error("Error reading or fetching file:", error);
   }
}

/** All drum sample filenames mapped by key */
const DRUM_SAMPLES: Record<string, string> = {
   "A1": "A1.mp3", //metronome-click-accent
   "Ab1": "Ab1.mp3", //metronome-click-sub
   "B1": "B1.mp3", //kick-1
   "C2": "C2.mp3", //kick-2
   "Ab2": "Ab2.mp3", //hi-hat-closed-1
   "Gb2": "Gb2.mp3", //hi-hat-closed-2
   "Bb2": "Bb2.mp3", //hi-hat-open-1
   "D2": "D2.mp3", //snare-1
   "E2": "E2.mp3", //snare-2
   "Db2": "Db2.mp3", //cross-stick-1
   "G1": "G1.mp3", //stick-click-1
   "D3": "D3.mp3", //high-tom-1
   "B2": "B2.mp3", //med-tom-1
   "C3": "C3.mp3", //med-tom-2
   "A2": "A2.mp3", //floor-tom-2
   "F2": "F2.mp3", //floor-tom-3
   "G2": "G2.mp3", //floor-tom-4
   "B3": "B3.mp3", //ride-1
   "Eb3": "Eb3.mp3", //ride-2
   "F3": "F3.mp3", //ride-bell-1
   "A3": "A3.mp3", //crash-1
   "Db3": "Db3.mp3", //crash-2
   "E1": "E1.mp3", //china-1
   "E3": "E3.mp3", //china-2
   "G3": "G3.mp3", //splash-1
   "Eb2": "Eb2.mp3", //clap-1
   "Bb1": "Bb1.mp3", //triangle-1
   "F1": "F1.mp3", //flub-drum-1
   "Gb1": "Gb1.mp3", //flub-drum-2
   "Ab3": "Ab3.mp3", //cowbell-1
   "Bb3": "Bb3.mp3", //vibroslap-1
   "Gb3": "Gb3.mp3", //tamborine-1
   "B4": "B4.mp3", //whistle-1
   "Bb4": "Bb4.mp3", //shaker-1
   "C4": "C4.mp3", //bongo-high-1
   "D4": "D4.mp3", //bongo-med-1
   "Db4": "Db4.mp3", //bongo-low-1
   "E4": "E4.mp3", //conga-low-1
   "Eb4": "Eb4.mp3", //conga-high-1
   "F4": "F4.mp3", //timbale-high-1
   "G4": "G4.mp3", //agogo-bell-high-1
   "Gb4": "Gb4.mp3", //timbale-med-1
   "B5": "B5.mp3", //sleigh-bells-1
   "Bb5": "Bb5.mp3", //shaker-2
   "C5": "C5.mp3", //whistle-2
   "D5": "D5.mp3", //guiro-run-1
   "Db5": "Db5.mp3", //guiro-tap-1
   "E5": "E5.mp3", //woodblock-med-1
   "Eb5": "Eb5.mp3", //clave-1
   "F5": "F5.mp3", //woodblock-low-1
   "G5": "G5.mp3", //cuica-low-1
   "Gb5": "Gb5.mp3", //cuica-high-1
   "C6": "C6.mp3", //chimes-1
   "D6": "D6.mp3", //concert-tom-1
   "Db6": "Db6.mp3", //castanets-1
   "Eb6": "Eb6.mp3", //concert-tom-2
};

export function LoadFile({ audioUrl }: LoadFileProps) {
   const drumsRef = useRef<Tone.Players | null>(null);
   const [isReady, setIsReady] = useState(false);

   useEffect(() => {
      const players = new Tone.Players(
         {
            urls: DRUM_SAMPLES,
            baseUrl: audioUrl,
            onload: () => {
               console.log("Drum samples loaded");
               setIsReady(true);
            },
         }
      ).toDestination();

      // expose globally
      drumEngine.setPlayers(players);
      drumsRef.current = players;

      return () => {
         players.dispose();
      };
   }, [audioUrl]);

   return (
      <div>
         {/* Component intentionally renders nothing visible */}
         {/* You can add UI here if needed */}
      </div>
   );
}
