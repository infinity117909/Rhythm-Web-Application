import * as OSMD from 'opensheetmusicdisplay';
const { OpenSheetMusicDisplay, MusicSheet, CursorType, MusicSheetReader, InstrumentReader, VoiceGenerator, MusicSheetCalculator } = OSMD;
import * as Tone from "tone";
import { DRUM_MIDI_TO_SAMPLE } from "@/utils/MIDIMapper";
import { drumEngine } from '../utils/DrumEngine';

interface XmlDrumData {
   id: string, // e.g., "P1-X1", "P1-X4", etc.
   name: string,
   midiProgram: OSMD.MidiInstrument,
   unpitchedNote: number, // Your midi-unpitched values (all 55)
   volume: number, // 0.6299 (80/127)
   pan: number // 0.0
}

export class BPMCursorController {
   private osmd: OSMD.OpenSheetMusicDisplay;
   private sheet: OSMD.MusicSheet;
   private cursor: OSMD.Cursor;
   private isPlaying: boolean = false;
   private intervalId: NodeJS.Timeout | null = null;
   private currentBPM: number = 120;
   private timeout: NodeJS.Timeout = setInterval(() => { });

   private loop: boolean = false;

   public setLoop(loop: boolean) {
      this.loop = loop;
   }


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



   public stop() {
      this.isPlaying = false;
      if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      }
   }

   public setBPM(bpm: number): void {
      this.currentBPM = bpm;

      // Restart with new tempo if currently playing  
      if (this.isPlaying) {
         this.stop();
         this.start();
      }
   }
}