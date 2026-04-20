// Very simple extractor: pulls duration + instrument id
export type DrumNote = {
  instrumentId: string | null;
  durationDivisions: number;
};

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
