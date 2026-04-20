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