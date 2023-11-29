import { Time } from "models";
import { GameAccess } from "../state.js";
import { Effect } from "./Effect.js";

export class AnnouncementEffect implements Effect {
  constructor(private readonly time?: Time) {}

  apply(game: GameAccess) {
    game.broadcastDeaths(this.time);
  }
}
