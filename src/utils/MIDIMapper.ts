// import * as OSMD from 'opensheetmusicdisplay';
// const { OpenSheetMusicDisplay } = OSMD;

/**
 * Authoritative mapping from General MIDI percussion note numbers to
 * FatBoy soundfont sample key strings used throughout the application.
 *
 * Covers:
 * - Standard GM percussion (MIDI 35–83)
 * - Custom / extended samples (MIDI 84–92) such as metronome clicks and
 *   additional cymbals not found in the GM specification
 *
 * Used by:
 * - {@link BPMCursorController} — resolves OSMD `fixedKey` → sample key
 * - {@link playMusicXMLDrums} — resolves instrument ID → MIDI → sample key
 * - `MusicPlayer` component — resolves graphical note MIDI → sample key
 *
 * @example
 * const key = DRUM_MIDI_TO_SAMPLE[36]; // → "C2" (Bass Drum 1)
 * drumEngine.play(key);
 */
export const DRUM_MIDI_TO_SAMPLE: Record<number, string> = {
   // --- Custom (Non‑GM) Drum Samples ---
   84: "A1",   // metronome-click-accent
   85: "Ab1",  // metronome-click-sub
   86: "Bb1",  // triangle-1
   87: "E1",   // china-1
   88: "Eb1",  // e-kick-1
   89: "F1",   // flub-drum-1
   90: "G1",   // stick-click-1
   91: "Gb1",  // flub-drum-2
   92: "A2",   // floor-tom-2 (alternate)

   // --- General MIDI Percussion (Standard) ---
   35: "B1",     // Acoustic Bass Drum
   36: "C2",     // Bass Drum 1
   37: "Db2",    // Side Stick 
   38: "D2",     // Acoustic Snare 
   39: "Eb2",    // Hand Clap
   40: "E2",     // Electric Snare

   41: "B2",     // Low Floor Tom
   42: "Gb2",    // Closed Hi-Hat
   43: "C3",     // High Floor Tom
   44: "Ab2",    // Pedal Hi-Hat
   45: "A2",     // Low Tom
   46: "Bb2",    // Open Hi-Hat → hi-hat-open-1

   47: "F2",     // Low-Mid Tom
   48: "G2",     // Hi-Mid Tom
   49: "A3",     // Crash Cymbal 1 → crash-1
   50: "D3",     // High Tom → high-tom-1
   51: "B3",     // Ride Cymbal 1 → ride-1
   52: "F3",     // Chinese Cymbal → ride-bell-1
   53: "Eb3",    // Ride Bell → ride-2

   54: "G3",     // Tambourine → splash-1
   55: "Db3",    // Splash Cymbal → crash-2
   56: "Ab3",    // Cowbell → cowbell-1
   57: "Db3",    // Crash Cymbal 2 → crash-2
   58: "Bb3",    // Vibra Slap → vibroslap-1
   59: "E3",     // Ride Cymbal 2 → china-2

   60: "C4",     // High Bongo → bongo-high-1
   61: "D4",     // Low Bongo → bongo-med-1
   62: "Db4",    // Mute High Conga → bongo-low-1
   63: "Eb4",    // Open High Conga → conga-high-1
   64: "E4",     // Low Conga → conga-low-1

   65: "F4",     // High Timbale → timbale-high-1
   66: "Gb4",    // Low Timbale → timbale-med-1
   67: "G4",     // High Agogo → agogo-bell-high-1
   68: "Gb4",    // Low Agogo → timbale-med-1
   69: "G4",     // Cabasa → agogo-bell-high-1
   70: "Gb3",    // Maracas → tamborine-1

   71: "B5",     // Short Whistle → sleigh-bells-1
   72: "C5",     // Long Whistle → whistle-2
   73: "Bb5",    // Short Guiro → shaker-2
   74: "D5",     // Long Guiro → guiro-run-1
   75: "Db5",    // Claves → guiro-tap-1
   76: "Eb5",     // High Wood Block → clave-1
   77: "F5",     // Low Wood Block → woodblock-low-1

   78: "G5",     // Mute Cuica → cuica-low-1
   79: "Gb5",    // Open Cuica → cuica-high-1
   80: "C6",     // Mute Triangle → chimes-1
   81: "D6",     // Open Triangle → concert-tom-1
   82: "Db6",    // Shaker / Castanets → castanets-1
   83: "Eb6",    // Jingle Bell → concert-tom-2
};

export function setMIDI(subInstruments: OSMD.SubInstrument[],  ) {

}