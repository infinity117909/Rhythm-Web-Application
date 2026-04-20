import * as Tone from "tone";
import { extractDrumNotes } from "./extractDrumNotes";
import { INSTRUMENT_ID_TO_MIDI } from "./instrumentToMidi";
import { DRUM_MIDI_TO_SAMPLE } from "@/utils/MIDIMapper";
import { drumEngine } from "@/utils/DrumEngine";

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
