import * as Tone from "tone";

/**
 * A map of drum instrument names to a pool of `Tone.Player` instances.
 * Multiple players per instrument allow simultaneous trigger events on the
 * same voice (polyphony) without cutting off a currently playing hit.
 *
 * @example
 * const map: DrumSampleMap = {
 *   kick:  [Player, Player, Player],
 *   snare: [Player, Player, Player],
 * };
 */
export type DrumSampleMap = Record<string, Tone.Player[]>;

/**
 * Loads drum sample MP3s from the FatBoy soundfont server and creates a small
 * pool of `Tone.Player` instances per instrument to support polyphonic playback.
 *
 * Samples are served from:
 * `http://localhost:8080/samples/soundfonts/FatBoy/percussion-mp3/`
 *
 * @param poolSize - Number of `Tone.Player` instances to create per instrument.
 *                   A larger pool reduces the chance of a hit being skipped on
 *                   rapid re-triggers. Defaults to `3`.
 * @returns A resolved {@link DrumSampleMap} with all audio buffers loaded.
 *
 * @example
 * const samples = await loadDrumSamples(4);
 * samples["kick"][0].start(); // trigger kick
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
