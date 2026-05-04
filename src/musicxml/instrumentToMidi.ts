/**
 * Hardcoded mapping from MusicXML `<instrument id>` strings to General MIDI
 * percussion note numbers for the **Basic Swing** score.
 *
 * This mapping is score-specific because MusicXML instrument IDs are defined
 * per-file. When adding support for a new score, extend this map or create
 * a separate file following the same pattern.
 *
 * The resulting MIDI numbers can be passed to {@link DRUM_MIDI_TO_SAMPLE} to
 * resolve the corresponding FatBoy soundfont sample key.
 *
 * @example
 * const midi = INSTRUMENT_ID_TO_MIDI["P1-I37"]; // → 36 (Bass Drum 1)
 * const key  = DRUM_MIDI_TO_SAMPLE[midi];        // → "C2"
 * drumEngine.play(key);
 */
export const INSTRUMENT_ID_TO_MIDI: Record<string, number> = {
  "P1-I37": 36, // Bass Drum 1
  "P1-I39": 38, // Acoustic Snare
  "P1-I45": 44, // Pedal Hi-Hat
  "P1-I52": 51, // Ride Cymbal 1
  // ...add others as needed
};
