import * as Tone from "tone";

export type DrumSampleMap = Record<string, Tone.Player[]>;

/**
 * Load drum samples and create a small pool per instrument so multiple
 * simultaneous triggers for the same instrument can be played (polyphony).
 *
 * poolSize: number of players to create per instrument (round-robin used).
 */
export async function loadDrumSamples(poolSize = 3): Promise<DrumSampleMap> {
   const base = "http://localhost:8080/samples/soundfonts/FatBoy/percussion-mp3/";

   const sampleUrls: Record<string, string> = {
      kick: `${base}/B1.mp3`,
      snare: `${base}/D2.mp3`,
      hihat: `${base}/Gb2.mp3`,
   };

   // Create a player pool per instrument
   const map: DrumSampleMap = {};
   for (const [key, url] of Object.entries(sampleUrls)) {
      const players: Tone.Player[] = [];
      for (let i = 0; i < poolSize; i++) {
         const p = new Tone.Player(url).toDestination();
         players.push(p);
      }
      map[key] = players;
   }

   // Wait for all created players' buffers to load
   await Tone.loaded();

   return map;
}
