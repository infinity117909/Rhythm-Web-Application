import * as Tone from "tone";
import { extractDrumNotes } from "./extractDrumNotes";
import { INSTRUMENT_ID_TO_MIDI } from "./instrumentToMidi";
import { DRUM_MIDI_TO_SAMPLE } from "@/utils/MIDIMapper";
import { drumEngine } from "@/utils/DrumEngine";

/**
 * Orchestrates end-to-end MusicXML drum playback by resolving notes from the
 * parsed document and scheduling them through the Tone.js Transport.
 *
 * Playback pipeline:
 * 1. Calls {@link extractDrumNotes} to get the flat note sequence.
 * 2. Reads `<divisions>` (subdivisions per quarter note) and `<sound tempo>`
 *    from the XML document to compute the seconds-per-division ratio.
 * 3. For each note, resolves:
 *    - `instrumentId` → MIDI number via {@link INSTRUMENT_ID_TO_MIDI}
 *    - MIDI number → sample key via {@link DRUM_MIDI_TO_SAMPLE}
 * 4. Schedules each sample hit with `Tone.Transport.scheduleOnce` at the
 *    correct absolute time offset from `Tone.now()`.
 * 5. Starts the Tone.js Transport.
 *
 * @param xml - A parsed MusicXML `Document` produced by {@link parseMusicXML}.
 *
 * @example
 * const doc = parseMusicXML(await loadMusicXML("/scores/Basic Swing.musicxml"));
 * await playMusicXMLDrums(doc);
 */
export async function playMusicXMLDrums(xml: Document) {
  const notes = extractDrumNotes(xml);

  // Get divisions + tempo from MusicXML
  const divisionsNode = xml.querySelector("divisions");
  const tempoNode = xml.querySelector("sound[tempo]");
  const divisions = divisionsNode ? Number(divisionsNode.textContent) : 1;
  const tempo = tempoNode ? Number(tempoNode.getAttribute("tempo")) : 120;

  const secondsPerBeat = 60 / tempo;
  const secondsPerDivision = secondsPerBeat / divisions;

  await Tone.start();
  let currentTime = Tone.now();

  for (const note of notes) {
    if (!note.instrumentId) continue;

    const midi = INSTRUMENT_ID_TO_MIDI[note.instrumentId];
    if (!midi) continue;

    const sampleKey = DRUM_MIDI_TO_SAMPLE[midi];
    if (!sampleKey) continue;

    const durationSeconds = note.durationDivisions * secondsPerDivision;

    // schedule playback
    Tone.Transport.scheduleOnce((time) => {
      drumEngine.play(sampleKey);
    }, currentTime - Tone.now());

    currentTime += durationSeconds;
  }

  Tone.Transport.start();
}
