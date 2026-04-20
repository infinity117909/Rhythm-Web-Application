import { useEffect, useMemo, useRef, useState } from 'react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import * as Tone from 'tone'
import * as OSMD from 'opensheetmusicdisplay'
/**
 * OSMD Parser Page - MusicXML Drum Loop Builder
 *
 * This component provides a self-contained activity page for parsing MusicXML files
 * and playing back drum patterns using Tone.js. It accepts MIDI instruments directly
 * by calculating MIDI note numbers from MusicXML pitch data and mapping them to
 * drum samples.
 *
 * Key Features:
 * - Parses MusicXML files using OpenSheetMusicDisplay for rendering
 * - Extracts drum events by converting pitch data to MIDI note numbers
 * - Maps MIDI numbers to drum samples from /drums/ directory
 * - Provides audio playback controls with loop functionality
 * - Includes debugging console logs for parsing and playback
 *
 * MIDI Mapping:
 * Uses General MIDI Percussion mapping (MIDI 35-81) for drum instruments.
 * Samples are loaded via Tone.Sampler with MIDI numbers as keys.
 *
 * Parsing Process:
 * 1. Load MusicXML file and parse to DOM
 * 2. Extract tempo, divisions, and measure data
 * 3. For each note, calculate MIDI number from pitch (step, alter, octave)
 * 4. Filter notes to only those with available drum samples
 * 5. Create timed events for Tone.js playback
 * 6. Render notation using OSMD
 *
 * Console Debugging:
 * - Logs pitch to MIDI conversions
 * - Reports parsing progress (measures, events)
 * - Warns about unmapped notes
 * - Shows playback event details
 */

const { OpenSheetMusicDisplay } = OSMD

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      retry: false,
    },
  },
})

/*

59 half tones in midi 
index[8] = C2 kick
index[32] = C4
convert = 32 - 8 = 24 half tones down the octave

index[1] = 
index[49] = F5

*/

const SCORE_INDEX_URL = '/scores/index.json'

/**
 * DRUM_SAMPLES: MIDI number to filename mapping for drum instruments
 * Based on General MIDI Percussion Key Map (MIDI 35-81)
 * Each MIDI number corresponds to a specific drum sound sample
 */
const DRUM_SAMPLES: Record<number, string> = {
  84: 'A1.mp3',   // metronome-click-accent
  85: 'Ab1.mp3',  // metronome-click-sub
  86: 'Bb1.mp3',  // triangle-1
  87: 'E1.mp3',   // china-1
  88: 'Eb1.mp3',  // e-kick-1
  89: 'F1.mp3',   // flub-drum-1
  90: 'G1.mp3',   // stick-click-1
  91: 'Gb1.mp3',  // flub-drum-2
  92: 'A2.mp3',   // floor-tom-2 (alternate)

  // --- General MIDI Percussion (Standard) ---
  35: 'B1.mp3',     // Acoustic Bass Drum
  36: 'C2.mp3',     // Bass Drum 1
  37: 'Db2.mp3',    // Side Stick
  38: 'D2.mp3',     // Acoustic Snare
  39: 'Eb2.mp3',    // Hand Clap
  40: 'E2.mp3',     // Electric Snare

  41: 'B2.mp3',     // Low Floor Tom
  42: 'Gb2.mp3',    // Closed Hi-Hat
  43: 'C3.mp3',     // High Floor Tom
  44: 'Ab2.mp3',    // Pedal Hi-Hat
  45: 'A2.mp3',     // Low Tom
  46: 'Bb2.mp3',    // Open Hi-Hat → hi-hat-open-1

  47: 'F2.mp3',     // Low-Mid Tom
  48: 'G2.mp3',     // Hi-Mid Tom
  49: 'A3.mp3',     // Crash Cymbal 1 → crash-1
  50: 'D3.mp3',     // High Tom → high-tom-1
  51: 'B3.mp3',     // Ride Cymbal 1 → ride-1
  52: 'F3.mp3',     // Chinese Cymbal → ride-bell-1
  53: 'Eb3.mp3',    // Ride Bell → ride-2

  54: 'G3.mp3',     // Tambourine → splash-1
  55: 'Db3.mp3',    // Splash Cymbal → crash-2
  56: 'Ab3.mp3',    // Cowbell → cowbell-1
  57: 'Db3.mp3',    // Crash Cymbal 2 → crash-2
  58: 'Bb3.mp3',    // Vibra Slap → vibroslap-1
  59: 'E3.mp3',     // Ride Cymbal 2 → china-2

  60: 'C4.mp3',     // High Bongo → bongo-high-1
  61: 'D4.mp3',     // Low Bongo → bongo-med-1
  62: 'Db4.mp3',    // Mute High Conga → bongo-low-1
  63: 'Eb4.mp3',    // Open High Conga → conga-high-1
  64: 'E4.mp3',     // Low Conga → conga-low-1

  65: 'F4.mp3',     // High Timbale → timbale-high-1
  66: 'Gb4.mp3',    // Low Timbale → timbale-med-1
  67: 'G4.mp3',     // High Agogo → agogo-bell-high-1
  68: 'Gb4.mp3',    // Low Agogo → timbale-med-1
  69: 'G4.mp3',     // Cabasa → agogo-bell-high-1
  70: 'Gb3.mp3',    // Maracas → tamborine-1

  71: 'B5.mp3',     // Short Whistle → sleigh-bells-1
  72: 'C5.mp3',     // Long Whistle → whistle-2
  73: 'Bb5.mp3',    // Short Guiro → shaker-2
  74: 'D5.mp3',     // Long Guiro → guiro-run-1
  75: 'Db5.mp3',    // Claves → guiro-tap-1
  76: 'Eb5.mp3',    // High Wood Block → clave-1
  77: 'F5.mp3',     // Low Wood Block → woodblock-low-1

  78: 'G5.mp3',     // Mute Cuica → cuica-low-1
  79: 'Gb5.mp3',    // Open Cuica → cuica-high-1
  80: 'C6.mp3',     // Mute Triangle → chimes-1
  81: 'D6.mp3',     // Open Triangle → concert-tom-1
  82: 'Db6.mp3',    // Shaker / Castanets → castanets-1
  83: 'Eb6.mp3',    // Jingle Bell → concert-tom-2
}

const DRUM_SAMPLE_URLS = Object.fromEntries(
  Object.entries(DRUM_SAMPLES).map(([midi, fileName]) => [
    Tone.Frequency(Number(midi), 'midi').toNote(),
    fileName,
  ]),
) as Record<string, string>

type DrumEvent = {
  time: number
  midi: number
  duration: number
  velocity: number
}

type ScorePayload = {
  raw: string
  xml: Document
}

/**
 * Converts MusicXML pitch data to MIDI note number
 * Formula: (octave + 1) * 12 + step_value + alter
 * @param step - Note step (C, D, E, F, G, A, B)
 * @param alter - Alteration (-1 for flat, 0 for natural, 1 for sharp)
 * @param octave - Octave number
 * @returns MIDI note number (0-127)
 */
function pitchToMidi(step: string, alter: number, octave: number): number {
  const stepValues: Record<string, number> = {
    'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11
  }
  const base = stepValues[step.toUpperCase()] ?? 0
  return (octave + 1) * 12 + base + alter
}

/**
 * Extracts MIDI note number from a MusicXML note element
 * Handles both pitched and unpitched notes
 * @param note - MusicXML note element
 * @returns MIDI note number or null if invalid
 */
function getNoteMidi(note: Element): number | null {
    const inst = note.querySelector('instrument')?.getAttribute('id') ?? 'unknown'
    console.log(`Instrument: ${inst}`)
  const pitch = note.querySelector('pitch')
  if (pitch) {
    const step = pitch.querySelector('step')?.textContent?.trim() ?? ''
    const alter = Number(pitch.querySelector('alter')?.textContent?.trim() ?? '0')
    const octave = Number(pitch.querySelector('octave')?.textContent?.trim() ?? '0')
    const midi = pitchToMidi(step, alter, octave)
    console.log(`Pitch: ${step}${alter !== 0 ? (alter > 0 ? '#' : 'b') : ''}${octave}, MIDI: ${midi}`)
    return midi
  }

  const unpitched = note.querySelector('unpitched')
  if (unpitched) {
    const displayStep = unpitched.querySelector('display-step')?.textContent?.trim() ?? ''
    const displayOctave = Number(unpitched.querySelector('display-octave')?.textContent?.trim() ?? '0')
    const step = displayStep || (unpitched.querySelector('step')?.textContent?.trim() ?? '')
    const octave = displayOctave || Number(unpitched.querySelector('octave')?.textContent?.trim() ?? '0')
    const alter = 0 // unpitched usually no alter
    const midi = pitchToMidi(step, alter, octave)
    console.log(`Unpitched: ${step}${octave}, MIDI: ${midi}`)
    return midi
  }

  return null
}

function parseTempo(xml: Document) {
  const tempoSound = xml.querySelector('sound[tempo]')
  if (tempoSound) {
    const tempoValue = tempoSound.getAttribute('tempo')
    if (tempoValue) return Number(tempoValue)
  }

  const perMinute = xml.querySelector('per-minute')?.textContent
  if (perMinute) return Number(perMinute)

  const metronome = xml.querySelector('direction[type=metronome] metronome per-minute')?.textContent
  if (metronome) return Number(metronome)

  return 120
}

function parseMeasureBeats(measure: Element) {
  const beats = Number(measure.querySelector('time > beats')?.textContent ?? '4')
  const beatType = Number(measure.querySelector('time > beat-type')?.textContent ?? '4')
  return beats * (4 / beatType)
}

/**
 * Parses MusicXML document and extracts drum events for playback
 * Converts note timing to seconds and maps pitches to MIDI numbers
 * Only includes notes that have corresponding drum samples
 * @param xml - Parsed MusicXML document
 * @returns Object containing events array, duration, missing notes, and tempo
 */
function buildDrumEvents(xml: Document) {
  console.log('Building drum events from MusicXML')
  const divisions = Number(xml.querySelector('divisions')?.textContent ?? '1') || 1
  const tempo = parseTempo(xml)
  const secondsPerQuarter = 60 / tempo
  const events: DrumEvent[] = []
  const missingNotes = new Set<string>()
  let scoreBeats = 0

  console.log(`Divisions: ${divisions}, Tempo: ${tempo} BPM, Seconds per quarter: ${secondsPerQuarter}`)

  const instrumentMidiMap = new Map<string, number>()
  const midiInstruments = xml.querySelectorAll('score-part > midi-instrument')
  for (const instr of midiInstruments) {
      const id = instr.getAttribute('id')
      const midi = instr.querySelector('midi-unpitched')?.textContent?.trim() ?? 'unknown'
      console.log(`MIDI Instrument: ${id}, MIDI: ${midi}`)

      if (id && midi !== 'unknown') {
        instrumentMidiMap.set(id, Number(midi))
      }
  }

  const measures = Array.from(xml.querySelectorAll('measure'))
  console.log(`Found ${measures.length} measures`)

  for (const [measureIndex, measure] of measures.entries()) {
    let measureCursor = 0
    const lastChordStartByVoice = new Map<string, number>()
    let measureMax = 0
    const measureBeatLength = parseMeasureBeats(measure)
    console.log(`Measure ${measureIndex + 1}: ${measureBeatLength} beats`)

    for (const child of Array.from(measure.children)) {
      if (child.tagName === 'note') {
        const voice = child.querySelector('voice')?.textContent?.trim() ?? '1'
        const isChord = Boolean(child.querySelector('chord'))
        const durationValue = Number(child.querySelector('duration')?.textContent ?? '0') / divisions
        const eventBeat = isChord
          ? (lastChordStartByVoice.get(voice) ?? measureCursor)
          : measureCursor

        if (child.querySelector('rest')) {
          if (!isChord) {
            measureCursor += durationValue
            measureMax = Math.max(measureMax, measureCursor)
          }
          continue
        }

        const noteId = child.querySelector('instrument')?.getAttribute('id') ?? 'unknown'
        const mappedMidi = instrumentMidiMap.get(noteId)
        const midi = mappedMidi !== undefined ? mappedMidi - 1 : getNoteMidi(child)

        if (midi !== null && DRUM_SAMPLES[midi] !== undefined) {
          events.push({
            time: (scoreBeats + eventBeat) * secondsPerQuarter,
            midi,
            duration: Math.max(0.02, durationValue * secondsPerQuarter),
            velocity: 0.8,
          })
          console.log(`Added event: MIDI ${midi}, time ${events[events.length - 1].time.toFixed(3)}s, duration ${events[events.length - 1].duration.toFixed(3)}s`)
        } else if (!child.querySelector('rest')) {
          const label = midi !== null ? `MIDI ${midi}` : 'unknown note'
          missingNotes.add(label)
          console.warn(`Skipping note: ${label} (not in DRUM_KIT_SAMPLES)`)
        }

        if (!isChord) {
          lastChordStartByVoice.set(voice, eventBeat)
          measureCursor += durationValue
          measureMax = Math.max(measureMax, measureCursor)
        } else {
          lastChordStartByVoice.set(voice, eventBeat)
          measureMax = Math.max(measureMax, eventBeat + durationValue)
        }
      }

      if (child.tagName === 'backup' || child.tagName === 'forward') {
        const durationValue = Number(child.querySelector('duration')?.textContent ?? '0') / divisions
        const direction = child.tagName === 'backup' ? -1 : 1
        measureCursor = Math.max(0, measureCursor + direction * durationValue)
        measureMax = Math.max(measureMax, measureCursor)
      }
    }

    scoreBeats += Math.max(measureMax, measureBeatLength)
    console.log(`Measure ${measureIndex + 1} ends at beat ${scoreBeats}`)
  }

  const result = {
    events: events.sort((a, b) => a.time - b.time),
    durationSeconds: Math.max(0, scoreBeats * secondsPerQuarter),
    missingNotes: Array.from(missingNotes),
    tempo,
  }
  console.log(`Total events: ${result.events.length}, Duration: ${result.durationSeconds.toFixed(2)}s, Missing notes: ${result.missingNotes.length}`)
  return result
}

export default function OsmdParserPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <OsmdParserPageInner />
    </QueryClientProvider>
  )
}

function OsmdParserPageInner() {
  const [selectedScore, setSelectedScore] = useState<string | null>(null)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [audioReady, setAudioReady] = useState(false)
  const [loopEnabled, setLoopEnabled] = useState(true)
  const [transportState, setTransportState] = useState<'stopped' | 'started' | 'paused'>('stopped')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const osmdContainerRef = useRef<HTMLDivElement | null>(null)
  const samplerRef = useRef<Tone.Sampler | null>(null)
  const partRef = useRef<Tone.Part<DrumEvent> | null>(null)

  const scoreListQuery = useQuery<string[]>({
      queryKey: ['score-files'],
      queryFn: async () => {
          const response = await fetch(SCORE_INDEX_URL)
          console.log("Fetching score list from:", SCORE_INDEX_URL)
      if (!response.ok) {
        throw new Error(`Unable to load score list (${response.status})`)
      }
      return response.json()
    },
  })

  useEffect(() => {
    if (scoreListQuery.data && !selectedScore) {
      setSelectedScore(scoreListQuery.data[0] ?? null)
    }
  }, [scoreListQuery.data, selectedScore])

  const selectedFilePath = selectedScore ? `/scores/${selectedScore}` : null

  const scoreQuery = useQuery<ScorePayload | undefined>({
    queryKey: ['score-xml', selectedScore],
    queryFn: async () => {
      if (!selectedFilePath) return undefined
      const response = await fetch(selectedFilePath)
      if (!response.ok) {
        throw new Error(`Unable to load score (${response.status})`)
      }
      const raw = await response.text()
      const xml = new DOMParser().parseFromString(raw, 'application/xml')
      return { raw, xml }
    },
    enabled: Boolean(selectedFilePath),
    placeholderData: (previousData) => previousData,
  })

  const scoreResults = useMemo(() => {
    if (!scoreQuery.data || !scoreQuery.data.xml) {
      return { events: [] as DrumEvent[], durationSeconds: 0, missingNotes: [] as string[], tempo: 120 }
    }
    return buildDrumEvents(scoreQuery.data.xml)
  }, [scoreQuery.data])

  const { events, durationSeconds, missingNotes, tempo } = scoreResults
  const isLoading = scoreListQuery.isLoading || scoreQuery.isFetching
  const isReadyToPlay = audioEnabled && audioReady && events.length > 0

  useEffect(() => {
    const sampler = new Tone.Sampler({
      urls: DRUM_SAMPLE_URLS,
      baseUrl: '/drums/',
    }).toDestination()

    samplerRef.current = sampler
    Tone.loaded().then(() => setAudioReady(true))

    return () => {
      sampler.dispose()
      samplerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!scoreQuery.data?.raw || !osmdContainerRef.current) return

    const container = osmdContainerRef.current
    container.innerHTML = ''
    const osmd = new OpenSheetMusicDisplay(container, {
      autoResize: true,
      drawTitle: true,
      pageBackgroundColor: '#F5F5F0',
    })

    let cancelled = false

    osmd.load(scoreQuery.data.raw).then(() => {
      if (cancelled) return
      return osmd.render()
    })

    return () => {
      cancelled = true
      container.innerHTML = ''
    }
  }, [scoreQuery.data?.raw])

  useEffect(() => {
    if (partRef.current) {
      partRef.current.stop()
      partRef.current.dispose()
      partRef.current = null
    }

    if (!samplerRef.current || events.length === 0) {
      Tone.Transport.stop()
      Tone.Transport.cancel(0)
      setTransportState('stopped')
      return
    }

    const part = new Tone.Part<DrumEvent>((time, value) => {
      const noteKey = Tone.Frequency(value.midi, 'midi').toNote()
      console.log(`Triggering MIDI ${value.midi} at time ${time.toFixed(3)}s with velocity ${value.velocity} and duration ${value.duration.toFixed(3)}s`)
      samplerRef.current?.triggerAttackRelease(noteKey, value.duration, time, value.velocity)
    }, events)

    part.start(0)
    partRef.current = part
    Tone.Transport.bpm.value = tempo
    Tone.Transport.loop = loopEnabled && durationSeconds > 0
    Tone.Transport.loopStart = 0
    Tone.Transport.loopEnd = `${durationSeconds}s`

    return () => {
      part.stop()
      part.dispose()
      if (partRef.current === part) {
        partRef.current = null
      }
    }
  }, [events, loopEnabled, durationSeconds, tempo])

  useEffect(() => {
    if (!audioEnabled) return
    setStatusMessage('Audio unlocked. Ready to play when the score is loaded.')
  }, [audioEnabled])

  const handleEnableAudio = async () => {
    try {
      await Tone.start()
      setAudioEnabled(true)
      setStatusMessage('Audio enabled. Press Play to hear the drum score.')
    } catch (error) {
      setStatusMessage('Unable to enable audio. Try again in a secure browser context.')
      console.error(error)
    }
  }

  const handlePlay = async () => {
    if (!selectedScore) return
    if (!audioEnabled) {
      await handleEnableAudio()
    }
    if (events.length === 0 || !samplerRef.current) return

    if (Tone.Transport.state === 'paused') {
      Tone.Transport.start()
      setTransportState('started')
      return
    }

    Tone.Transport.stop()
    Tone.Transport.seconds = 0
    Tone.Transport.start()
    setTransportState('started')
  }

  const handlePause = () => {
    if (Tone.Transport.state === 'started') {
      Tone.Transport.pause()
      setTransportState('paused')
    }
  }

  const handleRestart = async () => {
    if (!audioEnabled) {
      await handleEnableAudio()
    }
    if (events.length === 0) return

    Tone.Transport.stop()
    Tone.Transport.seconds = 0
    Tone.Transport.start()
    setTransportState('started')
  }

  return (
    <div className="min-h-screen bg-metro-primary flex flex-col font-gotu">
      <header className="bg-metro-dark text-metro-primary py-4 px-8 shadow-lg">
        <h1 className="text-center text-2xl md:text-3xl font-semibold tracking-widest uppercase">MusicXML Drum Loop Builder</h1>
        <p className="text-center text-xs text-metro-secondary tracking-wide mt-0.5">
          Drum notation activity
          {' · '}
          {transportState === 'started' ? (
            <span className="text-metro-primary">Playing</span>
          ) : transportState === 'paused' ? (
            <span className="text-metro-secondary">Paused</span>
          ) : (
            <span className="text-metro-accent">Stopped</span>
          )}
        </p>
      </header>

      <main className="flex-1 flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
        {/* Controls card */}
        <section className="rounded-2xl border-2 border-metro-secondary bg-metro-primary/60 p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-metro-accent font-semibold">Score &amp; Playback</p>
              <p className="max-w-xl text-sm text-metro-accent leading-relaxed">
                Select a MusicXML score, enable audio, then use the controls to play back the drum pattern.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                type="button"
                onClick={handleEnableAudio}
                className="rounded-xl bg-metro-secondary px-5 py-2.5 text-sm font-semibold text-metro-dark hover:bg-metro-primary transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              >
                Enable Audio
              </button>
              <button
                type="button"
                onClick={handlePlay}
                disabled={!isReadyToPlay}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${isReadyToPlay ? 'bg-metro-dark text-metro-primary hover:bg-metro-accent' : 'bg-metro-accent/30 text-metro-accent'}`}
              >
                {transportState === 'paused' ? 'Resume' : '▶ Play'}
              </button>
              <button
                type="button"
                onClick={handlePause}
                disabled={Tone.Transport.state !== 'started'}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${Tone.Transport.state === 'started' ? 'bg-metro-accent text-metro-primary hover:bg-metro-secondary hover:text-metro-dark' : 'bg-metro-accent/30 text-metro-accent'}`}
              >
                ‖ Pause
              </button>
              <button
                type="button"
                onClick={handleRestart}
                disabled={!isReadyToPlay}
                className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${isReadyToPlay ? 'bg-metro-accent text-metro-primary hover:bg-metro-secondary hover:text-metro-dark' : 'bg-metro-accent/30 text-metro-accent'}`}
              >
                ↺ Restart
              </button>
            </div>
          </div>

          {/* Score / Playback controls */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-metro-secondary bg-metro-primary/70 p-4">
              <p className="text-xs uppercase tracking-widest text-metro-secondary font-semibold mb-3">Score</p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <label className="min-w-[5rem] text-sm font-semibold text-metro-dark">File</label>
                <select
                  value={selectedScore ?? ''}
                  onChange={(event) => setSelectedScore(event.target.value)}
                  disabled={scoreListQuery.isLoading || !!scoreListQuery.error}
                  className="w-full rounded-lg border border-metro-secondary bg-metro-primary px-3 py-2 text-metro-dark outline-none transition focus:border-metro-accent"
                >
                  {scoreListQuery.data?.map((score) => (
                    <option key={score} value={score}>
                      {score}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rounded-xl border border-metro-secondary bg-metro-primary/70 p-4">
              <p className="text-xs uppercase tracking-widest text-metro-secondary font-semibold mb-3">Playback</p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-lg bg-metro-secondary/40 px-3 py-1 text-sm font-medium text-metro-dark">
                  {scoreQuery.isFetching ? 'Loading score…' : selectedScore ? 'Score loaded' : 'Choose score'}
                </span>
                <button
                  type="button"
                  onClick={() => setLoopEnabled((prev) => !prev)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${loopEnabled ? 'bg-metro-accent text-metro-primary hover:bg-metro-secondary hover:text-metro-dark' : 'bg-metro-secondary/40 text-metro-dark hover:bg-metro-secondary'}`}
                >
                  Loop: {loopEnabled ? 'On' : 'Off'}
                </button>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-lg bg-metro-accent/30 border border-metro-accent px-3 py-1.5 text-metro-primary font-medium">Tempo: {tempo} BPM</span>
            <span className="rounded-lg bg-metro-accent/30 border border-metro-accent px-3 py-1.5 text-metro-primary font-medium">Duration: {durationSeconds.toFixed(2)}s</span>
            <span className="rounded-lg bg-metro-accent/30 border border-metro-accent px-3 py-1.5 text-metro-primary font-medium">Events: {events.length}</span>
            <span className="rounded-lg bg-metro-accent/30 border border-metro-accent px-3 py-1.5 text-metro-primary font-medium">Audio: {audioEnabled ? 'enabled' : 'disabled'}</span>
            <span className="rounded-lg bg-metro-accent/30 border border-metro-accent px-3 py-1.5 text-metro-primary font-medium">Transport: {transportState}</span>
          </div>

          {statusMessage ? (
            <div className="mt-4 rounded-xl bg-metro-secondary/40 border border-metro-secondary px-4 py-3 text-sm text-metro-accent">
              {statusMessage}
            </div>
          ) : null}
        </section>

        {/* Instructions + Warnings */}
        <section className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <aside className="flex flex-col gap-4 rounded-2xl border-2 border-metro-secondary bg-metro-primary/60 p-5">
            <h2 className="text-lg font-semibold text-metro-dark border-b border-metro-secondary pb-2">How to Use</h2>
            <ol className="list-decimal list-inside space-y-3 text-sm text-metro-dark leading-relaxed">
              <li>Click <strong>Enable Audio</strong> to unlock browser audio.</li>
              <li>Choose a MusicXML score from the dropdown.</li>
              <li>Press <strong>Play</strong> to hear the drum pattern from the score.</li>
              <li>Use <strong>Pause</strong> and <strong>Restart</strong> to control playback.</li>
              <li>Toggle <strong>Loop</strong> to repeat the drum pattern automatically.</li>
            </ol>
            <div className="mt-auto rounded-xl bg-metro-secondary/40 p-3 text-xs text-metro-accent leading-relaxed">
              <strong>Note:</strong> Notation is rendered with OpenSheetMusicDisplay. Drum samples are loaded from <code>/drums/</code>.
            </div>
          </aside>

          <aside className="flex flex-col gap-4 rounded-2xl bg-metro-dark p-5 text-metro-primary">
            <h3 className="text-lg font-semibold tracking-wide border-b border-metro-accent pb-2">Warnings</h3>
            <p className="text-xs text-metro-secondary leading-relaxed">Notes without a matching drum sample are skipped during playback.</p>
            {missingNotes.length > 0 ? (
              <div className="rounded-xl bg-metro-accent/30 border border-metro-accent p-4 text-sm text-metro-primary">
                <p className="font-semibold text-xs uppercase tracking-widest text-metro-secondary mb-2">Missing sample mapping</p>
                <p className="text-xs leading-6">{missingNotes.join(', ')}</p>
              </div>
            ) : (
              <div className="rounded-xl bg-metro-secondary/25 border border-metro-secondary p-4 text-sm text-metro-primary">
                All note pitches mapped to drum samples.
              </div>
            )}
          </aside>
        </section>

        {/* Score preview */}
        <section className="rounded-2xl border-2 border-metro-secondary bg-white/45 p-4 md:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-metro-dark tracking-wide">Score Preview</h2>
              <p className="text-sm text-metro-accent">The MusicXML file is rendered below as sheet music.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-metro-dark px-4 py-2 text-sm text-metro-primary shadow-sm">
              <span className="h-2 w-2 rounded-full bg-metro-accent"></span>
              OpenSheetMusicDisplay
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border-2 border-metro-secondary bg-metro-primary/60 p-3">
            <div ref={osmdContainerRef} className="min-h-[420px]" />
          </div>
        </section>
      </main>
    </div>
  )
}
