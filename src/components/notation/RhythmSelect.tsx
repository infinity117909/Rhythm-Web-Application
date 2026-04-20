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
