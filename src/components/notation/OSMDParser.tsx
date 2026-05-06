// Delete when certain I can!  
import { useEffect, useRef, useState } from "react";  
import * as OSMD from "opensheetmusicdisplay";  
const { OpenSheetMusicDisplay, CursorType, MusicSheetReader } = OSMD;  
import { BPMCursorController } from "../../lib/BPMCursorController";  
  
interface TripletInfo {  
  timestamp: number;  
  notes: number;  
  normalNotes: number;  
}  
  
interface ParseXMLProps {  
   filePath: string;  
}  
  
async function parseXml(filePath: string) {  
   const response = await fetch(filePath);  
   const text = await response.text();  
   const parser = new DOMParser();  
   return parser.parseFromString(text, "application/xml");  
}  
  
function extractTriplets(sheet: OSMD.MusicSheet): TripletInfo[] {  
  const triplets: TripletInfo[] = [];  
    
  for (const measure of sheet.SourceMeasures) {  
    for (const container of measure.VerticalSourceStaffEntryContainers) {  
      for (const staffEntry of container.StaffEntries) {  
        if (!staffEntry) continue;  
          
        const timestamp = staffEntry.AbsoluteTimestamp.RealValue;  
          
        for (const voiceEntry of staffEntry.VoiceEntries) {  
          for (const note of voiceEntry.Notes) {  
            if (note.NoteTuplet && note.PrintObject) {  
              const tuplet = note.NoteTuplet;  
                
              // Check if this is the first note of the tuplet to avoid duplicates  
              if (tuplet.Notes[0][0] === note) {  
                triplets.push({  
                  timestamp,  
                  notes: tuplet.TupletLabelNumber,  
                  normalNotes: note.NormalNotes || 2  
                });  
              }  
            }  
          }  
        }  
      }  
    }  
  }  
    
  return triplets;  
}  
  
async function loadAndRender(  
   osmd: OSMD.OpenSheetMusicDisplay,  
   filePath: string  
): Promise<{ controller: BPMCursorController | null; triplets: TripletInfo[] }> {  
  
   const xmlDoc = await parseXml(filePath);  
   if (!xmlDoc) return { controller: null, triplets: [] };  
  
   await osmd.load(xmlDoc);  
   osmd.render();  
  
   osmd.cursor.reset();  
   osmd.cursor.hide();  
  
   const root = xmlDoc.firstElementChild;  
   if (!root) return { controller: null, triplets: [] };  
  
   const xmlElem = new OSMD.IXmlElement(root);  
   const sheetReader = new MusicSheetReader();  
   const sheet = sheetReader.createMusicSheet(xmlElem, filePath);  
     
   const triplets = extractTriplets(sheet);  
  
   return {  
     controller: new BPMCursorController(osmd, sheet),  
     triplets  
   };  
}  
  
export default function ParseXML({ filePath }: ParseXMLProps) {  
   const osmdContainerRef = useRef<HTMLDivElement | null>(null);  
   const osmdRef = useRef<OSMD.OpenSheetMusicDisplay | null>(null);  
   const controllerRef = useRef<BPMCursorController | null>(null);  
  
   const [loop, setLoop] = useState(false);  
   const [triplets, setTriplets] = useState<TripletInfo[]>([]);  
  
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
            // Configure triplet display options  
            tripletsBracketed: true,  
            tupletsRatioed: false,  
         });  
      }  
  
      const osmd = osmdRef.current;  
  
      loadAndRender(osmd, filePath).then(({ controller, triplets }) => {  
         controllerRef.current = controller;  
         setTriplets(triplets);  
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
         <div>  
            <button onClick={ handleStart }>Start</button>  
            <button onClick={ handleStop } style={ { marginLeft: "8px" } }>  
               Stop  
            </button>  
  
            <label>  
               <input  
                  type="checkbox"  
                  checked={ loop }  
                  onChange={ (e) => setLoop(e.target.checked) }  
               />  
               Loop playback  
            </label>  
         </div>  
  
         <div>  
            <h4>Triplets Found: {triplets.length}</h4>  
            {triplets.map((triplet, index) => (  
               <div key={index}>  
                  Triplet at {triplet.timestamp}: {triplet.notes} notes in the space of {triplet.normalNotes}  
               </div>  
            ))}  
         </div>  
  
         <div  
            ref={ osmdContainerRef }  
         />  
      </>  
   );  
}