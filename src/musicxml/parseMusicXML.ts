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
