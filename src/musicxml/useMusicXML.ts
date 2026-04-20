import { useEffect, useState } from "react";
import { loadMusicXML } from "./loadMusicXML";
import { parseMusicXML } from "./parseMusicXML";

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