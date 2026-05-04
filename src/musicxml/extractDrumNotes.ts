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
 * // notes[0] → { instrumentId: "P1-I37", durationDivisions: 2 }
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
