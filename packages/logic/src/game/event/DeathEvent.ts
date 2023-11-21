import { Player } from "../player/Player.js";
import { DismissChoice } from "../vote/Choice.js";
import { Event } from "./Event.js";

export class DeathEvent extends Event {
  constructor(
    players: ReadonlyArray<Player>,
    public readonly deaths: ReadonlyArray<Player>
  ) {
    super("announcement.death", players, DismissChoice);
  }

  finish() {
    return [];
  }
}
