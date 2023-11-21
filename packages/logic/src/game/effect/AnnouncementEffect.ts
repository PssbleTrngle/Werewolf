import { GameAccess } from "../Game.js";
import { Effect } from "./Effect.js";

export class AnnouncementEffect implements Effect {
  apply(game: GameAccess) {
    game.broadcastDeaths();
  }
}
