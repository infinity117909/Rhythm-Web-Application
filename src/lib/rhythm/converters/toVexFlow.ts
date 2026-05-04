import { DrumNote, DrumPattern, DrumInstrument } from "../types";
import Vex, { StaveNote, Beam, Voice, NoteStruct, KeySignature } from "vexflow";

/**
 * Maps each {@link DrumInstrument} to its VexFlow staff position key and optional
 * notehead style. Instruments that use an "x" notehead (e.g. hi-hat, ride, crash)
 * are rendered with `notehead: "x"` to follow standard percussion notation.
 *
 * @example
 * DRUM_MAP["hihat"] // → { key: "f/5", notehead: "x" }
 */
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

/**
 * Represents a single measure of notation produced by {@link patternToVexFlowMeasures}.
 *
 * @property index       - Zero-based measure number within the pattern.
 * @property notes       - VexFlow `StaveNote` objects for all beats in this measure.
 * @property beams       - VexFlow `Beam` objects for grouping eighth/sixteenth notes.
 * @property uniqueTimes - Sorted array of distinct beat-time values present in the measure.
 */
export interface VexMeasure {
   index: number;
   notes: StaveNote[];
   beams: Beam[];
   uniqueTimes: number[];
}


/**
 * Groups the notes of a {@link DrumPattern} into measures.
 *
 * @param pattern         - The source drum pattern.
 * @param beatsPerMeasure - Number of quarter-note beats per measure. Defaults to 4.
 * @returns Array of `{ index, notes }` objects sorted by measure index.
 */
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


/**
 * Builds a VexFlow `NoteStruct` for a chord of simultaneous drum hits.
 *
 * @param instruments - List of drum voices sounding at the same time.
 * @param duration    - VexFlow duration string (e.g. `"q"` = quarter, `"8"` = eighth). Defaults to `"8"`.
 * @returns A `NoteStruct` ready to be passed to `new StaveNote()`.
 */
function makeDrumNoteStruct(
   instruments: DrumInstrument[],
   duration: string = "8"
): NoteStruct {
   return {
      keys: instruments.map(i => DRUM_MAP[i].key),
      duration,
   };
}

/**
 * Converts a {@link DrumPattern} into an array of {@link VexMeasure} objects
 * suitable for rendering on a VexFlow `Stave`.
 *
 * Notes at the same beat time are stacked into a single chord `StaveNote`.
 * Dynamic beaming is generated automatically via `Beam.generateBeams`.
 *
 * @param pattern         - The source drum pattern.
 * @param beatsPerMeasure - Number of quarter-note beats per measure. Defaults to 4.
 * @returns Array of {@link VexMeasure} objects, one per measure.
 */
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


/**
 * Converts a {@link DrumPattern} into a flat array of VexFlow `StaveNote` objects
 * without measure grouping. Useful for single-measure or simplified rendering.
 *
 * Notes at the same beat time are stacked into a chord. Instruments that use
 * an `"x"` notehead (hi-hat, ride, crash) receive a VexFlow `Annotation` to
 * render the correct percussive notehead symbol.
 *
 * @param pattern - The source drum pattern.
 * @returns Object with a `notes` array of `StaveNote` instances.
 */
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
