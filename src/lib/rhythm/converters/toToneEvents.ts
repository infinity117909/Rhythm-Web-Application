import { DrumPattern } from "../types";

export interface ToneEvent {
   // transport-style time string for scheduling (e.g., "0:1:2")
   time: string;
   instrument: string;
   duration: number;
   velocity?: number;
}

/**
 * Convert internal beat-offset notes into transport-style time strings.
 * This function does NOT convert to seconds — that conversion is done at
 * the audio scheduling boundary (PatternTransport).
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
