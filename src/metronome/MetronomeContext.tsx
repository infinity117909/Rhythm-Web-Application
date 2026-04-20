import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import * as Tone from 'tone'

export interface TimeSignature {
  beats: number
  noteValue: number
}

export const METRONOME_TYPES = ['Block Beat', 'Pulse', 'Pendulum'] as const
export type MetronomeType = (typeof METRONOME_TYPES)[number]

interface MetronomeContextValue {
  bpm: number
  timeSignature: TimeSignature
  currentBeat: number
  currentPolyBeat: number
  isPlaying: boolean
  isAudioEnabled: boolean
  metronomeType: MetronomeType
  metronomeTypeIndex: number
  isPolyrhythmEnabled: boolean
  polyrhythmValue: number
  setBpm: (bpm: number) => void
  setTimeSignature: (ts: TimeSignature) => void
  setIsPolyrhythmEnabled: (enabled: boolean) => void
  setPolyrhythmValue: (value: number) => void
  enableAudio: () => Promise<void>
  play: () => void
  pause: () => void
  stop: () => void
  restart: () => void
  cycleType: (direction: 1 | -1) => void
}

const MetronomeContext = createContext<MetronomeContextValue | null>(null)

export function MetronomeProvider({ children }: { children: ReactNode }) {
  const [bpm, setBpmState] = useState(120)
  const [timeSignature, setTimeSigState] = useState<TimeSignature>({ beats: 4, noteValue: 4 })
  const [currentBeat, setCurrentBeat] = useState(-1)
  const [currentPolyBeat, setCurrentPolyBeat] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)
  const [metronomeTypeIndex, setMetronomeTypeIndex] = useState(0)
  const [isPolyrhythmEnabled, setIsPolyrhythmEnabledState] = useState(false)
  const [polyrhythmValue, setPolyrhythmValueState] = useState(2)

  const primaryAccentSynthRef = useRef<Tone.MembraneSynth | null>(null)
  const primaryBeatSynthRef = useRef<Tone.MembraneSynth | null>(null)
  const polyAccentSynthRef = useRef<Tone.MembraneSynth | null>(null)
  const polyBeatSynthRef = useRef<Tone.MembraneSynth | null>(null)
  const measureLoopIdRef = useRef<number | null>(null)

  const bpmRef = useRef(bpm)
  const tsRef = useRef(timeSignature)
  const polyEnabledRef = useRef(isPolyrhythmEnabled)
  const polyValueRef = useRef(polyrhythmValue)

  bpmRef.current = bpm
  tsRef.current = timeSignature
  polyEnabledRef.current = isPolyrhythmEnabled
  polyValueRef.current = polyrhythmValue

  const metronomeType = METRONOME_TYPES[metronomeTypeIndex]

  const clearScheduler = useCallback(() => {
    if (measureLoopIdRef.current !== null) {
      Tone.getTransport().clear(measureLoopIdRef.current)
      measureLoopIdRef.current = null
    }
  }, [])

  const scheduleMeasureLoop = useCallback(() => {
    clearScheduler()

    const primaryAccent = primaryAccentSynthRef.current
    const primaryBeat = primaryBeatSynthRef.current
    const polyAccent = polyAccentSynthRef.current
    const polyBeat = polyBeatSynthRef.current
    if (!primaryAccent || !primaryBeat || !polyAccent || !polyBeat) return

    const transport = Tone.getTransport()
    const { beats, noteValue } = tsRef.current

    // A beat duration that honors time signature denominator (e.g. 6/8 beat is eighth-note).
    const beatDurationSeconds = (60 / bpmRef.current) * (4 / noteValue)
    const measureDurationSeconds = beatDurationSeconds * beats

    // We schedule timings manually to support denominators 1..16, so keep transport TS simple.
    transport.timeSignature = beats

    measureLoopIdRef.current = transport.scheduleRepeat(
      (time) => {
        for (let i = 0; i < beats; i += 1) {
          const beatTime = time + i * beatDurationSeconds
          if (i === 0) {
            primaryAccent.triggerAttackRelease('C2', '16n', beatTime)
          } else {
            primaryBeat.triggerAttackRelease('G2', '16n', beatTime)
          }

          Tone.getDraw().schedule(() => {
            setCurrentBeat(i)
          }, beatTime)
        }

        if (polyEnabledRef.current) {
          const polyCount = polyValueRef.current
          const polyStepSeconds = measureDurationSeconds / polyCount

          for (let j = 0; j < polyCount; j += 1) {
            const polyTime = time + j * polyStepSeconds
            if (j === 0) {
              // Secondary metronome accent is intentionally higher than the primary downbeat.
              polyAccent.triggerAttackRelease('E3', '16n', polyTime)
            } else {
              polyBeat.triggerAttackRelease('B2', '16n', polyTime)
            }

            Tone.getDraw().schedule(() => {
              setCurrentPolyBeat(j)
            }, polyTime)
          }
        } else {
          Tone.getDraw().schedule(() => {
            setCurrentPolyBeat(-1)
          }, time)
        }
      },
      measureDurationSeconds,
      0,
    )
  }, [clearScheduler])

  const restartTransportWithNewSchedule = useCallback(() => {
    if (!isAudioEnabled) return

    const transport = Tone.getTransport()
    const wasPlaying = transport.state === 'started'

    if (wasPlaying) {
      transport.stop()
      setCurrentBeat(-1)
      setCurrentPolyBeat(-1)
    }

    scheduleMeasureLoop()

    if (wasPlaying) {
      transport.start()
      setIsPlaying(true)
    }
  }, [isAudioEnabled, scheduleMeasureLoop])

  const enableAudio = useCallback(async () => {
    if (isAudioEnabled) return
    await Tone.start()

    primaryAccentSynthRef.current = new Tone.MembraneSynth({
      pitchDecay: 0.08,
      octaves: 4,
      envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 },
    }).toDestination()

    primaryBeatSynthRef.current = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 2,
      envelope: { attack: 0.001, decay: 0.16, sustain: 0, release: 0.05 },
    }).toDestination()

    polyAccentSynthRef.current = new Tone.MembraneSynth({
      pitchDecay: 0.06,
      octaves: 3,
      envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.08 },
    }).toDestination()

    polyBeatSynthRef.current = new Tone.MembraneSynth({
      pitchDecay: 0.04,
      octaves: 2,
      envelope: { attack: 0.001, decay: 0.12, sustain: 0, release: 0.05 },
    }).toDestination()

    Tone.getTransport().bpm.value = bpmRef.current
    scheduleMeasureLoop()
    setIsAudioEnabled(true)
  }, [isAudioEnabled, scheduleMeasureLoop])

  const setBpm = useCallback(
    (value: number) => {
      const clamped = Math.max(20, Math.min(300, value))
      setBpmState(clamped)
      Tone.getTransport().bpm.value = clamped
      restartTransportWithNewSchedule()
    },
    [restartTransportWithNewSchedule],
  )

  const setPolyrhythmValue = useCallback(
    (value: number) => {
      const clamped = Math.max(2, Math.min(6, value))
      setPolyrhythmValueState(clamped)
      if (isPolyrhythmEnabled) {
        restartTransportWithNewSchedule()
      }
    },
    [isPolyrhythmEnabled, restartTransportWithNewSchedule],
  )

  const setIsPolyrhythmEnabled = useCallback(
    (enabled: boolean) => {
      setIsPolyrhythmEnabledState(enabled)
      if (!enabled) {
        setCurrentPolyBeat(-1)
      }
      restartTransportWithNewSchedule()
    },
    [restartTransportWithNewSchedule],
  )

  const setTimeSignature = useCallback(
    (ts: TimeSignature) => {
      const sanitized: TimeSignature = {
        beats: Math.max(1, Math.min(32, ts.beats)),
        noteValue: Math.max(1, Math.min(16, ts.noteValue)),
      }
      setTimeSigState(sanitized)
      restartTransportWithNewSchedule()
    },
    [restartTransportWithNewSchedule],
  )

  const play = useCallback(() => {
    if (!isAudioEnabled) return

    const transport = Tone.getTransport()
    if (transport.state !== 'started') {
      setCurrentBeat(-1)
      setCurrentPolyBeat(-1)
      transport.start()
    }

    setIsPlaying(true)
  }, [isAudioEnabled])

  const pause = useCallback(() => {
    Tone.getTransport().pause()
    setIsPlaying(false)
    setCurrentBeat(-1)
    setCurrentPolyBeat(-1)
  }, [])

  const stop = useCallback(() => {
    Tone.getTransport().stop()
    setIsPlaying(false)
    setCurrentBeat(-1)
    setCurrentPolyBeat(-1)
  }, [])

  const restart = useCallback(() => {
    Tone.getTransport().stop()
    setCurrentBeat(-1)
    setCurrentPolyBeat(-1)
    setIsPlaying(false)

    if (isAudioEnabled) {
      Tone.getTransport().start()
      setIsPlaying(true)
    }
  }, [isAudioEnabled])

  const cycleType = useCallback((direction: 1 | -1) => {
    setMetronomeTypeIndex((prev) => (prev + direction + METRONOME_TYPES.length) % METRONOME_TYPES.length)
  }, [])

  useEffect(() => {
    return () => {
      Tone.getTransport().stop()
      clearScheduler()
      primaryAccentSynthRef.current?.dispose()
      primaryBeatSynthRef.current?.dispose()
      polyAccentSynthRef.current?.dispose()
      polyBeatSynthRef.current?.dispose()
    }
  }, [clearScheduler])

  const value: MetronomeContextValue = {
    bpm,
    timeSignature,
    currentBeat,
    currentPolyBeat,
    isPlaying,
    isAudioEnabled,
    metronomeType,
    metronomeTypeIndex,
    isPolyrhythmEnabled,
    polyrhythmValue,
    setBpm,
    setTimeSignature,
    setIsPolyrhythmEnabled,
    setPolyrhythmValue,
    enableAudio,
    play,
    pause,
    stop,
    restart,
    cycleType,
  }

  return <MetronomeContext.Provider value={value}>{children}</MetronomeContext.Provider>
}

export function useMetronome(): MetronomeContextValue {
  const ctx = useContext(MetronomeContext)
  if (!ctx) throw new Error('useMetronome must be used inside MetronomeProvider')
  return ctx
}
