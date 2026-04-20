/**
 * sampleMap.ts
 *
 * Contains the list of available drum and percussion instruments,
 * including sample file mapping and the human-readable display name.
 * The instrument key is used throughout the drum machine as a unique
 * identifier for selecting instruments and loading sample audio.
 */
export interface DrumInstrument {
  key: string
  file: string
  name: string
}

export const instrumentList: DrumInstrument[] = [
  { key: 'A1', file: 'A1.mp3', name: 'Metronome Accent' },
  { key: 'Ab1', file: 'Ab1.mp3', name: 'Metronome Sub' },
  { key: 'B1', file: 'B1.mp3', name: 'Kick 1' },
  { key: 'C2', file: 'C2.mp3', name: 'Kick 2' },
  { key: 'Ab2', file: 'Ab2.mp3', name: 'Hi-Hat Closed 1' },
  { key: 'Gb2', file: 'Gb2.mp3', name: 'Hi-Hat Closed 2' },
  { key: 'Bb2', file: 'Bb2.mp3', name: 'Hi-Hat Open 1' },
  { key: 'D2', file: 'D2.mp3', name: 'Snare 1' },
  { key: 'E2', file: 'E2.mp3', name: 'Snare 2' },
  { key: 'Db2', file: 'Db2.mp3', name: 'Cross-Stick 1' },
  { key: 'G1', file: 'G1.mp3', name: 'Stick Click' },
  { key: 'D3', file: 'D3.mp3', name: 'Hi Tom' },
  { key: 'B2', file: 'B2.mp3', name: 'Mid Tom' },
  { key: 'C3', file: 'C3.mp3', name: 'Mid Tom 2' },
  { key: 'A2', file: 'A2.mp3', name: 'Floor Tom 2' },
  { key: 'F2', file: 'F2.mp3', name: 'Floor Tom 3' },
  { key: 'G2', file: 'G2.mp3', name: 'Floor Tom 4' },
  { key: 'B3', file: 'B3.mp3', name: 'Ride 1' },
  { key: 'Eb3', file: 'Eb3.mp3', name: 'Ride 2' },
  { key: 'F3', file: 'F3.mp3', name: 'Ride Bell' },
  { key: 'A3', file: 'A3.mp3', name: 'Crash 1' },
  { key: 'Db3', file: 'Db3.mp3', name: 'Crash 2' },
  { key: 'E1', file: 'E1.mp3', name: 'China 1' },
  { key: 'E3', file: 'E3.mp3', name: 'China 2' },
  { key: 'G3', file: 'G3.mp3', name: 'Splash' },
  { key: 'Eb2', file: 'Eb2.mp3', name: 'Clap' },
  { key: 'Bb1', file: 'Bb1.mp3', name: 'Triangle' },
  { key: 'F1', file: 'F1.mp3', name: 'Flub Drum 1' },
  { key: 'Gb1', file: 'Gb1.mp3', name: 'Flub Drum 2' },
  { key: 'Ab3', file: 'Ab3.mp3', name: 'Cowbell' },
  { key: 'Bb3', file: 'Bb3.mp3', name: 'Vibroslap' },
  { key: 'Gb3', file: 'Gb3.mp3', name: 'Tambourine' },
  { key: 'B4', file: 'B4.mp3', name: 'Whistle 1' },
  { key: 'Bb4', file: 'Bb4.mp3', name: 'Shaker 1' },
  { key: 'C4', file: 'C4.mp3', name: 'Bongo High' },
  { key: 'D4', file: 'D4.mp3', name: 'Bongo Mid' },
  { key: 'Db4', file: 'Db4.mp3', name: 'Bongo Low' },
  { key: 'E4', file: 'E4.mp3', name: 'Conga Low' },
  { key: 'Eb4', file: 'Eb4.mp3', name: 'Conga High' },
  { key: 'F4', file: 'F4.mp3', name: 'Timbale High' },
  { key: 'G4', file: 'G4.mp3', name: 'Agogo Bell' },
  { key: 'Gb4', file: 'Gb4.mp3', name: 'Timbale Mid' },
  { key: 'B5', file: 'B5.mp3', name: 'Sleigh Bells' },
  { key: 'Bb5', file: 'Bb5.mp3', name: 'Shaker 2' },
  { key: 'C5', file: 'C5.mp3', name: 'Whistle 2' },
  { key: 'D5', file: 'D5.mp3', name: 'Guiro Run' },
  { key: 'Db5', file: 'Db5.mp3', name: 'Guiro Tap' },
  { key: 'E5', file: 'E5.mp3', name: 'Woodblock Mid' },
  { key: 'Eb5', file: 'Eb5.mp3', name: 'Clave' },
  { key: 'F5', file: 'F5.mp3', name: 'Woodblock Low' },
  { key: 'G5', file: 'G5.mp3', name: 'Cuica Low' },
  { key: 'Gb5', file: 'Gb5.mp3', name: 'Cuica High' },
  { key: 'C6', file: 'C6.mp3', name: 'Chimes' },
  { key: 'D6', file: 'D6.mp3', name: 'Concert Tom 1' },
  { key: 'Db6', file: 'Db6.mp3', name: 'Castanets' },
  { key: 'Eb6', file: 'Eb6.mp3', name: 'Concert Tom 2' },
]

export const sampleFiles = Object.fromEntries(
  instrumentList.map((instrument) => [instrument.key, instrument.file]),
) as Record<string, string>
