import React, { useEffect, useRef, useState } from "react";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import { playDrumPattern, DrumEvent } from "@/lib/toneDrums";

const MUSICXML_URL = "/scores/BasicRockBeat1.musicxml"; // put a MusicXML file in public/scores/

export const OsmdDrumPlayer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<DrumEvent[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadScore() {
      if (!containerRef.current) return;
      setLoading(true);

      // 1. Fetch MusicXML dynamically
      const res = await fetch(MUSICXML_URL);
      const xmlText = await res.text();

      if (cancelled) return;

      // 2. Initialize OSMD
      const osmd = new OpenSheetMusicDisplay(containerRef.current, {
        autoResize: true,
        drawTitle: true
      });
      osmdRef.current = osmd;

      // 3. Load from XML string
      await osmd.load(xmlText);
      await osmd.render();

      // 4. Build drum events from OSMD internal model
      const drumEvents = extractDrumEventsFromOsmd(osmd);
      setEvents(drumEvents);
      setLoading(false);
    }

    loadScore();

    return () => {
      cancelled = true;
    };
  }, []);

  const handlePlay = async () => {
    if (!events.length) return;
    await playDrumPattern(events);
  };

  return (
    <div className="w-full max-w-4xl flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button
          onClick={handlePlay}
          disabled={!events.length || loading}
          className="px-4 py-2 rounded bg-emerald-500 text-slate-900 font-semibold disabled:opacity-50"
        >
          {loading ? "Loading..." : "Play Drums"}
        </button>
        <span className="text-sm text-slate-400">
          MusicXML source: <code>{MUSICXML_URL}</code>
        </span>
      </div>

      <div
        ref={containerRef}
        className="bg-white rounded shadow overflow-auto p-2"
      />
    </div>
  );
};

/**
 * Very simplified “MIDI extraction” from OSMD.
 * We walk through the GraphicalMusicSheet and map notes to drum MIDI numbers.
 */
function extractDrumEventsFromOsmd(osmd: OpenSheetMusicDisplay): DrumEvent[] {
const gms = osmd.GraphicSheet;  
const events: DrumEvent[] = [];  
  
if (!gms) return events;  
  
const bpm = 120;  
const secondsPerQuarter = 60 / bpm;  
  
// Iterate directly through SourceMeasures from the sheet  
for (const measure of gms.ParentMusicSheet.SourceMeasures) {  
  // Iterate through VerticalSourceStaffEntryContainers  
  for (const container of measure.VerticalSourceStaffEntryContainers) {  
    for (const staffEntry of container.StaffEntries) {  
      if (!staffEntry) continue;  
        
      // Access timestamp through AbsoluteTimestamp  
      const timestamp = staffEntry.AbsoluteTimestamp.RealValue;  
      const timeSeconds = timestamp * secondsPerQuarter;  
  
        // Iterate through VoiceEntries to get Notes  
        for (const voiceEntry of staffEntry.VoiceEntries) {  
            for (const note of voiceEntry.Notes) {  
                // Correct: use PrintObject property to check visibility  
                if (!note.PrintObject) continue;  
            
                // Correct: use pitch information instead of non-existent NoteheadHeight  
                const line = note.Pitch ? note.Pitch.FundamentalNote : 0;  
                const midi = mapNoteToDrumMidi(line);  
            
                events.push({  
                time: timeSeconds,  
                midi,  
                velocity: 0.9  
                });  
            }  
        }
    }  
  }  
}


  // Sort by time
  events.sort((a, b) => a.time - b.time);
  return events;
}

/**
 * Map a note “line” (or pitch) to a drum MIDI number.
 * This is intentionally simple—tune it to your MusicXML conventions.
 */
function mapNoteToDrumMidi(line: number): number {
  // You can replace this with pitch-based mapping:
  // const pitch = note.halfTone; etc.
  if (line <= 0.5) return 36; // kick
  if (line <= 1.5) return 38; // snare
  return 42; // hihat
}
