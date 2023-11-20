import { ArrayOrSingle } from "../../util";
import { Player } from "../Player";
import { Choice } from "../choice/Choice";
import { Vote } from "../choice/Vote";
import { Effect } from "../effect/Effet";
import { KillEffect } from "../effect/KillEffect";
import { Event } from "./Event";

export class KillEvent extends Event {
  constructor(
    readonly players: ReadonlyArray<Player>,
    readonly cause: unknown,
    readonly choice: Choice,
    readonly timeLimit?: number
  ) {
    super(players, choice, timeLimit);
  }

  finish(vote: Vote): ArrayOrSingle<Effect> {
    if (vote.type === "players") {
      // TODO vote strategy?
      return new KillEffect(vote.players[0], this.cause);
    }

    return [];
  }
}
