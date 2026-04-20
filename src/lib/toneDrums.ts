import * as Tone from "tone";

export type DrumEvent = {
  time: number; // seconds from start
  midi: number;
  velocity?: number;
};

let sampler: Tone.Sampler | null = null;
let started = false;

export async function initDrumSampler() {
  if (sampler) return sampler;

  sampler = new Tone.Sampler(
    {
        84: "A1.mp3",   // metronome-click-accent
        85: "Ab1.mp3",  // metronome-click-sub
        86: "Bb1.mp3",  // triangle-1
        87: "E1.mp3",   // china-1
        88: "Eb1.mp3",  // e-kick-1
        89: "F1.mp3",   // flub-drum-1
        90: "G1.mp3",   // stick-click-1
        91: "Gb1.mp3",  // flub-drum-2
        92: "A2.mp3",   // floor-tom-2 (alternate)

        // --- General MIDI Percussion (Standard) ---
        35: "B1.mp3",     // Acoustic Bass Drum
        36: "C2.mp3",     // Bass Drum 1
        37: "Db2.mp3",    // Side Stick 
        38: "D2.mp3",     // Acoustic Snare 
        39: "Eb2.mp3",    // Hand Clap
        40: "E2.mp3",     // Electric Snare

        41: "B2.mp3",     // Low Floor Tom
        42: "Gb2.mp3",    // Closed Hi-Hat
        43: "C3.mp3",     // High Floor Tom
        44: "Ab2.mp3",    // Pedal Hi-Hat
        45: "A2.mp3",     // Low Tom
        46: "Bb2.mp3",    // Open Hi-Hat → hi-hat-open-1

        47: "F2.mp3",     // Low-Mid Tom
        48: "G2.mp3",     // Hi-Mid Tom
        49: "A3.mp3",     // Crash Cymbal 1 → crash-1
        50: "D3.mp3",     // High Tom → high-tom-1
        51: "B3.mp3",     // Ride Cymbal 1 → ride-1
        52: "F3.mp3",     // Chinese Cymbal → ride-bell-1
        53: "Eb3.mp3",    // Ride Bell → ride-2

        54: "G3.mp3",     // Tambourine → splash-1
        55: "Db3.mp3",    // Splash Cymbal → crash-2
        56: "Ab3.mp3",    // Cowbell → cowbell-1
        57: "Db3.mp3",    // Crash Cymbal 2 → crash-2
        58: "Bb3.mp3",    // Vibra Slap → vibroslap-1
        59: "E3.mp3",     // Ride Cymbal 2 → china-2

        60: "C4.mp3",     // High Bongo → bongo-high-1
        61: "D4.mp3",     // Low Bongo → bongo-med-1
        62: "Db4.mp3",    // Mute High Conga → bongo-low-1
        63: "Eb4.mp3",    // Open High Conga → conga-high-1
        64: "E4.mp3",     // Low Conga → conga-low-1

        65: "F4.mp3",     // High Timbale → timbale-high-1
        66: "Gb4.mp3",    // Low Timbale → timbale-med-1
        67: "G4.mp3",     // High Agogo → agogo-bell-high-1
        68: "Gb4.mp3",    // Low Agogo → timbale-med-1
        69: "G4.mp3",     // Cabasa → agogo-bell-high-1
        70: "Gb3.mp3",    // Maracas → tamborine-1

        71: "B5.mp3",     // Short Whistle → sleigh-bells-1
        72: "C5.mp3",     // Long Whistle → whistle-2
        73: "Bb5.mp3",    // Short Guiro → shaker-2
        74: "D5.mp3",     // Long Guiro → guiro-run-1
        75: "Db5.mp3",    // Claves → guiro-tap-1
        76: "Eb5.mp3",     // High Wood Block → clave-1
        77: "F5.mp3",     // Low Wood Block → woodblock-low-1

        78: "G5.mp3",     // Mute Cuica → cuica-low-1
        79: "Gb5.mp3",    // Open Cuica → cuica-high-1
        80: "C6.mp3",     // Mute Triangle → chimes-1
        81: "D6.mp3",     // Open Triangle → concert-tom-1
        82: "Db6.mp3",    // Shaker / Castanets → castanets-1
        83: "Eb6.mp3",    // Jingle Bell → concert-tom-2
    },
    {
      baseUrl: "/drums/"
    }
  ).toDestination();

  await Tone.loaded();
  return sampler;
}

export async function startAudioContext() {
  if (!started) {
    await Tone.start();
    started = true;
  }
}

export async function playDrumPattern(events: DrumEvent[]) {
  if (!sampler) {
    await initDrumSampler();
  }
  await startAudioContext();

  const now = Tone.now();

  events.forEach((ev) => {
    const note = ev.midi.toString(); // Sampler keys are MIDI numbers as strings
    const vel = ev.velocity ?? 0.1;
    sampler!.triggerAttackRelease(note, "8n", now + ev.time, vel);
  });
}
