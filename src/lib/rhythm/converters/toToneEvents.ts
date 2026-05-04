import { DrumPattern } from "../types";

/**
 * A drum event formatted for the Tone.js Transport scheduler.
 *
 * @property time       - Tone.js transport-style time string in `"measure:beat:sixteenth"` format.
 *                        Example: `"0:1:2"` = measure 0, beat 1, sixteenth 2.
 * @property instrument - The drum voice to trigger (maps to a sample key).
 * @property duration   - Duration of the note in musical units.
 * @property velocity   - Optional accent level in the range 0.0–1.0.
 */
export interface ToneEvent {
   time: string;
   instrument: string;
   duration: number;
   velocity?: number;
}

/**
 * Converts the beat-offset notes of a {@link DrumPattern} into Tone.js
 * transport-style time strings suitable for `Transport.scheduleRepeat`.
 *
 * Time conversion formula:
 * - `beat`      = `Math.floor(note.time)`        — integer beat number
 * - `sixteenth` = `Math.round((note.time % 1) * 4)` — 16th-note offset
 * - Result:     `"0:<beat>:<sixteenth>"`
 *
 * @remarks This function does **not** convert to seconds. Seconds conversion
 * happens at the audio scheduling boundary (e.g., `PatternTransport`).
 *
 * @param pattern - The source drum pattern.
 * @returns Array of {@link ToneEvent} objects ready for Transport scheduling.
 *
 * @example
 * // DrumNote { time: 1.5 } → ToneEvent { time: "0:1:2" }
 * const events = patternToToneEvents(myPattern);
 */
export function patternToToneEvents(pattern: DrumPattern): ToneEvent[] {
   return pattern.notes.map((n) => {
      const beat = Math.floor(n.time);          // 1.0 → 1
      const subdivision = n.time % 1;           // 1.5 → 0.5

      // Convert subdivision to 16th notes
      const sixteenth = Math.round(subdivision * 4); // 0.5 → 2

      const toneTime = `0:${beat}:${sixteenth}`;

      return {
         time: toneTime,
         instrument: n.instrument,
         duration: n.duration,
         velocity: n.velocity,
      };
   });
}
