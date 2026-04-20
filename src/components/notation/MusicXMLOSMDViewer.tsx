import React, { useEffect, useRef } from "react";
import { useMusicXML } from "@/musicxml/useMusicXML";
import * as OSMD from "opensheetmusicdisplay";
const { OpenSheetMusicDisplay } = OSMD;

interface Props {
  filePath: string;
}

export default function MusicXMLOSMDViewer({ filePath }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const osmdRef = useRef<OSMD.OpenSheetMusicDisplay | null>(null);
  const { raw, loading, error } = useMusicXML(filePath);

  useEffect(() => {
  if (!containerRef.current) return;

  const width = containerRef.current.clientWidth;
  if (width === 0) return; // wait for layout

  if (!osmdRef.current) {
    osmdRef.current = new OpenSheetMusicDisplay(containerRef.current, {
      autoResize: true,
      drawTitle: true
    });
  }

 
  osmdRef.current.load(raw).then(() => osmdRef.current!.render());
}, [raw]);

  if (loading) return <p>Loading score…</p>;
  if (error) return <p>Error: {error}</p>;

    return (
        <div
            ref={containerRef}
            style={{
            width: "100%",
            minWidth: "600px",
            height: "auto"
            }}
        />
    );
}
