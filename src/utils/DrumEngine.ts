// DrumEngine.ts
import * as Tone from "tone";

/**
 * Singleton service that holds the active `Tone.Players` instance and provides
 * a simple `play()` API for triggering drum samples.
 *
 * The engine is initialised once at application start by the `<LoadFile>`
 * component (`src/components/audio/Tone.tsx`), which loads all 57 drum samples
 * and calls `setPlayers()`. After that, any module can import `drumEngine` and
 * call `play()` without prop-drilling or React context.
 *
 * @example
 * // Trigger a kick drum at normal volume
 * drumEngine.play("B1");
 *
 * // Trigger a snare at half volume
 * drumEngine.play("D2", 0.5);
 */
class DrumEngine {
   /** The loaded `Tone.Players` instance, or `null` if not yet initialised. */
   players: Tone.Players | null = null;

   /**
    * Registers the loaded `Tone.Players` instance.
    * Must be called before any `play()` invocations.
    *
    * @param players - A fully-loaded `Tone.Players` instance keyed by sample names.
    */
   setPlayers(players: Tone.Players) {
      this.players = players;
   }

   /**
    * Triggers the named drum sample at the specified volume.
    *
    * Silently returns if `players` has not been initialised yet.
    *
    * @param note             - Sample key string matching a key in the `Tone.Players`
    *                           instance (e.g. `"B1"` for kick, `"D2"` for snare).
    * @param volumeMultiplier - Linear volume multiplier in the range 0.0–1.0 (or
    *                           higher for accents). Defaults to `1.0`.
    */
   play(note: string, volumeMultiplier: number = 1.0) {
      if (!this.players) return;
      const player = this.players.player(note);
      player.volume.value = volumeMultiplier;
      player.start();
   }
}

/** Pre-constructed singleton instance. Import this directly throughout the app. */
export const drumEngine = new DrumEngine();
