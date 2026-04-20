// DrumEngine.ts
import * as Tone from "tone";

class DrumEngine {
   players: Tone.Players | null = null;

   setPlayers(players: Tone.Players) {
      this.players = players;
   }

   play(note: string, volumeMultiplier: number = 1.0) {
      if (!this.players) return;
      const player = this.players.player(note);
      player.volume.value = volumeMultiplier;
      player.start();
   }
}

export const drumEngine = new DrumEngine();
