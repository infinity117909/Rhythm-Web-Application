# Rhythm Application — Project Documentation

> Generated: May 1, 2026

---

## Table of Contents

1. [Summary](#1-summary)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Application Sections & Routes](#4-application-sections--routes)
5. [Data & File Structures](#5-data--file-structures)
6. [Functions, Classes, and Methods](#6-functions-classes-and-methods)
7. [Backend — NestJS Server](#7-backend--nestjs-server)
8. [Database Schema](#8-database-schema)
9. [Audio Architecture](#9-audio-architecture)
10. [Key Architectural Patterns](#10-key-architectural-patterns)

---

## 1. Summary

The **Rhythm Application** is a full-stack web application for music rhythm education, visualization, and interactive tools. It is designed to teach rhythmic concepts ranging from basic time signatures to complex polyrhythms, across a wide range of musical genres.

The application is divided into three main feature areas, accessible from a home page pie-chart navigation:

| Section | Purpose |
|---|---|
| **Education** | Interactive lessons on rhythm theory and music genres (jazz, rock, hip-hop, etc.) |
| **Visualization** | Visual tools for rhythm patterns, a metronome, and a DVD-style polyrhythm visualizer |
| **Games** | Interactive tools including a step-sequencer drum machine and a YouTube-based drum challenge |

The frontend is a **React + TypeScript** single-page application built with Vite. The backend is a **NestJS** REST API backed by a **PostgreSQL** database managed through **Prisma ORM**.

---

## 2. Technology Stack

### Frontend (`app/`)

| Dependency | Version | Role |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 5 | Type safety |
| Vite | 7 | Build tool & dev server |
| TanStack Router | 1 | File-based SPA routing |
| TanStack Query | 5 | Server-state data fetching |
| Tone.js | 15 | Web Audio scheduling & synthesis |
| OpenSheetMusicDisplay (OSMD) | 1.9 | MusicXML score rendering |
| VexFlow | 5 | Programmatic music notation rendering |
| Tailwind CSS | 4 | Utility-first styling |
| better-react-mathjax | 3 | Math equation rendering |
| react-youtube | 10 | YouTube IFrame API wrapper |
| lucide-react | — | Icon library |

### Backend (`server/`)

| Dependency | Version | Role |
|---|---|---|
| NestJS | 11 | Node.js server framework |
| Prisma | 7 | ORM + migrations |
| PostgreSQL | — | Relational database |
| Faker.js | 10 | Seed data generation |

### Dev / Build

| Tool | Role |
|---|---|
| Vitest | Unit testing |
| ESLint + Prettier | Linting & formatting |
| jsdom | DOM emulation in tests |

---

## 3. Project Structure

```
app/
├── public/
│   ├── index.html
│   ├── drums/              # MP3 drum sample files (FatBoy soundfont)
│   └── scores/             # MusicXML score files
│       └── index.json      # Score catalog
├── src/
│   ├── main.tsx            # App entry point
│   ├── router.tsx          # TanStack Router setup
│   ├── routes/             # File-based page routes
│   │   ├── __root.tsx      # Root layout (HTML shell)
│   │   ├── index.tsx       # Home "/" layout + HomeNavbar
│   │   ├── education/      # /education section
│   │   ├── visualization/  # /visualization section
│   │   └── games/          # /games section
│   ├── components/
│   │   ├── audio/          # Tone.js sample loading component
│   │   ├── notation/       # OSMD / VexFlow rendering components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── Navbars.tsx     # All navigation bar components
│   │   └── MetronomeController.tsx
│   ├── lib/
│   │   ├── rhythm/         # Core drum/rhythm domain types & converters
│   │   │   ├── types.ts
│   │   │   └── converters/
│   │   │       ├── toToneEvents.ts
│   │   │       └── toVexFlow.ts
│   │   ├── audio/
│   │   │   └── loadSamples.ts
│   │   ├── BPMCursorController.ts
│   │   └── toneDrums.ts
│   ├── drum-machine/
│   │   ├── DrumMachine.tsx
│   │   ├── ToneExportButton.tsx
│   │   └── sampleMap.ts
│   ├── metronome/
│   │   ├── Metronome.tsx
│   │   └── MetronomeContext.tsx
│   ├── musicxml/
│   │   ├── parseMusicXML.ts
│   │   ├── extractDrumNotes.ts
│   │   ├── drumPlaybackEngine.ts
│   │   ├── loadMusicXML.ts
│   │   ├── useMusicXML.ts
│   │   └── instrumentToMidi.ts
│   ├── utils/
│   │   ├── DrumEngine.ts   # Global audio singleton
│   │   └── MIDIMapper.ts   # MIDI number → sample key mapping
│   └── data/
│       └── demo.punk-songs.ts
└── server/
    ├── src/
    │   ├── main.ts
    │   ├── app.module.ts
    │   ├── lessons/        # Lessons feature module
    │   └── topics/         # Topics feature module
    └── prisma/
        ├── schema.prisma
        └── seed.ts
```

---

## 4. Application Sections & Routes

### Home (`/`)

The root layout renders `<HomeNavbar>` — an SVG pie-chart with three interactive sectors that link to the three main sections.

| Sector | Color | Route |
|---|---|---|
| Education | Teal | `/education` |
| Visualization | Blue | `/visualization` |
| Games | Purple | `/games` |

---

### Education (`/education`)

Layout: `EducationNavbar` (sticky, scroll-based opacity fade).

| Route | Component | Description |
|---|---|---|
| `/education` | `index.tsx` | Landing page describing the four sub-sections |
| `/education/theory` | `rhythm-education.tsx` | Rhythm theory content |
| `/education/genres` | `genres/index.tsx` | Genre overview with anatomy explanation |
| `/education/genres/jazz` | `jazz/` | Jazz genre deep-dive |
| `/education/genres/hip-hop` | `hip-hop/` | Hip-hop genre deep-dive |
| `/education/genres/classic-rock` | `classic-rock/` | Classic rock genre deep-dive |
| `/education/genres/edm` | `edm/` | Electronic dance music |
| `/education/genres/metal` | `metal/` | Metal genre |
| `/education/genres/pop` | `pop/` | Pop genre |
| `/education/genres/prog` | `prog/` | Progressive rock/metal |
| `/education/genres/punk-rock` | `punk-rock/` | Punk rock |
| `/education/genres/afro-cuban` | `afro-cuban/` | Afro-Cuban rhythm traditions |
| `/education/genres/Glossary` | `Glossary.tsx` | Rhythm & genre glossary |

---

### Visualization (`/visualization`)

Layout: `VisualizationNavbar`.

| Route | Component | Description |
|---|---|---|
| `/visualization` | `index.tsx` | Landing page for all visualization tools |
| `/visualization/rhythms` | `RhythmIndex.tsx` | MusicXML score browser + drum playback |
| `/visualization/rhythms/$rhythmId` | `$rhythmId.tsx` | Individual score viewer (dynamic route) |
| `/visualization/metronome` | `metronome.tsx` | Full metronome with three visual modes |
| `/visualization/osmd-parser` | `osmd-parser.tsx` | OSMD parsing debug page |
| `/visualization/DVD-Polyrhythm-Visualizer` | `DvdPolyrhythmVisualizer.tsx` | Polyrhythm visualizer |

---

### Games (`/games`)

Layout: `GameNavbar`.

| Route | Component | Description |
|---|---|---|
| `/games` | `index.tsx` | Landing page |
| `/games/drum-machine` | `DrumMachine.tsx` | Interactive step-sequencer |
| `/games/whitney-houston-challenge` | `YouTubeTomDetector` | YouTube challenge with drum timing detection |

---

## 5. Data & File Structures

### `DrumNote` — Core Note Representation

```typescript
// src/lib/rhythm/types.ts

export type DrumInstrument =
  | "kick"
  | "snare"
  | "hihat"
  | "tom"
  | "ride"
  | "crash";

export interface DrumNote {
  time: number;       // Beat offset in quarter-note units. e.g. 1.5 = beat 1 + eighth note
  duration: number;   // Duration in seconds or musical units depending on context
  instrument: DrumInstrument;
  velocity?: number;  // 0.0 – 1.0, optional accent control
}
```

**Example:**
```typescript
const note: DrumNote = {
  time: 2.5,           // Half-way through beat 2
  duration: 0.1,
  instrument: "snare",
  velocity: 0.8
};
```

---

### `DrumPattern` — Full Pattern Structure

```typescript
export interface DrumPattern {
  id: string;
  title: string;
  bpm: number;
  notes: DrumNote[];
}
```

**Example:**
```typescript
const basicRock: DrumPattern = {
  id: "basic-rock",
  title: "Basic Rock Beat",
  bpm: 120,
  notes: [
    { time: 0,   duration: 0.1, instrument: "kick" },
    { time: 1,   duration: 0.1, instrument: "snare" },
    { time: 2,   duration: 0.1, instrument: "kick" },
    { time: 3,   duration: 0.1, instrument: "snare" },
    { time: 0,   duration: 0.05, instrument: "hihat" },
    { time: 0.5, duration: 0.05, instrument: "hihat" },
  ]
};
```

---

### `ToneEvent` — Transport-Scheduled Audio Event

```typescript
// src/lib/rhythm/converters/toToneEvents.ts

export interface ToneEvent {
  time: string;       // Tone.js transport format: "measure:beat:sixteenth", e.g. "0:1:2"
  instrument: string;
  duration: number;
  velocity?: number;
}
```

**Example:**
```typescript
// DrumNote { time: 1.5 } → ToneEvent { time: "0:1:2" }
// 1.5 beats = beat 1 + 0.5 subdivisions = beat 1 + 2 sixteenth notes
const event: ToneEvent = {
  time: "0:1:2",
  instrument: "snare",
  duration: 0.1,
  velocity: 0.8
};
```

---

### `VexMeasure` — Sheet Music Measure

```typescript
// src/lib/rhythm/converters/toVexFlow.ts

export interface VexMeasure {
  index: number;
  notes: StaveNote[];       // VexFlow StaveNote objects
  beams: Beam[];            // VexFlow Beam objects for grouping flags
  uniqueTimes: number[];    // Unique beat times in the measure
}
```

---

### `DrumInstrument` (Drum Machine) — Sample Catalog Entry

```typescript
// src/drum-machine/sampleMap.ts

export interface DrumInstrument {
  key: string;    // Sample key matching soundfont filename, e.g. "B1", "D2"
  file: string;   // MP3 filename, e.g. "B1.mp3"
  name: string;   // Human-readable name, e.g. "Bass Drum 1"
}
```

**Example entries from `instrumentList`:**
```typescript
const instrumentList: DrumInstrument[] = [
  { key: "B1",  file: "B1.mp3",  name: "Bass Drum 1" },
  { key: "D2",  file: "D2.mp3",  name: "Acoustic Snare" },
  { key: "Gb2", file: "Gb2.mp3", name: "Closed Hi-Hat" },
  { key: "Ab2", file: "Ab2.mp3", name: "Pedal Hi-Hat" },
  { key: "Bb2", file: "Bb2.mp3", name: "Open Hi-Hat" },
  // ... 52 more entries
];
```

---

### `DRUM_MIDI_TO_SAMPLE` — MIDI-to-Sample Key Map

```typescript
// src/utils/MIDIMapper.ts

export const DRUM_MIDI_TO_SAMPLE: Record<number, string> = {
  35: "B1",   // Bass Drum 2
  36: "C2",   // Bass Drum 1
  38: "D2",   // Acoustic Snare
  42: "Gb2",  // Closed Hi-Hat
  46: "Bb2",  // Open Hi-Hat
  49: "Db3",  // Crash Cymbal 1
  51: "Eb3",  // Ride Cymbal 1
  // ... full GM percussion map (35–92)
};
```

---

### `DrumSampleMap` — Tone.js Player Pool

```typescript
// src/lib/audio/loadSamples.ts

export type DrumSampleMap = Record<string, Tone.Player[]>;

// Example structure after loadDrumSamples():
const map: DrumSampleMap = {
  "kick":  [Player, Player, Player],   // 3-player pool for polyphony
  "snare": [Player, Player, Player],
  "hihat": [Player, Player, Player],
};
```

---

### `DrumEvent` — OSMD-Derived Playback Event

```typescript
// src/lib/toneDrums.ts

export type DrumEvent = {
  time: number;      // Absolute seconds from playback start
  midi: number;      // GM MIDI percussion note number (35–92)
  velocity?: number;
};
```

**Example:**
```typescript
const events: DrumEvent[] = [
  { time: 0.0,  midi: 36, velocity: 1.0 },   // Kick on beat 1
  { time: 0.5,  midi: 42, velocity: 0.7 },   // Hi-hat on the "and"
  { time: 1.0,  midi: 38, velocity: 0.9 },   // Snare on beat 2
];
```

---

### `TimeSignature` — Metronome Context

```typescript
// src/metronome/MetronomeContext.tsx

export interface TimeSignature {
  beats: number;      // Numerator:   e.g. 4 for 4/4
  noteValue: number;  // Denominator: e.g. 4 for quarter note
}
```

---

### `OptionType` — Generic Select Option

```typescript
// src/lib/rhythm/types.ts

export interface OptionType {
  label: string;   // Display text
  value: string;   // Internal value
}
```

---

### MusicXML Score Catalog (`public/scores/index.json`)

The scores directory contains an `index.json` catalog that the `RhythmSelect` dropdown reads to populate the score chooser.

**Available MusicXML scores:**
```
Basic Swing (2 – 4 Feel).musicxml
Big Band Swing.musicxml
Bossa Nova Rhumba Clave (2 + 3).musicxml
Bossa Nova Rhumba Clave (3 + 2).musicxml
Bossa Nova Son Clave (2 + 3).musicxml
Bossa Nova Son Clave (3 + 2).musicxml
Brazillian Bossa Nova.musicxml
Four On The Floor.musicxml
Mambo.musicxml
Standard Rock Groove.musicxml
WholeNote.musicxml
```

---

### Drum Machine Step-Sequencer State

The `DrumMachine` component manages the following core state shape:

```typescript
// src/drum-machine/DrumMachine.tsx (state shape)

const [pattern, setPattern]     = useState<boolean[][]>([]);
// Rows = instruments, Columns = steps
// pattern[rowIndex][stepIndex] = true means that cell is active

const [muteStates, setMuteStates]     = useState<boolean[]>([]);
// muteStates[rowIndex] = true means that instrument row is muted

const [volumeStates, setVolumeStates] = useState<number[]>([]);
// volumeStates[rowIndex] = 0.0–1.0 volume multiplier per row

const [selectedInstrumentKeys, setSelectedInstrumentKeys] = useState<string[]>([]);
// Array of sampleMap keys for currently loaded instruments

const [measures, setMeasures]         = useState<number>(1);
const [subdivisions, setSubdivisions] = useState<number>(16);
const [bpm, setBpm]                   = useState<number>(120);
const [tempoMode, setTempoMode]       = useState<"half" | "normal" | "double">("normal");
```

---

### Prisma Database Models

```prisma
// server/prisma/schema.prisma

model Topic {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  era         String?
  region      String?
  lessons     Lesson[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Lesson {
  id          Int        @id @default(autoincrement())
  title       String
  summary     String?
  difficulty  Difficulty
  orderIndex  Int
  topic       Topic      @relation(fields: [topicId], references: [id])
  topicId     Int
  sections    Section[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model Section {
  id          Int         @id @default(autoincrement())
  title       String
  contentType ContentType
  bodyText    String?
  orderIndex  Int
  lesson      Lesson      @relation(fields: [lessonId], references: [id])
  lessonId    Int
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

enum Difficulty  { beginner  intermediate  advanced }
enum ContentType { text  audio  video }
```

---

## 6. Functions, Classes, and Methods

---

### `DrumEngine` class — `src/utils/DrumEngine.ts`

Global singleton for triggering drum samples. Initialized once via `<LoadFile>` and accessed everywhere without prop-drilling.

```typescript
class DrumEngine {
  players: Tone.Players | null = null;

  setPlayers(players: Tone.Players): void
  // Registers a loaded Tone.Players instance.

  play(note: string, volumeMultiplier?: number): void
  // Triggers the named sample player.
  // note: sample key string (e.g. "B1", "D2")
  // volumeMultiplier: 0.0–1.0, defaults to 1.0
}

export const drumEngine: DrumEngine   // Pre-constructed singleton
```

---

### `BPMCursorController` class — `src/lib/BPMCursorController.ts`

Drives OSMD cursor playback synchronized to a live BPM clock.

```typescript
class BPMCursorController {
  constructor(osmd: OpenSheetMusicDisplay, sheet: object)

  start(): void
  // Resets cursor to beginning. Starts a setInterval at (60000 / bpm / 2) ms.
  // On each tick: reads NotesUnderCursor(), resolves MIDI, calls drumEngine.play().

  stop(): void
  // Clears the playback interval.

  setBPM(bpm: number): void
  // Updates the internal BPM. Restarts the interval if currently playing.

  setLoop(loop: boolean): void
  // Enables/disables cursor looping back to measure 1 at end of score.

  private getToneNotesFromCursor(): void
  // Reads current OSMD cursor notes → resolves sub-instrument fixedKey → MIDI
  // → DRUM_MIDI_TO_SAMPLE key → drumEngine.play(key, accentMultiplier)
}
```

---

### `patternToToneEvents()` — `src/lib/rhythm/converters/toToneEvents.ts`

Converts internal beat-offset `DrumNote[]` to Tone.js transport-format strings.

```typescript
function patternToToneEvents(pattern: DrumPattern): ToneEvent[]

// Input:  DrumNote { time: 1.5, instrument: "snare", duration: 0.1 }
// Output: ToneEvent { time: "0:1:2", instrument: "snare", duration: 0.1 }
//
// Conversion logic:
//   beat        = Math.floor(time)         → 1
//   subdivision = time % 1                 → 0.5
//   sixteenth   = Math.round(sub * 4)      → 2
//   toneTime    = `0:${beat}:${sixteenth}` → "0:1:2"
```

---

### `patternToVexFlowMeasures()` — `src/lib/rhythm/converters/toVexFlow.ts`

Converts a `DrumPattern` into grouped VexFlow notation objects per measure.

```typescript
function patternToVexFlowMeasures(
  pattern: DrumPattern,
  beatsPerMeasure: number
): VexMeasure[]
// Groups notes by measure, builds StaveNote objects with proper chord stacking
// and returns VexFlow Beam objects for correct flag rendering.

function patternToVexFlowNotes(pattern: DrumPattern): StaveNote[]
// Flat note list (no measure grouping). Cymbal/hi-hat noteheads are rendered as "x".

const DRUM_MAP: Record<DrumInstrument, { key: string; notehead?: "x" }>
// Maps DrumInstrument to VexFlow staff position key and optional x-notehead.
// Example: "hihat" → { key: "a/5", notehead: "x" }
```

---

### `loadDrumSamples()` — `src/lib/audio/loadSamples.ts`

Creates a polyphonic pool of Tone.js Players per instrument.

```typescript
async function loadDrumSamples(poolSize?: number): Promise<DrumSampleMap>
// poolSize defaults to 3 — creates 3 Tone.Player instances per instrument
// so that rapid re-triggers of the same drum don't cut off previous hits.
// Samples are loaded from: http://localhost:8080/samples/soundfonts/FatBoy/
// Waits for all buffers to load via Tone.loaded() before resolving.
```

---

### `initDrumSampler()` — `src/lib/toneDrums.ts`

Creates a singleton `Tone.Sampler` keyed by GM MIDI percussion numbers.

```typescript
async function initDrumSampler(): Promise<Tone.Sampler>
// Builds a Sampler with note mappings for MIDI 35–92 covering all GM percussion.
// Base URL: "/drums/" (served from public/drums/).
// Returns the same instance on subsequent calls (singleton pattern).

async function startAudioContext(): Promise<void>
// Calls Tone.start() to unlock the Web Audio context (required after user gesture).

async function playDrumPattern(events: DrumEvent[]): Promise<void>
// Schedules all DrumEvent[] via sampler.triggerAttackRelease()
// with time offsets from Tone.now().
```

---

### `parseMusicXML()` — `src/musicxml/parseMusicXML.ts`

```typescript
function parseMusicXML(xmlString: string): Document
// Parses a MusicXML string into a browser DOM Document using DOMParser.
```

---

### `extractDrumNotes()` — `src/musicxml/extractDrumNotes.ts`

```typescript
type DrumNote = { instrumentId: string | null; durationDivisions: number }

function extractDrumNotes(xml: Document): DrumNote[]
// Iterates <note> elements in the MusicXML Document.
// Skips rests. Returns instrumentId + durationDivisions for each note.
```

---

### `loadMusicXML()` — `src/musicxml/loadMusicXML.ts`

```typescript
async function loadMusicXML(filePath: string): Promise<string | null>
// Fetches a MusicXML file from a URL and returns its text content.
// Returns null on fetch failure.
```

---

### `useMusicXML()` — `src/musicxml/useMusicXML.ts`

```typescript
function useMusicXML(filePath: string): {
  xml: Document | null;     // Parsed DOM Document
  raw: string | null;       // Raw XML string
  loading: boolean;
  error: string | null;
}
// React hook: composes loadMusicXML + parseMusicXML.
// Re-runs when filePath changes.
```

---

### `playMusicXMLDrums()` — `src/musicxml/drumPlaybackEngine.ts`

```typescript
function playMusicXMLDrums(xml: Document): void
// Orchestrates end-to-end MusicXML drum playback:
//   1. Reads <divisions> and <sound tempo> from the XML document
//   2. Calls extractDrumNotes() to get the note sequence
//   3. Resolves each instrumentId → MIDI (via INSTRUMENT_ID_TO_MIDI)
//      then MIDI → sampleKey (via DRUM_MIDI_TO_SAMPLE)
//   4. Schedules each note with Tone.Transport.scheduleOnce + drumEngine.play()
```

---

### `MetronomeProvider` / `useMetronome()` — `src/metronome/MetronomeContext.tsx`

```typescript
// Provider component — wraps your subtree to expose metronome state.
function MetronomeProvider({ children }: { children: React.ReactNode }): JSX.Element

// Hook — access the full metronome context anywhere inside the provider.
function useMetronome(): MetronomeContextValue
```

**`MetronomeContextValue` properties:**

| Property / Method | Type | Description |
|---|---|---|
| `bpm` | `number` | Current beats per minute |
| `timeSignature` | `TimeSignature` | `{ beats, noteValue }` |
| `currentBeat` | `number` | 0-based beat index in the current measure |
| `currentPolyBeat` | `number` | 0-based polyrhythm layer beat index |
| `isPlaying` | `boolean` | Whether the metronome is running |
| `isAudioEnabled` | `boolean` | Whether Web Audio context is unlocked |
| `metronomeType` | `MetronomeType` | `'Block Beat' \| 'Pulse' \| 'Pendulum'` |
| `metronomeTypeIndex` | `number` | Index of current type (0–2) |
| `isPolyrhythmEnabled` | `boolean` | Whether second polyrhythm layer is active |
| `polyrhythmValue` | `number` | Number of beats in the polyrhythm layer |
| `setBpm(bpm)` | function | Update BPM |
| `setTimeSignature(ts)` | function | Update time signature |
| `play()` | function | Start playback |
| `pause()` | function | Pause without reset |
| `stop()` | function | Stop and reset to beat 1 |
| `restart()` | function | Stop then immediately play |
| `cycleType()` | function | Advance to the next visualizer type |
| `enableAudio()` | function | Unlock Web Audio context |
| `setIsPolyrhythmEnabled(v)` | function | Toggle polyrhythm layer |
| `setPolyrhythmValue(v)` | function | Set polyrhythm division count |

**Scheduling internals:**

The `scheduleMeasureLoop` function uses `Tone.getTransport().scheduleRepeat` to fire in the audio thread ahead of time (look-ahead scheduling), then `Tone.getDraw().schedule` to synchronize React state updates with the audio events for accurate visual beat highlighting.

The polyrhythm layer is scheduled independently by dividing the total measure duration by `polyrhythmValue`.

---

### `LoadFile` component — `src/components/audio/Tone.tsx`

```typescript
function LoadFile({ audioUrl }: { audioUrl: string }): null
// Creates a Tone.Players instance with all 57 drum samples from DRUM_SAMPLES map.
// Calls drumEngine.setPlayers(players) to register the singleton.
// Renders nothing visible.
```

---

### `DrumMachine` component — `src/drum-machine/DrumMachine.tsx`

```typescript
export default function DrumMachine(): JSX.Element
// Full step-sequencer component wrapped in QueryClientProvider.

// Key internal functions:
function createEmptyPattern(rows: number, cols: number): boolean[][]
// Returns a rows×cols 2D array filled with false.

function handlePresetChange(preset: "small" | "large" | "latin"): void
// Loads a preset instrument kit (drumKitPresets) and resets the pattern grid.

// Playback uses Tone.Transport.scheduleRepeat:
//   stepDurationSeconds = (4 * 60 / effectiveBpm) / subdivisions
//   effectiveBpm = bpm * (tempoMode multiplier)
//   For each active pattern[row][step]: player.start(time)
```

---

### `ToneExportButton` component — `src/drum-machine/ToneExportButton.tsx`

```typescript
interface ToneExportButtonProps {
  bpm: number;
  measures: number;
  subdivisions: number;
  tempoMode: "half" | "normal" | "double";
  pattern: boolean[][];
  selectedInstruments: DrumInstrument[];
  selectedSampleFiles: Record<string, string>;
  muteStates: boolean[];
  volumeStates: number[];
}

// Key internal functions:

function audioBufferToWavBlob(audioBuffer: AudioBuffer): Blob
// Encodes an AudioBuffer as a 16-bit PCM WAV file from scratch.
// Writes the RIFF/WAVE header manually, then interleaves L/R channel samples.

async function decodeSampleBuffers(
  sampleFiles: Record<string, string>
): Promise<Record<string, AudioBuffer>>
// Fetches each MP3 from /drums/ and decodes it with AudioContext.decodeAudioData().

async function handleExport(): Promise<void>
// 1. Builds OfflineAudioContext at 44100 Hz for the full pattern duration
// 2. Schedules each active step per instrument
// 3. Calls offlineCtx.startRendering()
// 4. Converts result to WAV via audioBufferToWavBlob()
// 5. Saves via showSaveFilePicker (if supported) or anchor-download fallback

function saveBlobToFile(blob: Blob, fileName: string): Promise<void>
// Uses File System Access API showSaveFilePicker if available;
// otherwise creates a temporary <a> element and triggers a browser download.
```

---

### Notation Components — `src/components/notation/`

#### `ParseXML` / `LoadMusicXMLShort`

```typescript
// src/components/notation/ParseXML.tsx

export default function ParseXML({ filePath }: { filePath: string }): JSX.Element
// Full score renderer: OSMD viewer + BPMCursorController playback controls.
// Controls: Play, Stop, Loop toggle, BPM slider.

export function LoadMusicXMLShort({ filePath }: { filePath: string }): JSX.Element
// Inline score renderer without title or full controls.
```

#### `RhythmSelect` / `Dropdown`

```typescript
// src/components/notation/RhythmSelect.tsx

function Dropdown({ options, onValueUpdate }: DropdownProps): JSX.Element
// Fetches /scores/index.json, renders a <select> element.
// On selection: mounts <LoadFile> + <ParseXML> for the chosen score.
```

#### `MusicPlayer`

```typescript
// src/components/notation/MusicPlayer.tsx
// OSMD viewer with cursor-driven playback.
// Uses getDrumMidiFromGraphicalNote() → DRUM_MIDI_TO_SAMPLE → drumEngine.play()
```

---

### `initYouTubePlayer()` — `src/components/hooks/initYouTubePlayer.ts`

```typescript
function initYouTubePlayer(
  event: YT.PlayerEvent,
  options: { width: number; height: number }
): YT.Player
// YouTube IFrame API onReady callback.
// Resizes the player iframe to the given dimensions and returns the player instance.
```

---

### Navigation Components — `src/components/Navbars.tsx`

```typescript
export function HomeNavbar(): JSX.Element
// SVG pie-chart with three interactive arc sectors.
// Clicking a sector navigates via TanStack Router Link.

export function EducationNavbar(): JSX.Element
// Sticky horizontal nav bar. Fades in on scroll using IntersectionObserver.
// Links: Education Home, Theory, Genres.

export function GenresSideNav(): JSX.Element
// Fixed left sidebar listing all genre sub-routes.

export function GenresFooterNav(): JSX.Element
// Horizontal footer navigation for the genres section.
```

---

## 7. Backend — NestJS Server

The server runs on **`localhost:3001`** with CORS enabled.

### Module Structure

```
server/src/
├── main.ts                 # Bootstrap: creates NestJS app, enables CORS, listens on 3001
├── app.module.ts           # Root module importing LessonsModule + TopicsModule
├── app.controller.ts       # Health check: GET /
├── app.service.ts          # Returns "Hello World!"
├── prisma.module.ts        # Global Prisma module
├── prisma.service.ts       # PrismaClient wrapper as an Injectable service
├── lessons/
│   ├── lessons.module.ts
│   ├── lessons.controller.ts   # GET /lessons → getLessonById()
│   └── lessons.service.ts      # Returns hardcoded lesson (Prisma methods commented out)
└── topics/
    ├── topics.module.ts
    ├── topics.controller.ts    # No routes currently defined
    └── topics.service.ts       # Empty service
```

### API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | Health check — returns `"Hello World!"` |
| `GET` | `/lessons` | Returns a single hardcoded lesson object |

> **Note:** Full Prisma-backed CRUD endpoints for Topics and Lessons are implemented in service stubs and commented out, pending full integration.

### Running the Server

```bash
cd server
npm run start:dev    # Development mode with file watching
npm run seed         # Seed the database with Faker.js data
npm run build        # Compile TypeScript to dist/
```

---

## 8. Database Schema

The PostgreSQL database (managed with Prisma) uses a three-tier content model:

```
Topic
 └─ Lesson  (many)
      └─ Section  (many)
```

**Topic** — A thematic grouping (e.g., "Music Genres", "Rhythm Theory")
- `id`, `title`, `description?`, `era?`, `region?`

**Lesson** — A single lesson within a topic
- `id`, `title`, `summary?`, `difficulty` (`beginner` | `intermediate` | `advanced`), `orderIndex`
- Belongs to one `Topic`

**Section** — A content block within a lesson
- `id`, `title`, `contentType` (`text` | `audio` | `video`), `bodyText?`, `orderIndex`
- Belongs to one `Lesson`

### Seed Data

Run `npm run seed` inside `server/` to populate the database using Faker.js:
- Creates **5 Topic** records with random title, description, era, region
- For each topic, creates **10 Lesson** records with random title, difficulty, orderIndex

---

## 9. Audio Architecture

### Sample Storage

Drum samples are served as MP3 files from the FatBoy General MIDI soundfont:

```
server/samples/soundfonts/FatBoy/percussion-mp3/
  B1.mp3    ← Bass Drum 2      (MIDI 35)
  C2.mp3    ← Bass Drum 1      (MIDI 36)
  D2.mp3    ← Acoustic Snare   (MIDI 38)
  Gb2.mp3   ← Closed Hi-Hat    (MIDI 42)
  Bb2.mp3   ← Open Hi-Hat      (MIDI 46)
  Db3.mp3   ← Crash Cymbal 1   (MIDI 49)
  ... (57 total samples)
```

Static samples for the score viewer are also served from:

```
public/drums/
```

### MIDI Resolution Chain

When playing back notes from OSMD scores:

```
OSMD Note (fixedKey / instrumentId)
         ↓
  INSTRUMENT_ID_TO_MIDI  (src/musicxml/instrumentToMidi.ts)
         ↓
  DRUM_MIDI_TO_SAMPLE    (src/utils/MIDIMapper.ts)
         ↓
  drumEngine.play(sampleKey)   (src/utils/DrumEngine.ts)
         ↓
  Tone.Players.player(key).start()
```

### Two Playback Paths

| Path | Used By | Mechanism |
|---|---|---|
| **OSMD Cursor** | `BPMCursorController`, `MusicPlayer` | `setInterval` at `60000/BPM/2` ms; reads notes at each cursor position |
| **Transport Scheduling** | `DrumMachine`, `drumPlaybackEngine` | `Tone.Transport.scheduleRepeat` / `scheduleOnce`; sample-precise scheduling |

### Web Audio Export

`ToneExportButton` uses `OfflineAudioContext` (not the live audio context) to render the drum pattern silently at full speed and export as a 44100 Hz stereo WAV file. The WAV header is written manually using the RIFF/WAVE binary format spec.

---

## 10. Key Architectural Patterns

### 1. Audio Singleton

`drumEngine` (in `src/utils/DrumEngine.ts`) is a module-level singleton. It is initialized once when `<LoadFile>` mounts (loading all 57 samples into `Tone.Players`), then accessed by any module that needs to trigger a drum hit — without prop drilling or React context.

### 2. File-Based Routing

Routes are organized as files in `src/routes/`. TanStack Router auto-generates the route tree. Each section has:
- `route.tsx` — Layout component with that section's navbar
- `index.tsx` — Landing page for the section
- Sub-directories for child routes

### 3. Type-Safe MIDI Mapping

All MIDI-to-sample lookups go through the centralized `DRUM_MIDI_TO_SAMPLE` map in `MIDIMapper.ts`, ensuring consistent sample resolution across all playback paths.

### 4. Pattern Data Model

The drum machine separates **pattern data** (`boolean[][]`) from **rendering** and **audio scheduling**. The same pattern array is shared between:
- The visual step grid (React UI)
- The `Tone.Transport.scheduleRepeat` playback callback
- The `ToneExportButton` offline renderer

### 5. React Context for Metronome State

All metronome state (BPM, beat index, time signature, polyrhythm settings) lives in `MetronomeContext`. Any component in the tree can call `useMetronome()` to read or drive the metronome without prop drilling. Audio scheduling happens inside the provider via Tone.js Transport, and visual state is synced through `Tone.getDraw()` callbacks.

### 6. MusicXML Score Pipeline

```
MusicXML file (public/scores/)
       ↓ loadMusicXML()
  Raw XML string
       ↓ parseMusicXML()
  DOM Document
       ↓ extractDrumNotes() / OSMD render
  Note data
       ↓ drumPlaybackEngine / BPMCursorController
  Audio output
```

---

*End of Documentation*
