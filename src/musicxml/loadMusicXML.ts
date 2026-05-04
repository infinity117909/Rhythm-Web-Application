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