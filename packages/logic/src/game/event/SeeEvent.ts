import { Vote } from "models";
import { ArrayOrSingle } from "../../util.js";
import { Effect } from "../effect/Effect.js";
import { RevealEffect } from "../effect/RevealEffect.js";
import { Player } from "../player/Player.js";
import { Event } from "./Event.js";

export class SeeEvent extends Event {
  constructor(player: Player, targets: ReadonlyArray<Player>) {
    super([player], { players: targets });
  }

  finish(vote: Vote): ArrayOrSingle<Effect> {
    if (vote.type === "players") {
      return new RevealEffect(this.players[0], vote.players);
    }

    return [];
  }
}
