# Files and Full Source Content

Source section: `docs/PROJECT_DOCUMENTATION.md` lines 203-890

## Quick Index

### Public
- public/drums/
- public/scores/index.json

### Server
- server/prisma/schema.prisma

### Components
- src/components/audio/Tone.tsx
- src/components/hooks/initYouTubePlayer.ts
- src/components/Navbars.tsx
- src/components/notation/
- src/components/notation/MusicPlayer.tsx
- src/components/notation/ParseXML.tsx
- src/components/notation/RhythmSelect.tsx
- src/drum-machine/DrumMachine.tsx
- src/drum-machine/sampleMap.ts
- src/drum-machine/ToneExportButton.tsx
- src/lib/audio/loadSamples.ts
- src/lib/BPMCursorController.ts
- src/lib/rhythm/converters/toToneEvents.ts
- src/lib/rhythm/converters/toVexFlow.ts
- src/lib/rhythm/types.ts
- src/lib/toneDrums.ts
- src/metronome/MetronomeContext.tsx
- src/musicxml/drumPlaybackEngine.ts
- src/musicxml/extractDrumNotes.ts
- src/musicxml/loadMusicXML.ts
- src/musicxml/parseMusicXML.ts
- src/musicxml/useMusicXML.ts
- src/utils/DrumEngine.ts
- src/utils/MIDIMapper.ts

## Public

### public/drums/

Directory entry (not a file).

---

### public/scores/index.json

```json
[
  
  "Mambo.musicxml",
  "Standard Rock Groove.musicxml",
  "Four On The Floor.musicxml",
  "Brazillian Bossa Nova.musicxml",
  "Bossa Nova Rhumba Clave (2 + 3).musicxml",
  "Bossa Nova Rhumba Clave (3 + 2).musicxml",
  "Bossa Nova Son Clave (2 + 3).musicxml",
  "Bossa Nova Son Clave (3 + 2).musicxml",
  "Basic Swing (2 â€“ 4 Feel).musicxml",
  "Big Band Swing.musicxml"

]
```

---

## Server

### server/prisma/schema.prisma

```prisma
generator client {
  provider = "prisma-client"
  output   = "./generated/prisma"
}

datasource db {
  provider = "postgresql"
}



model Topic {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  era         String?
  region      String?

  lessons     Lesson[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Lesson {
  id          Int       @id @default(autoincrement())
  title       String
  summary     String?
  difficulty  Difficulty
  orderIndex  Int

  topic       Topic     @relation(fields: [topicId], references: [id])
  topicId     Int

  sections    Section[]

  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Section {
  id          Int         @id @default(autoincrement())
  title       String
  contentType ContentType
  bodyText    String?
  orderIndex  Int

  lesson      Lesson      @relation(fields: [lessonId], references: [id])
  lessonId    Int

  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

enum Difficulty {
  beginner
  intermediate
  advanced
}

enum ContentType {
  text
  audio
  video
}
```

---

## Components

### src/components/audio/Tone.tsx

```tsx
import * as Tone from "tone";
import { useEffect, useRef, useState } from "react";
import { drumEngine } from "../../utils/DrumEngine";

interface LoadFileProps {
   audioUrl: string;
}

/** Utility: fetch a file as text */
export async function parseFile({ filePath }: { filePath: string }) {
   try {
      const response = await fetch(filePath);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const content = await response.text();
      console.log(content);
      return { content };
   } catch (error) {
      console.error("Error reading or fetching file:", error);
   }
}

/** All drum sample filenames mapped by key */
const DRUM_SAMPLES: Record<string, string> = {
   "A1": "A1.mp3", //metronome-click-accent
   "Ab1": "Ab1.mp3", //metronome-click-sub
   "B1": "B1.mp3", //kick-1
   "C2": "C2.mp3", //kick-2
   "Ab2": "Ab2.mp3", //hi-hat-closed-1
   "Gb2": "Gb2.mp3", //hi-hat-closed-2
   "Bb2": "Bb2.mp3", //hi-hat-open-1
   "D2": "D2.mp3", //snare-1
   "E2": "E2.mp3", //snare-2
   "Db2": "Db2.mp3", //cross-stick-1
   "G1": "G1.mp3", //stick-click-1
   "D3": "D3.mp3", //high-tom-1
   "B2": "B2.mp3", //med-tom-1
   "C3": "C3.mp3", //med-tom-2
   "A2": "A2.mp3", //floor-tom-2
   "F2": "F2.mp3", //floor-tom-3
   "G2": "G2.mp3", //floor-tom-4
   "B3": "B3.mp3", //ride-1
   "Eb3": "Eb3.mp3", //ride-2
   "F3": "F3.mp3", //ride-bell-1
   "A3": "A3.mp3", //crash-1
   "Db3": "Db3.mp3", //crash-2
   "E1": "E1.mp3", //china-1
   "E3": "E3.mp3", //china-2
   "G3": "G3.mp3", //splash-1
   "Eb2": "Eb2.mp3", //clap-1
   "Bb1": "Bb1.mp3", //triangle-1
   "F1": "F1.mp3", //flub-drum-1
   "Gb1": "Gb1.mp3", //flub-drum-2
   "Ab3": "Ab3.mp3", //cowbell-1
   "Bb3": "Bb3.mp3", //vibroslap-1
   "Gb3": "Gb3.mp3", //tamborine-1
   "B4": "B4.mp3", //whistle-1
   "Bb4": "Bb4.mp3", //shaker-1
   "C4": "C4.mp3", //bongo-high-1
   "D4": "D4.mp3", //bongo-med-1
   "Db4": "Db4.mp3", //bongo-low-1
   "E4": "E4.mp3", //conga-low-1
   "Eb4": "Eb4.mp3", //conga-high-1
   "F4": "F4.mp3", //timbale-high-1
   "G4": "G4.mp3", //agogo-bell-high-1
   "Gb4": "Gb4.mp3", //timbale-med-1
   "B5": "B5.mp3", //sleigh-bells-1
   "Bb5": "Bb5.mp3", //shaker-2
   "C5": "C5.mp3", //whistle-2
   "D5": "D5.mp3", //guiro-run-1
   "Db5": "Db5.mp3", //guiro-tap-1
   "E5": "E5.mp3", //woodblock-med-1
   "Eb5": "Eb5.mp3", //clave-1
   "F5": "F5.mp3", //woodblock-low-1
   "G5": "G5.mp3", //cuica-low-1
   "Gb5": "Gb5.mp3", //cuica-high-1
   "C6": "C6.mp3", //chimes-1
   "D6": "D6.mp3", //concert-tom-1
   "Db6": "Db6.mp3", //castanets-1
   "Eb6": "Eb6.mp3", //concert-tom-2
};

export function LoadFile({ audioUrl }: LoadFileProps) {
   const drumsRef = useRef<Tone.Players | null>(null);
   const [isReady, setIsReady] = useState(false);

   useEffect(() => {
      const players = new Tone.Players(
         {
            urls: DRUM_SAMPLES,
            baseUrl: audioUrl,
            onload: () => {
               console.log("Drum samples loaded");
               setIsReady(true);
            },
         }
      ).toDestination();

      // expose globally
      drumEngine.setPlayers(players);
      drumsRef.current = players;

      return () => {
         players.dispose();
      };
   }, [audioUrl]);

   return (
      <div>
         {/* Component intentionally renders nothing visible */}
         {/* You can add UI here if needed */}
      </div>
   );
}
```

---

### src/components/hooks/initYouTubePlayer.ts

```typescript
export function initYouTubePlayer(event: any, {
  width = 640,
  height = 390
} = {}) {
  const player = event.target;

  // Resize iframe
  try {
    const iframe = player.getIframe();
    iframe.width = width;
    iframe.height = height;
  } catch (err) {
    console.warn("Could not resize iframe:", err);
  }

  console.log("YouTube Player Ready");

  return player;
}
```

---

### src/components/Navbars.tsx

```tsx
import { useEffect, useState } from 'react'
import { Link, Outlet } from '@tanstack/react-router'

const genreLinks = [
   { to: '/education/genres/jazz', label: 'Jazz' },
   { to: '/education/genres/afro-cuban', label: 'Afro Cuban' },
   { to: '/education/genres/hip-hop', label: 'Hip Hop' },
   { to: '/education/genres/metal', label: 'Metal' },
   { to: '/education/genres/classic-rock', label: 'Classic Rock' },
   { to: '/education/genres/punk-rock', label: 'Punk Rock' },
   { to: '/education/genres/prog', label: 'Prog' },
   { to: '/education/genres/pop', label: 'Pop' },
   { to: '/education/genres/edm', label: 'Electronic Dance Music' },
] as const

export const HomeNavbar = () => {
   return (
      <>
         <nav className="flex items-center justify-center min-h-screen bg-gray-950">
            <svg
               viewBox="0 0 300 300"
               className="w-[min(90vw,90vh)] mx-auto cursor-pointer select-none drop-shadow-2xl"
            >
            {/* --- EDUCATION --- */ }
            <Link to="/education">
               <g className="group">
                  <path
                     d="M150,150 L150,50 A100,100 0 0,1 236.6,200 Z"
                     className="fill-deep-teal-600 stroke-white stroke-[0.5] transition-all duration-300 group-hover:opacity-85 group-hover:brightness-110"
                  />
                  <text
                     x="206"
                     y="118"
                     textAnchor="middle"
                     dominantBaseline="middle"
                     transform="rotate(60, 206, 118)"
                     className="pointer-events-none fill-white font-semibold text-[12px] drop-shadow"
                  >
                     Education
                  </text>
               </g>
            </Link>

            {/* --- VISUALIZATION --- */ }
            <Link to="/visualization">
               <g className="group">
                  <path
                     d="M150,150 L236.6,200 A100,100 0 0,1 63.4,200 Z"
                     className="fill-blue-slate-600 stroke-white stroke-[0.5] transition-all duration-300 group-hover:opacity-85 group-hover:brightness-110"
                  />
                  <text
                     x="150"
                     y="216"
                     textAnchor="middle"
                     dominantBaseline="middle"
                     className="pointer-events-none fill-white font-semibold text-[11px] drop-shadow"
                  >
                     Visualization
                  </text>
               </g>
            </Link>

            {/* --- GAMES --- */ }
            <Link to="/games">
               <g className="group">
                  <path
                     d="M150,150 L63.4,200 A100,100 0 0,1 150,50 Z"
                     className="fill-dusty-grape-600 stroke-white stroke-[0.5] transition-all duration-300 group-hover:opacity-85 group-hover:brightness-110"
                  />
                  <text
                     x="94"
                     y="118"
                     textAnchor="middle"
                     dominantBaseline="middle"
                     transform="rotate(-60, 94, 118)"
                     className="pointer-events-none fill-white font-semibold text-[12px] drop-shadow"
                  >
                     Games
                  </text>
               </g>
            </Link>

            {/* Center circle â€” rendered last so it sits on top */}
            <circle cx="150" cy="150" r="32" className="fill-gray-950 cursor-default" />
            <text
               x="150"
               y="150"
               textAnchor="middle"
               dominantBaseline="middle"
               className="pointer-events-none fill-white font-semibold text-[9px] tracking-widest uppercase"
            >
               Rhythm
            </text>

            </svg>
         </nav>
      <Outlet/>
      </>
   )
};

export const EducationNavbar = () => {
   const [opacity, setOpacity] = useState(1);

   useEffect(() => {
      const handleScroll = () => {
      const y = window.scrollY;

      // clamp scroll between 0 and 300
      const max = 300;
      const clamped = Math.min(y, max);

      // map 0 â†’ 1 and 300 â†’ 0.2 (adjust as needed)
      const newOpacity = 1 - clamped / max * 0.25;

      setOpacity(newOpacity);
   };

   window.addEventListener("scroll", handleScroll);
   return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   return (
      <>
         <nav
            style={{
               opacity,
               backgroundColor: "var(--education-nav-bg, var(--color-deep-teal-600))",
               color: "var(--education-nav-text, var(--color-porcelain-50))",
            }}
            className={`
               p-4 sticky top-0 z-50 shadow-md transition-all duration-300
               ${opacity < 1 ? "backdrop-blur-xl" : ""}
            `}
         >


            <ul className="nav-list">
               <li><Link to="/education" className="nav-link">Education Home</Link></li>
               <li><Link to="/education/theory/Introduction" className="nav-link">Introduction</Link></li>
               <li><Link to="/education/genres" className="nav-link">Genres</Link></li>
               <li className="ml-auto"><Link to="/" className="nav-link">Home</Link></li>
            </ul>
         </nav>

         <Outlet/>
      </>
   )

};

export const VisualizationNavbar = () => {
   const [opacity, setOpacity] = useState(1);

   useEffect(() => {
      const handleScroll = () => {
         const y = window.scrollY;
         const max = 300;
         const clamped = Math.min(y, max);

         // fade to 75% opacity
         const newOpacity = 1 - (clamped / max) * 0.25;
         setOpacity(newOpacity);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   return (
      <>
         <nav
            style={{ opacity }}
            className={`
               p-4 sticky top-0 z-50 shadow-md transition-all duration-300 text-white
               ${opacity < 1 ? "bg-blue-slate-600/80 backdrop-blur-xl " : "bg-blue-slate-600 "}
            `}
         >
            <ul className="nav-list">
               <li><Link to="/visualization" className="nav-link">Visualization Home</Link></li>
               <li><Link to="/visualization/osmd-parser" className="nav-link">Rhythms</Link></li>
               <li><Link to="/visualization/metronome" className="nav-link">Metronome</Link></li>
               <li><Link to="/visualization/DVD-Polyrhythm-Visualizer/DvdPolyrhythmVisualizer" className="nav-link">DVD Polyrhythms</Link></li>
               <li className="ml-auto"><Link to="/" className="nav-link">Home</Link></li>
            </ul>
         </nav>

         <Outlet />
      </>
   );
};


export const GameNavbar = () => {
   const [opacity, setOpacity] = useState(1);

   useEffect(() => {
      const handleScroll = () => {
         const y = window.scrollY;
         const max = 300;
         const clamped = Math.min(y, max);

         // fade to 75% opacity
         const newOpacity = 1 - (clamped / max) * 0.25;
         setOpacity(newOpacity);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   return (
      <>
         <nav
            style={{ opacity }}
            className={`
               p-4 sticky top-0 z-50 shadow-md transition-all duration-300 text-white
               ${opacity < 1 ? "bg-dusty-grape-600/80 backdrop-blur-xl " : "bg-dusty-grape-600 "}  "}
            `}
         >
            <ul className="nav-list">
               <li><Link to="/games" className="nav-link">Games Home</Link></li>
               <li><Link to="/games/drum-machine" className="nav-link">Drum Machine</Link></li>
               <li><Link to="/games/whitney-houston-challenge" className="nav-link">The Whitney Houston Challenge</Link></li>
               <li className=" ml-auto"><Link to="/" className="nav-link">Home</Link></li>
            </ul>
         </nav>

         <Outlet />
      </>
   );
};

export function GenresSideNav() {
   return (
      <aside className="group fixed left-0 top-28 z-40 hidden lg:block">
         <div className="flex items-start">
            <button
               type="button"
               aria-label="Open genres navigation"
               style={{
                  backgroundColor: "var(--genres-side-button-bg, var(--color-deep-teal-600))",
                  color: "var(--genres-side-button-text, var(--color-porcelain-50))",
                  borderColor: "var(--genres-side-border, var(--color-deep-teal-500))",
               }}
               className="mt-3 flex h-12 w-12 items-center justify-center rounded-r-lg border-2 shadow-lg"
            >
               <span className="flex flex-col gap-1.5">
                  <span className="block h-0.5 w-5 bg-current" />
                  <span className="block h-0.5 w-5 bg-current" />
                  <span className="block h-0.5 w-5 bg-current" />
               </span>
            </button>

            <nav
               style={{
                  backgroundColor: "var(--genres-side-panel-bg, var(--color-porcelain-50))",
                  borderColor: "var(--genres-side-border, var(--color-deep-teal-500))",
               }}
               className="ml-2 w-0 overflow-hidden rounded-lg border-2 shadow-xl transition-all duration-300 ease-out group-hover:w-72 group-focus-within:w-72"
            >
               <div className="w-72 p-4">
                  <h3
                     style={{
                        color: "var(--genres-side-heading-text, var(--color-deep-teal-700))",
                        borderColor: "var(--genres-side-divider, var(--color-deep-teal-300))",
                     }}
                     className="mb-3 border-b pb-2 text-sm font-semibold uppercase tracking-[0.2em]"
                  >
                     Genres
                  </h3>
                  <ul className="space-y-1">
                     {genreLinks.map(({ to, label }) => (
                        <li key={to}>
                           <Link
                              to={to}
                              style={{
                                 color: "var(--genres-side-link-text, var(--color-deep-teal-800))",
                              }}
                              className="block rounded-md px-2 py-1.5 text-sm transition-colors duration-200 hover:bg-[var(--genres-side-link-hover-bg,var(--color-deep-teal-100))] hover:text-[var(--genres-side-link-hover-text,var(--color-deep-teal-900))]"
                           >
                              {label}
                           </Link>
                        </li>
                     ))}
                  </ul>
               </div>
            </nav>
         </div>
      </aside>
   )
}

export function GenresFooterNav() {
   return (
      <footer
         style={{
            backgroundColor: "var(--genres-footer-bg, var(--color-deep-teal-600))",
            color: "var(--genres-footer-text, var(--color-porcelain-50))",
            borderColor: "var(--genres-footer-border, var(--color-deep-teal-300))",
         }}
         className="mt-10 border-t-2 px-4 py-6"
      >
         <h2 className="text-center text-2xl">Genres to Explore</h2>
         <ul className="mx-auto mt-4 flex max-w-6xl flex-wrap justify-center gap-4 text-sm tracking-wide sm:text-base">
            {genreLinks.map(({ to, label }) => (
               <li key={to}>
                  <Link
                     to={to}
                     className="rounded-md px-2 py-1 transition-colors duration-200 hover:bg-[var(--genres-footer-link-hover-bg,var(--color-porcelain-50))] hover:text-[var(--genres-footer-link-hover-text,var(--color-deep-teal-700))]"
                  >
                     {label}
                  </Link>
               </li>
            ))}
         </ul>
      </footer>
   )
}
```

---

### src/components/notation/

Directory entry (not a file).

---

### src/components/notation/MusicPlayer.tsx

```tsx
import { useEffect, useRef, useState } from "react";
import osmd from 'opensheetmusicdisplay';
const {OpenSheetMusicDisplay} = osmd;
import * as Tone from "tone";
import { drumEngine } from "@/utils/DrumEngine";
import { DRUM_MIDI_TO_SAMPLE } from "@/utils/MIDIMapper";

interface MusicPlayerProps {
   filePath: string; // URL to the MusicXML file
}

export function getDrumMidiFromGraphicalNote(g: osmd.GraphicalNote): number | null {
   if (!g?.sourceNote) return null;
   if (g.sourceNote.isRest()) return null;

   const midi = g.sourceNote.Pitch. getMidiPitch();
   return typeof midi === "number" ? midi : null;
}


export default function MusicPlayer({ filePath }: MusicPlayerProps) {
   const containerRef = useRef<HTMLDivElement>(null);
   const osmdRef = useRef<osmd.OpenSheetMusicDisplay | null>(null);
   const [ready, setReady] = useState(false);
   

   useEffect(() => {
      if (!containerRef.current || !filePath) return;

      const osmd = new OpenSheetMusicDisplay(containerRef.current, {
         autoResize: true,
         drawTitle: true,
      });

      osmdRef.current = osmd;

      async function load() {
         await osmd.load(filePath);
         await osmd.render();
         setReady(true);
      }

      load();
   }, [filePath]);

   

   async function play() {
      if (!osmdRef.current) return;

      await Tone.start(); // required by browsers
      const now = Tone.now();

      const cursor = osmdRef.current.cursor;
      cursor.show();

      cursor.reset();
      cursor.next();

      function scheduleNext() {
         if (cursor.iterator.EndReached) {
            cursor.hide();
            return;
         }
         const gnotes = cursor.GNotesUnderCursor();

        for (const g of gnotes) {
        const midi = getDrumMidiFromGraphicalNote(g);
        if (!midi) continue;

        const sampleName = DRUM_MIDI_TO_SAMPLE[midi];
        if (sampleName) {
            drumEngine.play(sampleName);
        }
        }


         const timestamp = cursor.iterator.currentTimeStamp.RealValue;
         const duration = cursor.iterator.currentTimeStamp.RealValue;

         // simple beep for each note
         const synth = new Tone.Synth().toDestination();
         synth.triggerAttackRelease("C5", duration, now + timestamp);

         cursor.next();
         requestAnimationFrame(scheduleNext);
      }

      scheduleNext();
   }

   return (
      <div>
         <div ref={containerRef} style={{ width: "100%", marginBottom: 20 }} />

         <button disabled={!ready} onClick={play}>
            {ready ? "Play Music" : "Loading..."}
         </button>
      </div>
   );
}
```

---

### src/components/notation/ParseXML.tsx

```tsx
import { useEffect, useRef, useState } from "react";
import * as OSMD from "opensheetmusicdisplay";
const { OpenSheetMusicDisplay, CursorType, MusicSheetReader } = OSMD;
import { BPMCursorController } from "../../lib/BPMCursorController";

interface ParseXMLProps {
   filePath: string;
}

async function parseXml(filePath: string) {
   const response = await fetch(filePath);
   const text = await response.text();
   const parser = new DOMParser();
   return parser.parseFromString(text, "application/xml");
}

async function loadAndRender(
   osmd: OSMD.OpenSheetMusicDisplay,
   filePath: string
): Promise<BPMCursorController | null> {
   osmd.cursor.reset();

   const xmlDoc = await parseXml(filePath);
   if (!xmlDoc) return null;

   await osmd.load(xmlDoc);
   osmd.render();

   osmd.cursor.reset();
   osmd.cursor.hide();

   const root = xmlDoc.firstElementChild;
   if (!root) return null;

   const xmlElem = new OSMD.IXmlElement(root);
   const sheetReader = new MusicSheetReader();
   const sheet = sheetReader.createMusicSheet(xmlElem, filePath);

   return new BPMCursorController(osmd, sheet);
}

export function LoadMusicXMLShort({ music }: { music: string | Document }) {
   const osmdContainerRef = useRef<HTMLDivElement | null>(null);
   const osmdRef = useRef<OSMD.OpenSheetMusicDisplay | null>(null);

   useEffect(() => {
      if (!osmdContainerRef.current) return;

      // Create OSMD instance once  
      if (!osmdRef.current) {
         osmdRef.current = new OSMD.OpenSheetMusicDisplay(osmdContainerRef.current);
      }

      const osmd = osmdRef.current;

      // Set options BEFORE loading  
      osmd.setOptions({
         drawTitle: false,
         drawSubtitle: false,
         drawComposer: false,
         drawPartNames: false,
         //autoResize: true,
         pageBackgroundColor: '#F5F5F0',
         stretchLastSystemLine: true,
         alignRests: 1
      });

      osmd.load(music)
         .then(() => {
            return osmd.render();
         })
         .catch((err) => console.error("OSMD load error:", err));
   }, [music]);

   return <div ref={ osmdContainerRef } />;
}

export default function ParseXML({ filePath }: ParseXMLProps) {
   const osmdContainerRef = useRef<HTMLDivElement | null>(null);
   const osmdRef = useRef<OSMD.OpenSheetMusicDisplay | null>(null);
   const controllerRef = useRef<BPMCursorController | null>(null);

   const [loop, setLoop] = useState(false);

   useEffect(() => {
      if (!osmdContainerRef.current) return;

      if (!osmdRef.current) {
         osmdRef.current = new OpenSheetMusicDisplay(osmdContainerRef.current, {
            cursorsOptions: [
               {
                  type: CursorType.ThinLeft,
                  color: "#33e02f",
                  alpha: 0.5,
                  follow: false,
               },
            ],
            autoResize: true,
         });
      }

      const osmd = osmdRef.current;

      loadAndRender(osmd, filePath).then((controller) => {
         controllerRef.current = controller;
      });
   }, [filePath]);

   function handleStart() {
      if (!controllerRef.current) return;
      controllerRef.current.setLoop(loop);
      controllerRef.current.start();
   }

   function handleStop() {
      controllerRef.current?.stop();
   }

   return (
      <>
         <div style={ { marginBottom: "12px" } }>
            <button onClick={ handleStart }>Start</button>
            <button onClick={ handleStop } style={ { marginLeft: "8px" } }>
               Stop
            </button>

            <label style={ { marginLeft: "16px" } }>
               <input
                  type="checkbox"
                  checked={ loop }
                  onChange={ (e) => setLoop(e.target.checked) }
               />
               Loop playback
            </label>
         </div>

         <div
            ref={ osmdContainerRef }
            style={ { width: "100%", height: "500px" } }
         />
      </>
   );
}
```

---

### src/components/notation/RhythmSelect.tsx

```tsx
import React, { useState, useRef, useEffect, ChangeEvent, Component } from 'react';
import { OptionType, /*DropdownProps*/ } from '@/lib/rhythm/types';
import { LoadFile } from '../audio/Tone';
import ParseXML from './OSMDParser';
import MusicXMLViewer from './MusicXMLViewer';
import MusicXMLDrumPlayer from './MusicXMLDrumPlayer';
import MusicXMLOSMDViewer from './MusicXMLOSMDViewer';
import { OsmdDrumPlayer } from './OsmdDrumPlayer';

interface PropTypes {
   xmlFile: string;
}

const Dropdown: React.FC = () => {
   const [selectedValue, setSelectedValue] = useState("");
   const [options, setOptions] = useState<OptionType[]>([]);

   useEffect(() => {
      fetch("/scores/index.json")
         .then(res => res.json())
         .then(files => {
            const mapped = files.map((file: string) => ({
               label: file.replace(".musicxml", "").replace(".xml", ""),
               value: `/scores/${file}`
            }));
            setOptions(mapped);
         });
   }, []);

   const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
      console.log("Selected Value: ", event.target.value);
      setSelectedValue(event.target.value);
   }

   return (
   <div className="dropdown">
      <select value={selectedValue} onChange={handleChange}>
         <option value="">-- Please choose a rhythm --</option>
         {options.map(opt => (
            <option key={opt.value} value={opt.value}>
               {opt.label}
            </option>
         ))}
      </select>

      <LoadFile audioUrl="http://127.0.0.1:8080/FatBoy/percussion-mp3/" />
      <ParseXML filePath={selectedValue} />
      {/* <MusicXMLViewer filePath={selectedValue} /> */}
      {/* <MusicXMLOSMDViewer filePath={selectedValue} /> */}
         {/* <OsmdDrumPlayer/> */}
      {/* Play drum part from MusicXML */}
      {/* <MusicXMLDrumPlayer filePath={selectedValue} /> */}
   </div>
   );
};

export default Dropdown;
```

---

### src/drum-machine/DrumMachine.tsx

```tsx
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
import { ToneExportButton } from './ToneExportButton'

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
      <div className="min-h-screen bg-[var(--color-dusty-grape-950)] text-[var(--color-dusty-lavender-50)] p-6">
        <div className="mx-auto max-w-6xl rounded-3xl bg-[var(--color-dusty-grape-900)] border border-[var(--color-dusty-grape-600)] shadow-2xl shadow-[var(--color-dusty-grape-950)] p-6">
          <header className="mb-8 space-y-4">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.3em] text-[var(--color-azure-mist-400)]">Drum Machine Activity</p>
              <h1 className="text-3xl font-semibold text-[var(--color-dusty-lavender-50)]">Choose Your Instruments</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-dusty-lavender-200)]">
                Start with a blank canvas. Select the instruments you wish to use and then begin building the pattern.
              </p>
            </div>
          </header>

          <div className="mb-6 rounded-3xl border border-[var(--color-dusty-grape-600)] bg-[var(--color-dusty-grape-700)] p-4 text-sm text-[var(--color-dusty-lavender-200)]">
            <label className="flex flex-col gap-2 text-sm uppercase tracking-[0.2em] text-[var(--color-dusty-lavender-300)]">
              Select a preset kit
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={selectedPreset}
                  onChange={(event) => handlePresetChange(event.target.value)}
                  className="rounded-2xl border border-[var(--color-dusty-grape-600)] bg-[var(--color-dusty-grape-900)] px-3 py-2 text-sm text-[var(--color-dusty-lavender-50)] outline-none focus:border-[var(--color-azure-mist-400)]"
                >
                  <option value="none">Choose a preset</option>
                  {drumKitPresets.map((preset) => (
                    <option key={preset.key} value={preset.key}>
                      {preset.label}
                    </option>
                  ))}
                </select>
                <span className="text-[var(--color-dusty-lavender-300)]">Loads the instrument set for the selected kit.</span>
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
                      ? 'border-[var(--color-azure-mist-400)] bg-[var(--color-dark-cyan-900)] text-[var(--color-dusty-lavender-50)]'
                      : 'border-[var(--color-dusty-grape-600)] bg-[var(--color-dusty-grape-700)] text-[var(--color-dusty-lavender-200)] hover:border-[var(--color-azure-mist-400)]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[var(--color-dusty-lavender-50)]">{instrument.name}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-dusty-lavender-400)]">{instrument.key}</p>
                    </div>
                    <div className="text-xs uppercase tracking-[0.2em] text-[var(--color-dusty-lavender-300)]">
                      {selected ? 'Selected' : 'Select'}
                    </div>
                  </div>
                </button>
              )
            })}
          </section>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
            <p className="text-sm text-[var(--color-dusty-lavender-200)]">
              {selectedInstrumentKeys.length} instrument{selectedInstrumentKeys.length === 1 ? '' : 's'} selected.
            </p>
            <button
              type="button"
              onClick={() => setSelectedInstrumentKeys(instrumentList.slice(0, 4).map((instrument) => instrument.key))}
              className="rounded-2xl border border-[var(--color-dusty-grape-600)] bg-[var(--color-dusty-grape-700)] px-4 py-3 text-sm text-[var(--color-dusty-lavender-100)] hover:border-[var(--color-azure-mist-500)]"
            >
              Quick select first 4
            </button>
            <button
              type="button"
              onClick={() => setHasStarted(true)}
              disabled={!selectedInstrumentKeys.length}
              className="inline-flex items-center justify-center rounded-2xl bg-[var(--color-azure-mist-500)] px-5 py-3 text-sm font-semibold text-[var(--color-dusty-grape-950)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-azure-mist-400)]"
            >
              Start Building Pattern
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-dusty-grape-950)] text-[var(--color-dusty-lavender-50)] p-6">
      <div className="mx-auto max-w-7xl rounded-3xl bg-[var(--color-dusty-grape-900)] border border-[var(--color-dusty-grape-600)] shadow-2xl shadow-[var(--color-dusty-grape-950)] p-6">
        <header className="mb-8 space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-sm uppercase tracking-[0.3em] text-[var(--color-azure-mist-400)]">Drum Machine Activity</p>
              <h1 className="text-3xl font-semibold text-[var(--color-dusty-lavender-50)]">Interactive Drum Grid</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-dusty-lavender-200)]">
                Create a beat by toggling squares in the grid. Adjust measures, subdivisions, mute individual instruments,
                and shape volume for each row.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleEnableAudio}
                disabled={audioUnlocked || !selectedInstruments.length}
                className="inline-flex items-center gap-2 rounded-2xl border border-[var(--color-dusty-grape-500)] bg-[var(--color-dusty-grape-700)] px-4 py-3 text-sm text-[var(--color-dusty-lavender-100)] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--color-azure-mist-500)]"
              >
                {audioUnlocked ? 'Audio Enabled' : 'Enable Audio'}
              </button>
              <button
                type="button"
                onClick={handlePlayPause}
                disabled={!audioUnlocked}
                className="inline-flex items-center gap-2 rounded-2xl bg-[var(--color-azure-mist-500)] px-4 py-3 text-sm font-semibold text-[var(--color-dusty-grape-950)] disabled:opacity-50 disabled:cursor-not-allowed shadow hover:bg-[var(--color-azure-mist-400)]"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button
                type="button"
                onClick={handleResetPattern}
                className="inline-flex items-center gap-2 rounded-2xl border border-[var(--color-dusty-grape-500)] bg-[var(--color-dusty-grape-700)] px-4 py-3 text-sm text-[var(--color-dusty-lavender-100)] hover:border-[var(--color-azure-mist-500)]"
              >
                Reset Grid
              </button>
              <ToneExportButton
                bpm={bpm}
                measures={measures}
                subdivisions={subdivisions}
                tempoMode={tempoMode}
                pattern={pattern}
                selectedInstruments={selectedInstruments}
                selectedSampleFiles={selectedSampleFiles}
                muteStates={muteStates}
                volumeStates={volumeStates}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--color-dusty-lavender-200)]">
              <span>{audioUnlocked ? 'Audio is enabled and ready to play.' : 'Enable audio first to allow Tone playback.'}</span>
            </div>
          </div>

          <div className="grid gap-3 rounded-3xl border border-[var(--color-dusty-grape-600)] bg-[var(--color-dusty-grape-700)] p-4 text-sm text-[var(--color-dusty-lavender-200)] sm:grid-cols-2">
            <div className="space-y-2">
              <p className="font-semibold text-[var(--color-dusty-lavender-50)]">Instructions</p>
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
                <label className="space-y-2 text-xs uppercase tracking-[0.2em] text-[var(--color-dusty-lavender-300)]">
                  Measures
                  <input
                    type="range"
                    min={MIN_MEASURES}
                    max={MAX_MEASURES}
                    value={measures}
                    onChange={(event) => setMeasures(clamp(Number(event.target.value), MIN_MEASURES, MAX_MEASURES))}
                    className="w-full accent-[var(--color-azure-mist-400)]"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={measuresInputValue}
                      onChange={handleMeasuresInputChange}
                      onBlur={handleMeasuresInputBlur}
                      onKeyDown={handleMeasuresInputKeyDown}
                      onFocus={handleMeasuresInputFocus}
                      className="w-16 rounded-lg border border-[var(--color-dusty-grape-500)] bg-[var(--color-dusty-grape-700)] px-2 py-1 text-sm text-[var(--color-dusty-lavender-100)] focus:border-[var(--color-azure-mist-400)] focus:outline-none"
                    />
                    <span className="text-sm text-[var(--color-dusty-lavender-100)]">measure{measures > 1 ? 's' : ''}</span>
                  </div>
                </label>
                <label className="space-y-2 text-xs uppercase tracking-[0.2em] text-[var(--color-dusty-lavender-300)]">
                  Subdivisions
                  <input
                    type="range"
                    min={MIN_SUBDIVISIONS}
                    max={MAX_SUBDIVISIONS}
                    value={subdivisions}
                    onChange={(event) => setSubdivisions(clamp(Number(event.target.value), MIN_SUBDIVISIONS, MAX_SUBDIVISIONS))}
                    className="w-full accent-[var(--color-azure-mist-400)]"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={subdivisionsInputValue}
                      onChange={handleSubdivisionsInputChange}
                      onBlur={handleSubdivisionsInputBlur}
                      onKeyDown={handleSubdivisionsInputKeyDown}
                      onFocus={handleSubdivisionsInputFocus}
                      className="w-16 rounded-lg border border-[var(--color-dusty-grape-500)] bg-[var(--color-dusty-grape-700)] px-2 py-1 text-sm text-[var(--color-dusty-lavender-100)] focus:border-[var(--color-azure-mist-400)] focus:outline-none"
                    />
                    <span className="text-sm text-[var(--color-dusty-lavender-100)]">step{subdivisions === 1 ? '' : 's'} per measure</span>
                  </div>
                  <div className="text-xs text-[var(--color-azure-mist-300)]">{getTimeSignatureDisplay(subdivisions).timeSignature} time ({getTimeSignatureDisplay(subdivisions).noteName})</div>
                </label>
              </div>
              <label className="space-y-2 text-xs uppercase tracking-[0.2em] text-[var(--color-dusty-lavender-300)]">
                Tempo
                <input
                  type="range"
                  min="20"
                  max="300"
                  value={bpm}
                  onChange={(event) => setBpm(Number(event.target.value))}
                  className="w-full accent-[var(--color-azure-mist-400)]"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={bpmInputValue}
                    onChange={handleBpmInputChange}
                    onBlur={handleBpmInputBlur}
                    onKeyDown={handleBpmInputKeyDown}
                    onFocus={handleBpmInputFocus}
                    className="w-20 rounded-lg border border-[var(--color-dusty-grape-500)] bg-[var(--color-dusty-grape-700)] px-2 py-1 text-sm text-[var(--color-dusty-lavender-100)] focus:border-[var(--color-azure-mist-400)] focus:outline-none"
                  />
                  <span className="text-sm text-[var(--color-dusty-lavender-100)]">BPM</span>
                </div>
                <div className="text-xs text-[var(--color-dusty-lavender-300)]">Effective: {Math.round(bpm * (tempoMode === 'double' ? 2 : tempoMode === 'half' ? 0.5 : 1))} BPM ({tempoMode === 'double' ? 'double time' : tempoMode === 'half' ? 'half time' : 'normal'})</div>
              </label>
              <div className="space-y-2 text-xs uppercase tracking-[0.2em] text-[var(--color-dusty-lavender-300)]">
                <div className="text-[var(--color-dusty-lavender-200)]">Tempo mode</div>
                <div className="flex gap-2">
                  {['half', 'normal', 'double'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setTempoMode(mode as 'half' | 'normal' | 'double')}
                      className={`rounded-2xl border px-3 py-2 text-[0.7rem] uppercase tracking-[0.2em] transition-colors duration-150 ${
                        tempoMode === mode ? 'border-[var(--color-azure-mist-400)] bg-[var(--color-dark-cyan-900)] text-[var(--color-azure-mist-200)]' : 'border-[var(--color-dusty-grape-600)] bg-[var(--color-dusty-grape-700)] text-[var(--color-dusty-lavender-200)] hover:border-[var(--color-azure-mist-400)]'
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
          <div className="flex flex-col gap-3 rounded-3xl border border-[var(--color-dusty-grape-600)] bg-[var(--color-dusty-grape-700)] px-4 py-3 text-sm text-[var(--color-dusty-lavender-200)] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-[var(--color-dusty-lavender-50)]">Grid</p>
              <p className="text-[var(--color-dusty-lavender-300)]">{selectedInstruments.length} instruments Ã— {measures} measure{measures === 1 ? '' : 's'} Ã— {subdivisions} step{subdivisions === 1 ? '' : 's'} per measure</p>
            </div>
            <button
              type="button"
              onClick={() => setHasStarted(false)}
              className="rounded-2xl border border-[var(--color-dusty-grape-600)] bg-[var(--color-dusty-grape-700)] px-3 py-2 text-xs uppercase tracking-[0.25em] text-[var(--color-dusty-lavender-100)] hover:border-[var(--color-azure-mist-500)]"
            >
              Change instruments
            </button>
            <div className="rounded-2xl bg-[var(--color-dusty-grape-950)] px-3 py-2 text-xs uppercase tracking-[0.25em] text-[var(--color-azure-mist-300)]">
              {isReady ? 'Samples loaded' : 'Loading samples...'}
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-[var(--color-dusty-grape-600)] bg-[var(--color-dusty-grape-900)] p-4">
            <div className="min-w-full">
              <div className="grid grid-cols-[minmax(12rem,14rem)_1fr] gap-4">
                <div className="space-y-2">
                  <div className="rounded-2xl bg-[var(--color-dusty-grape-900)] px-3 py-2 text-xs uppercase tracking-[0.2em] text-[var(--color-dusty-lavender-300)]">Instrument</div>
                </div>
                <div className="rounded-2xl bg-[var(--color-dusty-grape-900)] px-3 py-2 text-xs uppercase tracking-[0.2em] text-[var(--color-dusty-lavender-300)]">Pattern</div>
              </div>

              <div className="space-y-3 pt-3">
                {selectedInstruments.map((instrument, instrumentIndex) => (
                  <div key={instrument.key} className="grid grid-cols-[minmax(12rem,14rem)_1fr] gap-4 rounded-3xl border border-[var(--color-dusty-grape-700)] bg-[var(--color-dusty-grape-950)] p-3">
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold text-[var(--color-dusty-lavender-50)]">{instrument.name}</p>
                        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-dusty-lavender-400)]">{instrument.key}</p>
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
                          className="inline-flex items-center gap-2 rounded-2xl border border-[var(--color-dusty-grape-600)] bg-[var(--color-dusty-grape-700)] px-3 py-2 text-xs uppercase tracking-[0.2em] text-[var(--color-dusty-lavender-100)] hover:border-[var(--color-azure-mist-500)]"
                        >
                          {muteStates[instrument.key] ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                          {muteStates[instrument.key] ? 'Muted' : 'Live'}
                        </button>
                      </div>
                      <label className="space-y-1 text-xs uppercase tracking-[0.2em] text-[var(--color-dusty-lavender-300)]">
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
                          className="w-full accent-[var(--color-azure-mist-400)]"
                        />
                      </label>
                    </div>

                    <div 
                      ref={(el) => {
                        scrollRefs.current[instrumentIndex] = el
                      }}
                      className="overflow-x-auto rounded-3xl border border-[var(--color-dusty-grape-700)] bg-[var(--color-dusty-grape-900)] p-2"
                      onScroll={(event) => handleScroll(event, instrumentIndex)}
                    >
                      <div className="space-y-2">
                        {Array.from({ length: measures }, (_, measureIndex) => (
                          <div key={measureIndex} className="text-center">
                            <div className="mb-1 text-xs text-[var(--color-dusty-lavender-400)] uppercase tracking-[0.2em]">
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
                                        ? 'border-[var(--color-azure-mist-400)] bg-[var(--color-dark-cyan-500)] text-[var(--color-dusty-grape-950)]'
                                        : 'border-[var(--color-dusty-grape-600)] bg-[var(--color-dusty-grape-700)] text-[var(--color-dusty-lavender-200)]'
                                      } ${isCurrent ? 'shadow-[0_0_0_3px_var(--color-azure-mist-500)]' : ''}`}
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
```

---

### src/drum-machine/sampleMap.ts

```typescript
/**
 * sampleMap.ts
 *
 * Contains the list of available drum and percussion instruments,
 * including sample file mapping and the human-readable display name.
 * The instrument key is used throughout the drum machine as a unique
 * identifier for selecting instruments and loading sample audio.
 */

/**
 * Describes a single drum or percussion sample available in the drum machine.
 *
 * @property key  - Unique identifier matching the FatBoy soundfont filename stem
 *                  (e.g. `"B1"` â†’ `B1.mp3`). Used as the `Tone.Players` key.
 * @property file - MP3 filename (e.g. `"B1.mp3"`) served from `/drums/`.
 * @property name - Human-readable display name shown in the instrument selector UI.
 */
export interface DrumInstrument {
  key: string
  file: string
  name: string
}

/**
 * Complete catalog of all 57 drum and percussion instruments available
 * in the drum machine, sourced from the FatBoy General MIDI soundfont.
 *
 * Includes standard GM percussion (kick, snare, hi-hat, cymbals, toms),
 * extended latin percussion (bongos, congas, timbales, etc.), and
 * custom non-GM samples (metronome clicks, triangle, china cymbals).
 */
export const instrumentList: DrumInstrument[] = [
  { key: 'A1', file: 'A1.mp3', name: 'Metronome Accent' },
  { key: 'Ab1', file: 'Ab1.mp3', name: 'Metronome Sub' },
  { key: 'B1', file: 'B1.mp3', name: 'Kick 1' },
  { key: 'C2', file: 'C2.mp3', name: 'Kick 2' },
  { key: 'Ab2', file: 'Ab2.mp3', name: 'Hi-Hat Closed 1' },
  { key: 'Gb2', file: 'Gb2.mp3', name: 'Hi-Hat Closed 2' },
  { key: 'Bb2', file: 'Bb2.mp3', name: 'Hi-Hat Open 1' },
  { key: 'D2', file: 'D2.mp3', name: 'Snare 1' },
  { key: 'E2', file: 'E2.mp3', name: 'Snare 2' },
  { key: 'Db2', file: 'Db2.mp3', name: 'Cross-Stick 1' },
  { key: 'G1', file: 'G1.mp3', name: 'Stick Click' },
  { key: 'D3', file: 'D3.mp3', name: 'Hi Tom' },
  { key: 'B2', file: 'B2.mp3', name: 'Mid Tom' },
  { key: 'C3', file: 'C3.mp3', name: 'Mid Tom 2' },
  { key: 'A2', file: 'A2.mp3', name: 'Floor Tom 2' },
  { key: 'F2', file: 'F2.mp3', name: 'Floor Tom 3' },
  { key: 'G2', file: 'G2.mp3', name: 'Floor Tom 4' },
  { key: 'B3', file: 'B3.mp3', name: 'Ride 1' },
  { key: 'Eb3', file: 'Eb3.mp3', name: 'Ride 2' },
  { key: 'F3', file: 'F3.mp3', name: 'Ride Bell' },
  { key: 'A3', file: 'A3.mp3', name: 'Crash 1' },
  { key: 'Db3', file: 'Db3.mp3', name: 'Crash 2' },
  { key: 'E1', file: 'E1.mp3', name: 'China 1' },
  { key: 'E3', file: 'E3.mp3', name: 'China 2' },
  { key: 'G3', file: 'G3.mp3', name: 'Splash' },
  { key: 'Eb2', file: 'Eb2.mp3', name: 'Clap' },
  { key: 'Bb1', file: 'Bb1.mp3', name: 'Triangle' },
  { key: 'F1', file: 'F1.mp3', name: 'Flub Drum 1' },
  { key: 'Gb1', file: 'Gb1.mp3', name: 'Flub Drum 2' },
  { key: 'Ab3', file: 'Ab3.mp3', name: 'Cowbell' },
  { key: 'Bb3', file: 'Bb3.mp3', name: 'Vibroslap' },
  { key: 'Gb3', file: 'Gb3.mp3', name: 'Tambourine' },
  { key: 'B4', file: 'B4.mp3', name: 'Whistle 1' },
  { key: 'Bb4', file: 'Bb4.mp3', name: 'Shaker 1' },
  { key: 'C4', file: 'C4.mp3', name: 'Bongo High' },
  { key: 'D4', file: 'D4.mp3', name: 'Bongo Mid' },
  { key: 'Db4', file: 'Db4.mp3', name: 'Bongo Low' },
  { key: 'E4', file: 'E4.mp3', name: 'Conga Low' },
  { key: 'Eb4', file: 'Eb4.mp3', name: 'Conga High' },
  { key: 'F4', file: 'F4.mp3', name: 'Timbale High' },
  { key: 'G4', file: 'G4.mp3', name: 'Agogo Bell' },
  { key: 'Gb4', file: 'Gb4.mp3', name: 'Timbale Mid' },
  { key: 'B5', file: 'B5.mp3', name: 'Sleigh Bells' },
  { key: 'Bb5', file: 'Bb5.mp3', name: 'Shaker 2' },
  { key: 'C5', file: 'C5.mp3', name: 'Whistle 2' },
  { key: 'D5', file: 'D5.mp3', name: 'Guiro Run' },
  { key: 'Db5', file: 'Db5.mp3', name: 'Guiro Tap' },
  { key: 'E5', file: 'E5.mp3', name: 'Woodblock Mid' },
  { key: 'Eb5', file: 'Eb5.mp3', name: 'Clave' },
  { key: 'F5', file: 'F5.mp3', name: 'Woodblock Low' },
  { key: 'G5', file: 'G5.mp3', name: 'Cuica Low' },
  { key: 'Gb5', file: 'Gb5.mp3', name: 'Cuica High' },
  { key: 'C6', file: 'C6.mp3', name: 'Chimes' },
  { key: 'D6', file: 'D6.mp3', name: 'Concert Tom 1' },
  { key: 'Db6', file: 'Db6.mp3', name: 'Castanets' },
  { key: 'Eb6', file: 'Eb6.mp3', name: 'Concert Tom 2' },
]

/**
 * Convenience lookup map derived from {@link instrumentList}.
 * Maps each instrument `key` directly to its MP3 `file` string.
 *
 * Used by `DrumMachine` and `ToneExportButton` to build the `Tone.Players`
 * URL map without iterating the full `instrumentList` array.
 *
 * @example
 * sampleFiles["B1"] // â†’ "B1.mp3"
 */
export const sampleFiles = Object.fromEntries(
  instrumentList.map((instrument) => [instrument.key, instrument.file]),
) as Record<string, string>
```

---

### src/drum-machine/ToneExportButton.tsx

```tsx
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
```

---

### src/lib/audio/loadSamples.ts

```typescript
import * as Tone from "tone";

/**
 * A map of drum instrument names to a pool of `Tone.Player` instances.
 * Multiple players per instrument allow simultaneous trigger events on the
 * same voice (polyphony) without cutting off a currently playing hit.
 *
 * @example
 * const map: DrumSampleMap = {
 *   kick:  [Player, Player, Player],
 *   snare: [Player, Player, Player],
 * };
 */
export type DrumSampleMap = Record<string, Tone.Player[]>;

/**
 * Loads drum sample MP3s from the FatBoy soundfont server and creates a small
 * pool of `Tone.Player` instances per instrument to support polyphonic playback.
 *
 * Samples are served from:
 * `http://localhost:8080/samples/soundfonts/FatBoy/percussion-mp3/`
 *
 * @param poolSize - Number of `Tone.Player` instances to create per instrument.
 *                   A larger pool reduces the chance of a hit being skipped on
 *                   rapid re-triggers. Defaults to `3`.
 * @returns A resolved {@link DrumSampleMap} with all audio buffers loaded.
 *
 * @example
 * const samples = await loadDrumSamples(4);
 * samples["kick"][0].start(); // trigger kick
 */
export async function loadDrumSamples(poolSize = 3): Promise<DrumSampleMap> {
   const base = "http://localhost:8080/samples/soundfonts/FatBoy/percussion-mp3/";

   const sampleUrls: Record<string, string> = {
      kick: `${base}/B1.mp3`,
      snare: `${base}/D2.mp3`,
      hihat: `${base}/Gb2.mp3`,
   };

   // Create a player pool per instrument
   const map: DrumSampleMap = {};
   for (const [key, url] of Object.entries(sampleUrls)) {
      const players: Tone.Player[] = [];
      for (let i = 0; i < poolSize; i++) {
         const p = new Tone.Player(url).toDestination();
         players.push(p);
      }
      map[key] = players;
   }

   // Wait for all created players' buffers to load
   await Tone.loaded();

   return map;
}
```

---

### src/lib/BPMCursorController.ts

```typescript
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
 * @property volume         - Linear volume 0.0â€“1.0 (sourced from MusicXML `<volume>`).
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
 * 2. Resolves each noteâ€™s sub-instrument `fixedKey` to a GM MIDI number.
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
    * `OSMD Note.PlaybackInstrumentId` â†’ `SubInstrument.fixedKey` (MIDI number)
    * â†’ {@link DRUM_MIDI_TO_SAMPLE} key â†’ `drumEngine.play(key, volumeMultiplier)`
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
    * - Otherwise, `getToneNotesFromCursor()` fires the current beatâ€™s samples and
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
```

---

### src/lib/rhythm/converters/toToneEvents.ts

```typescript
import { DrumPattern } from "../types";

/**
 * A drum event formatted for the Tone.js Transport scheduler.
 *
 * @property time       - Tone.js transport-style time string in `"measure:beat:sixteenth"` format.
 *                        Example: `"0:1:2"` = measure 0, beat 1, sixteenth 2.
 * @property instrument - The drum voice to trigger (maps to a sample key).
 * @property duration   - Duration of the note in musical units.
 * @property velocity   - Optional accent level in the range 0.0â€“1.0.
 */
export interface ToneEvent {
   time: string;
   instrument: string;
   duration: number;
   velocity?: number;
}

/**
 * Converts the beat-offset notes of a {@link DrumPattern} into Tone.js
 * transport-style time strings suitable for `Transport.scheduleRepeat`.
 *
 * Time conversion formula:
 * - `beat`      = `Math.floor(note.time)`        â€” integer beat number
 * - `sixteenth` = `Math.round((note.time % 1) * 4)` â€” 16th-note offset
 * - Result:     `"0:<beat>:<sixteenth>"`
 *
 * @remarks This function does **not** convert to seconds. Seconds conversion
 * happens at the audio scheduling boundary (e.g., `PatternTransport`).
 *
 * @param pattern - The source drum pattern.
 * @returns Array of {@link ToneEvent} objects ready for Transport scheduling.
 *
 * @example
 * // DrumNote { time: 1.5 } â†’ ToneEvent { time: "0:1:2" }
 * const events = patternToToneEvents(myPattern);
 */
export function patternToToneEvents(pattern: DrumPattern): ToneEvent[] {
   return pattern.notes.map((n) => {
      const beat = Math.floor(n.time);          // 1.0 â†’ 1
      const subdivision = n.time % 1;           // 1.5 â†’ 0.5

      // Convert subdivision to 16th notes
      const sixteenth = Math.round(subdivision * 4); // 0.5 â†’ 2

      const toneTime = `0:${beat}:${sixteenth}`;

      return {
         time: toneTime,
         instrument: n.instrument,
         duration: n.duration,
         velocity: n.velocity,
      };
   });
}
```

---

### src/lib/rhythm/converters/toVexFlow.ts

```typescript
import { DrumNote, DrumPattern, DrumInstrument } from "../types";
import Vex, { StaveNote, Beam, Voice, NoteStruct, KeySignature } from "vexflow";

/**
 * Maps each {@link DrumInstrument} to its VexFlow staff position key and optional
 * notehead style. Instruments that use an "x" notehead (e.g. hi-hat, ride, crash)
 * are rendered with `notehead: "x"` to follow standard percussion notation.
 *
 * @example
 * DRUM_MAP["hihat"] // â†’ { key: "f/5", notehead: "x" }
 */
const DRUM_MAP: Record<
   DrumInstrument,
   { key: string; line?: number; notehead?: string; stem?: number }
> = {
   kick: { key: "f/4" }, // low 
   snare: { key: "c/5" }, // mid 
   hihat: { key: "f/5", notehead: "x" }, // X notehead 
   tom: { key: "a/3" }, // example tom 
   ride: { key: "ax/5", notehead: "x" },
   crash: { key: "cx/6", notehead: "x" },
};

/**
 * Represents a single measure of notation produced by {@link patternToVexFlowMeasures}.
 *
 * @property index       - Zero-based measure number within the pattern.
 * @property notes       - VexFlow `StaveNote` objects for all beats in this measure.
 * @property beams       - VexFlow `Beam` objects for grouping eighth/sixteenth notes.
 * @property uniqueTimes - Sorted array of distinct beat-time values present in the measure.
 */
export interface VexMeasure {
   index: number;
   notes: StaveNote[];
   beams: Beam[];
   uniqueTimes: number[];
}


/**
 * Groups the notes of a {@link DrumPattern} into measures.
 *
 * @param pattern         - The source drum pattern.
 * @param beatsPerMeasure - Number of quarter-note beats per measure. Defaults to 4.
 * @returns Array of `{ index, notes }` objects sorted by measure index.
 */
function patternToMeasures(
   pattern: DrumPattern,
   beatsPerMeasure = 4
): { index: number; notes: DrumNote[] }[] {
   const measures = new Map<number, DrumNote[]>();

   for (const note of pattern.notes) {
      const measureIndex = Math.floor(note.time / beatsPerMeasure);
      if (!measures.has(measureIndex)) measures.set(measureIndex, []);
      measures.get(measureIndex)!.push(note);
   }

   return Array.from(measures.entries())
      .sort(([a], [b]) => a - b)
      .map(([index, notes]) => ({ index, notes }));
}


/**
 * Builds a VexFlow `NoteStruct` for a chord of simultaneous drum hits.
 *
 * @param instruments - List of drum voices sounding at the same time.
 * @param duration    - VexFlow duration string (e.g. `"q"` = quarter, `"8"` = eighth). Defaults to `"8"`.
 * @returns A `NoteStruct` ready to be passed to `new StaveNote()`.
 */
function makeDrumNoteStruct(
   instruments: DrumInstrument[],
   duration: string = "8"
): NoteStruct {
   return {
      keys: instruments.map(i => DRUM_MAP[i].key),
      duration,
   };
}

/**
 * Converts a {@link DrumPattern} into an array of {@link VexMeasure} objects
 * suitable for rendering on a VexFlow `Stave`.
 *
 * Notes at the same beat time are stacked into a single chord `StaveNote`.
 * Dynamic beaming is generated automatically via `Beam.generateBeams`.
 *
 * @param pattern         - The source drum pattern.
 * @param beatsPerMeasure - Number of quarter-note beats per measure. Defaults to 4.
 * @returns Array of {@link VexMeasure} objects, one per measure.
 */
export function patternToVexFlowMeasures(
   pattern: DrumPattern,
   beatsPerMeasure = 4
): VexMeasure[] {
   const measureDefs = patternToMeasures(pattern, beatsPerMeasure);
   console.log(measureDefs)
   const measures: VexMeasure[] = [];

   for (const { index, notes } of measureDefs) {
      const groups = new Map<number, DrumNote[]>();

      for (const n of notes) {
         if (!groups.has(n.time)) groups.set(n.time, []);
         groups.get(n.time)!.push(n);
      }

      const chordNotes: StaveNote[] = [];
      const uniqueTimes = Array.from(groups.keys()).sort((a, b) => a - b);

      for (const time of uniqueTimes) {
         const group = groups.get(time)!;
         const instruments = group.map(n => n.instrument);
         const noteStruct = makeDrumNoteStruct(instruments, "q");

         const staveNote = new StaveNote(noteStruct);

         chordNotes.push(staveNote);
      }

      // Generating dynamic beaming
      const beams = Beam.generateBeams(chordNotes, {
         flatBeams: true,
         stemDirection: 1
      });

      measures.push({
         index,
         notes: chordNotes,
         beams,
         uniqueTimes,
      });
   }

   return measures;
}


/**
 * Converts a {@link DrumPattern} into a flat array of VexFlow `StaveNote` objects
 * without measure grouping. Useful for single-measure or simplified rendering.
 *
 * Notes at the same beat time are stacked into a chord. Instruments that use
 * an `"x"` notehead (hi-hat, ride, crash) receive a VexFlow `Annotation` to
 * render the correct percussive notehead symbol.
 *
 * @param pattern - The source drum pattern.
 * @returns Object with a `notes` array of `StaveNote` instances.
 */
export function patternToVexFlowNotes(pattern: DrumPattern) {
   const groups = new Map<number, DrumNote[]>();

   // Group notes by beat
   for (const note of pattern.notes) {
      if (!groups.has(note.time)) groups.set(note.time, []);
      groups.get(note.time)!.push(note);
   }

   const notes: StaveNote[] = [];

   for (const [time, group] of groups.entries()) {
      const keys = group.map(n => DRUM_MAP[n.instrument].key);

      const staveNote = new StaveNote({
         keys,
         duration: "8",
      });

      // Add "x" annotations for instruments that require X noteheads (e.g., hi-hat)
      group.forEach((n, i) => {
         const map = DRUM_MAP[n.instrument];
         if (map.notehead === "x") {
            const ann = new Vex.Annotation("x")
               .setFont("Arial", 14, "bold")
               .setVerticalJustification(Vex.Annotation.VerticalJustify.CENTER);
            (staveNote as any).addAnnotation(i, ann);
         }
      });

      notes.push(staveNote); // <-- MUST be an instance
   }

   return { notes };
}
```

---

### src/lib/rhythm/types.ts

```typescript
/**
 * The set of drum instrument voices supported by the rhythm engine.
 * Each value maps to a VexFlow staff position and a sample key via DRUM_MAP / DRUM_MIDI_TO_SAMPLE.
 */
export type DrumInstrument =
   | "kick"
   | "snare"
   | "hihat"
   | "tom"
   | "ride"
   | "crash";

/**
 * A single drum hit within a {@link DrumPattern}.
 *
 * @property time       - Beat offset from the start of the pattern in quarter-note units.
 *                        Example: `1.5` = beat 1 + an eighth-note.
 * @property duration   - Duration value. Interpretation depends on context:
 *                        seconds when scheduling audio, musical units when rendering notation.
 * @property instrument - The drum voice to trigger.
 * @property velocity   - Optional accent level in the range 0.0â€“1.0. Defaults to 1.0 when omitted.
 */
export interface DrumNote {
   time: number;
   duration: number;
   instrument: DrumInstrument;
   velocity?: number;
}

/**
 * A complete drum pattern that can be rendered as notation or scheduled for playback.
 *
 * @property id    - Unique identifier used as a lookup key.
 * @property title - Human-readable display name.
 * @property bpm   - Tempo in beats per minute.
 * @property notes - Ordered list of drum hits that make up the pattern.
 */
export interface DrumPattern {
   id: string;
   title: string;
   bpm: number;
   notes: DrumNote[];
}

/**
 * Generic label/value pair used by dropdown and select components.
 *
 * @property label - Text displayed to the user.
 * @property value - Internal string value passed to event handlers.
 */
export interface OptionType {
   label: string;
   value: string;
}

//export interface DropdownProps {
//   options: OptionType[];
//   placeholder?: string;
//   onValueUpdate?: (value: string) => void;
//}
```

---

### src/lib/toneDrums.ts

```typescript
import * as Tone from "tone";

/**
 * A single drum playback event derived from an OSMD score or pattern.
 *
 * @property time     - Absolute offset in seconds from the start of playback.
 * @property midi     - General MIDI percussion note number (35â€“92).
 *                      Use {@link DRUM_MIDI_TO_SAMPLE} to resolve to a sample key.
 * @property velocity - Optional accent level in the range 0.0â€“1.0.
 */
export type DrumEvent = {
  time: number;
  midi: number;
  velocity?: number;
};

/** Singleton `Tone.Sampler` instance. Initialised once by {@link initDrumSampler}. */
let sampler: Tone.Sampler | null = null;
/** Tracks whether `Tone.start()` has already been called. */
let started = false;

/**
 * Initialises and returns the singleton `Tone.Sampler` keyed by GM MIDI
 * percussion note numbers (35â€“92) plus custom notes (84â€“92).
 *
 * Samples are served as MP3 files from `/drums/` (relative to the document
 * root, i.e. `public/drums/`). Subsequent calls return the cached instance
 * without reloading.
 *
 * @returns The ready-to-use `Tone.Sampler` after all audio buffers have loaded.
 */
export async function initDrumSampler() {
  if (sampler) return sampler;

  sampler = new Tone.Sampler(
    {
        84: "A1.mp3",   // metronome-click-accent
        85: "Ab1.mp3",  // metronome-click-sub
        86: "Bb1.mp3",  // triangle-1
        87: "E1.mp3",   // china-1
        88: "Eb1.mp3",  // e-kick-1
        89: "F1.mp3",   // flub-drum-1
        90: "G1.mp3",   // stick-click-1
        91: "Gb1.mp3",  // flub-drum-2
        92: "A2.mp3",   // floor-tom-2 (alternate)

        // --- General MIDI Percussion (Standard) ---
        35: "B1.mp3",     // Acoustic Bass Drum
        36: "C2.mp3",     // Bass Drum 1
        37: "Db2.mp3",    // Side Stick 
        38: "D2.mp3",     // Acoustic Snare 
        39: "Eb2.mp3",    // Hand Clap
        40: "E2.mp3",     // Electric Snare

        41: "B2.mp3",     // Low Floor Tom
        42: "Gb2.mp3",    // Closed Hi-Hat
        43: "C3.mp3",     // High Floor Tom
        44: "Ab2.mp3",    // Pedal Hi-Hat
        45: "A2.mp3",     // Low Tom
        46: "Bb2.mp3",    // Open Hi-Hat â†’ hi-hat-open-1

        47: "F2.mp3",     // Low-Mid Tom
        48: "G2.mp3",     // Hi-Mid Tom
        49: "A3.mp3",     // Crash Cymbal 1 â†’ crash-1
        50: "D3.mp3",     // High Tom â†’ high-tom-1
        51: "B3.mp3",     // Ride Cymbal 1 â†’ ride-1
        52: "F3.mp3",     // Chinese Cymbal â†’ ride-bell-1
        53: "Eb3.mp3",    // Ride Bell â†’ ride-2

        54: "G3.mp3",     // Tambourine â†’ splash-1
        55: "Db3.mp3",    // Splash Cymbal â†’ crash-2
        56: "Ab3.mp3",    // Cowbell â†’ cowbell-1
        57: "Db3.mp3",    // Crash Cymbal 2 â†’ crash-2
        58: "Bb3.mp3",    // Vibra Slap â†’ vibroslap-1
        59: "E3.mp3",     // Ride Cymbal 2 â†’ china-2

        60: "C4.mp3",     // High Bongo â†’ bongo-high-1
        61: "D4.mp3",     // Low Bongo â†’ bongo-med-1
        62: "Db4.mp3",    // Mute High Conga â†’ bongo-low-1
        63: "Eb4.mp3",    // Open High Conga â†’ conga-high-1
        64: "E4.mp3",     // Low Conga â†’ conga-low-1

        65: "F4.mp3",     // High Timbale â†’ timbale-high-1
        66: "Gb4.mp3",    // Low Timbale â†’ timbale-med-1
        67: "G4.mp3",     // High Agogo â†’ agogo-bell-high-1
        68: "Gb4.mp3",    // Low Agogo â†’ timbale-med-1
        69: "G4.mp3",     // Cabasa â†’ agogo-bell-high-1
        70: "Gb3.mp3",    // Maracas â†’ tamborine-1

        71: "B5.mp3",     // Short Whistle â†’ sleigh-bells-1
        72: "C5.mp3",     // Long Whistle â†’ whistle-2
        73: "Bb5.mp3",    // Short Guiro â†’ shaker-2
        74: "D5.mp3",     // Long Guiro â†’ guiro-run-1
        75: "Db5.mp3",    // Claves â†’ guiro-tap-1
        76: "Eb5.mp3",     // High Wood Block â†’ clave-1
        77: "F5.mp3",     // Low Wood Block â†’ woodblock-low-1

        78: "G5.mp3",     // Mute Cuica â†’ cuica-low-1
        79: "Gb5.mp3",    // Open Cuica â†’ cuica-high-1
        80: "C6.mp3",     // Mute Triangle â†’ chimes-1
        81: "D6.mp3",     // Open Triangle â†’ concert-tom-1
        82: "Db6.mp3",    // Shaker / Castanets â†’ castanets-1
        83: "Eb6.mp3",    // Jingle Bell â†’ concert-tom-2
    },
    {
      baseUrl: "/drums/"
    }
  ).toDestination();

  await Tone.loaded();
  return sampler;
}

/**
 * Unlocks the Web Audio context on the first call (required after a user gesture
 * in browsers that block auto-playing audio). Subsequent calls are no-ops.
 */
export async function startAudioContext() {
  if (!started) {
    await Tone.start();
    started = true;
  }
}

/**
 * Schedules and plays a sequence of drum events using the singleton
 * `Tone.Sampler`. Each event is triggered relative to `Tone.now()` using
 * `sampler.triggerAttackRelease`.
 *
 * Initialises the sampler and unlocks the audio context if not already done.
 *
 * @param events - Array of {@link DrumEvent} objects describing MIDI note,
 *                 time offset (seconds), and optional velocity.
 *
 * @example
 * await playDrumPattern([
 *   { time: 0.0, midi: 36, velocity: 1.0 }, // kick on beat 1
 *   { time: 0.5, midi: 42, velocity: 0.7 }, // hi-hat on the "and"
 * ]);
 */
export async function playDrumPattern(events: DrumEvent[]) {
  if (!sampler) {
    await initDrumSampler();
  }
  await startAudioContext();

  const now = Tone.now();

  events.forEach((ev) => {
    const note = ev.midi.toString(); // Sampler keys are MIDI numbers as strings
    const vel = ev.velocity ?? 0.1;
    sampler!.triggerAttackRelease(note, "8n", now + ev.time, vel);
  });
}
```

---

### src/metronome/MetronomeContext.tsx

```tsx
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
```

---

### src/musicxml/drumPlaybackEngine.ts

```typescript
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
 *    - `instrumentId` â†’ MIDI number via {@link INSTRUMENT_ID_TO_MIDI}
 *    - MIDI number â†’ sample key via {@link DRUM_MIDI_TO_SAMPLE}
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
```

---

### src/musicxml/extractDrumNotes.ts

```typescript
/**
 * A minimal representation of a single drum note extracted from a MusicXML
 * `<note>` element.
 *
 * @property instrumentId      - The `id` attribute of the `<instrument>` child
 *                               element (e.g. `"P1-I37"`), or `null` if absent.
 * @property durationDivisions - Raw duration value in MusicXML divisions
 *                               (quarter-note subdivisions defined by `<divisions>`).
 */
export type DrumNote = {
  instrumentId: string | null;
  durationDivisions: number;
};

/**
 * Extracts drum note data from a parsed MusicXML `Document`.
 *
 * Iterates all `<note>` elements in document order, skipping rest elements.
 * Returns instrument ID and raw duration for each sounding note.
 *
 * @param xml - A MusicXML `Document` produced by {@link parseMusicXML}.
 * @returns Ordered array of {@link DrumNote} objects representing every
 *          sounding note in the score.
 *
 * @example
 * const doc = parseMusicXML(rawXml);
 * const notes = extractDrumNotes(doc);
 * // notes[0] â†’ { instrumentId: "P1-I37", durationDivisions: 2 }
 */
export function extractDrumNotes(xml: Document): DrumNote[] {
  const notes = Array.from(xml.getElementsByTagName("note"));
  const result: DrumNote[] = [];

  for (const note of notes) {
    const rest = note.getElementsByTagName("rest")[0];
    if (rest) continue; // skip rests

    const instr = note.getElementsByTagName("instrument")[0];
    const duration = note.getElementsByTagName("duration")[0];

    result.push({
      instrumentId: instr ? instr.getAttribute("id") : null,
      durationDivisions: duration ? Number(duration.textContent) : 0
    });
  }

  return result;
}
```

---

### src/musicxml/loadMusicXML.ts

```typescript
/**
 * Fetches a MusicXML file from the given URL and returns its raw text content.
 *
 * @param filePath - URL or path to the `.musicxml` file
 *                   (e.g. `"/scores/Basic Swing.musicxml"`).
 * @returns The file contents as a UTF-8 string, or `null` if the fetch fails
 *          (network error, 4xx/5xx response, etc.).
 *
 * @example
 * const raw = await loadMusicXML("/scores/Big Band Swing.musicxml");
 * if (raw) {
 *   const doc = parseMusicXML(raw);
 * }
 */
export async function loadMusicXML(filePath: string): Promise<string | null> {
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const xml = await response.text();
    return xml;
  } catch (err) {
    console.error("Failed to load MusicXML:", err);
    return null;
  }
}
```

---

### src/musicxml/parseMusicXML.ts

```typescript
/**
 * Parses a raw MusicXML string into a browser `Document` object using the
 * native `DOMParser` API.
 *
 * The resulting `Document` can be passed to {@link extractDrumNotes},
 * {@link playMusicXMLDrums}, or rendered via OSMD.
 *
 * @param xmlString - Raw MusicXML content as a UTF-8 string.
 * @returns A parsed DOM `Document` with MIME type `application/xml`.
 *
 * @example
 * const raw = await loadMusicXML("/scores/Basic Swing.musicxml");
 * const doc = parseMusicXML(raw!);
 */
export function parseMusicXML(xmlString: string) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlString, "application/xml");

  return xml;
}
```

---

### src/musicxml/useMusicXML.ts

```typescript
import { useEffect, useState } from "react";
import { loadMusicXML } from "./loadMusicXML";
import { parseMusicXML } from "./parseMusicXML";

/**
 * React hook that loads and parses a MusicXML file whenever `filePath` changes.
 *
 * Composes {@link loadMusicXML} (network fetch) and {@link parseMusicXML}
 * (DOM parsing) into a single hook with standard loading/error state.
 *
 * @param filePath - URL or public-folder path to the `.musicxml` file.
 * @returns An object containing:
 *   - `xml`     â€” Parsed `Document`, or `null` while loading / on error.
 *   - `raw`     â€” Raw MusicXML string, or `null` while loading / on error.
 *   - `loading` â€” `true` while the fetch/parse is in progress.
 *   - `error`   â€” Error message string, or `null` if no error occurred.
 *
 * @example
 * function ScoreViewer({ path }: { path: string }) {
 *   const { raw, loading, error } = useMusicXML(path);
 *   if (loading) return <p>Loadingâ€¦</p>;
 *   if (error)   return <p>Error: {error}</p>;
 *   return <MusicXMLOSMDViewer raw={raw!} />;
 * }
 */
export function useMusicXML(filePath: string) {
  const [xml, setXML] = useState<Document | null>(null);
  const [raw, setRaw] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      setLoading(true);
      const text = await loadMusicXML(filePath);

      if (!text) {
        setError("Failed to load MusicXML");
        setLoading(false);
        return;
      }

      setRaw(text);
      setXML(parseMusicXML(text));
      setLoading(false);
    }

    run();
  }, [filePath]);

  return { xml, raw, loading, error };
}
```

---

### src/utils/DrumEngine.ts

```typescript
// DrumEngine.ts
import * as Tone from "tone";

/**
 * Singleton service that holds the active `Tone.Players` instance and provides
 * a simple `play()` API for triggering drum samples.
 *
 * The engine is initialised once at application start by the `<LoadFile>`
 * component (`src/components/audio/Tone.tsx`), which loads all 57 drum samples
 * and calls `setPlayers()`. After that, any module can import `drumEngine` and
 * call `play()` without prop-drilling or React context.
 *
 * @example
 * // Trigger a kick drum at normal volume
 * drumEngine.play("B1");
 *
 * // Trigger a snare at half volume
 * drumEngine.play("D2", 0.5);
 */
class DrumEngine {
   /** The loaded `Tone.Players` instance, or `null` if not yet initialised. */
   players: Tone.Players | null = null;

   /**
    * Registers the loaded `Tone.Players` instance.
    * Must be called before any `play()` invocations.
    *
    * @param players - A fully-loaded `Tone.Players` instance keyed by sample names.
    */
   setPlayers(players: Tone.Players) {
      this.players = players;
   }

   /**
    * Triggers the named drum sample at the specified volume.
    *
    * Silently returns if `players` has not been initialised yet.
    *
    * @param note             - Sample key string matching a key in the `Tone.Players`
    *                           instance (e.g. `"B1"` for kick, `"D2"` for snare).
    * @param volumeMultiplier - Linear volume multiplier in the range 0.0â€“1.0 (or
    *                           higher for accents). Defaults to `1.0`.
    */
   play(note: string, volumeMultiplier: number = 1.0) {
      if (!this.players) return;
      const player = this.players.player(note);
      player.volume.value = volumeMultiplier;
      player.start();
   }
}

/** Pre-constructed singleton instance. Import this directly throughout the app. */
export const drumEngine = new DrumEngine();
```

---

### src/utils/MIDIMapper.ts

```typescript
// import * as OSMD from 'opensheetmusicdisplay';
// const { OpenSheetMusicDisplay } = OSMD;

/**
 * Authoritative mapping from General MIDI percussion note numbers to
 * FatBoy soundfont sample key strings used throughout the application.
 *
 * Covers:
 * - Standard GM percussion (MIDI 35â€“83)
 * - Custom / extended samples (MIDI 84â€“92) such as metronome clicks and
 *   additional cymbals not found in the GM specification
 *
 * Used by:
 * - {@link BPMCursorController} â€” resolves OSMD `fixedKey` â†’ sample key
 * - {@link playMusicXMLDrums} â€” resolves instrument ID â†’ MIDI â†’ sample key
 * - `MusicPlayer` component â€” resolves graphical note MIDI â†’ sample key
 *
 * @example
 * const key = DRUM_MIDI_TO_SAMPLE[36]; // â†’ "C2" (Bass Drum 1)
 * drumEngine.play(key);
 */
export const DRUM_MIDI_TO_SAMPLE: Record<number, string> = {
   // --- Custom (Nonâ€‘GM) Drum Samples ---
   84: "A1",   // metronome-click-accent
   85: "Ab1",  // metronome-click-sub
   86: "Bb1",  // triangle-1
   87: "E1",   // china-1
   88: "Eb1",  // e-kick-1
   89: "F1",   // flub-drum-1
   90: "G1",   // stick-click-1
   91: "Gb1",  // flub-drum-2
   92: "A2",   // floor-tom-2 (alternate)

   // --- General MIDI Percussion (Standard) ---
   35: "B1",     // Acoustic Bass Drum
   36: "C2",     // Bass Drum 1
   37: "Db2",    // Side Stick 
   38: "D2",     // Acoustic Snare 
   39: "Eb2",    // Hand Clap
   40: "E2",     // Electric Snare

   41: "B2",     // Low Floor Tom
   42: "Gb2",    // Closed Hi-Hat
   43: "C3",     // High Floor Tom
   44: "Ab2",    // Pedal Hi-Hat
   45: "A2",     // Low Tom
   46: "Bb2",    // Open Hi-Hat â†’ hi-hat-open-1

   47: "F2",     // Low-Mid Tom
   48: "G2",     // Hi-Mid Tom
   49: "A3",     // Crash Cymbal 1 â†’ crash-1
   50: "D3",     // High Tom â†’ high-tom-1
   51: "B3",     // Ride Cymbal 1 â†’ ride-1
   52: "F3",     // Chinese Cymbal â†’ ride-bell-1
   53: "Eb3",    // Ride Bell â†’ ride-2

   54: "G3",     // Tambourine â†’ splash-1
   55: "Db3",    // Splash Cymbal â†’ crash-2
   56: "Ab3",    // Cowbell â†’ cowbell-1
   57: "Db3",    // Crash Cymbal 2 â†’ crash-2
   58: "Bb3",    // Vibra Slap â†’ vibroslap-1
   59: "E3",     // Ride Cymbal 2 â†’ china-2

   60: "C4",     // High Bongo â†’ bongo-high-1
   61: "D4",     // Low Bongo â†’ bongo-med-1
   62: "Db4",    // Mute High Conga â†’ bongo-low-1
   63: "Eb4",    // Open High Conga â†’ conga-high-1
   64: "E4",     // Low Conga â†’ conga-low-1

   65: "F4",     // High Timbale â†’ timbale-high-1
   66: "Gb4",    // Low Timbale â†’ timbale-med-1
   67: "G4",     // High Agogo â†’ agogo-bell-high-1
   68: "Gb4",    // Low Agogo â†’ timbale-med-1
   69: "G4",     // Cabasa â†’ agogo-bell-high-1
   70: "Gb3",    // Maracas â†’ tamborine-1

   71: "B5",     // Short Whistle â†’ sleigh-bells-1
   72: "C5",     // Long Whistle â†’ whistle-2
   73: "Bb5",    // Short Guiro â†’ shaker-2
   74: "D5",     // Long Guiro â†’ guiro-run-1
   75: "Db5",    // Claves â†’ guiro-tap-1
   76: "Eb5",     // High Wood Block â†’ clave-1
   77: "F5",     // Low Wood Block â†’ woodblock-low-1

   78: "G5",     // Mute Cuica â†’ cuica-low-1
   79: "Gb5",    // Open Cuica â†’ cuica-high-1
   80: "C6",     // Mute Triangle â†’ chimes-1
   81: "D6",     // Open Triangle â†’ concert-tom-1
   82: "Db6",    // Shaker / Castanets â†’ castanets-1
   83: "Eb6",    // Jingle Bell â†’ concert-tom-2
};

export function setMIDI(subInstruments: OSMD.SubInstrument[],  ) {

}
```

---

