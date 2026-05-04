import * as OSMD from 'opensheetmusicdisplay';
const { OpenSheetMusicDisplay, MusicSheet, CursorType, MusicSheetReader, InstrumentReader, VoiceGenerator, MusicSheetCalculator } = OSMD;
import * as Tone from "tone";
import { DRUM_MIDI_TO_SAMPLE } from "@/utils/MIDIMapper";
import { drumEngine } from '../utils/DrumEngine';

/**
 * Internal representation of OSMD sub-instrument MIDI metadata.
 * Extracted from the `<midi-instrument>` elements of a MusicXML file.
 *
 * @property id             - Sub-instrument id string (e.g. `"P1-X1"`).
 * @property name           - Human-readable instrument name.
 * @property midiProgram    - OSMD MIDI instrument reference.
 * @property unpitchedNote  - GM unpitched MIDI note number (e.g. 55 for splash).
 * @property volume         - Linear volume 0.0–1.0 (sourced from MusicXML `<volume>`).
 * @property pan            - Stereo pan position -1.0 (left) to 1.0 (right).
 */
interface XmlDrumData {
   id: string;
   name: string;
   midiProgram: OSMD.MidiInstrument;
   unpitchedNote: number;
   volume: number;
   pan: number;
}

/**
 * Drives OSMD cursor-step playback synchronised to a live BPM clock.
 *
 * On each tick of the internal interval, the controller:
 * 1. Reads the notes under the current cursor position via `NotesUnderCursor()`.
 * 2. Resolves each note’s sub-instrument `fixedKey` to a GM MIDI number.
 * 3. Looks up the matching sample key in {@link DRUM_MIDI_TO_SAMPLE}.
 * 4. Triggers the sample through the {@link drumEngine} singleton.
 * 5. Advances the OSMD cursor to the next position.
 *
 * @example
 * const controller = new BPMCursorController(osmdInstance, osmdInstance.Sheet);
 * controller.setBPM(120);
 * controller.setLoop(true);
 * controller.start();
 * // Later:
 * controller.stop();
 */
export class BPMCursorController {
   private osmd: OSMD.OpenSheetMusicDisplay;
   private sheet: OSMD.MusicSheet;
   private cursor: OSMD.Cursor;
   private isPlaying: boolean = false;
   private intervalId: NodeJS.Timeout | null = null;
   private currentBPM: number = 120;
   private timeout: NodeJS.Timeout = setInterval(() => { });

   private loop: boolean = false;

   /**
    * Enables or disables automatic cursor looping.
    * When `true`, the cursor resets to measure 1 after reaching the end of the score.
    *
    * @param loop - `true` to enable looping, `false` to stop at the end.
    */
   public setLoop(loop: boolean) {
      this.loop = loop;
   }


   /**
    * Reads the notes currently under the OSMD cursor, resolves each one to a
    * drum sample key, and triggers playback via the {@link drumEngine} singleton.
    *
    * Resolution chain:
    * `OSMD Note.PlaybackInstrumentId` → `SubInstrument.fixedKey` (MIDI number)
    * → {@link DRUM_MIDI_TO_SAMPLE} key → `drumEngine.play(key, volumeMultiplier)`
    *
    * Accented notes (detected via `VoiceEntry.isAccent()`) are played with a
    * volume multiplier of `5` to simulate a harder hit.
    *
    * @returns Array of sample key strings that were triggered on this tick.
    */
   private getToneNotesFromCursor(): string[] {
      const notes = this.cursor.NotesUnderCursor();
      const result: string[] = [];
      let instruments: OSMD.Instrument[] = this.sheet.Instruments;
      //const gnotes = this.cursor.GNotesUnderCursor();      

      let instrument: OSMD.SubInstrument[][] = [];
      for (let i = 0; i < instruments.length; i++) {
         instrument.push(instruments[i].SubInstruments);
      }      

      for (const n of notes) {
         const sheet = n.ParentVoiceEntry.ParentVoice.Parent.GetMusicSheet;
         //let p: XmlDrumData[] = [];

         const drumInstrument = sheet.Instruments.find(inst => inst.Name === "Drums");
         if (drumInstrument) {
            for (const subInstrument of drumInstrument.SubInstruments) {
               // Each subInstrument represents one of your midi-instrument elements
               //console.log(`Drum part MIDI data:`, {
               //   id: subInstrument.idString, // e.g., "P1-X1", "P1-X4", etc.
               //   name: subInstrument.name,
               //   midiProgram: subInstrument.midiInstrumentID,
               //   unpitchedNote: subInstrument.fixedKey, // Your midi-unpitched values (all 55)
               //   volume: subInstrument.volume, // 0.6299 (80/127)
               //   pan: subInstrument.pan // 0.0
               //});
            }
         }

         let midi = 0;

         //// Drum example ONLY
         //const drums: OSMD.SubInstrument[] = instruments[0].SubInstruments; //holds all of the drums on the drum kit
         //// GM percussion MIDI number
         //for (const d of drums) {
         //   if (n.PlaybackInstrumentId == d.idString) {
         //      midi = d.fixedKey;
         //      //console.log(`\nThe name of n.PlaybackInstrumentId = ${n.PlaybackInstrumentId}.\The name of of d.idString = ${d.idString}.\nThe fixed key value is ${d.fixedKey}`);
         //   }
         //}

         for (let instrumentFirst of instrument) {
            for (let instrumentSecond of instrumentFirst) {
               //console.log(`\nMIDI data:`, {
               //   id: instrumentSecond.idString, // e.g., "P1-X1", "P1-X4", etc.
               //   name: instrumentSecond.name,
               //   midiProgram: instrumentSecond.midiInstrumentID,
               //   unpitchedNote: instrumentSecond.fixedKey, // Your midi-unpitched values (all 55)
               //   volume: instrumentSecond.volume, // 0.6299 (80/127)
               //   pan: instrumentSecond.pan // 0.0
               //});
               if (n.PlaybackInstrumentId == instrumentSecond.idString) {
                  midi = instrumentSecond.fixedKey;

               }
            }
         }
         const engravingRules = new OSMD.EngravingRules();
         let gNote: OSMD.GraphicalNote = OSMD.GraphicalNote.FromNote(n, engravingRules);
         const voiceEntry = n.ParentVoiceEntry;
         console.log(voiceEntry.hasArticulation );
         const hasAccent = voiceEntry.isAccent();

         const volMult = hasAccent ? 5 : 1.0;

         if (midi && DRUM_MIDI_TO_SAMPLE[midi]) {
            const sample = DRUM_MIDI_TO_SAMPLE[midi];
            result.push(sample);
            drumEngine.play(sample, volMult);
         }
      }

      return result;
   }



   /**
    * Creates a new `BPMCursorController` for the given OSMD instance.
    *
    * Reads `sheet.DefaultStartTempoInBpm` to initialise the BPM if available.
    * Configures the OSMD cursor with a green standard-type cursor that follows
    * the current position.
    *
    * @param osmd  - The loaded `OpenSheetMusicDisplay` instance.
    * @param sheet - The `MusicSheet` belonging to `osmd` (i.e. `osmd.Sheet`).
    */
   constructor(osmd: OSMD.OpenSheetMusicDisplay, sheet: OSMD.MusicSheet) {
      this.osmd = osmd;
      this.cursor = osmd.cursor;
      this.cursor.CursorOptions = {
         type: CursorType.Standard,
         color: "#00FF00",
         alpha: 0.8,
         follow: true
      };
      this.sheet = sheet;

      // Get initial BPM from the sheet  
      if (sheet.DefaultStartTempoInBpm) {
         this.currentBPM = sheet.DefaultStartTempoInBpm;
      }
   }

   /**
    * Starts cursor-driven drum playback from the beginning of the score.
    *
    * Sets up a `setInterval` at `60000 / BPM / 2` milliseconds. On each tick:
    * - If the end of the score is reached and looping is enabled, the cursor resets.
    * - Otherwise, `getToneNotesFromCursor()` fires the current beat’s samples and
    *   the cursor advances to the next position.
    *
    * Calling `start()` while already playing is a no-op.
    */
   public start() {
      if (this.isPlaying) return;

      this.isPlaying = true;
      this.cursor.reset();
      this.cursor.show();

      const intervalMs = 60000 / this.currentBPM / 2;

      this.intervalId = setInterval(() => {
         if (this.cursor.Iterator.EndReached) {
            if (this.loop) {
               this.cursor.reset();
               this.cursor.show();
            } else {
               this.stop();
               return;
            }
         }

         this.getToneNotesFromCursor();
         this.cursor.next();
      }, intervalMs);
   }



   /**
    * Stops playback and clears the internal interval.
    * The cursor position is preserved so playback can be inspected after stopping.
    */
   public stop() {
      this.isPlaying = false;
      if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      }
   }

   /**
    * Updates the playback tempo.
    *
    * If the controller is currently playing, it stops and immediately restarts
    * with the new BPM so the interval length takes effect without delay.
    *
    * @param bpm - New tempo in beats per minute.
    */
   public setBPM(bpm: number): void {
      this.currentBPM = bpm;

      // Restart with new tempo if currently playing  
      if (this.isPlaying) {
         this.stop();
         this.start();
      }
   }
}