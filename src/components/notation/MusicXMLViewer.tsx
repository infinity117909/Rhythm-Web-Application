import React from "react";
import { useMusicXML } from "@/musicxml/useMusicXML";

export default function MusicXMLViewer({ filePath }: { filePath: string }) {
  const { xml, raw, loading, error } = useMusicXML(filePath);

  if (loading) return <p>Loading MusicXML…</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>MusicXML Loaded</h2>

      <pre style={{ whiteSpace: "pre-wrap", background: "#eee", padding: 10 }}>
        {raw}
      </pre>
    </div>
  );
}
