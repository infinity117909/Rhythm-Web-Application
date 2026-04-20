import { DrumNote, DrumPattern, DrumInstrument } from "../types";
import Vex, { StaveNote, Beam, Voice, NoteStruct, KeySignature } from "vexflow";

// Creates a key-value pair of type DrumInstruments and their locations on the stave
const DRUM_MAP: Record<
   DrumInstrument,
   { key: string; line?: number; notehead?: string; stem?: number }
> = {
   kick: { key: "f/4" }, // low 
   snare: { key: "c/5" }, // mid 
   hihat: { key: "f/5", notehead: "x" }, // X notehead 
   tom: { key: "a/3" }, // example tom 
   ride: { key: "ax/5", notehead: "x" },
   crash: { key: "cx/6", notehead: "x" },
};

// Contains all of the beats per measure
export interface VexMeasure {
   index: number;
   notes: StaveNote[];
   beams: Beam[]; // how each note 
   uniqueTimes: number[];
}


// Takes the pattern from the json file and returns an iterable array of the notes and their indexes
function patternToMeasures(
   pattern: DrumPattern,
   beatsPerMeasure = 4
): { index: number; notes: DrumNote[] }[] {
   const measures = new Map<number, DrumNote[]>();

   for (const note of pattern.notes) {
      const measureIndex = Math.floor(note.time / beatsPerMeasure);
      if (!measures.has(measureIndex)) measures.set(measureIndex, []);
      measures.get(measureIndex)!.push(note);
   }

   return Array.from(measures.entries())
      .sort(([a], [b]) => a - b)
      .map(([index, notes]) => ({ index, notes }));
}


function makeDrumNoteStruct(
   instruments: DrumInstrument[],
   duration: string = "8"
): NoteStruct {
   return {
      keys: instruments.map(i => DRUM_MAP[i].key),
      duration,
   };
}

export function patternToVexFlowMeasures(
   pattern: DrumPattern,
   beatsPerMeasure = 4
): VexMeasure[] {
   const measureDefs = patternToMeasures(pattern, beatsPerMeasure);
   console.log(measureDefs)
   const measures: VexMeasure[] = [];

   for (const { index, notes } of measureDefs) {
      const groups = new Map<number, DrumNote[]>();

      for (const n of notes) {
         if (!groups.has(n.time)) groups.set(n.time, []);
         groups.get(n.time)!.push(n);
      }

      const chordNotes: StaveNote[] = [];
      const uniqueTimes = Array.from(groups.keys()).sort((a, b) => a - b);

      for (const time of uniqueTimes) {
         const group = groups.get(time)!;
         const instruments = group.map(n => n.instrument);
         const noteStruct = makeDrumNoteStruct(instruments, "q");

         const staveNote = new StaveNote(noteStruct);

         chordNotes.push(staveNote);
      }

      // Generating dynamic beaming
      const beams = Beam.generateBeams(chordNotes, {
         flatBeams: true,
         stemDirection: 1
      });

      measures.push({
         index,
         notes: chordNotes,
         beams,
         uniqueTimes,
      });
   }

   return measures;
}


export function patternToVexFlowNotes(pattern: DrumPattern) {
   const groups = new Map<number, DrumNote[]>();

   // Group notes by beat
   for (const note of pattern.notes) {
      if (!groups.has(note.time)) groups.set(note.time, []);
      groups.get(note.time)!.push(note);
   }

   const notes: StaveNote[] = [];

   for (const [time, group] of groups.entries()) {
      const keys = group.map(n => DRUM_MAP[n.instrument].key);

      const staveNote = new StaveNote({
         keys,
         duration: "8",
      });

      // Add "x" annotations for instruments that require X noteheads (e.g., hi-hat)
      group.forEach((n, i) => {
         const map = DRUM_MAP[n.instrument];
         if (map.notehead === "x") {
            const ann = new Vex.Annotation("x")
               .setFont("Arial", 14, "bold")
               .setVerticalJustification(Vex.Annotation.VerticalJustify.CENTER);
            (staveNote as any).addAnnotation(i, ann);
         }
      });

      notes.push(staveNote); // <-- MUST be an instance
   }

   return { notes };
}
