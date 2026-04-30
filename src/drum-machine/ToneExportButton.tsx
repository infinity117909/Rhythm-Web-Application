import { useMemo, useState } from 'react'

type ExportInstrument = {
  key: string
  name: string
}

type ToneExportButtonProps = {
  bpm: number
  measures: number
  subdivisions: number
  tempoMode: 'half' | 'normal' | 'double'
  pattern: boolean[][]
  selectedInstruments: ExportInstrument[]
  selectedSampleFiles: Record<string, string>
  muteStates: Record<string, boolean>
  volumeStates: Record<string, number>
}

type SaveFilePickerWindow = Window & {
  showSaveFilePicker?: (options?: {
    suggestedName?: string
    types?: Array<{
      description?: string
      accept: Record<string, string[]>
    }>
  }) => Promise<{
    createWritable: () => Promise<{
      write: (data: Blob) => Promise<void>
      close: () => Promise<void>
    }>
  }>
}

const SAMPLE_RATE = 44100
const EXPORT_TAIL_SECONDS = 2.5

function dbToGain(value: number) {
  return Math.pow(10, value / 20)
}

function sanitizeFileName(value: string) {
  return value.replace(/[^a-z0-9-_]+/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

function writeAscii(view: DataView, offset: number, value: string) {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index))
  }
}

function audioBufferToWavBlob(audioBuffer: AudioBuffer) {
  const channelCount = audioBuffer.numberOfChannels
  const sampleCount = audioBuffer.length
  const bytesPerSample = 2
  const blockAlign = channelCount * bytesPerSample
  const byteRate = audioBuffer.sampleRate * blockAlign
  const dataSize = sampleCount * blockAlign
  const buffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(buffer)

  writeAscii(view, 0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeAscii(view, 8, 'WAVE')
  writeAscii(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, channelCount, true)
  view.setUint32(24, audioBuffer.sampleRate, true)
  view.setUint32(28, byteRate, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, 16, true)
  writeAscii(view, 36, 'data')
  view.setUint32(40, dataSize, true)

  let offset = 44

  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    for (let channelIndex = 0; channelIndex < channelCount; channelIndex += 1) {
      const channelData = audioBuffer.getChannelData(channelIndex)
      const sample = Math.max(-1, Math.min(1, channelData[sampleIndex] ?? 0))
      const pcmValue = sample < 0 ? sample * 0x8000 : sample * 0x7fff
      view.setInt16(offset, pcmValue, true)
      offset += bytesPerSample
    }
  }

  return new Blob([buffer], { type: 'audio/wav' })
}

async function saveBlobToFile(blob: Blob, fileName: string) {
  const saveWindow = window as SaveFilePickerWindow

  if (typeof saveWindow.showSaveFilePicker === 'function') {
    const handle = await saveWindow.showSaveFilePicker({
      suggestedName: fileName,
      types: [
        {
          description: 'WAV audio file',
          accept: { 'audio/wav': ['.wav'] },
        },
      ],
    })

    const writable = await handle.createWritable()
    await writable.write(blob)
    await writable.close()
    return
  }

  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.click()
  URL.revokeObjectURL(url)
}

async function decodeSampleBuffers(
  selectedInstruments: ExportInstrument[],
  selectedSampleFiles: Record<string, string>,
) {
  const audioContext = new AudioContext({ sampleRate: SAMPLE_RATE })

  try {
    return await Promise.all(
      selectedInstruments.map(async (instrument) => {
        const sampleFile = selectedSampleFiles[instrument.key]

        if (!sampleFile) {
          throw new Error(`Missing sample file for ${instrument.name}.`)
        }

        const response = await fetch(`/drums/${sampleFile}`)
        if (!response.ok) {
          throw new Error(`Failed to load ${sampleFile}.`)
        }

        const bufferData = await response.arrayBuffer()
        return {
          instrument,
          buffer: await audioContext.decodeAudioData(bufferData.slice(0)),
        }
      }),
    )
  } finally {
    await audioContext.close()
  }
}

export function ToneExportButton({
  bpm,
  measures,
  subdivisions,
  tempoMode,
  pattern,
  selectedInstruments,
  selectedSampleFiles,
  muteStates,
  volumeStates,
}: ToneExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const hasActiveNotes = useMemo(
    () => pattern.some((row) => row.some(Boolean)),
    [pattern],
  )

  const handleExport = async () => {
    if (!selectedInstruments.length || !hasActiveNotes) {
      return
    }

    setIsExporting(true)
    setErrorMessage(null)

    try {
      const tempoMultiplier = tempoMode === 'double' ? 2 : tempoMode === 'half' ? 0.5 : 1
      const effectiveBpm = bpm * tempoMultiplier
      const quarterNoteDuration = 60 / effectiveBpm
      const measureDuration = 4 * quarterNoteDuration
      const stepDurationSeconds = measureDuration / subdivisions

      const decodedBuffers = await decodeSampleBuffers(selectedInstruments, selectedSampleFiles)

      const maxSampleSeconds = decodedBuffers.reduce(
        (maxDuration, current) => Math.max(maxDuration, current.buffer.duration),
        0,
      )

      const loopDuration = measures * measureDuration
      const exportDuration = loopDuration + Math.max(EXPORT_TAIL_SECONDS, maxSampleSeconds)
      const frameCount = Math.ceil(exportDuration * SAMPLE_RATE)
      const offlineContext = new OfflineAudioContext(2, frameCount, SAMPLE_RATE)

      decodedBuffers.forEach(({ instrument, buffer }, instrumentIndex) => {
        if (muteStates[instrument.key]) {
          return
        }

        const gainValue = dbToGain(volumeStates[instrument.key] ?? -3)

        for (let stepIndex = 0; stepIndex < measures * subdivisions; stepIndex += 1) {
          if (!pattern[instrumentIndex]?.[stepIndex]) {
            continue
          }

          const source = offlineContext.createBufferSource()
          source.buffer = buffer

          const gainNode = offlineContext.createGain()
          gainNode.gain.value = gainValue

          source.connect(gainNode)
          gainNode.connect(offlineContext.destination)

          const startTime = stepIndex * stepDurationSeconds
          source.start(startTime)

          if (instrument.key === 'Bb2') {
            source.stop(startTime + stepDurationSeconds)
          }
        }
      })

      const renderedBuffer = await offlineContext.startRendering()
      const fileStem = sanitizeFileName(`drum-pattern-${Math.round(effectiveBpm)}bpm-${measures}m-${subdivisions}steps`)
      const wavBlob = audioBufferToWavBlob(renderedBuffer)

      await saveBlobToFile(wavBlob, `${fileStem}.wav`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to export audio.'
      setErrorMessage(message)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleExport}
        disabled={isExporting || !selectedInstruments.length || !hasActiveNotes}
        className="inline-flex items-center gap-2 rounded-2xl border border-[var(--color-dusty-grape-500)] bg-[var(--color-dusty-grape-700)] px-4 py-3 text-sm text-[var(--color-dusty-lavender-100)] disabled:cursor-not-allowed disabled:opacity-50 hover:border-[var(--color-azure-mist-500)]"
      >
        {isExporting ? 'Exporting WAV...' : 'Export Audio'}
      </button>
      <p className="text-xs text-[var(--color-dusty-lavender-300)]">
        Saves one rendered loop to a WAV file on your device.
      </p>
      {errorMessage ? <p className="text-xs text-red-300">{errorMessage}</p> : null}
    </div>
  )
}