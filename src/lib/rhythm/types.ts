/**
 * The set of drum instrument voices supported by the rhythm engine.
 * Each value maps to a VexFlow staff position and a sample key via DRUM_MAP / DRUM_MIDI_TO_SAMPLE.
 */
export type DrumInstrument =
   | "kick"
   | "snare"
   | "hihat"
   | "tom"
   | "ride"
   | "crash";

/**
 * A single drum hit within a {@link DrumPattern}.
 *
 * @property time       - Beat offset from the start of the pattern in quarter-note units.
 *                        Example: `1.5` = beat 1 + an eighth-note.
 * @property duration   - Duration value. Interpretation depends on context:
 *                        seconds when scheduling audio, musical units when rendering notation.
 * @property instrument - The drum voice to trigger.
 * @property velocity   - Optional accent level in the range 0.0–1.0. Defaults to 1.0 when omitted.
 */
export interface DrumNote {
   time: number;
   duration: number;
   instrument: DrumInstrument;
   velocity?: number;
}

/**
 * A complete drum pattern that can be rendered as notation or scheduled for playback.
 *
 * @property id    - Unique identifier used as a lookup key.
 * @property title - Human-readable display name.
 * @property bpm   - Tempo in beats per minute.
 * @property notes - Ordered list of drum hits that make up the pattern.
 */
export interface DrumPattern {
   id: string;
   title: string;
   bpm: number;
   notes: DrumNote[];
}

/**
 * Generic label/value pair used by dropdown and select components.
 *
 * @property label - Text displayed to the user.
 * @property value - Internal string value passed to event handlers.
 */
export interface OptionType {
   label: string;
   value: string;
}

//export interface DropdownProps {
//   options: OptionType[];
//   placeholder?: string;
//   onValueUpdate?: (value: string) => void;
//}
