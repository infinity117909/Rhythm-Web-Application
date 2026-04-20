import { useState, useEffect, useRef } from 'react'
import { MetronomeProvider, useMetronome, METRONOME_TYPES } from '@/metronome/MetronomeContext'

interface VisualizerProps {
  beats: number
  currentBeat: number
  isPlaying: boolean
  label: string
  compact?: boolean
  bpm: number
}

// --- Beat rectangle visualizer (Block Beat) ---

function BlockBeatVisualizer({ beats, currentBeat, label, compact = false }: VisualizerProps) {
  const width = compact ? '4rem' : '5rem'
  const height = compact ? '6rem' : '10rem'

  return (
    <div className="flex flex-col items-center gap-4 w-full justify-center">
      <h2 className="text-xl font-semibold text-shadow-grey-900 tracking-wide">{label}</h2>
      <div className="flex flex-row gap-3 items-center justify-center flex-wrap">
        {Array.from({ length: beats }, (_, i) => {
          const isActive = currentBeat === i
          const isAccent = i === 0

          let bgClass = 'bg-pale-sky-300'
          if (isActive && isAccent) bgClass = 'bg-shadow-grey-900'
          else if (isActive) bgClass = 'bg-blue-slate-600'
          else if (isAccent) bgClass = 'bg-pale-sky-300 border-2 border-blue-slate-600'

          return (
            <div
              key={i}
              className={`
                flex items-center justify-center rounded-md
                transition-all duration-75 select-none
                ${bgClass}
                ${isActive ? 'scale-105 shadow-lg' : 'scale-100 shadow-sm'}
              `}
              style={{ width, height }}
            >
              <span className={`text-2xl font-bold ${isActive ? 'text-azure-mist-50' : 'text-shadow-grey-900'}`}>
                {i + 1}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// --- Pulse visualizer ---

function PulseVisualizer({ beats, currentBeat, isPlaying, label, compact = false }: VisualizerProps) {
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    if (currentBeat >= 0) {
      setPulse(true)
      const t = setTimeout(() => setPulse(false), 120)
      return () => clearTimeout(t)
    }
  }, [currentBeat])

  const isAccent = currentBeat === 0
  const circleSize = compact ? '9rem' : '12rem'

  return (
    <div className="flex flex-col items-center gap-4 w-full justify-center">
      <h2 className="text-xl font-semibold text-shadow-grey-900 tracking-wide">{label}</h2>
      <div className="flex gap-3 mb-2">
        {Array.from({ length: beats }, (_, i) => (
          <div
            key={i}
            className={`
              w-4 h-4 rounded-full transition-all duration-75
              ${currentBeat === i ? 'bg-shadow-grey-900 scale-125' : 'bg-pale-sky-300'}
            `}
          />
        ))}
      </div>
      <div
        className={`
          rounded-full flex items-center justify-center
          transition-all duration-75
          ${pulse
            ? isAccent
              ? 'bg-shadow-grey-900 scale-110'
              : 'bg-blue-slate-600 scale-105'
            : 'bg-pale-sky-300 scale-100'}
        `}
        style={{ width: circleSize, height: circleSize }}
      >
        <span className={`text-3xl font-bold ${pulse ? 'text-azure-mist-50' : 'text-shadow-grey-900'}`}>
          {currentBeat >= 0 ? currentBeat + 1 : isPlaying ? '...' : '-'}
        </span>
      </div>
    </div>
  )
}

// --- Pendulum visualizer ---

function PendulumVisualizer({ beats, currentBeat, isPlaying, label, compact = false, bpm }: VisualizerProps) {
  const [angle, setAngle] = useState(0)
  const directionRef = useRef(1)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (!isPlaying) {
      setAngle(0)
      return
    }

    const beatMs = (60 / bpm) * 1000
    const steps = 30
    const stepMs = beatMs / steps

    intervalRef.current = setInterval(() => {
      setAngle((prev) => {
        const next = prev + directionRef.current * (45 / steps)
        if (next >= 45) {
          directionRef.current = -1
          return 45
        }
        if (next <= -45) {
          directionRef.current = 1
          return -45
        }
        return next
      })
    }, stepMs)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, bpm])

  const isAccent = currentBeat === 0

  return (
    <div className="flex flex-col items-center gap-3 w-full justify-center">
      <h2 className="text-xl font-semibold text-shadow-grey-900 tracking-wide">{label}</h2>
      <div className="flex gap-3 mb-1">
        {Array.from({ length: beats }, (_, i) => (
          <div
            key={i}
            className={`
              w-3 h-3 rounded-full transition-all duration-75
              ${currentBeat === i ? 'bg-shadow-grey-900 scale-125' : 'bg-pale-sky-300'}
            `}
          />
        ))}
      </div>
      <svg viewBox="-80 0 160 200" className={compact ? 'w-36 h-48' : 'w-48 h-64'} style={{ overflow: 'visible' }}>
        <circle cx="0" cy="10" r="5" fill="var(--color-blue-slate-600)" />
        <g transform={`rotate(${angle}, 0, 10)`} style={{ transition: 'transform 50ms linear' }}>
          <line x1="0" y1="10" x2="0" y2="160" stroke="var(--color-blue-slate-600)" strokeWidth="3" />
          <circle
            cx="0"
            cy="168"
            r="22"
            fill={
              isAccent && currentBeat >= 0
                ? 'var(--color-shadow-grey-900)'
                : currentBeat >= 0
                  ? 'var(--color-blue-slate-600)'
                  : 'var(--color-pale-sky-300)'
            }
            className="transition-colors duration-75"
          />
          <text
            x="0"
            y="168"
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--color-azure-mist-50)"
            fontSize="16"
            fontWeight="bold"
          >
            {currentBeat >= 0 ? currentBeat + 1 : ''}
          </text>
        </g>
      </svg>
    </div>
  )
}

function renderVisualizer(
  metronomeType: string,
  props: VisualizerProps,
) {
  switch (metronomeType) {
    case 'Pulse':
      return <PulseVisualizer {...props} />
    case 'Pendulum':
      return <PendulumVisualizer {...props} />
    default:
      return <BlockBeatVisualizer {...props} />
  }
}

// --- Center panel ---

function CenterVisualizer() {
  const {
    metronomeType,
    timeSignature,
    currentBeat,
    currentPolyBeat,
    isPlaying,
    bpm,
    isPolyrhythmEnabled,
    polyrhythmValue,
  } = useMetronome()

  return (
    <div className="flex flex-col w-full items-center justify-center gap-5">
      {renderVisualizer(metronomeType, {
        beats: timeSignature.beats,
        currentBeat,
        isPlaying,
        label: metronomeType,
        bpm,
      })}

      {isPolyrhythmEnabled && (
        <div className="w-full border-t-2 border-pale-sky-300/60 pt-4">
          {renderVisualizer(metronomeType, {
            beats: polyrhythmValue,
            currentBeat: currentPolyBeat,
            isPlaying,
            label: `Polyrhythm ${polyrhythmValue}/${timeSignature.noteValue}`,
            compact: true,
            bpm,
          })}
        </div>
      )}
    </div>
  )
}

// --- BPM control ---

function BpmControl() {
  const { bpm, setBpm } = useMetronome()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(bpm))

  const commit = () => {
    const v = parseInt(draft, 10)
    if (!isNaN(v)) setBpm(v)
    setEditing(false)
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <label className="text-xs uppercase tracking-widest text-blue-slate-600 font-semibold">BPM</label>
      {editing ? (
        <input
          autoFocus
          type="number"
          min={20}
          max={300}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === 'Enter' && commit()}
          className="w-24 text-center text-shadow-grey-900 bg-azure-mist-50 border-2 border-blue-slate-600 rounded-lg p-1 text-lg font-bold focus:outline-none"
        />
      ) : (
        <button
          onClick={() => {
            setDraft(String(bpm))
            setEditing(true)
          }}
          className="w-24 text-center text-shadow-grey-900 bg-azure-mist-50 border-2 border-pale-sky-300 hover:border-blue-slate-600 rounded-lg p-1 text-lg font-bold transition-colors"
          title="Click to edit BPM"
        >
          {bpm}
        </button>
      )}
      <div className="flex gap-1 mt-1">
        <button
          onClick={() => setBpm(bpm - 5)}
          className="px-2 py-0.5 text-sm rounded bg-pale-sky-300 hover:bg-blue-slate-600 hover:text-azure-mist-50 text-shadow-grey-900 transition-colors"
        >
          -5
        </button>
        <button
          onClick={() => setBpm(bpm - 1)}
          className="px-2 py-0.5 text-sm rounded bg-pale-sky-300 hover:bg-blue-slate-600 hover:text-azure-mist-50 text-shadow-grey-900 transition-colors"
        >
          -1
        </button>
        <button
          onClick={() => setBpm(bpm + 1)}
          className="px-2 py-0.5 text-sm rounded bg-pale-sky-300 hover:bg-blue-slate-600 hover:text-azure-mist-50 text-shadow-grey-900 transition-colors"
        >
          +1
        </button>
        <button
          onClick={() => setBpm(bpm + 5)}
          className="px-2 py-0.5 text-sm rounded bg-pale-sky-300 hover:bg-blue-slate-600 hover:text-azure-mist-50 text-shadow-grey-900 transition-colors"
        >
          +5
        </button>
      </div>
    </div>
  )
}

// --- Time signature control ---

const TUPLET_NAMES: Record<number, string> = {
  1: 'whole beat',
  2: 'duplet',
  3: 'triplet',
  4: 'quadruplet',
  5: 'quintuplet',
  6: 'sextuplet',
  7: 'septuplet',
  8: 'octuplet',
  9: 'nontuplet',
  10: 'ten-tuplet',
}

function TimeSigControl() {
  const { timeSignature, setTimeSignature } = useMetronome()
  const [beatsDraft, setBeatsDraft] = useState(String(timeSignature.beats))
  const [noteValueDraft, setNoteValueDraft] = useState(String(timeSignature.noteValue))

  useEffect(() => {
    setBeatsDraft(String(timeSignature.beats))
    setNoteValueDraft(String(timeSignature.noteValue))
  }, [timeSignature.beats, timeSignature.noteValue])

  const commit = () => {
    const beats = Number.parseInt(beatsDraft, 10)
    const noteValue = Number.parseInt(noteValueDraft, 10)
    if (Number.isNaN(beats) || Number.isNaN(noteValue)) {
      setBeatsDraft(String(timeSignature.beats))
      setNoteValueDraft(String(timeSignature.noteValue))
      return
    }
    setTimeSignature({
      beats: Math.max(1, Math.min(32, beats)),
      noteValue: Math.max(1, Math.min(16, noteValue)),
    })
  }

  const tupletLabel =
    TUPLET_NAMES[timeSignature.noteValue] ?? `${timeSignature.noteValue}-tuplet`

  return (
    <div className="flex flex-col items-center gap-1">
      <label className="text-xs uppercase tracking-widest text-blue-slate-600 font-semibold">Time Sig</label>
      <div className="flex items-center gap-1">
        <input
          type="number"
          min={1}
          max={32}
          value={beatsDraft}
          onChange={(e) => setBeatsDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === 'Enter' && commit()}
          className="w-16 text-center text-shadow-grey-900 bg-azure-mist-50 border-2 border-pale-sky-300 hover:border-blue-slate-600 rounded-lg p-1 text-lg font-bold transition-colors"
          aria-label="Time signature numerator"
        />
        <span className="text-lg font-bold text-azure-mist-50">/</span>
        <input
          type="number"
          min={1}
          max={16}
          value={noteValueDraft}
          onChange={(e) => setNoteValueDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === 'Enter' && commit()}
          className="w-16 text-center text-shadow-grey-900 bg-azure-mist-50 border-2 border-pale-sky-300 hover:border-blue-slate-600 rounded-lg p-1 text-lg font-bold transition-colors"
          aria-label="Time signature denominator"
        />
      </div>
      <p className="text-[10px] text-pale-sky-300 text-center leading-tight max-w-36">
        #{timeSignature.noteValue}: {timeSignature.noteValue} beats per measure or one {tupletLabel}
      </p>
    </div>
  )
}

// --- Right panel: controls ---

function ControlsPanel() {
  const {
    isAudioEnabled,
    isPlaying,
    metronomeType,
    metronomeTypeIndex,
    enableAudio,
    play,
    pause,
    stop,
    restart,
    cycleType,
    isPolyrhythmEnabled,
    polyrhythmValue,
    setIsPolyrhythmEnabled,
    setPolyrhythmValue,
  } = useMetronome()

  return (
    <aside className="flex flex-col gap-5 h-full rounded-2xl bg-shadow-grey-900 p-5 text-azure-mist-50">
      <h2 className="text-center text-lg font-semibold tracking-wide border-b border-blue-slate-600 pb-2">Controls</h2>

      <div className="flex flex-col items-center gap-2">
        <span className="text-xs uppercase tracking-widest text-pale-sky-300">Metronome Type</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => cycleType(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-slate-600 hover:bg-pale-sky-300 hover:text-shadow-grey-900 transition-colors text-lg"
            aria-label="Previous metronome type"
          >
            {'<'}
          </button>
          <span className="text-sm font-medium w-24 text-center">{metronomeType}</span>
          <button
            onClick={() => cycleType(1)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-slate-600 hover:bg-pale-sky-300 hover:text-shadow-grey-900 transition-colors text-lg"
            aria-label="Next metronome type"
          >
            {'>'}
          </button>
        </div>
        <div className="flex gap-2">
          {METRONOME_TYPES.map((_type: string, i: number) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${i === metronomeTypeIndex ? 'bg-azure-mist-50' : 'bg-blue-slate-600'}`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-row gap-4 justify-center flex-wrap">
        <BpmControl />
        <TimeSigControl />
      </div>

      <div className="rounded-xl bg-blue-slate-600/30 border border-blue-slate-600 p-3 text-sm text-pale-sky-300 leading-relaxed">
        <p className="text-xs uppercase tracking-widest text-pale-sky-300 mb-2 font-semibold">Polyrhythm</p>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isPolyrhythmEnabled}
            onChange={(e) => setIsPolyrhythmEnabled(e.target.checked)}
            className="h-4 w-4 rounded border-pale-sky-300 bg-azure-mist-50 text-shadow-grey-900"
          />
          <span className="text-azure-mist-50">Enable polyrhythm visual</span>
        </label>

        {isPolyrhythmEnabled && (
          <div className="mt-3 flex items-center gap-2">
            <label htmlFor="polyrhythm-value" className="text-xs uppercase tracking-widest text-pale-sky-300">Value</label>
            <select
              id="polyrhythm-value"
              value={polyrhythmValue}
              onChange={(e) => setPolyrhythmValue(Number(e.target.value))}
              className="ml-auto rounded-lg border border-pale-sky-300 bg-azure-mist-50 px-3 py-1 text-shadow-grey-900 font-semibold"
            >
              {[2, 3, 4, 5, 6].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex-1 rounded-xl bg-blue-slate-600/30 border border-blue-slate-600 p-3 text-sm text-pale-sky-300 leading-relaxed">
        <p className="text-xs uppercase tracking-widest text-pale-sky-300 mb-2 font-semibold">Modifiers</p>
        <p>
          BPM range: <span className="text-azure-mist-50 font-medium">20 - 300</span>
        </p>
        <p className="mt-1">
          Beat 1 plays an <span className="text-azure-mist-50 font-medium">accented</span> low tone.
          All other beats play a <span className="text-azure-mist-50 font-medium">softer</span> click.
        </p>
        <p className="mt-1">
          Switch between <span className="text-azure-mist-50 font-medium">{METRONOME_TYPES.join(', ')}</span> visualizations using the arrows above.
        </p>
      </div>

      {!isAudioEnabled && (
        <button
          onClick={enableAudio}
          className="w-full py-2 rounded-xl bg-pale-sky-300 text-shadow-grey-900 font-semibold text-sm hover:bg-azure-mist-50 transition-colors"
        >
          Enable Audio
        </button>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <button
            onClick={isPlaying ? pause : play}
            disabled={!isAudioEnabled}
            className={`
              flex-1 py-2.5 rounded-xl font-semibold transition-colors text-sm
              ${isAudioEnabled
                ? isPlaying
                  ? 'bg-blue-slate-600 text-azure-mist-50 hover:bg-pale-sky-300 hover:text-shadow-grey-900'
                  : 'bg-pale-sky-300 text-shadow-grey-900 hover:bg-azure-mist-50'
                : 'bg-blue-slate-600/30 text-blue-slate-600 cursor-not-allowed'}
            `}
          >
            {isPlaying ? '|| Pause' : '> Play'}
          </button>
          <button
            onClick={restart}
            disabled={!isAudioEnabled}
            className={`
              flex-1 py-2.5 rounded-xl font-semibold transition-colors text-sm
              ${isAudioEnabled
                ? 'bg-blue-slate-600 text-azure-mist-50 hover:bg-pale-sky-300 hover:text-shadow-grey-900'
                : 'bg-blue-slate-600/30 text-blue-slate-600 cursor-not-allowed'}
            `}
          >
            Restart
          </button>
        </div>
        <button
          onClick={stop}
          disabled={!isAudioEnabled}
          className={`
            w-full py-2.5 rounded-xl font-semibold transition-colors text-sm
            ${isAudioEnabled
              ? 'bg-blue-slate-600 text-azure-mist-50 hover:bg-pale-sky-300 hover:text-shadow-grey-900'
              : 'bg-blue-slate-600/30 text-blue-slate-600 cursor-not-allowed'}
          `}
        >
          Stop
        </button>
        {!isAudioEnabled && <p className="text-xs text-blue-slate-600 text-center">Enable audio first</p>}
      </div>
    </aside>
  )
}

// --- Left panel: instructions ---

function InstructionsPanel() {
  return (
    <aside className="flex flex-col gap-4 h-full rounded-2xl border-2 border-pale-sky-300 bg-azure-mist-50/60 p-5">
      <h2 className="text-lg font-semibold text-shadow-grey-900 border-b border-pale-sky-300 pb-2">How to Use</h2>
      <ol className="list-decimal list-inside space-y-3 text-sm text-shadow-grey-900 leading-relaxed">
        <li>
          Click <strong>"Enable Audio"</strong> in the Controls panel to unlock your browser audio.
        </li>
        <li>
          Set your tempo with <strong>BPM</strong>, then choose your base <strong>Time Sig</strong>.
        </li>
        <li>
          Toggle <strong>Polyrhythm</strong> on and choose a value from <strong>2 to 6</strong> to render
          a second synchronized metronome underneath the main visualizer.
        </li>
        <li>
          Press <strong>Play</strong> to start and <strong>Pause</strong> or <strong>Restart</strong> as needed.
        </li>
      </ol>
      <div className="mt-auto rounded-xl bg-pale-sky-300/40 p-3 text-xs text-blue-slate-600 leading-relaxed">
        <strong>Tip:</strong> Beat 1 of each row is accented to keep the downbeat obvious while practicing subdivisions.
      </div>
    </aside>
  )
}

// --- Page ---

function MetronomePage() {
  const { timeSignature, isPlaying, currentBeat, isPolyrhythmEnabled, polyrhythmValue } = useMetronome()

  return (
    <div className="min-h-screen bg-azure-mist-50 flex flex-col font-gotu">
      <header className="bg-shadow-grey-900 text-azure-mist-50 py-4 px-8 shadow-lg">
        <h1 className="text-center text-2xl md:text-3xl font-semibold tracking-widest uppercase">Metronome</h1>
        <p className="text-center text-xs text-pale-sky-300 tracking-wide mt-0.5">
          {timeSignature.beats}/{timeSignature.noteValue}
          {isPolyrhythmEnabled ? ` + ${polyrhythmValue}/${timeSignature.noteValue}` : ''}
          {' · '}
          {isPlaying ? (
            <span className="text-azure-mist-50">Beat {currentBeat >= 0 ? currentBeat + 1 : '-'} of {timeSignature.beats}</span>
          ) : (
            <span className="text-blue-slate-600">Stopped</span>
          )}
        </p>
      </header>

      <main className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-4 p-4 md:p-6 max-w-7xl mx-auto w-full">
        <InstructionsPanel />

        <section className="rounded-2xl border-2 border-pale-sky-300 bg-white/40 flex items-center justify-center min-h-[22rem] p-6">
          <CenterVisualizer />
        </section>

        <ControlsPanel />
      </main>
    </div>
  )
}

// --- Export ---

export default function Metronome() {
  return (
    <MetronomeProvider>
      <MetronomePage />
    </MetronomeProvider>
  )
}
