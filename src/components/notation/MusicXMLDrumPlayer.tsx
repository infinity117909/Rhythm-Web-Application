import React, { useEffect, useState } from "react";
import { useMusicXML } from "@/musicxml/useMusicXML";
import { playMusicXMLDrums } from "@/musicxml/drumPlaybackEngine";

export default function MusicXMLDrumPlayer({ filePath }: { filePath: string }) {
  const { xml, loading, error } = useMusicXML(filePath);
  const [playing, setPlaying] = useState(false);

  const handlePlay = async () => {
    if (!xml) return;
    setPlaying(true);
    await playMusicXMLDrums(xml);
  };

  if (loading) return <p>Loading MusicXML…</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <button
        onClick={handlePlay}
        disabled={!xml || playing}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Play Drum Part
      </button>
    </div>
  );
}
