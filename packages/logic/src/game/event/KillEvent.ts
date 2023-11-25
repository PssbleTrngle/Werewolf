import { Choice, Vote } from "models";
import { ArrayOrSingle } from "../../util.js";
import { Effect } from "../effect/Effect.js";
import { KillEffect } from "../effect/KillEffect.js";
import { DeathCause } from "../player/DeathCause.js";
import { Player } from "../player/Player.js";
import { Event } from "./Event.js";

export class KillEvent extends Event {
  constructor(
    type: string,
    readonly players: ReadonlyArray<Player>,
    readonly cause: DeathCause,
    readonly choice: Choice,
    readonly timeLimit?: number,
  ) {
    super(type, players, choice, timeLimit);
  }

  finish(vote: Vote): ArrayOrSingle<Effect> {
    if (vote.type === "players") {
      // TODO vote strategy?
      return new KillEffect(vote.players[0], this.cause);
    }

    return [];
  }
}
