import React, { useEffect, useRef, useState } from "react";
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

export function LoadMusicXMLShort({ music }) {
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
