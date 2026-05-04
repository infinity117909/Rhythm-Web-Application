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
 *   - `xml`     — Parsed `Document`, or `null` while loading / on error.
 *   - `raw`     — Raw MusicXML string, or `null` while loading / on error.
 *   - `loading` — `true` while the fetch/parse is in progress.
 *   - `error`   — Error message string, or `null` if no error occurred.
 *
 * @example
 * function ScoreViewer({ path }: { path: string }) {
 *   const { raw, loading, error } = useMusicXML(path);
 *   if (loading) return <p>Loading…</p>;
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