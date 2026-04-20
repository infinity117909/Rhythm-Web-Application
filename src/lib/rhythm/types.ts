export type DrumInstrument =
   | "kick"
   | "snare"
   | "hihat"
   | "tom"
   | "ride"
   | "crash";

export interface DrumNote {
   // time is in beats (quarter-note units). Example: 1.5 = beat 1 + an eighth-note.
   time: number;
   duration: number; // seconds or musical duration depending on usage
   instrument: DrumInstrument;
   velocity?: number;
}

export interface DrumPattern {
   id: string;
   title: string;
   bpm: number;
   notes: DrumNote[];
}

export interface OptionType {
   label: string;
   value: string;
}

//export interface DropdownProps {
//   options: OptionType[];
//   placeholder?: string;
//   onValueUpdate?: (value: string) => void;
//}
