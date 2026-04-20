/**
 * DrumMachine.tsx
 *
 * Main drum-machine application component.
 * This file contains the full selection workflow, preset-kit loader,
 * playback engine integration with Tone.js, and the pattern editor UI.
 * It manages instrument selection, step-grid state, transport scheduling,
 * volume/mute controls, and responsive row scrolling.
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import * as Tone from 'tone'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { instrumentList } from './sampleMap'
import { Play, Pause, VolumeX, Volume2 } from 'lucide-react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      retry: false,
    },
  },
})

const MIN_SUBDIVISIONS = 1
const MAX_SUBDIVISIONS = 32
const MIN_MEASURES = 1
const MAX_MEASURES = 16
const DEFAULT_BPM = 100

function createEmptyPattern(rows: number, columns: number) {
  return Array.from({ length: rows }, () => Array(columns).fill(false))
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function getTimeSignatureDisplay(subdivisions: number) {
  const noteNames: Record<number, string> = {
    1: 'whole notes',
    2: 'half notes',
    4: 'quarter notes',
    8: 'eighth notes',
    16: 'sixteenth notes',
    32: 'thirty-second notes',
  }
  const noteName = noteNames[subdivisions] || `${subdivisions} divisions`
  
  // Display as {subdivisions}/denominator, where denominator represents the note type
  // 1 = whole (1), 2 = half (2), 4 = quarter (4), 8 = eighth (8), 16 = sixteenth (16), 32 = thirty-second (32)
  return {
    timeSignature: `${subdivisions}/${subdivisions}`,
    noteName,
  }
}

const drumKitPresets = [
  {
    key: 'small',
    label: 'Small Drum Kit',
    instrumentKeys: ['B1', 'Ab2', 'Gb2', 'Bb2', 'D2', 'Db2', 'D3', 'A2', 'B3', 'F3', 'A3'],
  },
  {
    key: 'large',
    label: 'Large Drum Kit',
    instrumentKeys: ['B1', 'Ab2', 'Gb2', 'Bb2', 'D2', 'Db2', 'D3', 'B2', 'C3', 'A2', 'F2', 'G2', 'B3', 'F3', 'A3', 'Db3', 'E1', 'G3'],
  },
  {
    key: 'latin',
    label: 'Latin Percussion Ensemble',
    instrumentKeys: [
      'B1', 'Ab2', 'Gb2', 'Bb2', 'D2', 'Db2', 'D3', 'A2', 'B3', 'F3', 'A3',
      'Eb2', 'Bb1', 'Ab3', 'Gb3', 'B4', 'Bb4', 'C4', 'D4', 'Db4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4', 'D5', 'Db5', 'Eb5', 'G5', 'Gb5', 'Db6',
    ],
  },
]

// Preset kit definitions are used by the instrument selection page
// to load a set of instrument keys and replace the current selection.
// Presets do not modify the pattern itself beyond resetting it for the
// new instrument row count.

/**
 * Drum machine inner component.
 *
 * This component renders a two-step workflow:
 * 1) instrument selection
 * 2) pattern creation/playback
 */
function DrumMachineInner() {
  // Load the available instrument list for the drum machine.
  // This uses React Query for caching, but currently returns the local static list.
  const { data: instruments = instrumentList } = useQuery({
    queryKey: ['drum-instruments'],
    queryFn: async () => instrumentList,
  })

  const [measures, setMeasures] = useState(2)
  const [measuresInputValue, setMeasuresInputValue] = useState(measures.toString())
  const [subdivisions, setSubdivisions] = useState(16)
  const [subdivisionsInputValue, setSubdivisionsInputValue] = useState(subdivisions.toString())
  const [bpm, setBpm] = useState(DEFAULT_BPM)
  const [bpmInputValue, setBpmInputValue] = useState(bpm.toString())
  const [tempoMode, setTempoMode] = useState<'half' | 'normal' | 'double'>('normal')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [currentStep, setCurrentStep] = useState<number | null>(null)
  const [selectedInstrumentKeys, setSelectedInstrumentKeys] = useState<string[]>([])
  const [selectedPreset, setSelectedPreset] = useState<string>('none')
  const [hasStarted, setHasStarted] = useState(false)
  const [pattern, setPattern] = useState<boolean[][]>(() => createEmptyPattern(0, measures * subdivisions))
  const patternRef = useRef<boolean[][]>(pattern)
  const [muteStates, setMuteStates] = useState<Record<string, boolean>>({})
  const [volumeStates, setVolumeStates] = useState<Record<string, number>>({})
  
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([])
  const isScrollingRef = useRef(false)

  const playersRef = useRef<Tone.Players | null>(null)
  const scheduleIdRef = useRef<number | null>(null)
  const [audioUnlocked, setAudioUnlocked] = useState(false)

  // Derive the active instruments currently selected by the user.
  const selectedInstruments = useMemo(
    () => instruments.filter((instrument) => selectedInstrumentKeys.includes(instrument.key)),
    [instruments, selectedInstrumentKeys],
  )

  // Build the sample file map for Tone.Players based on selected instruments.
  const selectedSampleFiles = useMemo(
    () => Object.fromEntries(selectedInstruments.map((instrument) => [instrument.key, instrument.file])) as Record<string, string>,
    [selectedInstruments],
  )

  const handlePresetChange = (presetKey: string) => {
    setSelectedPreset(presetKey)
    const preset = drumKitPresets.find((item) => item.key === presetKey)

    console.log('Preset change requested', { presetKey, preset })

    if (preset) {
      // Replace the current selection with the preset instruments.
      // This ensures stale selections are removed when switching presets.
      setSelectedInstrumentKeys([...preset.instrumentKeys])
      setPattern(createEmptyPattern(preset.instrumentKeys.length, totalSteps))
      setMuteStates({})
      setVolumeStates({})
    } else {
      setSelectedInstrumentKeys([])
      setPattern(createEmptyPattern(0, totalSteps))
      setMuteStates({})
      setVolumeStates({})
    }
  }

  const totalSteps = useMemo(() => measures * subdivisions, [measures, subdivisions])

  useEffect(() => {
    // Sync input value with bpm when bpm changes (e.g., from slider)
    setBpmInputValue(bpm.toString())
  }, [bpm])

  useEffect(() => {
    // Sync measures input value when measures changes
    setMeasuresInputValue(measures.toString())
  }, [measures])

  useEffect(() => {
    // Sync subdivisions input value when subdivisions changes
    setSubdivisionsInputValue(subdivisions.toString())
  }, [subdivisions])

  useEffect(() => {
    console.log('selectedInstruments effect', {
      selectedInstrumentKeys,
      selectedInstrumentCount: selectedInstruments.length,
      totalSteps,
    })

    if (!selectedInstruments.length) {
      setPattern(createEmptyPattern(0, totalSteps))
      return
    }

    setMuteStates((current) => {
      const base = Object.fromEntries(selectedInstruments.map((instrument) => [instrument.key, current[instrument.key] ?? false]))
      return base
    })

    setVolumeStates((current) => {
      const base = Object.fromEntries(selectedInstruments.map((instrument) => [instrument.key, current[instrument.key] ?? -3]))
      return base
    })

    setPattern((previous) => {
      if (previous.length !== selectedInstruments.length) {
        return createEmptyPattern(selectedInstruments.length, totalSteps)
      }

      return previous.map((row) => {
        const trimmed = row.slice(0, totalSteps)
        return totalSteps > row.length ? trimmed.concat(Array(totalSteps - row.length).fill(false)) : trimmed
      })
    })
  }, [totalSteps, selectedInstruments.length, selectedInstruments])

  useEffect(() => {
    if (!playersRef.current) return

    console.log('selectedSampleFiles changed, disposing old players', {
      selectedSampleFilesKeys: Object.keys(selectedSampleFiles),
    })

    Tone.Transport.cancel()
    Tone.Transport.stop()
    playersRef.current.dispose()
    playersRef.current = null
    setIsReady(false)
  }, [selectedSampleFiles])

  useEffect(() => {
    if (!playersRef.current) return

    console.log('updating instrument volumes', {
      selectedInstrumentKeys,
      muteStates,
      volumeStates,
    })

    selectedInstruments.forEach((instrument) => {
      const player = playersRef.current?.player(instrument.key)
      if (player) {
        player.volume.value = muteStates[instrument.key] ? -Infinity : volumeStates[instrument.key]
      }
    })
  }, [selectedInstruments, muteStates, volumeStates])

  useEffect(() => {
    if (!playersRef.current || !isPlaying) return

    const tempoMultiplier = tempoMode === 'double' ? 2 : tempoMode === 'half' ? 0.5 : 1
    const effectiveBpm = bpm * tempoMultiplier

    console.log('playback effect starting', {
      isPlaying,
      bpm,
      tempoMode,
      effectiveBpm,
      measures,
      subdivisions,
      selectedInstruments: selectedInstruments.map((instrument) => instrument.key),
    })

    Tone.Transport.cancel()

    // Each measure = 4 quarter notes. Quarter note gets the pulse at the effective BPM.
    // Subdivisions divide each measure into that many equal steps.
    const quarterNoteDuration = 60 / effectiveBpm // duration of one quarter note in seconds
    const measureDuration = 4 * quarterNoteDuration // 4 quarter notes per measure
    const stepDurationSeconds = measureDuration / subdivisions
    const stepDuration = Tone.Time(stepDurationSeconds, 's')
    
    console.log('scheduling with step duration', {
      bpm,
      measures,
      subdivisions,
      quarterNoteDuration,
      measureDuration,
      stepDurationSeconds,
      stepDurationTone: stepDuration.toString(),
    })

    scheduleIdRef.current = Tone.Transport.scheduleRepeat((time) => {
      const elapsedSeconds = Tone.Transport.seconds
      const measureCycleDuration = measures * measureDuration
      const step = Math.floor((elapsedSeconds % measureCycleDuration) / stepDurationSeconds) % totalSteps
      
      console.log('scheduleRepeat tick', { 
        time: time.toString(), 
        elapsedSeconds,
        step,
        totalSteps,
      })
      
      setCurrentStep(step)
      selectedInstruments.forEach((instrument, instrumentIndex) => {
        if (patternRef.current[instrumentIndex]?.[step]) {
          const player = playersRef.current?.player(instrument.key)
          if (player) {
            console.log('triggering sample', {
              instrument: instrument.key,
              step,
              time: time.toString(),
              playerState: player.state,
            })
            player.start(time, 0)
            
            // Only stop hi-hat open samples at the end of the step
            if (instrument.key === 'Bb2') { // Hi-Hat Open 1
              const stopTime = Tone.Time(time).toSeconds() + stepDurationSeconds
              player.stop(stopTime)
            }
          }
        }
      })
    }, stepDuration) as unknown as number

    Tone.Transport.bpm.value = bpm
    Tone.Transport.start()

    return () => {
      if (scheduleIdRef.current !== null) {
        Tone.Transport.clear(scheduleIdRef.current)
      }
      Tone.Transport.stop()
    }
  }, [isPlaying, selectedInstruments, totalSteps, bpm, measures, tempoMode])

  useEffect(() => {
    patternRef.current = pattern
  }, [pattern])

  useEffect(() => {
    // Reset scroll refs when instruments change
    scrollRefs.current = new Array(selectedInstruments.length).fill(null)
  }, [selectedInstruments.length])

  const handleBpmInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBpmInputValue(event.target.value)
  }

  const handleBpmInputBlur = () => {
    const numericValue = Number(bpmInputValue)
    const clampedValue = clamp(numericValue, 20, 300)
    setBpm(clampedValue)
    setBpmInputValue(clampedValue.toString())
  }

  const handleBpmInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleBpmInputBlur()
    }
  }

  const handleBpmInputFocus = () => {
    setBpmInputValue('')
  }

  const handleMeasuresInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMeasuresInputValue(event.target.value)
  }

  const handleMeasuresInputBlur = () => {
    const numericValue = Number(measuresInputValue)
    const clampedValue = clamp(numericValue, MIN_MEASURES, MAX_MEASURES)
    setMeasures(clampedValue)
    setMeasuresInputValue(clampedValue.toString())
  }

  const handleMeasuresInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleMeasuresInputBlur()
    }
  }

  const handleMeasuresInputFocus = () => {
    setMeasuresInputValue('')
  }

  const handleSubdivisionsInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubdivisionsInputValue(event.target.value)
  }

  const handleSubdivisionsInputBlur = () => {
    const numericValue = Number(subdivisionsInputValue)
    const clampedValue = clamp(numericValue, MIN_SUBDIVISIONS, MAX_SUBDIVISIONS)
    setSubdivisions(clampedValue)
    setSubdivisionsInputValue(clampedValue.toString())
  }

  const handleSubdivisionsInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubdivisionsInputBlur()
    }
  }

  const handleSubdivisionsInputFocus = () => {
    setSubdivisionsInputValue('')
  }

  // Load or reuse a Tone.Players collection for the active instrument set.
  // Each selected instrument key maps to an audio sample URL from the drum folder.
  const loadPlayers = async () => {
    if (playersRef.current) return playersRef.current

    console.log('loading players for selected instruments', selectedSampleFiles)
    return await new Promise<Tone.Players>((resolve, reject) => {
      const players = new Tone.Players({
        urls: selectedSampleFiles,
        baseUrl: '/drums/',
        onload: () => {
          console.log('Samples are ready!')
          setIsReady(true)
          resolve(players)
        },
        onerror: (error) => {
          console.error('Failed to load sample', error)
          reject(error)
        },
      }).toDestination()

      playersRef.current = players
    })
  }

  const handleEnableAudio = async () => {
    if (!selectedInstruments.length) {
      console.warn('No selected instruments to enable audio for')
      return
    }

    if (!audioUnlocked) {
      await Tone.start()
      setAudioUnlocked(true)
      console.log('audio unlocked')
    }

    await loadPlayers()
  }

  const handlePlayPause = async () => {
    console.log('handlePlayPause clicked', {
      selectedInstrumentKeys,
      audioUnlocked,
      isPlaying,
      selectedSampleFilesKeys: Object.keys(selectedSampleFiles),
    })

    if (!selectedInstruments.length) return
    if (!audioUnlocked) {
      console.warn('Audio not enabled yet; call enable audio first')
      return
    }

    if (!playersRef.current) {
      await loadPlayers()
    }

    setIsPlaying((current) => {
      console.log('toggling play state from', current, 'to', !current)
      return !current
    })
  }

  const handleResetPattern = () => {
    console.log('resetting pattern', {
      selectedInstrumentKeys,
      totalSteps,
    })
    setPattern(createEmptyPattern(selectedInstruments.length, totalSteps))
    setCurrentStep(null)
  }

  const toggleInstrumentSelection = (key: string) => {
    setSelectedInstrumentKeys((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    )
  }

  const toggleCell = (instrumentIndex: number, stepIndex: number) => {
    setPattern((current) =>
      current.map((row, rowIndex) =>
        rowIndex === instrumentIndex
          ? row.map((cell, cellIndex) => (cellIndex === stepIndex ? !cell : cell))
          : row,
      ),
    )
  }

  const handleScroll = (event: React.UIEvent<HTMLDivElement>, instrumentIndex: number) => {
    if (isScrollingRef.current) return
    isScrollingRef.current = true

    const target = event.currentTarget
    const scrollLeft = target.scrollLeft

    scrollRefs.current.forEach((ref, index) => {
      if (index !== instrumentIndex && ref) {
        ref.scrollLeft = scrollLeft
      }
    })

    setTimeout(() => {
      isScrollingRef.current = false
    }, 10)
  }

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-[var(--color-drum-slate-950)] text-[var(--color-drum-slate-100)] p-6">
        <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--color-drum-slate-900-95)] border border-[var(--color-drum-slate-700)] shadow-2xl shadow-[var(--color-drum-slate-950-40)] p-6">
          <header className="mb-8 space-y-4">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.3em] text-[var(--color-drum-emerald-400)]">Drum Machine Activity</p>
              <h1 className="text-3xl font-semibold text-[var(--color-drum-white)]">Choose Your Instruments</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-drum-slate-300)]">
                Start with a blank canvas. Select the instruments you wish to use and then begin building the pattern.
              </p>
            </div>
          </header>

          <div className="mb-6 rounded-3xl border border-[var(--color-drum-slate-700)] bg-[var(--color-drum-slate-800-80)] p-4 text-sm text-[var(--color-drum-slate-300)]">
            <label className="flex flex-col gap-2 text-sm uppercase tracking-[0.2em] text-[var(--color-drum-slate-400)]">
              Select a preset kit
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={selectedPreset}
                  onChange={(event) => handlePresetChange(event.target.value)}
                  className="rounded-2xl border border-[var(--color-drum-slate-700)] bg-[var(--color-drum-slate-900-95)] px-3 py-2 text-sm text-[var(--color-drum-slate-100)] outline-none focus:border-[var(--color-drum-emerald-400)]"
                >
                  <option value="none">Choose a preset</option>
                  {drumKitPresets.map((preset) => (
                    <option key={preset.key} value={preset.key}>
                      {preset.label}
                    </option>
                  ))}
                </select>
                <span className="text-[var(--color-drum-slate-400)]">Loads the instrument set for the selected kit.</span>
              </div>
            </label>
          </div>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {instruments.map((instrument) => {
              const selected = selectedInstrumentKeys.includes(instrument.key)
              return (
                <button
                  key={instrument.key}
                  type="button"
                  onClick={() => toggleInstrumentSelection(instrument.key)}
                  className={`rounded-3xl border p-4 text-left transition-colors duration-150 ${
                    selected
                      ? 'border-[var(--color-drum-emerald-400)] bg-[var(--color-drum-emerald-500-15)] text-[var(--color-drum-slate-100)]'
                      : 'border-[var(--color-drum-slate-700)] bg-[var(--color-drum-slate-800-90)] text-[var(--color-drum-slate-300)] hover:border-[var(--color-drum-emerald-400)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[var(--color-drum-white)]">{instrument.name}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-drum-slate-500)]">{instrument.key}</p>
                    </div>
                    <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-drum-slate-400)]">
                      {selected ? 'Selected' : 'Select'}
                    </div>
                  </div>
                </button>
              )
            })}
          </section>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
            <p className="text-sm text-[var(--color-drum-slate-300)]">
              {selectedInstrumentKeys.length} instrument{selectedInstrumentKeys.length === 1 ? '' : 's'} selected.
            </p>
            <button
              type="button"
              onClick={() => setSelectedInstrumentKeys(instrumentList.slice(0, 4).map((instrument) => instrument.key))}
              className="rounded-2xl border border-[var(--color-drum-slate-700)] bg-[var(--color-drum-slate-800)] px-4 py-3 text-sm text-[var(--color-drum-slate-200)] hover:border-[var(--color-drum-emerald-500)]"
            >
              Quick select first 4
            </button>
            <button
              type="button"
              onClick={() => setHasStarted(true)}
              disabled={!selectedInstrumentKeys.length}
              className="inline-flex items-center justify-center rounded-2xl bg-[var(--color-drum-emerald-500)] px-5 py-3 text-sm font-semibold text-[var(--color-drum-slate-950)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-drum-emerald-400)]"
            >
              Start Building Pattern
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-drum-slate-950)] text-[var(--color-drum-slate-100)] p-6">
      <div className="mx-auto max-w-7xl rounded-3xl bg-[var(--color-drum-slate-900-95)] border border-[var(--color-drum-slate-700)] shadow-2xl shadow-[var(--color-drum-slate-950-40)] p-6">
        <header className="mb-8 space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.3em] text-[var(--color-drum-emerald-400)]">Drum Machine Activity</p>
              <h1 className="text-3xl font-semibold text-[var(--color-drum-white)]">Interactive Drum Grid</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-drum-slate-300)]">
                Create a beat by toggling squares in the grid. Adjust measures, subdivisions, mute individual instruments,
                and shape volume for each row.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleEnableAudio}
                disabled={audioUnlocked || !selectedInstruments.length}
                className="inline-flex items-center gap-2 rounded-2xl border border-[var(--color-drum-slate-600)] bg-[var(--color-drum-slate-800)] px-4 py-3 text-sm text-[var(--color-drum-slate-200)] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--color-drum-emerald-500)]"
              >
                {audioUnlocked ? 'Audio Enabled' : 'Enable Audio'}
              </button>
              <button
                type="button"
                onClick={handlePlayPause}
                disabled={!audioUnlocked}
                className="inline-flex items-center gap-2 rounded-2xl bg-[var(--color-drum-emerald-500)] px-4 py-3 text-sm font-semibold text-[var(--color-drum-slate-950)] disabled:opacity-50 disabled:cursor-not-allowed shadow hover:bg-[var(--color-drum-emerald-400)]"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button
                type="button"
                onClick={handleResetPattern}
                className="inline-flex items-center gap-2 rounded-2xl border border-[var(--color-drum-slate-600)] bg-[var(--color-drum-slate-800)] px-4 py-3 text-sm text-[var(--color-drum-slate-200)] hover:border-[var(--color-drum-emerald-500)]"
              >
                Reset Grid
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-drum-slate-300)]">
              <span>{audioUnlocked ? 'Audio is enabled and ready to play.' : 'Enable audio first to allow Tone playback.'}</span>
            </div>
          </div>

          <div className="grid gap-3 rounded-3xl border border-[var(--color-drum-slate-700)] bg-[var(--color-drum-slate-800-80)] p-4 text-sm text-[var(--color-drum-slate-300)] sm:grid-cols-2">
            <div className="space-y-2">
              <p className="font-semibold text-[var(--color-drum-white)]">Instructions</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Click a square to toggle a drum hit on or off.</li>
                <li>Use Mute and Volume controls for each instrument row.</li>
                <li>Each measure contains one whole note worth of time (4 quarter notes).</li>
                <li>Subdivisions divide the measure into equal steps: 4 = quarter notes, 8 = eighth notes, 16 = sixteenth notes, etc.</li>
                <li>The BPM (beats per minute) always refers to the quarter note pulse.</li>
                <li>Press Play to hear the loop and watch the current step highlight in green.</li>
              </ul>
            </div>
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-2 text-xs uppercase tracking-[0.2em] text-[var(--color-drum-slate-400)]">
                  Measures
                  <input
                    type="range"
                    min={MIN_MEASURES}
                    max={MAX_MEASURES}
                    value={measures}
                    onChange={(event) => setMeasures(clamp(Number(event.target.value), MIN_MEASURES, MAX_MEASURES))}
                    className="w-full accent-[var(--color-drum-emerald-400)]"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={measuresInputValue}
                      onChange={handleMeasuresInputChange}
                      onBlur={handleMeasuresInputBlur}
                      onKeyDown={handleMeasuresInputKeyDown}
                      onFocus={handleMeasuresInputFocus}
                      className="w-16 rounded-lg border border-[var(--color-drum-slate-600)] bg-[var(--color-drum-slate-800)] px-2 py-1 text-sm text-[var(--color-drum-slate-200)] focus:border-[var(--color-drum-emerald-400)] focus:outline-none"
                    />
                    <span className="text-sm text-[var(--color-drum-slate-200)]">measure{measures > 1 ? 's' : ''}</span>
                  </div>
                </label>
                <label className="space-y-2 text-xs uppercase tracking-[0.2em] text-[var(--color-drum-slate-400)]">
                  Subdivisions
                  <input
                    type="range"
                    min={MIN_SUBDIVISIONS}
                    max={MAX_SUBDIVISIONS}
                    value={subdivisions}
                    onChange={(event) => setSubdivisions(clamp(Number(event.target.value), MIN_SUBDIVISIONS, MAX_SUBDIVISIONS))}
                    className="w-full accent-[var(--color-drum-emerald-400)]"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={subdivisionsInputValue}
                      onChange={handleSubdivisionsInputChange}
                      onBlur={handleSubdivisionsInputBlur}
                      onKeyDown={handleSubdivisionsInputKeyDown}
                      onFocus={handleSubdivisionsInputFocus}
                      className="w-16 rounded-lg border border-[var(--color-drum-slate-600)] bg-[var(--color-drum-slate-800)] px-2 py-1 text-sm text-[var(--color-drum-slate-200)] focus:border-[var(--color-drum-emerald-400)] focus:outline-none"
                    />
                    <span className="text-sm text-[var(--color-drum-slate-200)]">step{subdivisions === 1 ? '' : 's'} per measure</span>
                  </div>
                  <div className="text-xs text-[var(--color-drum-emerald-300)]">{getTimeSignatureDisplay(subdivisions).timeSignature} time ({getTimeSignatureDisplay(subdivisions).noteName})</div>
                </label>
              </div>
              <label className="space-y-2 text-xs uppercase tracking-[0.2em] text-[var(--color-drum-slate-400)]">
                Tempo
                <input
                  type="range"
                  min="20"
                  max="300"
                  value={bpm}
                  onChange={(event) => setBpm(Number(event.target.value))}
                  className="w-full accent-[var(--color-drum-emerald-400)]"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={bpmInputValue}
                    onChange={handleBpmInputChange}
                    onBlur={handleBpmInputBlur}
                    onKeyDown={handleBpmInputKeyDown}
                    onFocus={handleBpmInputFocus}
                    className="w-20 rounded-lg border border-[var(--color-drum-slate-600)] bg-[var(--color-drum-slate-800)] px-2 py-1 text-sm text-[var(--color-drum-slate-200)] focus:border-[var(--color-drum-emerald-400)] focus:outline-none"
                  />
                  <span className="text-sm text-[var(--color-drum-slate-200)]">BPM</span>
                </div>
                <div className="text-xs text-[var(--color-drum-slate-400)]">Effective: {Math.round(bpm * (tempoMode === 'double' ? 2 : tempoMode === 'half' ? 0.5 : 1))} BPM ({tempoMode === 'double' ? 'double time' : tempoMode === 'half' ? 'half time' : 'normal'})</div>
              </label>
              <div className="space-y-2 text-xs uppercase tracking-[0.2em] text-[var(--color-drum-slate-400)]">
                <div className="text-[var(--color-drum-slate-300)]">Tempo mode</div>
                <div className="flex gap-2">
                  {['half', 'normal', 'double'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setTempoMode(mode as 'half' | 'normal' | 'double')}
                      className={`rounded-2xl border px-3 py-2 text-[0.7rem] uppercase tracking-[0.2em] transition-colors duration-150 ${
                        tempoMode === mode ? 'border-[var(--color-drum-emerald-400)] bg-[var(--color-drum-emerald-500-15)] text-[var(--color-drum-emerald-200)]' : 'border-[var(--color-drum-slate-700)] bg-[var(--color-drum-slate-800)] text-[var(--color-drum-slate-300)] hover:border-[var(--color-drum-emerald-400)]'
                      }`}
                    >
                      {mode === 'half' ? 'Half' : mode === 'double' ? 'Double' : 'Normal'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-3xl border border-[var(--color-drum-slate-700)] bg-[var(--color-drum-slate-800-90)] px-4 py-3 text-sm text-[var(--color-drum-slate-300)] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-[var(--color-drum-white)]">Grid</p>
              <p className="text-[var(--color-drum-slate-400)]">{selectedInstruments.length} instruments × {measures} measure{measures === 1 ? '' : 's'} × {subdivisions} step{subdivisions === 1 ? '' : 's'} per measure</p>
            </div>
            <button
              type="button"
              onClick={() => setHasStarted(false)}
              className="rounded-2xl border border-[var(--color-drum-slate-700)] bg-[var(--color-drum-slate-800)] px-3 py-2 text-xs uppercase tracking-[0.25em] text-[var(--color-drum-slate-200)] hover:border-[var(--color-drum-emerald-500)]"
            >
              Change instruments
            </button>
            <div className="rounded-2xl bg-[var(--color-drum-slate-950)] px-3 py-2 text-xs uppercase tracking-[0.25em] text-[var(--color-drum-emerald-300)]">
              {isReady ? 'Samples loaded' : 'Loading samples...'}
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-[var(--color-drum-slate-700)] bg-[var(--color-drum-slate-900-90)] p-4">
            <div className="min-w-full">
              <div className="grid grid-cols-[minmax(12rem,14rem)_1fr] gap-4">
                <div className="space-y-2">
                  <div className="rounded-2xl bg-[var(--color-drum-slate-900-95)] px-3 py-2 text-xs uppercase tracking-[0.2em] text-[var(--color-drum-slate-400)]">Instrument</div>
                </div>
                <div className="rounded-2xl bg-[var(--color-drum-slate-900-95)] px-3 py-2 text-xs uppercase tracking-[0.2em] text-[var(--color-drum-slate-400)]">Pattern</div>
              </div>

              <div className="space-y-3 pt-3">
                {selectedInstruments.map((instrument, instrumentIndex) => (
                  <div key={instrument.key} className="grid grid-cols-[minmax(12rem,14rem)_1fr] gap-4 rounded-3xl border border-[var(--color-drum-slate-800)] bg-[var(--color-drum-slate-950-90)] p-3">
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold text-[var(--color-drum-white)]">{instrument.name}</p>
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-drum-slate-500)]">{instrument.key}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setMuteStates((current) => ({
                              ...current,
                              [instrument.key]: !current[instrument.key],
                            }))
                          }
                          className="inline-flex items-center gap-2 rounded-2xl border border-[var(--color-drum-slate-700)] bg-[var(--color-drum-slate-800)] px-3 py-2 text-xs uppercase tracking-[0.2em] text-[var(--color-drum-slate-200)] hover:border-[var(--color-drum-emerald-500)]"
                        >
                          {muteStates[instrument.key] ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                          {muteStates[instrument.key] ? 'Muted' : 'Live'}
                        </button>
                      </div>
                      <label className="space-y-1 text-xs uppercase tracking-[0.2em] text-[var(--color-drum-slate-400)]">
                        Volume
                        <input
                          type="range"
                          min={-24}
                          max={6}
                          value={volumeStates[instrument.key]}
                          onChange={(event) =>
                            setVolumeStates((current) => ({
                              ...current,
                              [instrument.key]: Number(event.target.value),
                            }))
                          }
                          className="w-full accent-[var(--color-drum-emerald-400)]"
                        />
                      </label>
                    </div>

                    <div 
                      ref={(el) => {
                        scrollRefs.current[instrumentIndex] = el
                      }}
                      className="overflow-x-auto rounded-3xl border border-[var(--color-drum-slate-800)] bg-[var(--color-drum-slate-900-95)] p-2"
                      onScroll={(event) => handleScroll(event, instrumentIndex)}
                    >
                      <div className="space-y-2">
                        {Array.from({ length: measures }, (_, measureIndex) => (
                          <div key={measureIndex} className="text-center">
                            <div className="mb-1 text-xs text-[var(--color-drum-slate-500)] uppercase tracking-[0.2em]">
                              Measure {measureIndex + 1}
                            </div>
                            <div
                              className="grid gap-1"
                              style={{ gridTemplateColumns: `repeat(${subdivisions}, minmax(2rem, 1fr))` }}
                            >
                              {Array.from({ length: subdivisions }, (_, subdivisionIndex) => {
                                const stepIndex = measureIndex * subdivisions + subdivisionIndex
                                const active = pattern[instrumentIndex]?.[stepIndex] || false
                                const isCurrent = currentStep === stepIndex && isPlaying
                                return (
                                  <button
                                    key={`${instrument.key}-${stepIndex}`}
                                    type="button"
                                    onClick={() => toggleCell(instrumentIndex, stepIndex)}
                                    className={`h-10 rounded-xl border transition-colors duration-150 ${
                                      active
                                        ? 'border-[var(--color-drum-emerald-400)] bg-[var(--color-drum-emerald-500-80)] text-[var(--color-drum-slate-950)]'
                                        : 'border-[var(--color-drum-slate-700)] bg-[var(--color-drum-slate-800)] text-[var(--color-drum-slate-300)]'
                                      } ${isCurrent ? 'shadow-[0_0_0_3px_var(--color-drum-current-step-ring)]' : ''}`}
                                    aria-label={`Measure ${measureIndex + 1}, Step ${subdivisionIndex + 1} ${active ? 'active' : 'inactive'}`}
                                  >
                                    <span className="text-[0.65rem] leading-none">{subdivisionIndex + 1}</span>
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DrumMachine() {
  return (
    <QueryClientProvider client={queryClient}>
      <DrumMachineInner />
    </QueryClientProvider>
  )
}
