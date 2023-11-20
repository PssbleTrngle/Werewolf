import { ArrayOrSingle } from "../../util";
import { Effect } from "../effect/Effet";
import { Player } from "../player/Player";
import { Choice } from "../vote/Options";
import { Vote } from "../vote/Vote";

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
