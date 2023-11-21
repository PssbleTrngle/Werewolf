import { Vote } from "models";
import { ArrayOrSingle } from "../../util.js";
import { Effect } from "../effect/Effect.js";
import { Player } from "../player/Player.js";
import { Choice } from "../vote/Choice.js";

export type EventFactory = (
  players: ReadonlyArray<Player>
) => ArrayOrSingle<Event>;

export abstract class Event {
  constructor(
    public readonly players: ReadonlyArray<Player>,
    public readonly choice?: Choice,
    public readonly timeLimit?: number
  ) {}

  abstract finish(vote: Vote): ArrayOrSingle<Effect>;
}
